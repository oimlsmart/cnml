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
        # The threshold group's public key, provisioned by the ceremony's
        # keygen step: a PEM ("public_key_pem") or the base64 compressed
        # EC point the CMP20/GG18 drivers produce ("public_key").
        pem = @config["public_key_pem"]
        return OpenSSL::PKey.read(pem) if pem
        b64 = @config["public_key"]
        if b64
          require "base64"
          point = OpenSSL::PKey::EC::Point.new(
            OpenSSL::PKey::EC::Group.new("prime256v1"),
            Base64.decode64(b64),
          )
          return point
        end
        raise "No public_key_pem or public_key in config — run the ceremony's keygen first to establish the threshold key"
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

      # LOCAL mode: run the threshold ceremony in-process via the
      # magnus native binding (Confium::TC::Cmp20/Gg18 — the FFI's
      # Confium::TC::Session skeleton has no round orchestration; the
      # magnus bundle carries the real in-process drivers). Shares are
      # base64 strings provisioned by the ceremony's keygen step.
      def sign_local(data)
        require "base64"
        # The magnus native binding (confium_native.bundle) builds into
        # the confium-ruby checkout — CONFIUM_RUBY_LIB overrides the
        # default discovery (this CA lives in a different repo than the
        # gem's native build).
        native_dir = ENV["CONFIUM_RUBY_LIB"] || File.expand_path("~/src/confium/confium-ruby/lib/confium_native")
        $LOAD_PATH.unshift(native_dir) if File.directory?(native_dir) && !$LOAD_PATH.include?(native_dir)

        shares = @config["local_shares"]
        threshold = @config["threshold"]
        scheme = @config.fetch("scheme", "CMP20-ECDSA-P256")

        share_bytes = shares.map { |s| Base64.decode64(s) }

        signature =
          case scheme
          when /^CMP20/i
            require "confium_native"
            ::Confium::TC::Cmp20.sign(share_bytes, threshold, data)
          when /^GG18/i
            require "confium_native"
            ::Confium::TC::Gg18.sign(share_bytes, threshold, data)
          else
            raise ArgumentError, "unknown local threshold scheme #{scheme} (supported: CMP20, GG18)"
          end

        signature
      rescue LoadError
        raise "confium-ruby's native binding not available. Build it with: cd confium-ruby && bundle exec rake compile"
      end

      # COORDINATOR mode: delegate to the async coordinator service.
      # Creates a session, submits to coordinator, blocks until threshold
      # is reached. In production, this call blocks for hours to days
      # while directors participate asynchronously.
      def sign_via_coordinator(data)
        require "confium"
        # The TC session lives in its own file — `require "confium"`
        # alone does not autoload Confium::TC.
        begin
          require "confium/tc/session"
        rescue LoadError
          raise LoadError, "confium-ruby's TC session not available"
        end

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
