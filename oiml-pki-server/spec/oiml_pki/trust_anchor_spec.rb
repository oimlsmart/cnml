# frozen_string_literal: true

require "spec_helper"
require "tmpdir"

# Test TrustAnchor + TrustAnchorSet + TrustAnchorPublisher. Uses real
# ECDSA-P256 keys (no doubles) and a real tempdir for output.
RSpec.describe OimlPki::TrustAnchor do
  let(:test_key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:anchor_attrs) do
    {
      id:                   "biml-root-2026",
      role:                 "root",
      public_key_pem:       test_key.public_to_pem,
      valid_from:           Time.utc(2026, 1, 1),
      valid_until:          Time.utc(2031, 1, 1),
      threshold_t:          5,
      threshold_n:          7,
      transparency_log_url: "https://tlog.cnml.oiml.org",
    }
  end

  describe ".new + #to_h round-trip" do
    it "exposes typed accessors" do
      a = described_class.new(anchor_attrs)
      expect(a.id).to eq("biml-root-2026")
      expect(a.role).to eq("root")
      expect(a.threshold_t).to eq(5)
      expect(a.threshold_n).to eq(7)
    end

    it "computes a stable SHA-256 fingerprint of the public key DER" do
      a1 = described_class.new(anchor_attrs)
      a2 = described_class.new(anchor_attrs)  # same attrs
      expect(a1.fingerprint_sha256).to eq(a2.fingerprint_sha256)
      expect(a1.fingerprint_sha256).to match(/\A[0-9a-f]{64}\z/)

      # Different key → different fingerprint
      other_attrs = anchor_attrs.merge(public_key_pem: OpenSSL::PKey::EC.generate("prime256v1").public_to_pem)
      expect(described_class.new(other_attrs).fingerprint_sha256).not_to eq(a1.fingerprint_sha256)
    end

    it "round-trips through to_h + from_h" do
      a = described_class.new(anchor_attrs)
      h = a.to_h
      restored = described_class.from_h(h)
      expect(restored.id).to eq(a.id)
      expect(restored.fingerprint_sha256).to eq(a.fingerprint_sha256)
      expect(restored.threshold_t).to eq(5)
    end
  end
end

RSpec.describe OimlPki::TrustAnchorSet do
  let(:root_key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:ia_key)   { OpenSSL::PKey::EC.generate("prime256v1") }

  let(:root_anchor) do
    OimlPki::TrustAnchor.new(
      id: "biml-root-2026", role: "root",
      public_key_pem: root_key.public_to_pem,
      threshold_t: 5, threshold_n: 7,
    )
  end

  let(:ia_anchor) do
    OimlPki::TrustAnchor.new(
      id: "ia-france-2026", role: "issuing_authority",
      public_key_pem: ia_key.public_to_pem,
      threshold_t: 2, threshold_n: 3,
    )
  end

  let(:set) do
    described_class.new(
      version:      "2026.07",
      published_at: Time.utc(2026, 7, 15, 12, 0, 0),
      anchors:      [root_anchor, ia_anchor],
    )
  end

  describe "#find_anchor + #current_root" do
    it "finds an anchor by id" do
      expect(set.find_anchor("biml-root-2026").role).to eq("root")
      expect(set.find_anchor("ia-france-2026").role).to eq("issuing_authority")
    end

    it "returns nil for unknown id" do
      expect(set.find_anchor("ghost")).to be_nil
    end

    it "finds the root anchor" do
      expect(set.current_root.id).to eq("biml-root-2026")
    end

    it "returns nil when no root anchor exists" do
      s = described_class.new(
        version: "2026.07", published_at: Time.now,
        anchors: [ia_anchor],  # only IA, no root
      )
      expect(s.current_root).to be_nil
    end
  end

  describe "#to_json + .load round-trip" do
    it "serializes to JSON and back" do
      json = set.to_json
      restored = described_class.load(json)
      expect(restored.version).to eq("2026.07")
      expect(restored.anchors.length).to eq(2)
      expect(restored.current_root.id).to eq("biml-root-2026")
    end

    it "includes schema_version field" do
      h = set.to_h
      expect(h["schema_version"]).to eq(OimlPki::TrustAnchorSet::SCHEMA_VERSION)
    end
  end

  describe "signing" do
    # Real Software KeyProvider (no doubles). Sign with one key,
    # verify with the matching public key.
    let(:provider) do
      signing_key = OpenSSL::PKey::EC.generate("prime256v1")
      OimlPki::KeyProvider::Software.new("privateKey" => signing_key.private_to_pem)
    end

    it "signs and verifies the canonical JSON" do
      signature_b64 = set.sign_with(provider)
      expect(signature_b64).to be_a(String)

      # Verify: provider signs with its private key; we verify with
      # the matching public key
      public_key_pem = provider.public_key.public_to_pem
      expect(set.verify_signature(public_key_pem, signature_b64)).to be(true)
    end

    it "rejects a tampered signature" do
      signature_b64 = set.sign_with(provider)
      # Tamper by flipping one byte of the decoded signature, then re-encode.
      decoded = Base64.strict_decode64(signature_b64)
      tampered_bytes = decoded.bytes
      tampered_bytes[0] = (tampered_bytes[0] ^ 0xFF)
      tampered = Base64.strict_encode64(tampered_bytes.pack("C*"))
      public_key_pem = provider.public_key.public_to_pem
      expect(set.verify_signature(public_key_pem, tampered)).to be(false)
    end

    it "rejects a different public key" do
      signature_b64 = set.sign_with(provider)
      other_key = OpenSSL::PKey::EC.generate("prime256v1").public_to_pem
      expect(set.verify_signature(other_key, signature_b64)).to be(false)
    end
  end
end

RSpec.describe OimlPki::TrustAnchorPublisher do
  after { described_class.output_dir_override = nil }

  let(:anchor_set) do
    root_anchor = OimlPki::TrustAnchor.new(
      id: "biml-root-2026", role: "root",
      public_key_pem: OpenSSL::PKey::EC.generate("prime256v1").public_to_pem,
      threshold_t: 5, threshold_n: 7,
    )
    OimlPki::TrustAnchorSet.new(
      version: "2026.07",
      published_at: Time.utc(2026, 7, 15),
      anchors: [root_anchor],
    )
  end

  it "publishes a trust-anchors.json file to a tempdir" do
    Dir.mktmpdir do |dir|
      described_class.output_dir_override = dir
      path = described_class.publish(anchor_set)
      expect(path).to eq(File.join(dir, "trust-anchors.json"))
      expect(File.exist?(path)).to be(true)
      loaded = OimlPki::TrustAnchorSet.load(File.read(path))
      expect(loaded.version).to eq("2026.07")
    end
  end

  it "publishes both JSON and signature when given a provider" do
    signing_key = OpenSSL::PKey::EC.generate("prime256v1")
    provider = OimlPki::KeyProvider::Software.new("privateKey" => signing_key.private_to_pem)
    Dir.mktmpdir do |dir|
      described_class.output_dir_override = dir
      json_path, sig_path = described_class.publish_with_signature(
        anchor_set, provider: provider
      )
      expect(File.exist?(json_path)).to be(true)
      expect(File.exist?(sig_path)).to be(true)
      expect(File.read(sig_path)).to match(/\A[A-Za-z0-9+\/=]+\z/)
    end
  end
end
