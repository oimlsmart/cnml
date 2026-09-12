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
#   stage(identifier, credential,   coordinator side: register the
#            holder_certificate_pem) credential and pin the holder's
#                                   certificate (the key behind the
#                                   identifier, known out-of-band)
#   request(identifier)             holder turn 1: ask -> single-use
#                                   challenge (nonce)
#   collect(id, sig)                holder turn 2: prove control of
#                                   the key behind the identifier ->
#                                   credential delivered
#
# Key material never comes from the request: collect verifies
# against the certificate pinned at staging. A certificate that
# merely claims the identifier names nothing.
#
# The nonce is 256-bit, single-use, and expires with the freshness
# window. A coordinator that runs exchanges is a stateful endpoint.

require "securerandom"

module OimlPki
  module Exchange
    class Error < StandardError; end

    # Seconds a challenge stays answerable.
    FRESHNESS_WINDOW = 300

    Session = Struct.new(:id, :identifier, :nonce, :credential, :holder_certificate, :state, :created_at,
                         keyword_init: true)

    class Coordinator
      # Staged deliveries persist to +store_path+ (the staged queue
      # survives a restart); single-use sessions are short-lived and
      # stay in memory.
      attr_reader :store_path

      def initialize(clock: Time, store_path: nil)
        @clock = clock
        @store_path = store_path
        @staged = load_staged
        @sessions = {}
      end

      # Coordinator side: register the credential destined for an
      # identifier and pin the holder's certificate, known
      # out-of-band. The certificate's subject CN must name the
      # identifier; the pinned key is the key behind the identifier.
      def stage(identifier, credential, holder_certificate_pem:)
        identifier = identifier.to_s
        raise Error, "identifier required" if identifier.empty?

        cert = OpenSSL::X509::Certificate.new(holder_certificate_pem)
        cn = cert.subject.to_a.assoc("CN")&.fetch(1)
        raise Error, "the certificate does not name the holder" unless cn == identifier

        @staged[identifier] = { "credential" => credential, "certificate_pem" => holder_certificate_pem }
        persist!
        identifier
      end

      # Holder turn 1: ask for the credential. Nothing is challenged
      # unless something is staged for the identifier (challenges are
      # not mintable for unknown holders). Returns the Session or nil.
      def request(identifier)
        identifier = identifier.to_s
        return nil unless @staged.key?(identifier)

        staged = @staged[identifier]
        session = Session.new(
          id: SecureRandom.hex(16),
          identifier: identifier,
          nonce: SecureRandom.random_bytes(32),
          credential: staged["credential"],
          holder_certificate: OpenSSL::X509::Certificate.new(staged["certificate_pem"]),
          state: :challenge_issued,
          created_at: @clock.now,
        )
        @sessions[session.id] = session
        session
      end

      # Holder turn 2: prove control of the key behind the
      # identifier by signing the nonce, and collect the credential.
      # The signature is verified against the key pinned at staging;
      # nothing in the request supplies key material.
      def collect(session_id, signature:)
        session = @sessions[session_id.to_s]
        raise Error, "unknown exchange" unless session
        raise Error, "exchange already completed" unless session.state == :challenge_issued
        raise Error, "challenge expired" if @clock.now - session.created_at > FRESHNESS_WINDOW

        unless signature_valid?(session.holder_certificate.public_key, signature, session.nonce)
          raise Error, "signature does not prove control of the key behind the identifier"
        end

        session.state = :collected
        session.credential
      end

      def load_staged
        return {} if store_path.nil? || !File.exist?(store_path)

        JSON.parse(File.read(store_path))
      rescue JSON::ParserError
        raise Error, "the staged exchange store is corrupt"
      end

      # Atomic write: a restart never sees a half-written store.
      def persist!
        return if store_path.nil?

        FileUtils.mkdir_p(File.dirname(store_path))
        tmp = "#{store_path}.tmp"
        File.write(tmp, JSON.pretty_generate(@staged))
        File.rename(tmp, store_path)
      end

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
      # Test seam, same idiom as CaStore/AuditLog overrides.
      attr_accessor :staged_store_override

      # The process-wide coordinator the API routes use: the stateful
      # exchange endpoint a deployment declares in its manifest. The
      # staged queue persists under OUTPUT_DIR; rebuilt when the
      # override flips (the test keystore) so each context sees its
      # own store.
      def coordinator
        path = staged_store_override || File.join(OUTPUT_DIR, "exchange_staged.json")
        if @coordinator.nil? || @coordinator.store_path.to_s != path.to_s
          @coordinator = Coordinator.new(store_path: path)
        end
        @coordinator
      end
    end
  end
end
