# frozen_string_literal: true

# PKCS#11 key backend. Works with any device exposing the PKCS#11
# (Cryptographic Token Interface Standard) API:
#
#   - Yubikey 5 series (via opensc-pkcs11 or libykcs11)
#   - Nitrokey Pro/3
#   - Smartcard HSM
#   - enterprise HSMs (Thales Luna, Utimaco SecurityServer) via vendor driver
#
# The private key NEVER leaves the device. The Ruby process holds a
# session handle, sends the to-be-signed bytes via PKCS#11, and
# receives the signature. Even if the host is compromised, the key
# cannot be exfiltrated — only signing operations can be performed,
# and only after PIN authentication.
#
# Configuration (stored in keystore entry, NO privateKey field):
#
#   "pkcs11": {
#     "module": "/Library/OpenSC/lib/opensc-pkcs11.so",
#     "slot":   0,
#     "cert_id": "01",      # hex; matches CKA_ID on the device
#     "pin_env": "OIML_PKCS11_PIN"   # env var holding the user PIN
#   }
#
# The PIN is read from an environment variable, never persisted to
# disk. Operators set it in their shell or via a password manager
# integration. For unattended operation (CI signing), use a slot
# configured with a PIN pad or touch-only policy.

module OimlPki
  module KeyProvider
    class Pkcs11 < Base
      attr_reader :module_path, :slot, :cert_id, :pin_env

      # @param config [Hash] with keys +module+, +slot+, +cert_id+, +pin_env+
      def initialize(config)
        @module_path = config["module"] || config[:module]
        @slot        = config["slot"]   || config[:slot]   || 0
        @cert_id     = config["cert_id"] || config[:cert_id]
        @pin_env     = config["pin_env"] || config[:pin_env] || "OIML_PKCS11_PIN"

        raise ArgumentError, "Pkcs11 provider requires 'module' path" unless @module_path
        raise ArgumentError, "Pkcs11 provider requires 'cert_id'" unless @cert_id
      end

      # Sign bytes via a PKCS#11 session. Opens a fresh session per call
      # (PKCS#11 sessions are cheap; this avoids state-leak between
      # operations).
      def sign(data, digest: "SHA256")
        with_session do |session|
          priv = find_object(session, CKO_PRIVATE_KEY)
          mechanism = mechanism_for(digest)
          session.sign(mechanism, priv, data)
        end
      end

      # PKCS#11 path: extract TBS DER via ASN.1, sign on device,
      # reassemble final cert. Slower than software but the private
      # key never leaves the device.
      def sign_cert(cert)
        # Sign with a throwaway software key first so OpenSSL populates
        # the cert's internal signature structure. We discard that sig.
        dummy_key = OpenSSL::PKey::EC.generate("prime256v1")
        cert.sign(dummy_key, OpenSSL::Digest::SHA256.new)

        asn1 = OpenSSL::ASN1.decode(cert.to_der)
        tbs_der = asn1.value[0].to_der
        sig_alg = asn1.value[1]
        real_signature = sign(tbs_der)
        sig_value = OpenSSL::ASN1::BitString.new(real_signature)
        new_cert_asn1 = OpenSSL::ASN1::Sequence.new([asn1.value[0], sig_alg, sig_value])

        OpenSSL::X509::Certificate.new(new_cert_asn1.to_der)
      end

      def sign_crl(crl)
        # CRL has same TBS / sigAlg / sigValue structure as a cert.
        # Sign with dummy key, then re-sign via device.
        dummy_key = OpenSSL::PKey::EC.generate("prime256v1")
        crl.sign(dummy_key, OpenSSL::Digest::SHA256.new)

        asn1 = OpenSSL::ASN1.decode(crl.to_der)
        tbs_der = asn1.value[0].to_der
        sig_alg = asn1.value[1]
        real_signature = sign(tbs_der)
        sig_value = OpenSSL::ASN1::BitString.new(real_signature)
        new_crl_asn1 = OpenSSL::ASN1::Sequence.new([asn1.value[0], sig_alg, sig_value])

        OpenSSL::X509::CRL.new(new_crl_asn1.to_der)
      end

      # Read the certificate from the device, extract its public key.
      # Useful at cert-creation time (root / intermediate issuance).
      def public_key
        with_session do |session|
          cert_obj = find_object(session, CKO_CERTIFICATE)
          cert = OpenSSL::X509::Certificate.new(cert_obj.value)
          OpenSSL::PKey.read(cert.public_key.to_der)
        end
      end

      def label
        "pkcs11 (#{File.basename(@module_path)} slot #{@slot} id #{@cert_id})"
      end

      def extractable?
        false
      end

      def to_h
        {
          "type"    => "pkcs11",
          "module"  => @module_path,
          "slot"    => @slot,
          "cert_id" => @cert_id,
          "pin_env" => @pin_env,
        }
      end

      # ─── Internal ─────────────────────────────────────────────────────────

      # Open a PKCS#11 session, log in with the PIN from env, yield.
      # Always closes the session even on exception.
      def with_session
        require "pkcs11"   # external gem; lazy-loaded so the rest of the
                           # CA server works without it installed
        pkcs11 = PKCS11.open(@module_path)
        slots = pkcs11.active_slots
        raise "No active slots on #{@module_path}" if slots.empty?
        target_slot = slots[@slot] || slots.first
        session = target_slot.open
        pin = ENV[@pin_env]
        unless pin
          raise "PKCS#11 user PIN not set in env var #{@pin_env}"
        end
        session.login(:user, pin)
        yield session
      ensure
        session&.logout
        session&.close
      end

      def find_object(session, klass)
        id_bytes = [@cert_id].pack("H*")
        session.find_objects(
          CKA_CLASS => klass,
          CKA_ID    => id_bytes,
        ).first.tap do |obj|
          raise "No #{class_name(klass)} with ID #{@cert_id} on device" unless obj
        end
      end

      # Map digest algorithm name → PKCS#11 mechanism constant.
      # For EC keys, PKCS#11 uses CKM_ECDSA (the digest is computed
      # externally). For Ed25519, CKM_EDDSA (no external digest).
      # For RSA, CKM_SHA256_RSA_PKCS etc. (mechanism handles hash).
      def mechanism_for(digest)
        return CKM_EDDSA if digest == "Ed25519"
        case digest
        when "SHA256" then CKM_ECDSA
        when "SHA384" then CKM_ECDSA
        when "SHA512" then CKM_ECDSA
        else raise ArgumentError, "Unsupported digest for PKCS#11: #{digest}"
        end
      end

      # Pretty-print the CKO_* class constant for error messages.
      def class_name(klass)
        case klass
        when CKO_CERTIFICATE  then "certificate"
        when CKO_PRIVATE_KEY   then "private key"
        when CKO_PUBLIC_KEY    then "public key"
        else "object (class=#{klass})"
        end
      end
    end
  end
end
