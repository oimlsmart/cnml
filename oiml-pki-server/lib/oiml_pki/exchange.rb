# frozen_string_literal: true

# SIGNATIF credential exchange (the delivery clause): a two-turn,
# holder-initiated protocol. The holder asks for a credential; the
# coordinator challenges it to sign a fresh nonce with the key
# behind its identifier (an identifier-control challenge — the same
# construction as the device-signer challenge, generalized from
# proving a device key is live to proving a holder controls an
# identifier); the coordinator verifies and delivers.
#
# Turns:
#   stage(identifier, credential)   coordinator side: register the
#                                   credential an identifier may collect
#   request(identifier)             holder turn 1: ask -> single-use
#                                   challenge (nonce)
#   collect(id, cert_pem, sig)      holder turn 2: prove control of
#                                   the key behind the identifier ->
#                                   credential delivered
#
# The nonce is 256-bit, single-use, and expires with the freshness
# window. A coordinator that runs exchanges is a stateful endpoint.

require "securerandom"

module OimlPki
  module Exchange
    class Error < StandardError; end

    # Seconds a challenge stays answerable.
    FRESHNESS_WINDOW = 300

    Session = Struct.new(:id, :identifier, :nonce, :credential, :state, :created_at,
                         keyword_init: true)

    class Coordinator
      def initialize(clock: Time)
        @clock = clock
        @staged = {}
        @sessions = {}
      end

      # Coordinator side: register the credential destined for an
      # identifier. Returns the identifier staged.
      def stage(identifier, credential)
        identifier = identifier.to_s
        raise Error, "identifier required" if identifier.empty?
        @staged[identifier] = credential
        identifier
      end

      # Holder turn 1: ask for the credential. Nothing is challenged
      # unless something is staged for the identifier (challenges are
      # not mintable for unknown holders). Returns the Session or nil.
      def request(identifier)
        identifier = identifier.to_s
        return nil unless @staged.key?(identifier)

        session = Session.new(
          id: SecureRandom.hex(16),
          identifier: identifier,
          nonce: SecureRandom.random_bytes(32),
          credential: @staged[identifier],
          state: :challenge_issued,
          created_at: @clock.now,
        )
        @sessions[session.id] = session
        session
      end

      # Holder turn 2: prove control of the key behind the
      # identifier by signing the nonce, and collect the credential.
      # The signature is verified against the public key of the
      # certificate the holder presents, and the certificate must
      # name the holder (subject CN equals the identifier).
      def collect(session_id, certificate_pem:, signature:)
        session = @sessions[session_id.to_s]
        raise Error, "unknown exchange" unless session
        raise Error, "exchange already completed" unless session.state == :challenge_issued
        raise Error, "challenge expired" if @clock.now - session.created_at > FRESHNESS_WINDOW

        cert = OpenSSL::X509::Certificate.new(certificate_pem)
        # Name#to_a entries are [type, value, encoding]; the value is
        # at index 1.
        cn = cert.subject.to_a.assoc("CN")&.fetch(1)
        raise Error, "the certificate does not name the holder" unless cn == session.identifier

        unless signature_valid?(cert.public_key, signature, session.nonce)
          raise Error, "signature does not prove control of the key behind the identifier"
        end

        session.state = :collected
        session.credential
      end

      private

      # ECDSA/RSA sign the nonce with SHA-256; Ed25519 signs it
      # directly.
      def signature_valid?(key, signature, nonce)
        if defined?(OpenSSL::PKey::ED) && key.is_a?(OpenSSL::PKey::ED)
          key.verify(nil, signature, nonce)
        else
          key.verify("SHA256", signature, nonce)
        end
      rescue OpenSSL::PKey::PKeyError
        false
      end
    end

    class << self
      # The process-wide coordinator the API routes use. In-memory:
      # the stateful exchange endpoint a deployment declares in its
      # manifest.
      def coordinator
        @coordinator ||= Coordinator.new
      end
    end
  end
end
