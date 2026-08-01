# frozen_string_literal: true

require "spec_helper"

# Test CeremonyTranscript without doubles — real key generation,
# real signature round-trip, real JSON round-trip.
RSpec.describe OimlPki::CeremonyTranscript do
  let(:chair_key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:scribe_key) { OpenSSL::PKey::EC.generate("prime256v1") }

  let(:chair_participant) do
    payload = "ceremony-001|chair|2026-07-15T10:00:00Z"
    signature = chair_key.sign(OpenSSL::Digest::SHA256.new, payload)
    described_class::Participant.new(
      role: "chair", name: "Dr. Alice Director",
      signature: signature, signed_payload: payload,
    )
  end

  let(:scribe_participant) do
    payload = "ceremony-001|scribe|2026-07-15T10:00:00Z"
    signature = scribe_key.sign(OpenSSL::Digest::SHA256.new, payload)
    described_class::Participant.new(
      role: "scribe", name: "Mr. Bob Secretary",
      signature: signature, signed_payload: payload,
    )
  end

  let(:valid_attrs) do
    {
      ceremony_id:   "ceremony-2026-001",
      ceremony_type: "director_onboarding",
      started_at:    Time.utc(2026, 7, 15, 10, 0, 0),
      ended_at:      Time.utc(2026, 7, 15, 14, 0, 0),
      outcome:       "success",
      participants:  [chair_participant, scribe_participant],
      steps: [
        described_class::Step.new(
          name: "Phase 1: Verification", timestamp: Time.utc(2026, 7, 15, 10, 0, 0),
          actor: "chair", result: "passed",
        ),
      ],
      artifacts: ["video.avi", "transcript.pdf"],
    }
  end

  describe ".new + #valid?" do
    it "is valid with all required fields + chair + scribe" do
      t = described_class.new(valid_attrs)
      expect(t).to be_valid
    end

    it "is invalid when ceremony_type is not in the canonical list" do
      t = described_class.new(valid_attrs.merge(ceremony_type: "bogus"))
      expect(t).not_to be_valid
    end

    it "is invalid when started_at is missing" do
      t = described_class.new(valid_attrs.reject { |k, _| k == :started_at })
      expect(t).not_to be_valid
    end

    it "is invalid when there are fewer than 2 participants" do
      t = described_class.new(valid_attrs.merge(participants: [chair_participant]))
      expect(t).not_to be_valid
    end

    it "is invalid when chair role is missing" do
      t = described_class.new(valid_attrs.merge(
        participants: [
          described_class::Participant.new(role: "scribe", name: "A"),
          described_class::Participant.new(role: "witness", name: "B"),
        ],
      ))
      expect(t).not_to be_valid
    end
  end

  describe "#to_json + .load round-trip" do
    it "round-trips through JSON preserving all fields" do
      t = described_class.new(valid_attrs)
      json = t.to_json
      restored = described_class.load(json)

      expect(restored.ceremony_id).to eq("ceremony-2026-001")
      expect(restored.ceremony_type).to eq("director_onboarding")
      expect(restored.participants.length).to eq(2)
      expect(restored.participants.first.role).to eq("chair")
      expect(restored.participants.first.name).to eq("Dr. Alice Director")
      expect(restored.steps.first.name).to eq("Phase 1: Verification")
      expect(restored.artifacts).to eq(["video.avi", "transcript.pdf"])
    end

    it "preserves signature bytes through base64 round-trip" do
      t = described_class.new(valid_attrs)
      restored = described_class.load(t.to_json)
      expect(restored.participants.first.signature).to eq(chair_participant.signature)
      expect(restored.participants.first.signed_payload).to eq(chair_participant.signed_payload)
    end
  end

  describe "#verify_signatures" do
    it "returns true when all participant signatures verify against matching public keys" do
      t = described_class.new(valid_attrs)
      resolver = lambda do |name|
        case name
        when "Dr. Alice Director" then chair_key
        when "Mr. Bob Secretary"  then scribe_key
        else nil
        end
      end
      expect(t.verify_signatures(resolver)).to be(true)
    end

    it "returns false when a signature is tampered" do
      tampered_attrs = valid_attrs
      tampered_participant = described_class::Participant.new(
        role: "chair", name: "Dr. Alice Director",
        signature: "wrong".b,
        signed_payload: chair_participant.signed_payload,
      )
      tampered_attrs = valid_attrs.merge(participants: [tampered_participant, scribe_participant])
      t = described_class.new(tampered_attrs)
      resolver = lambda do |name|
        case name
        when "Dr. Alice Director" then chair_key
        when "Mr. Bob Secretary"  then scribe_key
        else nil
        end
      end
      expect(t.verify_signatures(resolver)).to be(false)
    end

    it "returns false when resolver returns mismatched key" do
      t = described_class.new(valid_attrs)
      wrong_key = OpenSSL::PKey::EC.generate("prime256v1")
      resolver = ->(_name) { wrong_key }
      expect(t.verify_signatures(resolver)).to be(false)
    end
  end

  describe "CEREMONY_TYPES" do
    it "includes director onboarding + offboarding + root signing + re_share" do
      expect(described_class::CEREMONY_TYPES).to include(
        "director_onboarding", "director_offboarding_voluntary",
        "root_signing", "re_share",
      )
    end
  end

  describe described_class::Participant do
    it "round-trips through to_h + from_h" do
      p = described_class.new(role: "witness", name: "X", signature: "\x01\x02", signed_payload: "data")
      restored = described_class.from_h(p.to_h)
      expect(restored.role).to eq("witness")
      expect(restored.name).to eq("X")
      expect(restored.signature).to eq("\x01\x02")
      expect(restored.signed_payload).to eq("data")
    end
  end

  describe described_class::Step do
    it "round-trips through to_h + from_h" do
      s = described_class.new(
        name: "Phase 1", timestamp: Time.utc(2026, 7, 15),
        actor: "chair", result: "passed",
      )
      restored = described_class.from_h(s.to_h)
      expect(restored.name).to eq("Phase 1")
      expect(restored.actor).to eq("chair")
      expect(restored.result).to eq("passed")
    end
  end
end
