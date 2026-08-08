# frozen_string_literal: true

# Software key backend — private key lives in the encrypted keystore
# as a PEM string. This is the lowest-security option (key is in
# process memory during signing) and the default for development /
# low-assurance deployments.
#
# For production CA operations, prefer {Pkcs11} (Yubikey or HSM).

module OimlPki
  module KeyProvider
    class Software < Base
      attr_reader :private_key_pem

      # @param entry [Hash] keystore entry with `privateKey` (PEM string)
      def initialize(entry)
        @private_key_pem = entry["privateKey"]
        unless @private_key_pem
          raise ArgumentError, "Software provider requires entry['privateKey']"
        end
        # Parse once — PEM decode + ASN.1 parse is not free, and the
        # key object is immutable for the lifetime of the provider.
        @key = OpenSSL::PKey.read(@private_key_pem)
      end

      def sign(data, digest: "SHA256")
        # Ed25519 ignores the digest arg — its sign() takes no hash.
        # Use class-name check (not is_a?) because OpenSSL::PKey::Ed25519
        # may not exist as a constant on older Ruby builds.
        return @key.sign(nil, data) if ed25519?(@key)
        @key.sign(digest, data)
      end

      # Software path: native OpenSSL cert signing (fastest, native C).
      # The cert must already have subject/issuer/public_key/extensions/
      # validity set. We just compute and attach the signature.
      def sign_cert(cert)
        cert.sign(@key, OpenSSL::Digest::SHA256.new)
        cert
      end

      def sign_crl(crl)
        crl.sign(@key, OpenSSL::Digest::SHA256.new)
        crl
      end

      def public_key
        OpenSSL::PKey.read(@key.public_to_der)
      end

      def label
        class_name = @key.class.name.split("::").last
        "software (#{class_name} #{algorithm_detail(@key)})"
      end

      def extractable?
        true
      end

      def to_h
        { "type" => "software" }
      end

      private

      def ed25519?(key)
        key.class.name.end_with?("::Ed25519")
      end

      def algorithm_detail(key)
        case key
        when OpenSSL::PKey::EC then key.group.curve_name
        when OpenSSL::PKey::RSA then "RSA-#{key.n.num_bits}"
        else key.class.name.split("::").last
        end
      end
    end
  end
end
