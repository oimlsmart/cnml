# frozen_string_literal: true

# Ceremony transcript.
#
# A signed record of an in-person ceremony (director onboarding, root
# signing, re-share, offboarding). The transcript is the legal +
# audit artifact; it captures who was present, what was done, and
# every witness signature.
#
# Format: JSON (human-readable, structured). Stored on disk + a copy
# archived to the transparency log.
module OimlPki
  class CeremonyTranscript
    CEREMONY_TYPES = %w[
      director_onboarding
      director_offboarding_voluntary
      director_offboarding_end_of_term
      director_offboarding_death
      director_offboarding_incapacity
      director_suspended_for_cause
      root_signing
      ia_signing
      re_share
      key_recovery
      emergency_rotation
    ].freeze

    REQUIRED_PARTICIPANT_ROLES = %w[chair scribe].freeze

    attr_reader :ceremony_id, :ceremony_type, :started_at, :ended_at,
                :participants, :steps, :artifacts, :outcome,
                :quorum, :payload_hash, :aggregate_signature, :log_sequence

    def initialize(attrs)
      @ceremony_id    = attrs.fetch(:ceremony_id)
      @ceremony_type  = attrs.fetch(:ceremony_type)
      @started_at     = attrs[:started_at]
      @ended_at       = attrs[:ended_at]
      @participants   = attrs[:participants] || []
      @steps          = attrs[:steps] || []
      @artifacts      = attrs[:artifacts] || []
      @outcome        = attrs[:outcome]
      @quorum         = attrs[:quorum]
      @payload_hash   = attrs[:payload_hash]
      @aggregate_signature = attrs[:aggregate_signature]
      @log_sequence   = attrs[:log_sequence]
    end

    # Returns true if every required field is present and every required
    # participant role is filled. Does NOT verify signatures (those are
    # verified separately by #verify_signatures).
    def valid?
      return false unless CEREMONY_TYPES.include?(@ceremony_type)
      return false unless @started_at && @ended_at
      return false unless @participants.is_a?(Array) && @participants.length >= 2

      filled_roles = @participants.map(&:role).compact
      REQUIRED_PARTICIPANT_ROLES.all? { |r| filled_roles.include?(r) }
    end

    # SIGNATIF §ceremony-records completeness: quorum parameters, the
    # canonical payload hash, the aggregate threshold signature, the
    # log cross-reference, and every member signature. An incomplete
    # transcript is not accepted as evidence of a valid ceremony.
    def complete?
      return false unless valid?
      return false unless quorum.is_a?(Hash) && quorum["t"] && quorum["n"]
      return false unless quorum["contributed"] && quorum["contributed"] >= quorum["t"]
      return false unless payload_hash
      return false unless aggregate_signature
      return false unless log_sequence
      @participants.all? { |p| p.signature && p.signed_payload }
    end

    # Verify every participant signature against the provided public key
    # resolver. Returns true if all signatures verify; false otherwise.
    # @param resolver [#call] receives participant name → returns OpenSSL::PKey
    def verify_signatures(resolver)
      return false unless valid?
      @participants.all? do |p|
        next false if p.signature.nil? || p.signed_payload.nil?
        key = resolver.call(p.name)
        next false unless key
        digest = OpenSSL::Digest::SHA256.new
        key.verify(digest, p.signature, p.signed_payload)
      rescue StandardError
        false
      end
    end

    def to_h
      {
        "ceremony_id"   => @ceremony_id,
        "ceremony_type" => @ceremony_type,
        "started_at"    => iso8601(@started_at),
        "ended_at"      => iso8601(@ended_at),
        "outcome"       => @outcome,
        "participants"  => @participants.map(&:to_h),
        "steps"         => @steps.map(&:to_h),
        "artifacts"     => @artifacts,
        "quorum"        => @quorum,
        "payload_hash"  => @payload_hash,
        "aggregate_signature" => @aggregate_signature,
        "log_sequence"  => @log_sequence,
      }
    end

    def to_json(*)
      JSON.pretty_generate(to_h)
    end

    def self.from_h(hash)
      new(
        ceremony_id:   hash.fetch("ceremony_id"),
        ceremony_type: hash.fetch("ceremony_type"),
        started_at:    parse_time(hash["started_at"]),
        ended_at:      parse_time(hash["ended_at"]),
        outcome:       hash["outcome"],
        participants:  (hash["participants"] || []).map { |p| Participant.from_h(p) },
        steps:         (hash["steps"] || []).map { |s| Step.from_h(s) },
        artifacts:     hash["artifacts"] || [],
        quorum:        hash["quorum"],
        payload_hash:  hash["payload_hash"],
        aggregate_signature: hash["aggregate_signature"],
        log_sequence:  hash["log_sequence"],
      )
    end

    def self.load(json)
      from_h(JSON.parse(json))
    end

    def self.parse_time(value)
      return value if value.nil? || value.is_a?(Time)
      Time.iso8601(value)
    rescue ArgumentError
      nil
    end

    private

    def iso8601(time)
      return nil unless time
      time.respond_to?(:iso8601) ? time.utc.iso8601 : time.to_s
    end

    # One participant in the ceremony (chair, scribe, witness, candidate, etc.).
    class Participant
      attr_reader :role, :name, :signature, :signed_payload

      def initialize(attrs)
        @role           = attrs.fetch(:role)
        @name           = attrs.fetch(:name)
        @signature      = attrs[:signature]
        @signed_payload = attrs[:signed_payload]
      end

      def to_h
        {
          "role"           => @role,
          "name"           => @name,
          "signature"      => @signature ? Base64.strict_encode64(@signature) : nil,
          "signed_payload" => @signed_payload ? Base64.strict_encode64(@signed_payload) : nil,
        }
      end

      def self.from_h(hash)
        new(
          role:           hash.fetch("role"),
          name:           hash.fetch("name"),
          signature:      hash["signature"] ? Base64.strict_decode64(hash["signature"]) : nil,
          signed_payload: hash["signed_payload"] ? Base64.strict_decode64(hash["signed_payload"]) : nil,
        )
      end
    end

    # One step in the ceremony (e.g., "Phase 1: Verification", "Phase 2: Provisioning").
    class Step
      attr_reader :name, :timestamp, :actor, :result

      def initialize(attrs)
        @name      = attrs.fetch(:name)
        @timestamp = attrs[:timestamp]
        @actor     = attrs[:actor]
        @result    = attrs[:result]
      end

      def to_h
        {
          "name"      => @name,
          "timestamp" => @timestamp.respond_to?(:iso8601) ? @timestamp.utc.iso8601 : @timestamp,
          "actor"     => @actor,
          "result"    => @result,
        }
      end

      def self.from_h(hash)
        new(
          name:      hash.fetch("name"),
          timestamp: CeremonyTranscript.parse_time(hash["timestamp"]),
          actor:     hash["actor"],
          result:    hash["result"],
        )
      end
    end
  end
end
