# frozen_string_literal: true

require "spec_helper"

RSpec.describe OimlPki::CertFactory do
  describe ".generate_root_ca" do
    it "creates a self-signed CA cert with CA:TRUE basic constraint" do
      with_test_keystore do |dir, pass|
        cert = described_class.generate_root_ca("CN=Test Root", 5, pass)

        expect(cert).to be_a(OpenSSL::X509::Certificate)
        expect(cert.version).to eq(2)  # X.509 v3

        bc = cert.extensions.find { |e| e.oid == "basicConstraints" }
        expect(bc.value).to eq("CA:TRUE")
        expect(bc.critical?).to be(true)

        ku = cert.extensions.find { |e| e.oid == "keyUsage" }
        # OpenSSL humanizes usage names ("Certificate Sign, CRL Sign" on
        # newer builds, "keyCertSign, cRLSign" on older). Assert the
        # capabilities, not the exact string.
        expect(ku.value.downcase).to include("certificate sign")
        expect(ku.value.downcase).to include("crl sign")
      end
    end

    it "verifies against its own public key" do
      with_test_keystore do |dir, pass|
        cert = described_class.generate_root_ca("CN=Test Root", 5, pass)
        expect(cert.verify(cert.public_key)).to be_truthy
      end
    end

    it "persists the entry to the keystore" do
      with_test_keystore do |dir, pass|
        described_class.generate_root_ca("CN=Test Root", 5, pass)
        entries = OimlPki::CaStore.all(pass)
        expect(entries.length).to eq(1)
        expect(entries.first["role"]).to eq("root")
        expect(entries.first["certificate"]).to start_with("-----BEGIN CERTIFICATE-----")
      end
    end
  end

  describe ".sign_csr with scope" do
    it "embeds the oimlAuthorizedRecommendations extension" do
      with_test_keystore do |dir, pass|
        root_cert = described_class.generate_root_ca("CN=Root", 10, pass)
        root_entry = OimlPki::CaStore.all(pass).first

        # Generate a CSR to sign
        key = OpenSSL::PKey::EC.generate("prime256v1")
        csr = described_class.create_csr("CN=Intermediate", key)

        signed = described_class.sign_csr(
          csr.to_pem, root_entry["privateKey"], root_cert.to_pem,
          2, "intermediate", pass,
          scope: ["R60", "R76"],
        )

        ext = signed.extensions.find { |e| e.oid == OimlPki::OIML_SCOPE_OID }
        expect(ext).not_to be_nil
        scope = OimlPki::Publisher.read_scope_from_cert(signed)
        expect(scope).to contain_exactly("R60", "R76")
      end
    end

    it "works without a scope (legacy cert)" do
      with_test_keystore do |dir, pass|
        root_cert = described_class.generate_root_ca("CN=Root", 10, pass)
        root_entry = OimlPki::CaStore.all(pass).first

        key = OpenSSL::PKey::EC.generate("prime256v1")
        csr = described_class.create_csr("CN=Signer", key)

        signed = described_class.sign_csr(
          csr.to_pem, root_entry["privateKey"], root_cert.to_pem,
          2, "end-entity", pass,
        )

        ext = signed.extensions.find { |e| e.oid == OimlPki::OIML_SCOPE_OID }
        expect(ext).to be_nil
      end
    end

    it "accepts a KeyProvider::Base instance instead of PEM" do
      with_test_keystore do |dir, pass|
        root_cert = described_class.generate_root_ca("CN=Root", 10, pass)
        root_entry = OimlPki::CaStore.all(pass).first
        provider = OimlPki::KeyProvider::Software.new(root_entry)

        key = OpenSSL::PKey::EC.generate("prime256v1")
        csr = described_class.create_csr("CN=Signer", key)

        signed = described_class.sign_csr(
          csr.to_pem, provider, root_cert.to_pem,
          2, "end-entity", pass,
        )
        expect(signed.verify(root_cert.public_key)).to be_truthy
      end
    end
  end

  describe ".create_csr" do
    it "produces a self-verifiable CSR" do
      key = OpenSSL::PKey::EC.generate("prime256v1")
      csr = described_class.create_csr("CN=Test, O=OIML, C=NL", key)
      expect(csr).to be_a(OpenSSL::X509::Request)
      expect(csr.verify(csr.public_key)).to be(true)
      expect(csr.subject.to_s).to include("CN=Test")
    end
  end

  describe ".algorithm_for" do
    it "returns 'ECDSA <curve>' for an EC key" do
      key = OpenSSL::PKey::EC.generate("prime256v1")
      expect(described_class.algorithm_for(key)).to eq("ECDSA prime256v1")
    end

    it "reads the algorithm off a cert's public key" do
      with_test_keystore do |dir, pass|
        cert = described_class.generate_root_ca("CN=Test", 5, pass)
        algo = described_class.algorithm_for(cert)
        expect(algo).to start_with("ECDSA")
      end
    end
  end
end
