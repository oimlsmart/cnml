# frozen_string_literal: true

require "spec_helper"

# Test the Confium KeyProvider backend. Uses real instances (no doubles).
# The LOCAL mode creates in-process threshold sessions via confium-ruby.
RSpec.describe OimlPki::KeyProvider::Confium do
  describe "#initialize" do
    it "accepts LOCAL mode config (local_shares)" do
      provider = described_class.new(
        "local_shares" => ["share1", "share2"],
        "threshold" => 2,
        "scheme" => "FROST-P256",
      )
      expect(provider.mode).to eq(:local)
    end

    it "accepts COORDINATOR mode config" do
      provider = described_class.new(
        "coordinator_endpoint" => "tcp://10.0.0.1:7788",
        "quorum_id" => "biml-root",
        "threshold" => 5,
      )
      expect(provider.mode).to eq(:coordinator)
    end

    it "requires threshold in LOCAL mode" do
      expect {
        described_class.new("local_shares" => ["a", "b"])
      }.to raise_error(ArgumentError, /threshold required/)
    end

    it "requires at least 2 shares in LOCAL mode" do
      expect {
        described_class.new("local_shares" => ["a"], "threshold" => 1)
      }.to raise_error(ArgumentError, /at least 2 shares/)
    end

    it "requires coordinator_endpoint in COORDINATOR mode" do
      expect {
        described_class.new("quorum_id" => "x", "threshold" => 2)
      }.to raise_error(ArgumentError, /coordinator_endpoint required/)
    end

    it "requires quorum_id in COORDINATOR mode" do
      expect {
        described_class.new("coordinator_endpoint" => "tcp://x", "threshold" => 2)
      }.to raise_error(ArgumentError, /quorum_id required/)
    end
  end

  describe "#extractable?" do
    it "is always false (threshold key is never extractable)" do
      provider = described_class.new("local_shares" => ["a", "b"], "threshold" => 2)
      expect(provider.extractable?).to be(false)
    end
  end

  describe "#label" do
    it "includes scheme + threshold in LOCAL mode" do
      provider = described_class.new(
        "local_shares" => ["a", "b", "c"],
        "threshold" => 2,
        "scheme" => "FROST-P256",
      )
      expect(provider.label).to eq("confium-local (FROST-P256, 2-of-3)")
    end

    it "includes quorum_id in COORDINATOR mode" do
      provider = described_class.new(
        "coordinator_endpoint" => "tcp://x",
        "quorum_id" => "biml-root",
        "threshold" => 5,
      )
      expect(provider.label).to eq("confium-coordinator (biml-root)")
    end
  end

  describe "#to_h" do
    it "serializes LOCAL config" do
      provider = described_class.new(
        "local_shares" => ["a", "b"],
        "threshold" => 2,
        "scheme" => "FROST-P256",
      )
      h = provider.to_h
      expect(h["type"]).to eq("confium")
      expect(h["mode"]).to eq("local")
      expect(h["scheme"]).to eq("FROST-P256")
      expect(h["threshold"]).to eq(2)
      expect(h["num_parties"]).to eq(2)
    end

    it "serializes COORDINATOR config" do
      provider = described_class.new(
        "coordinator_endpoint" => "tcp://x:7788",
        "quorum_id" => "biml-root",
        "threshold" => 5,
      )
      h = provider.to_h
      expect(h["mode"]).to eq("coordinator")
      expect(h["coordinator_endpoint"]).to eq("tcp://x:7788")
      expect(h["quorum_id"]).to eq("biml-root")
    end
  end

  describe "#public_key" do
    it "returns the configured public key when provided" do
      key = OpenSSL::PKey::EC.generate("prime256v1")
      provider = described_class.new(
        "local_shares" => ["a", "b"],
        "threshold" => 2,
        "public_key_pem" => key.public_to_pem,
      )
      pub = provider.public_key
      expect(pub).to be_a(OpenSSL::PKey::EC)
    end

    it "raises when no public key configured" do
      provider = described_class.new("local_shares" => ["a", "b"], "threshold" => 2)
      expect { provider.public_key }.to raise_error(/No public_key_pem/)
    end
  end

  describe "factory dispatch" do
    it "KeyProvider.for dispatches to Confium when entry has confium config" do
      entry = { "confium" => { "local_shares" => ["a", "b"], "threshold" => 2 } }
      provider = OimlPki::KeyProvider.for(entry)
      expect(provider).to be_a(described_class)
    end

    it "takes priority over pkcs11 and software" do
      entry = {
        "confium" => { "coordinator_endpoint" => "tcp://x", "quorum_id" => "y", "threshold" => 2 },
        "pkcs11" => { "module" => "/dev/null", "cert_id" => "01" },
        "privateKey" => "-----BEGIN PRIVATE KEY-----",
      }
      provider = OimlPki::KeyProvider.for(entry)
      expect(provider).to be_a(described_class)
    end
  end
end
