# frozen_string_literal: true

require "spec_helper"
require "tmpdir"

# Test UpdateIntegrity without doubles — real files in tmpdir,
# real SHA-256 computation, real JSON parse.
RSpec.describe OimlPki::UpdateIntegrity do
  let(:artifact_bytes) { "fake gem content #{SecureRandom.hex(32)}" }
  let(:signature_bytes) { "x" * 64 }  # plausible signature (>=32 bytes, non-empty, != artifact)

  it "sha256_file returns a stable hex SHA-256" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "test.bin")
      File.write(path, "hello")
      h1 = described_class.sha256_file(path)
      h2 = described_class.sha256_file(path)
      expect(h1).to eq(h2)
      expect(h1).to match(/\A[0-9a-f]{64}\z/)
      # SHA-256 of "hello" is well-known
      expect(h1).to eq(OpenSSL::Digest::SHA256.hexdigest("hello"))
    end
  end

  it "parse_sbom returns true for a valid CycloneDX SBOM" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "sbom.json")
      File.write(path, JSON.generate({
        bomFormat: "CycloneDX",
        specVersion: "1.4",
        components: [],
      }))
      expect(described_class.parse_sbom(path)).to be(true)
    end
  end

  it "parse_sbom returns false for invalid JSON" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "sbom.json")
      File.write(path, "not json")
      expect(described_class.parse_sbom(path)).to be(false)
    end
  end

  it "parse_sbom returns false for missing components field" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "sbom.json")
      File.write(path, JSON.generate({ bomFormat: "CycloneDX" }))
      expect(described_class.parse_sbom(path)).to be(false)
    end
  end

  it "verify_signature_file accepts a plausible signature" do
    Dir.mktmpdir do |dir|
      artifact = File.join(dir, "a.gem")
      sig = File.join(dir, "a.sig")
      File.binwrite(artifact, artifact_bytes)
      File.binwrite(sig, signature_bytes)
      expect(described_class.verify_signature_file(artifact, sig)).to be(true)
    end
  end

  it "verify_signature_file rejects empty signature" do
    Dir.mktmpdir do |dir|
      artifact = File.join(dir, "a.gem")
      sig = File.join(dir, "a.sig")
      File.binwrite(artifact, artifact_bytes)
      File.binwrite(sig, "")
      expect(described_class.verify_signature_file(artifact, sig)).to be(false)
    end
  end

  it "verify_signature_file rejects signature identical to artifact" do
    Dir.mktmpdir do |dir|
      artifact = File.join(dir, "a.gem")
      sig = File.join(dir, "a.sig")
      File.binwrite(artifact, artifact_bytes)
      File.binwrite(sig, artifact_bytes)
      expect(described_class.verify_signature_file(artifact, sig)).to be(false)
    end
  end

  describe ".verify_release" do
    it "passes when artifact, signature, sbom all valid" do
      Dir.mktmpdir do |dir|
        artifact = File.join(dir, "pkg.gem")
        sig = File.join(dir, "pkg.sig")
        sbom = File.join(dir, "sbom.json")
        File.binwrite(artifact, artifact_bytes)
        File.binwrite(sig, signature_bytes)
        File.write(sbom, JSON.generate({ bomFormat: "CycloneDX", components: [] }))

        report = described_class.verify_release(
          artifact_path: artifact, signature_path: sig, sbom_path: sbom
        )
        expect(report[:valid]).to be(true)
        expect(report[:errors]).to eq([])
        expect(report[:artifact_sha256]).to match(/\A[0-9a-f]{64}\z/)
        expect(report[:signature_valid]).to be(true)
        expect(report[:sbom_parses]).to be(true)
      end
    end

    it "fails when artifact missing" do
      Dir.mktmpdir do |dir|
        report = described_class.verify_release(
          artifact_path: File.join(dir, "missing.gem"),
          signature_path: File.join(dir, "x"),
          sbom_path: File.join(dir, "x")
        )
        expect(report[:valid]).to be(false)
        expect(report[:errors]).to include(/artifact not found/)
      end
    end

    it "detects hash mismatch when expected_hash provided" do
      Dir.mktmpdir do |dir|
        artifact = File.join(dir, "pkg.gem")
        sig = File.join(dir, "pkg.sig")
        sbom = File.join(dir, "sbom.json")
        File.binwrite(artifact, artifact_bytes)
        File.binwrite(sig, signature_bytes)
        File.write(sbom, JSON.generate({ bomFormat: "CycloneDX", components: [] }))

        report = described_class.verify_release(
          artifact_path: artifact, signature_path: sig, sbom_path: sbom,
          expected_hash: "0" * 64  # wrong hash
        )
        expect(report[:hash_matches]).to be(false)
        expect(report[:errors]).to include(/SHA-256 mismatch/)
      end
    end

    it "passes when expected_hash matches" do
      Dir.mktmpdir do |dir|
        artifact = File.join(dir, "pkg.gem")
        sig = File.join(dir, "pkg.sig")
        sbom = File.join(dir, "sbom.json")
        File.binwrite(artifact, artifact_bytes)
        File.binwrite(sig, signature_bytes)
        File.write(sbom, JSON.generate({ bomFormat: "CycloneDX", components: [] }))

        expected = described_class.sha256_file(artifact)
        report = described_class.verify_release(
          artifact_path: artifact, signature_path: sig, sbom_path: sbom,
          expected_hash: expected
        )
        expect(report[:hash_matches]).to be(true)
        expect(report[:valid]).to be(true)
      end
    end

    it "fails when signature missing" do
      Dir.mktmpdir do |dir|
        artifact = File.join(dir, "pkg.gem")
        sbom = File.join(dir, "sbom.json")
        File.binwrite(artifact, artifact_bytes)
        File.write(sbom, JSON.generate({ bomFormat: "CycloneDX", components: [] }))

        report = described_class.verify_release(
          artifact_path: artifact,
          signature_path: File.join(dir, "missing.sig"),
          sbom_path: sbom
        )
        expect(report[:valid]).to be(false)
        expect(report[:errors]).to include(/signature not found/)
      end
    end
  end

  describe ".audit_dependencies" do
    it "parses a Gemfile.lock" do
      Dir.mktmpdir do |dir|
        path = File.join(dir, "Gemfile.lock")
        File.write(path, <<~LOCK)
          GEM
            remote: https://rubygems.org/
            specs:
              rspec (3.13.0)
              sinatra (4.0.0)

          PLATFORMS
            ruby

          DEPENDENCIES
            rspec (~> 3.13)
            sinatra (~> 4.0)

          BUNDLED WITH
            2.5.0
        LOCK
        report = described_class.audit_dependencies(path)
        expect(report[:dependency_count]).to be > 0
        names = report[:dependencies].map { |d| d[:name] }
        expect(names).to include("rspec", "sinatra")
      end
    end
  end
end
