# frozen_string_literal: true

require "openssl"
require "json"

module OimlPki
  # Deployment manifest signing (SIGNATIF §manifest-format: "a
  # deployment manifest shall be signed by the root trust authority
  # whose deployment it describes").
  #
  # The canonical string covers the deployment header, mode, and the
  # tier/quorum structure — everything a verifier must agree on before
  # trusting the deployment's topology. The signature travels as a
  # [signature] table in the TOML.
  module ManifestSigning
    module_function

    # @param parsed [Hash] the parsed manifest (pre-signature)
    # @return [String] the canonical string covered by the signature
    def canonical_string(parsed)
      deployment = parsed["deployment"] || {}
      tiers = (parsed["tiers"] || []).map do |t|
        parts = [t["name"], t["role"]]
        if t["threshold"]
          parts << "t=#{t['threshold']['t']}"
          parts << "n=#{t['threshold']['n']}"
        end
        parts << "by=#{t['delegated_by']}" if t["delegated_by"]
        parts.join(":")
      end
      quorums = (parsed["quorums"] || []).map do |q|
        "#{q['name']}:#{q['coordinator']}"
      end
      "CNML-MANIFEST-v1|#{deployment['name']}|#{deployment['operator']}|" \
        "#{parsed['mode']}|#{tiers.join(';')}|#{quorums.join(';')}"
    end

    # Sign a parsed manifest with the root key. Returns a copy with a
    # "signature" section: algorithm, value (P-1363 hex), public_key.
    def sign(parsed, key)
      to_sign = canonical_string(parsed)
      raw = TransparencyPublisher.der_to_p1363(
        key.sign(OpenSSL::Digest::SHA256.new, to_sign), 32
      )
      parsed.merge(
        "signature" => {
          "algorithm" => "ECDSA-P256-SHA256",
          "value"     => raw.unpack1("H*"),
          "public_key" => key.public_to_pem,
        }
      )
    end

    # @return [Boolean]
    def verified?(parsed)
      sig = parsed["signature"]
      return false unless sig && sig["value"] && sig["public_key"]
      to_sign = canonical_string(parsed)
      pub = OpenSSL::PKey::EC.new(sig["public_key"])
      der = TransparencyPublisher.p1363_to_der([sig["value"]].pack("H*"))
      pub.verify(OpenSSL::Digest::SHA256.new, der, to_sign)
    rescue StandardError
      false
    end
  end
end
