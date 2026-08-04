# frozen_string_literal: true

# Trust anchor distribution.
#
# A trust anchor set is a versioned JSON document listing the
# currently-trusted root certificates. The browser verifier fetches
# it on first visit and pins the SHA-256 fingerprint in localStorage.
# Subsequent visits compare the pinned fingerprint to the freshly
# fetched one; mismatch is a hard fail (TOFU discipline).
#
# The Ruby CA server publishes the trust anchor set when roots are
# rotated or new directors onboarded. The set is signed by the
# current root quorum (5-of-7) and pushed to:
#
#   - The CNML web app's static assets (trust-anchors.json)
#   - The transparency log (as an anchored entry)
#
module OimlPki
  class TrustAnchor
    attr_reader :id, :role, :public_key_pem, :valid_from, :valid_until,
                :threshold_t, :threshold_n, :transparency_log_url

    def initialize(attrs)
      @id                   = attrs.fetch(:id)
      @role                 = attrs.fetch(:role)
      @public_key_pem       = attrs.fetch(:public_key_pem)
      @valid_from           = attrs[:valid_from]
      @valid_until          = attrs[:valid_until]
      @threshold_t          = attrs[:threshold_t]
      @threshold_n          = attrs[:threshold_n]
      @transparency_log_url = attrs[:transparency_log_url]
    end

    # SHA-256 fingerprint of the public key DER, hex-encoded.
    # Used as a stable identifier across the wire (independent of PEM whitespace).
    def fingerprint_sha256
      key = OpenSSL::PKey.read(@public_key_pem)
      der = key.public_to_der
      OpenSSL::Digest::SHA256.hexdigest(der)
    end

    def to_h
      {
        "id"                   => @id,
        "role"                 => @role,
        "public_key_pem"       => @public_key_pem,
        "fingerprint_sha256"   => fingerprint_sha256,
        "valid_from"           => iso8601_or_nil(@valid_from),
        "valid_until"          => iso8601_or_nil(@valid_until),
        "threshold"            => threshold_h,
        "transparency_log_url" => @transparency_log_url,
      }
    end

    def self.from_h(hash)
      threshold = hash["threshold"] || {}
      new(
        id:                   hash.fetch("id"),
        role:                 hash.fetch("role"),
        public_key_pem:       hash.fetch("public_key_pem"),
        valid_from:           parse_time(hash["valid_from"]),
        valid_until:          parse_time(hash["valid_until"]),
        threshold_t:          threshold["t"],
        threshold_n:          threshold["n"],
        transparency_log_url: hash["transparency_log_url"],
      )
    end

    def self.parse_time(value)
      return value if value.nil? || value.is_a?(Time)
      Time.iso8601(value)
    rescue ArgumentError
      nil
    end

    private

    def threshold_h
      return nil unless @threshold_t && @threshold_n
      { "t" => @threshold_t, "n" => @threshold_n }
    end

    def iso8601_or_nil(time)
      return nil unless time
      time.respond_to?(:iso8601) ? time.utc.iso8601 : time.to_s
    end
  end

  # A versioned collection of TrustAnchors with a detached signature
  # by the current operating quorum.
  class TrustAnchorSet
    CURRENT_VERSION = 1
    SCHEMA_VERSION  = "2026.07"

    attr_reader :version, :published_at, :anchors, :previous_version,
                :previous_version_signature

    def initialize(version:, published_at:, anchors:, previous_version: nil,
                   previous_version_signature: nil)
      @version                   = version
      @published_at              = published_at
      @anchors                   = anchors
      @previous_version          = previous_version
      @previous_version_signature = previous_version_signature
    end

    def find_anchor(id)
      @anchors.find { |a| a.id == id }
    end

    def current_root
      @anchors.find { |a| a.role == "root" }
    end

    def to_h
      {
        "version"         => @version,
        "schema_version"  => SCHEMA_VERSION,
        "published_at"    => published_at_iso8601,
        "anchors"         => @anchors.map(&:to_h),
        "previous_version"          => @previous_version,
        "previous_version_signature" => @previous_version_signature,
      }
    end

    def to_json(*)
      JSON.pretty_generate(to_h)
    end

    def self.from_h(hash)
      anchors = (hash["anchors"] || []).map { |a| TrustAnchor.from_h(a) }
      new(
        version:                    hash.fetch("version"),
        published_at:               TrustAnchor.parse_time(hash["published_at"]),
        anchors:                    anchors,
        previous_version:           hash["previous_version"],
        previous_version_signature: hash["previous_version_signature"],
      )
    end

    def self.load(json)
      from_h(JSON.parse(json))
    end

    # Compute a detached signature over the canonical JSON form.
    # The provider (any KeyProvider) supplies the signing machinery —
    # this lets the same code path sign via Software, Pkcs11, or Confium
    # threshold crypto (OCP: open for extension).
    def sign_with(provider)
      canonical = canonical_json
      signature = provider.sign(canonical)
      Base64.strict_encode64(signature)
    end

    # Verify a detached signature against a public key.
    def verify_signature(public_key_pem, signature_b64)
      canonical = canonical_json
      signature = Base64.strict_decode64(signature_b64)
      key = OpenSSL::PKey.read(public_key_pem)
      verify_with_key(key, canonical, signature)
    end

    private

    def published_at_iso8601
      return @published_at unless @published_at.respond_to?(:iso8601)
      @published_at.utc.iso8601
    end

    # Canonical JSON: keys sorted, no whitespace, UTF-8. Same bytes
    # regardless of insertion order or Hash implementation.
    def canonical_json
      # Round-trip through JSON to normalize; sort_keys for stability.
      JSON.generate(to_h, { space: "", indent: "", object_nl: "", array_nl: "" })
    rescue StandardError
      to_h.to_json
    end

    def verify_with_key(key, data, signature)
      digest = OpenSSL::Digest::SHA256.new
      if key.class.name.end_with?("::EC")
        key.dsa_verify_asn1(digest.digest(data), signature)
      elsif key.respond_to?(:verify_pss)
        key.verify_pss("SHA256", signature, data, salt_length: :digest, mgf1_hash: "SHA256")
      else
        key.verify(digest, signature, data)
      end
    rescue OpenSSL::PKey::PKeyError
      false
    end
  end

  # Publishes a TrustAnchorSet to one or more destinations (static file,
  # transparency log, CDN, mirror). Each destination is its own method
  # so adding destinations is purely additive (OCP).
  module TrustAnchorPublisher
    class << self
      attr_accessor :output_dir_override
    end

    module_function

    def publish(anchor_set, output_dir: default_output_dir)
      FileUtils.mkdir_p(output_dir)
      json_path = File.join(output_dir, "trust-anchors.json")
      File.write(json_path, anchor_set.to_json)
      json_path
    end

    def publish_with_signature(anchor_set, provider:, output_dir: default_output_dir)
      json_path = publish(anchor_set, output_dir: output_dir)
      signature = anchor_set.sign_with(provider)
      sig_path = File.join(output_dir, "trust-anchors.json.sig")
      File.write(sig_path, signature)
      [json_path, sig_path]
    end

    def default_output_dir
      @output_dir_override || File.join(OimlPki::OUTPUT_DIR, "trust-anchors")
    end
  end
end
