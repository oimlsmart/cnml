# frozen_string_literal: true

require "spec_helper"
require "tmpdir"
require "json"

# Round-3 SIGNATIF closures: the mirror (§security-considerations),
# registry signing ceremony (§algorithm-agility), and ceremony
# transcript completeness (§ceremony-records).
RSpec.describe OimlPki::TransparencyMirror do
  let(:ec_key) { OpenSSL::PKey::EC.generate("prime256v1") }

  def publish(dir, count:)
    OimlPki::TransparencyPublisher.log_file_override = File.join(dir, "t.log")
    OimlPki::TransparencyPublisher.state_bindings_file_override = File.join(dir, "sb.json")
    # Grow to the target TOTAL size (record appends).
    current = File.exist?(File.join(dir, "t.log")) ? File.binread(File.join(dir, "t.log")).bytesize / 36 : 0
    (current...count).each { |i| OimlPki::TransparencyPublisher.record(OpenSSL::Digest::SHA256.digest("m#{i}")) }
    OimlPki::TransparencyPublisher.publish_to_directory(
      File.join(dir, "pub"), operator_key: ec_key
    )
  end

  after do
    OimlPki::TransparencyPublisher.log_file_override = nil
    OimlPki::TransparencyPublisher.state_bindings_file_override = nil
  end

  it "accepts a first sync and republishes the verified state" do
    Dir.mktmpdir do |dir|
      publish(dir, count: 3)
      mirror = File.join(dir, "mirror")
      observation = described_class.sync(File.join(dir, "pub"), mirror, mirror_name: "m1")

      expect(observation["size"]).to eq(3)
      expect(observation["prior_size"]).to be_nil
      expect(File).to exist(File.join(mirror, "head.json"))
      expect(File).to exist(File.join(mirror, "leaf", "2"))
      expect(JSON.parse(File.read(File.join(mirror, "mirror.json")))["mirror"]).to eq("m1")
    end
  end

  it "validates the consistency proof between consecutive heads" do
    Dir.mktmpdir do |dir|
      publish(dir, count: 2)
      mirror = File.join(dir, "mirror")
      described_class.sync(File.join(dir, "pub"), mirror)

      publish(dir, count: 5)
      observation = described_class.sync(File.join(dir, "pub"), mirror)
      expect(observation["size"]).to eq(5)
      expect(observation["prior_size"]).to eq(2)
    end
  end

  it "rejects a rewritten operator head (fork)" do
    Dir.mktmpdir do |dir|
      publish(dir, count: 2)
      mirror = File.join(dir, "mirror")
      described_class.sync(File.join(dir, "pub"), mirror)

      # Rewrite: a fresh log replacing history with different leaves,
      # so the size-2 prefix the mirror observed no longer matches.
      File.delete(File.join(dir, "t.log"))
      OimlPki::TransparencyPublisher.log_file_override = File.join(dir, "t.log")
      4.times { |i| OimlPki::TransparencyPublisher.record(OpenSSL::Digest::SHA256.digest("x#{i}")) }
      OimlPki::TransparencyPublisher.publish_to_directory(
        File.join(dir, "pub"), operator_key: ec_key
      )
      expect {
        described_class.sync(File.join(dir, "pub"), mirror)
      }.to raise_error(OimlPki::TransparencyMirror::MirrorRejected, /consistency proof failed/)
    end
  end

  it "rejects a head that does not match the published leaves" do
    Dir.mktmpdir do |dir|
      publish(dir, count: 2)
      head_path = File.join(dir, "pub", "head.json")
      head = JSON.parse(File.read(head_path))
      head["root"] = "00" * 32
      File.write(head_path, JSON.pretty_generate(head))
      expect {
        described_class.sync(File.join(dir, "pub"), File.join(dir, "mirror"))
      }.to raise_error(OimlPki::TransparencyMirror::MirrorRejected, /does not match/)
    end
  end
end

RSpec.describe OimlPki::AlgorithmRegistry do
  let(:key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:registry) do
    {
      "version" => 1,
      "published" => "2026-08-16",
      "algorithms" => [
        { "id" => "ecdsa-p256", "family" => "classical", "status" => "active" },
        { "id" => "ed25519", "family" => "classical", "status" => "active" },
      ],
    }
  end

  it "signs and verifies the registry" do
    signed = described_class.sign(registry, key)
    expect(signed["signature"]).to match(/\A[0-9a-f]{128}\z/)
    expect(described_class.verified?(signed)).to be(true)
  end

  it "rejects a tampered registry" do
    signed = described_class.sign(registry, key)
    signed["algorithms"][0]["status"] = "retired"
    expect(described_class.verified?(signed)).to be(false)
  end

  it "signs a file in place" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "algorithms.json")
      File.write(path, JSON.pretty_generate(registry))
      described_class.sign_file(path, key)
      expect(described_class.verified?(JSON.parse(File.read(path)))).to be(true)
    end
  end
end

RSpec.describe OimlPki::CeremonyTranscript, "completeness (§ceremony-records)" do
  def transcript(**overrides)
    attrs = {
      ceremony_id: "c-1",
      ceremony_type: "root_signing",
      started_at: Time.utc(2026, 8, 1, 9),
      ended_at: Time.utc(2026, 8, 1, 10),
      participants: [
        OimlPki::CeremonyTranscript::Participant.new(
          role: "chair", name: "A", signature: "sig", signed_payload: "payload"
        ),
        OimlPki::CeremonyTranscript::Participant.new(
          role: "scribe", name: "B", signature: "sig", signed_payload: "payload"
        ),
      ],
      quorum: { "t" => 2, "n" => 3, "contributed" => 3 },
      payload_hash: "sha256:" + "0" * 64,
      aggregate_signature: "sig",
      log_sequence: 42,
    }
    OimlPki::CeremonyTranscript.new(attrs.merge(overrides))
  end

  it "is complete with quorum, payload hash, aggregate signature, log ref, and member signatures" do
    expect(transcript.complete?).to be(true)
  end

  it "is incomplete without the log cross-reference" do
    expect(transcript(log_sequence: nil).complete?).to be(false)
  end

  it "is incomplete when fewer than t contributed" do
    expect(transcript(quorum: { "t" => 2, "n" => 3, "contributed" => 1 }).complete?).to be(false)
  end

  it "is incomplete without the aggregate signature" do
    expect(transcript(aggregate_signature: nil).complete?).to be(false)
  end

  it "round-trips the ceremony-record fields" do
    h = transcript.to_h
    restored = OimlPki::CeremonyTranscript.from_h(JSON.parse(JSON.generate(h)))
    expect(restored.log_sequence).to eq(42)
    expect(restored.quorum["t"]).to eq(2)
    expect(restored.complete?).to be(true)
  end
end
