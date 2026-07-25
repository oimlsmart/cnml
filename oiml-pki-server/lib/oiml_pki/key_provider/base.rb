# frozen_string_literal: true

# Abstract interface for key-storage backends. Concrete classes
# (Software, Pkcs11, future HSM bindings) inherit and implement.
#
# A KeyProvider knows how to:
#   1. Sign arbitrary bytes with the private key it controls (#sign)
#   2. Sign an X.509 cert / CRL in place (#sign_cert, #sign_crl)
#   3. Expose the matching public key (for cert embedding) (#public_key)
#   4. Serialize its config to a keystore-entry fragment (#to_h)
#
# A KeyProvider does NOT know about:
#   - The keystore encryption envelope (CaStore handles that)
#   - Audit logging (the route handler wraps the call)
#   - The business logic of WHAT to sign (CertFactory / Publisher decide)
#
# Each backend picks the most efficient path for #sign_cert:
#   - Software calls OpenSSL::PKey#sign directly (native C)
#   - Pkcs11 signs the TBS via ASN.1 manipulation (device-mediated)
#
# This separation makes backends testable in isolation and lets
# consumers (CertFactory, future CLI tools) stay backend-agnostic.

module OimlPki
  module KeyProvider
    class Base
      # Sign `data` with the private key.
      #
      # @param data [String] bytes to sign
      # @param digest [String] OpenSSL digest name, default "SHA256"
      # @return [String] raw signature bytes
      def sign(data, digest: "SHA256")
        raise NotImplementedError, "#{self.class.name} must implement #sign"
      end

      # Sign an OpenSSL::X509::Certificate in place using this provider's
      # private key. Each backend implements the most efficient path it can.
      #
      # @param cert [OpenSSL::X509::Certificate] mutated in place
      # @return [OpenSSL::X509::Certificate] the same cert, now signed
      def sign_cert(cert)
        raise NotImplementedError, "#{self.class.name} must implement #sign_cert"
      end

      # Sign an OpenSSL::X509::CRL. Same pattern as #sign_cert.
      #
      # @param crl [OpenSSL::X509::CRL] mutated in place
      # @return [OpenSSL::X509::CRL]
      def sign_crl(crl)
        raise NotImplementedError, "#{self.class.name} must implement #sign_crl"
      end

      # The public key matching this provider's private key.
      #
      # @return [OpenSSL::PKey::PKey] a public-only key instance
      def public_key
        raise NotImplementedError, "#{self.class.name} must implement #public_key"
      end

      # Human-readable label for logging / UI.
      #
      # @return [String]
      def label
        self.class.name.split("::").last
      end

      # Whether the private key is extractable from this provider.
      # Software: true. Pkcs11 / HSM: false.
      #
      # @return [Boolean]
      def extractable?
        raise NotImplementedError, "#{self.class.name} must implement #extractable?"
      end

      # Serialize config to a storable hash. Merged into the keystore
      # entry so the provider can be reconstructed later via KeyProvider.for.
      #
      # @return [Hash]
      def to_h
        raise NotImplementedError, "#{self.class.name} must implement #to_h"
      end
    end
  end
end
