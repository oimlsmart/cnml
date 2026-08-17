# frozen_string_literal: true

# X.509 certificate factory. Root CA creation, CSR signing (with scope),
# CRL generation. All signing operations go through a {KeyProvider}
# backend — software (PEM in keystore), PKCS#11 (Yubikey/HSM), or any
# future backend that implements the {KeyProvider::Base} interface.
#
# Adding a new backend is open/closed: implement Base, add a factory
# dispatch in KeyProvider.for. No edits here.

module OimlPki
  module CertFactory
    module_function

    # Generate a root CA. Key is generated in software by necessity
    # (you can't put a brand-new root on a Yubikey via this path —
    # use provision-yubikey.rb for that, then pass the resulting
    # keystore entry to sign_csr to chain from this root).
    def generate_root_ca(subject_str, validity_years, passphrase)
      key = generate_signing_key
      provider = KeyProvider::Software.new("privateKey" => key.to_pem)
      cert = create_cert(subject_str, key, public_key_for_cert(key), validity_years)
      cert = add_ca_extensions(cert, cert)
      sign_cert_with_provider(cert, provider)
      store_entry("root-ca", "OIML Root CA", key, cert, "root", passphrase)
      cert
    end

    # Sign a CSR. The `ca_key_or_provider` arg accepts:
    #   - String (PEM) → wrapped as KeyProvider::Software (back-compat)
    #   - KeyProvider::Base instance → used directly (Yubikey/HSM)
    def sign_csr(csr_pem, ca_key_or_provider, ca_cert_pem, validity_years, role, passphrase, scope: [], quorum: nil)
      csr = OpenSSL::X509::Request.new(csr_pem)
      raise "CSR signature invalid" unless csr.verify(csr.public_key)

      ca_cert = OpenSSL::X509::Certificate.new(ca_cert_pem)
      ca_provider = coerce_provider(ca_key_or_provider)

      cert = create_cert(csr.subject.to_s, ca_cert, csr.public_key, validity_years)
      cert = role == "intermediate" ? add_ca_extensions(cert, ca_cert) : add_ee_extensions(cert, ca_cert)
      cert = add_scope_extension(cert, scope) unless scope.empty?
      # §threshold-signing/quorum-in-delegation: a threshold child's
      # delegation certificate carries the quorum definition (T, N).
      cert = add_quorum_extension(cert, quorum) if quorum
      sign_cert_with_provider(cert, ca_provider)

      entry_id = "signed-#{cert.serial.to_s(16)}"
      store_entry(entry_id, csr.subject.to_s, nil, cert, role, passphrase, scope: scope)
      cert
    end

    # Sign a CRL. Same provider-acceptance semantics as sign_csr.
    def create_crl(ca_key_or_provider, ca_cert_pem, revoked_serials)
      ca_cert = OpenSSL::X509::Certificate.new(ca_cert_pem)
      ca_provider = coerce_provider(ca_key_or_provider)

      crl = OpenSSL::X509::CRL.new
      crl.version = 0
      crl.issuer = ca_cert.subject
      crl.last_update = Time.now
      crl.next_update = Time.now + 30 * 86400

      revoked_serials.each do |entry|
        revoked = OpenSSL::X509::Revoked.new
        revoked.serial = entry["serial"].to_i
        revoked.time = Time.parse(entry["date"])
        crl.add_revoked(revoked)
      end

      # crlNumber direct (OpenSSL 3.x's ExtensionFactory refuses the
      # extension without a config section; the
      # value is the issuance timestamp in seconds, unique per issue).
      crl.add_extension(OpenSSL::X509::Extension.new("crlNumber", OpenSSL::ASN1::Integer(Time.now.to_i)))
      sign_crl_with_provider(crl, ca_provider)
      crl
    end

    def create_csr(subject_str, key)
      csr = OpenSSL::X509::Request.new
      csr.version = 0
      csr.subject = OpenSSL::X509::Name.parse(subject_str)
      csr.public_key = public_key_for_cert(key)
      csr.sign(key, OpenSSL::Digest::SHA256.new)
      csr
    end

    # Human-readable algorithm name for a cert's public key. Used by
    # the published trust-anchors manifest — never a hardcoded string.
    def algorithm_for(cert_or_key)
      pub = cert_or_key.respond_to?(:public_key) ? cert_or_key.public_key : cert_or_key
      # OpenSSL::PKey::EC#public_key returns an OpenSSL::PKey::EC::Point
      # (not a PKey). Resolve via DER round-trip so we get a real PKey
      # for the class-name check below.
      if pub.is_a?(OpenSSL::PKey::EC::Point)
        curve = pub.group.curve_name
        return "Ed25519" if curve == "Ed25519"
        return "ECDSA #{curve}"
      end
      # Use class-name check (not is_a?) — OpenSSL::PKey::Ed25519 may
      # not exist as a resolvable constant on older Ruby builds.
      return "Ed25519" if pub.class.name.end_with?("::Ed25519")
      return "ECDSA #{pub.group.curve_name}" if pub.is_a?(OpenSSL::PKey::EC)
      pub.class.name.split("::").last
    end

    # ─── Internal ──────────────────────────────────────────────────────────

    # Generate a fresh software signing keypair. Policy is Ed25519;
    # falls back to EC P-256 on Ruby builds without Ed25519.
    def generate_signing_key
      OpenSSL::PKey::Ed25519.generate
    rescue NameError
      OpenSSL::PKey::EC.generate("prime256v1")
    end

    def create_cert(subject_str, issuer_cert_or_key, public_key, validity_years)
      cert = OpenSSL::X509::Certificate.new
      cert.version = 2
      cert.serial = SecureRandom.random_number(1 << 128)
      cert.subject = OpenSSL::X509::Name.parse(subject_str)
      cert.issuer = issuer_cert_or_key.is_a?(OpenSSL::X509::Certificate) ? issuer_cert_or_key.subject : cert.subject
      cert.public_key = public_key_for_pkey(public_key)
      cert.not_before = Time.now
      cert.not_after = Time.now + validity_years * 365 * 86400
      cert
    end

    # Normalize various "public key" representations into a form
    # OpenSSL::X509::Certificate#public_key= will accept.
    def public_key_for_pkey(pub)
      return pub if pub.is_a?(OpenSSL::PKey::PKey)
      raise "Cannot normalize #{pub.class} to PKey" unless pub.respond_to?(:group)
      # EC::Point case — round-trip via a fresh PKey (OpenSSL 3.0 immutable).
      ec = OpenSSL::PKey::EC.new(pub.group)
      ec.public_key = pub
      OpenSSL::PKey.read(ec.to_der)
    rescue OpenSSL::PKey::PKeyError
      raise "OpenSSL 3.0 immutable PKey — pass the source key, not EC::Point"
    end

    def public_key_for_cert(key)
      OpenSSL::PKey.read(key.public_to_der)
    end

    # Accept either a PEM string (back-compat), an OpenSSL::PKey, or a
    # KeyProvider::Base instance. Always returns a KeyProvider.
    def coerce_provider(arg)
      return arg if arg.is_a?(KeyProvider::Base)
      return KeyProvider::Software.new("privateKey" => arg) if arg.is_a?(String)
      return KeyProvider::Software.new("privateKey" => arg.to_pem) if arg.is_a?(OpenSSL::PKey::PKey)
      raise ArgumentError, "Cannot coerce #{arg.class} to a KeyProvider"
    end

    # Delegate cert signing to the provider. Each backend implements
    # the most efficient path it can. CertFactory stays backend-agnostic.
    def sign_cert_with_provider(cert, provider)
      provider.sign_cert(cert)
    end

    def sign_crl_with_provider(crl, provider)
      provider.sign_crl(crl)
    end

    def add_ca_extensions(cert, issuer_cert)
      ef = OpenSSL::X509::ExtensionFactory.new
      ef.subject_certificate = cert
      ef.issuer_certificate = issuer_cert
      cert.add_extension(ef.create_extension("basicConstraints", "CA:TRUE", true))
      cert.add_extension(ef.create_extension("keyUsage", "keyCertSign, cRLSign", true))
      cert.add_extension(ef.create_extension("subjectKeyIdentifier", "hash"))
      cert
    end

    def add_ee_extensions(cert, issuer_cert)
      ef = OpenSSL::X509::ExtensionFactory.new
      ef.subject_certificate = cert
      ef.issuer_certificate = issuer_cert
      cert.add_extension(ef.create_extension("basicConstraints", "CA:FALSE", true))
      cert.add_extension(ef.create_extension("keyUsage", "digitalSignature, nonRepudiation", true))
      cert.add_extension(ef.create_extension("subjectKeyIdentifier", "hash"))
      cert.add_extension(ef.create_extension("authorityKeyIdentifier", "keyid:always"))
      # The CRL distribution point: verifiers fetch the
      # CA's current CRL here (the deployment's public base; the dev
      # default is the local ceremony instance).
      crl_base = ENV["OIML_CRL_BASE_URL"] || "http://localhost:4455"
      crl_url = "#{crl_base.gsub(/\/$/, '')}/crl.pem"
      cert.add_extension(ef.create_extension("crlDistributionPoints", "URI:#{crl_url}", false))
      cert
    end

    # Embed the OIML-authorized-Recommendations scope as a non-critical
    # Quorum parameters (T, N) extension for threshold delegations
    # (§threshold-signing/quorum-in-delegation). ASN.1 SEQUENCE of two
    # INTEGERs. OID 1.3.6.1.4.1.99999.1.2 (placeholder PEN family).
    OIML_QUORUM_OID = "1.3.6.1.4.1.99999.1.2"

    def add_quorum_extension(cert, quorum)
      t = quorum[:t] || quorum["t"]
      n = quorum[:n] || quorum["n"]
      raise ArgumentError, "quorum requires t and n" unless t && n
      value = OpenSSL::ASN1::Sequence.new([
        OpenSSL::ASN1::Integer.new(t),
        OpenSSL::ASN1::Integer.new(n),
      ]).to_der
      cert.add_extension(OpenSSL::X509::Extension.new(OIML_QUORUM_OID, value, false))
      cert
    end

    # X.509 v3 extension. Value is ASN.1 SEQUENCE OF UTF8String.
    def add_scope_extension(cert, scope)
      asn1_value = OpenSSL::ASN1::Sequence.new(
        scope.map { |r| OpenSSL::ASN1::UTF8String.new(r.to_s) }
      ).to_der
      cert.add_extension(OpenSSL::X509::Extension.new(OIML_SCOPE_OID, asn1_value, false))
      cert
    end

    def store_entry(id, alias_name, key, cert, role, passphrase, scope: [])
      entry = {
        "id"          => id,
        "alias"       => alias_name,
        "role"        => role,
        "certificate" => cert.to_pem,
        "fingerprint" => OpenSSL::Digest::SHA256.hexdigest(cert.to_der),
        "createdAt"   => Time.now.iso8601,
        "notAfter"    => cert.not_after.iso8601,
      }
      entry["privateKey"] = key.to_pem if key
      entry["scope"] = scope if scope && !scope.empty?
      CaStore.add(entry, passphrase)
      entry
    end
  end
end
