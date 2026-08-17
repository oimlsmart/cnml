# frozen_string_literal: true

require "spec_helper"

# Round-4 requirement closures: manifest signing (§manifest-format),
# the recognized-logs declaration (§manifest-transparency), the
# delegation quorum extension (§threshold-signing), and the ceremony
# audit algorithm (§ceremony).
RSpec.describe OimlPki::ManifestSigning do
  let(:key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:parsed) do
    {
      "deployment" => { "name" => "T", "operator" => "O", "manifest_version" => 1 },
      "mode" => "certificate_pki",
      "tiers" => [
        { "name" => "root", "role" => "RTA", "threshold" => { "t" => 5, "n" => 7 } },
        { "name" => "ia", "role" => "DTA", "threshold" => { "t" => 2, "n" => 3 }, "delegated_by" => "root" },
      ],
      "quorums" => [{ "name" => "q1", "coordinator" => "c1" }],
      "transparency" => {
        "logs" => [
          { "name" => "primary", "endpoint" => "https://log.example.org" },
          { "name" => "mirror-1", "endpoint" => "https://m1.example.org", "mirror" => true },
        ],
        "multi_log" => { "m" => 2, "k" => 3 },
      },
    }
  end

  it "signs the manifest and verifies it" do
    signed = described_class.sign(parsed, key)
    expect(signed["signature"]["value"]).to match(/\A[0-9a-f]{128}\z/)
    expect(described_class.verified?(signed)).to be(true)
  end

  it "rejects a manifest whose tiers were tampered after signing" do
    signed = described_class.sign(parsed, key)
    signed["tiers"][0]["threshold"]["t"] = 6
    expect(described_class.verified?(signed)).to be(false)
  end

  it "rejects an unsigned manifest" do
    expect(described_class.verified?(parsed)).to be(false)
  end

  it "the canonical string does not include the signature itself" do
    signed = described_class.sign(parsed, key)
    expect(described_class.canonical_string(signed)).to eq(described_class.canonical_string(parsed))
  end
end

RSpec.describe OimlPki::DeploymentManifest, "transparency logs declaration" do
  it "parses recognized logs and the multi-log policy" do
    toml = <<~TOML
      [deployment]
      name = "T"
      operator = "O"
      manifest_version = 1

      [[tiers]]
      name = "root"
      role = "RTA"

      [transparency]
      gossip = true

      [[transparency.logs]]
      name = "primary"
      endpoint = "https://log.example.org"

      [[transparency.logs]]
      name = "mirror-1"
      endpoint = "https://m1.example.org"
      mirror = true

      [transparency.multi_log]
      m = 2
      k = 3
    TOML
    manifest = OimlPki::DeploymentManifest.load(toml)
    expect(manifest.transparency.logs.length).to eq(2)
    expect(manifest.transparency.logs[1]["mirror"]).to be(true)
    expect(manifest.transparency.multi_log).to include("m" => 2, "k" => 3)
  end
end

RSpec.describe OimlPki::CertFactory, "quorum extension" do
  it "carries (T, N) on a threshold delegation certificate" do
    with_test_keystore do |dir, pass|
      root_cert = described_class.generate_root_ca("CN=Root", 10, pass)
      root_entry = OimlPki::CaStore.all(pass).first
      key = OpenSSL::PKey::EC.generate("prime256v1")
      csr = described_class.create_csr("CN=IA Threshold", key)

      signed = described_class.sign_csr(
        csr.to_pem, root_entry["privateKey"], root_cert.to_pem, 5, "intermediate", pass,
        scope: ["R60"], quorum: { t: 2, n: 3 }
      )

      ext = signed.extensions.find { |e| e.oid == described_class::OIML_QUORUM_OID }
      expect(ext).not_to be_nil
      seq = OpenSSL::ASN1.decode(ext.value_der)
      expect(seq.value.map(&:value)).to eq([2, 3])
    end
  end
end

RSpec.describe OimlPki::CeremonyTranscript, "#audit (§ceremony audit algorithm)" do
  let(:key) { OpenSSL::PKey::EC.generate("prime256v1") }

  def signed_transcript
    payload = "ceremony payload"
    participants = %w[chair_member scribe_member witness_member].each_with_index.map do |name, i|
      sig = key.sign(OpenSSL::Digest::SHA256.new, "participant-#{name}")
      OimlPki::CeremonyTranscript::Participant.new(
        role: i.zero? ? "chair" : (i == 1 ? "scribe" : "witness"),
        name: name, signature: sig, signed_payload: "participant-#{name}"
      )
    end
    OimlPki::CeremonyTranscript.new(
      ceremony_id: "c-1",
      ceremony_type: "root_signing",
      started_at: Time.utc(2026, 8, 1, 9),
      ended_at: Time.utc(2026, 8, 1, 10),
      participants: participants,
      quorum: { "t" => 2, "n" => 3, "contributed" => 3 },
      payload_hash: "sha256:" + OpenSSL::Digest::SHA256.hexdigest(payload),
      aggregate_signature: "aggregate-sig",
      log_sequence: 42,
    )
  end

  it "audits a valid ceremony: signatures, quorum, completeness" do
    t = signed_transcript
    resolver = ->(name) { key }
    report = t.audit(resolver)
    expect(report[:valid]).to be(true)
    expect(report[:checks]).to all(be_truthy)
  end

  it "fails the audit when a member signature is wrong" do
    t = signed_transcript
    resolver = ->(_name) { OpenSSL::PKey::EC.generate("prime256v1") }
    report = t.audit(resolver)
    expect(report[:valid]).to be(false)
    expect(report[:reasons]).not_to be_empty
  end
end
