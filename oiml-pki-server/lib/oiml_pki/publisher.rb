# frozen_string_literal: true

# Publishes CA artifacts (certs, CRLs, manifests) to the output
# directory for USB transfer to the CDN repo.

module OimlPki
  module Publisher
    OUTPUT = OimlPki::OUTPUT_DIR

    module_function

    def publish_certs(entries)
      FileUtils.mkdir_p(File.join(OUTPUT, "roots"))
      FileUtils.mkdir_p(File.join(OUTPUT, "intermediates"))
      FileUtils.mkdir_p(File.join(OUTPUT, "crls"))

      published = []
      entries.each do |e|
        next unless e["certificate"]
        cert = OpenSSL::X509::Certificate.new(e["certificate"])
        fname = e["alias"].gsub(/[^A-Za-z0-9]/, "-").downcase
        subdir = e["role"] == "root" ? "roots" : "intermediates"
        path = File.join(OUTPUT, subdir, "#{fname}.crt")
        File.write(path, cert.to_pem)
        published << path
      end

      publish_trust_anchors(entries)
      published
    end

    def publish_trust_anchors(entries)
      roots = entries.select { |e| e["role"] == "root" }
      intermediates = entries.select { |e| e["role"] == "intermediate" }

      manifest = {
        "version" => Time.now.iso8601,
        "roots" => roots.map do |r|
          cert = OpenSSL::X509::Certificate.new(r["certificate"])
          {
            "fingerprint" => "sha256:#{OpenSSL::Digest::SHA256.hexdigest(cert.to_der)}",
            "subject"     => cert.subject.to_s,
            "validFrom"   => cert.not_before.iso8601,
            "validUntil"  => cert.not_after.iso8601,
            "algorithm"   => CertFactory.algorithm_for(cert),
          }
        end,
        "intermediates" => intermediates.map do |i|
          cert = OpenSSL::X509::Certificate.new(i["certificate"])
          {
            "fingerprint"  => "sha256:#{OpenSSL::Digest::SHA256.hexdigest(cert.to_der)}",
            "subject"      => cert.subject.to_s,
            "validFrom"    => cert.not_before.iso8601,
            "validUntil"   => cert.not_after.iso8601,
            "oimlIssuerId" => i["alias"].match(/(\w+\d+)/)&.[](1) || "unknown",
            "scope"        => Publisher.read_scope_from_cert(cert) || i["scope"] || [],
          }
        end,
      }
      File.write(File.join(OUTPUT, "trust-anchors.json"), JSON.pretty_generate(manifest))
    end

    def publish_crl(crl, ca_alias)
      fname = ca_alias.gsub(/[^A-Za-z0-9]/, "-").downcase
      path = File.join(OUTPUT, "crls", "#{fname}.crl")
      File.binwrite(path, crl.to_der)
      path
    end

    def output_files
      return [] unless Dir.exist?(OUTPUT)
      Dir.glob("**/*", base: OUTPUT).select { |f| File.file?(File.join(OUTPUT, f)) }
    end

    # Read the OIML scope extension off a cert. Returns the array of
    # R-ids or nil if the cert has no scope extension.
    def read_scope_from_cert(cert)
      ext = cert.extensions.find { |e| e.oid == OIML_SCOPE_OID }
      return nil unless ext
      asn1 = OpenSSL::ASN1.decode(ext.value_der)
      return [] unless asn1.is_a?(OpenSSL::ASN1::Sequence)
      asn1.value.map { |node| node.value.to_s }
    rescue StandardError
      nil
    end
  end
end
