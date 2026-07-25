# frozen_string_literal: true

require "spec_helper"

# Real keypair (no doubles per CLAUDE.md rule). Use OpenSSL directly.
RSpec.describe OimlPki::KeyProvider::Software do
  let(:ec_key) { OpenSSL::PKey::EC.generate("prime256v1") }
  let(:entry)  { { "privateKey" => ec_key.to_pem } }
  subject(:provider) { described_class.new(entry) }

  describe "#initialize" do
    it "requires entry['privateKey']" do
      expect { described_class.new({}) }.to raise_error(ArgumentError, /privateKey/)
    end
  end

  describe "#sign" do
    it "produces a DER-encoded ECDSA signature" do
      data = "hello world"
      signature = provider.sign(data)
      # ECDSA P-256 signature is DER-encoded: ASN.1 SEQUENCE of two
      # INTEGERs (r, s). Raw = 64 bytes; DER = ~70 (varies by leading-zero
      # suppression on r/s).
      expect(signature.bytesize).to be_between(64, 72)
    end

    it "produces a verifiable signature" do
      data = "another payload"
      signature = provider.sign(data)
      # ECDSA#verify on OpenSSL 3.x takes (data, signature)
      expect(ec_key.verify(OpenSSL::Digest::SHA256.new, signature, data)).to be_truthy
    end
  end

  describe "#public_key" do
    it "returns a public-only OpenSSL::PKey" do
      pub = provider.public_key
      expect(pub).to be_a(OpenSSL::PKey::EC)
      # Public keys can verify but not sign.
      data = "x"
      sig = provider.sign(data)
      expect(pub.verify(OpenSSL::Digest::SHA256.new, sig, data)).to be_truthy
    end
  end

  describe "#label" do
    it "includes the algorithm name" do
      expect(provider.label).to match(/software.*EC.*prime256v1/)
    end
  end

  describe "#extractable?" do
    it "is true (PEM is in the keystore)" do
      expect(provider.extractable?).to be(true)
    end
  end

  describe "#to_h" do
    it "returns a serializable hash with type=software" do
      expect(provider.to_h).to eq({ "type" => "software" })
    end
  end
end

RSpec.describe OimlPki::KeyProvider::Pkcs11 do
  describe "#initialize" do
    it "requires a module path" do
      expect { described_class.new({}) }.to raise_error(ArgumentError, /module/)
    end

    it "requires a cert_id" do
      expect {
        described_class.new("module" => "/dev/null")
      }.to raise_error(ArgumentError, /cert_id/)
    end
  end

  describe "#extractable?" do
    it "is false (key never leaves the device)" do
      provider = described_class.new(
        "module" => "/dev/null", "cert_id" => "01"
      )
      expect(provider.extractable?).to be(false)
    end
  end

  describe "#to_h" do
    it "captures all config fields" do
      provider = described_class.new(
        "module" => "/opt/pkcs11.so", "slot" => 1, "cert_id" => "02",
        "pin_env" => "MY_PIN"
      )
      expect(provider.to_h).to eq({
        "type"    => "pkcs11",
        "module"  => "/opt/pkcs11.so",
        "slot"    => 1,
        "cert_id" => "02",
        "pin_env" => "MY_PIN",
      })
    end
  end

  describe "#label" do
    it "includes module path and cert id" do
      provider = described_class.new(
        "module" => "/opt/pkcs11.so", "cert_id" => "99"
      )
      expect(provider.label).to eq("pkcs11 (pkcs11.so slot 0 id 99)")
    end
  end
end

RSpec.describe OimlPki::KeyProvider, ".for" do
  it "dispatches to Software when entry has privateKey" do
    entry = { "privateKey" => OpenSSL::PKey::EC.generate("prime256v1").to_pem }
    provider = described_class.for(entry)
    expect(provider).to be_a(OimlPki::KeyProvider::Software)
  end

  it "dispatches to Pkcs11 when entry has pkcs11 config" do
    entry = { "pkcs11" => { "module" => "/dev/null", "cert_id" => "01" } }
    provider = described_class.for(entry)
    expect(provider).to be_a(OimlPki::KeyProvider::Pkcs11)
  end

  it "raises ArgumentError when entry has neither" do
    expect { described_class.for({}) }.to raise_error(ArgumentError)
  end
end
