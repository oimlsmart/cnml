# frozen_string_literal: true

# Confium threshold cryptography key provider.
#
# Drives multi-party threshold signing via the Confium framework
# (confium-ruby FFI bindings to confium Rust core). The private key
# is NEVER assembled in one place — the FROST protocol produces a
# valid signature from partial shares contributed by K-of-N parties.
#
# Two modes:
#   - LOCAL (testing): all N parties run in-process. Synchronous.
#     Config: { "local_shares": [share1, share2, ...], "threshold": K }
#   - COORDINATOR (production): delegates to a confium-tc-coordinator
#     service. Asynchronous — directors participate when convenient.
#     Config: { "coordinator_endpoint": "tcp://...", "quorum_id": "biml-root" }
#
# See:
#   - confium/TODO.roadmap/27-cnml-deployment.md (authoritative spec)
#   - confium-ruby/lib/confium/tc/ (Ruby API)

module OimlPki
  module KeyProvider
    class Confium < Base
      attr_reader :mode, :config

      def initialize(config)
        @config = config
        @mode = config["local_shares"] ? :local : :coordinator
        validate_config!
      end

      # Sign data via the threshold protocol. In LOCAL mode, runs all
      # parties synchronously in-process. In COORDINATOR mode, creates
      # a coordinator session and waits for aggregation.
      def sign(data, digest: "SHA256")
        case @mode
        when :local then sign_local(data)
        when :coordinator then sign_via_coordinator(data)
        end
      end

      # Sign an X.509 cert via the threshold protocol. Extracts TBS,
      # signs via #sign, reassembles the final cert.
      def sign_cert(cert)
        dummy_key = OpenSSL::PKey::EC.generate("prime256v1")
        cert.sign(dummy_key, OpenSSL::Digest::SHA256.new)
        asn1 = OpenSSL::ASN1.decode(cert.to_der)
        tbs_der = asn1.value[0].to_der
        sig_alg = asn1.value[1]
        real_signature = sign(tbs_der)
        sig_value = OpenSSL::ASN1::BitString.new(real_signature)
        new_asn1 = OpenSSL::ASN1::Sequence.new([asn1.value[0], sig_alg, sig_value])
        OpenSSL::X509::Certificate.new(new_asn1.to_der)
      end

      def sign_crl(crl)
        dummy_key = OpenSSL::PKey::EC.generate("prime256v1")
        crl.sign(dummy_key, OpenSSL::Digest::SHA256.new)
        asn1 = OpenSSL::ASN1.decode(crl.to_der)
        tbs_der = asn1.value[0].to_der
        sig_alg = asn1.value[1]
        real_signature = sign(tbs_der)
        sig_value = OpenSSL::ASN1::BitString.new(real_signature)
        new_asn1 = OpenSSL::ASN1::Sequence.new([asn1.value[0], sig_alg, sig_value])
        OpenSSL::X509::CRL.new(new_asn1.to_der)
      end

      def public_key
        # In a real deployment, the public key is known from DKG setup.
        # For LOCAL mode, reconstruct from shares (same as Shamir).
        # For COORDINATOR mode, stored in the config.
        pem = @config["public_key_pem"]
        return OpenSSL::PKey.read(pem) if pem
        raise "No public_key_pem in config — run DKG first to establish the threshold key"
      end

      def extractable?
        false
      end

      def label
        scheme = @config.fetch("scheme", "FROST-P256")
        threshold = @config.fetch("threshold", "?")
        case @mode
        when :local
          num = @config["local_shares"]&.length || "?"
          "confium-local (#{scheme}, #{threshold}-of-#{num})"
        when :coordinator
          "confium-coordinator (#{@config['quorum_id']})"
        end
      end

      def to_h
        {
          "type" => "confium",
          "mode" => @mode.to_s,
          "scheme" => @config["scheme"],
          "threshold" => @config["threshold"],
        }.merge(
          @mode == :coordinator ?
            { "coordinator_endpoint" => @config["coordinator_endpoint"], "quorum_id" => @config["quorum_id"] } :
            { "num_parties" => @config["local_shares"]&.length }
        )
      end

      # ─── Internal ─────────────────────────────────────────────────────────

      def validate_config!
        case @mode
        when :local
          shares = @config["local_shares"]
          raise ArgumentError, "local_shares must be an Array" unless shares.is_a?(Array)
          raise ArgumentError, "threshold required for local mode" unless @config["threshold"]
          raise ArgumentError, "need at least 2 shares" unless shares.length >= 2
        when :coordinator
          raise ArgumentError, "coordinator_endpoint required" unless @config["coordinator_endpoint"]
          raise ArgumentError, "quorum_id required" unless @config["quorum_id"]
        end
      end

      # LOCAL mode: run all N parties in-process via Confium::TC::Session.
      # This is synchronous and blocks until the protocol completes.
      # Used for testing and air-gapped ceremonies.
      def sign_local(data)
        require "confium"

        shares = @config["local_shares"]
        threshold = @config["threshold"]
        scheme = @config.fetch("scheme", "FROST-P256")

        # Create one session per party
        sessions = shares.each_index.map do |i|
          s = Confium::TC::Session.new(
            scheme: scheme,
            threshold: threshold,
            num_parties: shares.length,
            party_index: i,
          )
          s.set_local_share(shares[i])
          s
        end

        # Run the protocol rounds. FROST is typically 2-3 rounds.
        messages = []
        3.times do |round|
          new_messages = []
          sessions.each_with_index do |session, i|
            outgoing = session.round(messages.select { |m| m[:to] == i })
            outgoing&.each { |m| new_messages << m.merge(from: i) }
          end
          messages = new_messages
          break if sessions.all?(&:complete?)
        end

        unless sessions.all?(&:complete?)
          raise "Threshold signing did not complete after 3 rounds"
        end

        # All parties should produce the same signature (threshold property).
        signatures = sessions.map(&:result).uniq
        raise "Parties produced different signatures" unless signatures.length == 1

        signatures.first
      rescue LoadError
        raise "confium-ruby gem not available. Install with: gem install confium"
      end

      # COORDINATOR mode: delegate to the async coordinator service.
      # Creates a session, submits to coordinator, blocks until threshold
      # is reached. In production, this call blocks for hours to days
      # while directors participate asynchronously.
      def sign_via_coordinator(data)
        require "confium"

        coordinator = Confium::TC::Coordinator.new(quorum_id: @config["quorum_id"])
        session_id = coordinator.create_session(
          message: data,
          threshold: @config["threshold"],
          unlock_window: @config.fetch("unlock_window", 14400),
        )

        # In a real deployment, directors submit commitments and shares
        # asynchronously. The CA server blocks here until the coordinator
        # reports threshold reached.
        # For testing, the caller pre-populates the coordinator.
        signature = coordinator.aggregate(session_id)
        signature
      rescue LoadError
        raise "confium-ruby gem not available. Install with: gem install confium"
      end
    end
  end
end
