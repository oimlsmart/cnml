# frozen_string_literal: true

require "spec_helper"

# Test ConfiumIntegration WITHOUT doubles. We use dependency injection
# via .injected_capability_report= (a real public attribute on the
# module) to exercise both the loaded and not-loaded branches without
# mocking the gem or prepending fake modules.
RSpec.describe OimlPki::ConfiumIntegration do
  after do
    described_class.skip_preflight_override = nil
    described_class.injected_capability_report = nil
  end

  def build_report(overrides = {})
    {
      gem_loaded:                   true,
      gem_version:                  "0.3.1",
      rust_core_version:            "0.4.0",
      available_schemes:            %w[FROST-P256 FROST-Ed25519],
      available_storage_backends:   %w[openpgp-card file],
      coordinator_protocol_version: "v1",
      missing:                      [],
    }.merge(overrides)
  end

  describe ".capability_report" do
    it "returns a Hash with the documented shape" do
      report = described_class.capability_report
      expect(report).to be_a(Hash)
      expect(report).to include(:gem_loaded, :available_schemes, :missing)
    end

    it "returns the injected report when set" do
      injected = build_report(gem_version: "9.9.9")
      described_class.injected_capability_report = injected
      expect(described_class.capability_report[:gem_version]).to eq("9.9.9")
    end

    it "returns the real probe when injected report is nil" do
      described_class.injected_capability_report = nil
      # Just verify it doesn't raise — exact shape depends on whether
      # confium-ruby is actually installed in the dev env.
      expect { described_class.capability_report }.not_to raise_error
    end
  end

  describe ".preflight!" do
    let(:minimal_manifest_hash) do
      {
        "deployment" => { "name" => "X", "operator" => "Y", "manifest_version" => 1 },
        "mode" => "certificate_pki",
        "tiers" => [{ "name" => "root", "role" => "root", "threshold" => { "t" => 1, "n" => 1 } }],
      }
    end

    it "returns nil when OIML_PKI_SKIP_PREFLIGHT=1 is set" do
      original = ENV["OIML_PKI_SKIP_PREFLIGHT"]
      ENV["OIML_PKI_SKIP_PREFLIGHT"] = "1"
      expect(described_class.preflight!(minimal_manifest_hash)).to be_nil
    ensure
      ENV["OIML_PKI_SKIP_PREFLOAD"] = original
      ENV["OIML_PKI_SKIP_PREFLIGHT"] = original
    end

    it "returns nil when skip_preflight_override is true" do
      described_class.skip_preflight_override = true
      expect(described_class.preflight!(minimal_manifest_hash)).to be_nil
    end

    context "when confium-ruby is not available (injected: gem_loaded=false)" do
      before do
        described_class.injected_capability_report = build_report(
          gem_loaded: false,
          gem_version: nil,
          available_schemes: [],
          available_storage_backends: [],
          coordinator_protocol_version: nil,
          missing: ["confium-ruby gem"],
        )
      end

      it "raises RequirementError with structured list" do
        expect { described_class.preflight!(minimal_manifest_hash) }.to raise_error(
          described_class::RequirementError, /not installed/
        ) do |err|
          expect(err.requirements).to be_an(Array)
          expect(err.requirements.length).to eq(1)
          first = err.requirements.first
          expect(first.kind).to eq(:capability)
          expect(first.name).to eq("confium-ruby")
        end
      end
    end

    context "when confium-ruby is available and meets requirements" do
      before do
        described_class.injected_capability_report = build_report
      end

      it "returns nil when manifest requirements are satisfied" do
        manifest = minimal_manifest_hash.dup
        manifest["tiers"] = [{ "name" => "root", "signing_algorithm" => "FROST-P256" }]
        manifest["quorums"] = [{ "name" => "q", "share_storage_backend" => "openpgp-card" }]
        expect(described_class.preflight!(manifest)).to be_nil
      end

      it "raises RequirementError when tier requires an unavailable scheme" do
        manifest = minimal_manifest_hash.dup
        manifest["tiers"] = [{ "name" => "root", "signing_algorithm" => "ML-DSA-87" }]
        expect { described_class.preflight!(manifest) }.to raise_error(
          described_class::RequirementError, /ML-DSA-87/
        )
      end

      it "raises RequirementError when quorum uses an unavailable backend" do
        manifest = minimal_manifest_hash.dup
        manifest["quorums"] = [{ "name" => "q", "share_storage_backend" => "tpm" }]
        expect { described_class.preflight!(manifest) }.to raise_error(
          described_class::RequirementError, /tpm storage/
        )
      end

      it "aggregates multiple failures into one error" do
        manifest = minimal_manifest_hash.dup
        manifest["tiers"] = [
          { "name" => "a", "signing_algorithm" => "ML-DSA-87" },
          { "name" => "b", "signing_algorithm" => "FROST-P256" },
        ]
        manifest["quorums"] = [{ "name" => "q", "share_storage_backend" => "tpm" }]
        expect { described_class.preflight!(manifest) }.to raise_error(
          described_class::RequirementError
        ) do |err|
          expect(err.requirements.length).to eq(2)
          messages = err.requirements.map(&:message)
          expect(messages.any? { |m| m.include?("ML-DSA-87") }).to be(true)
          expect(messages.any? { |m| m.include?("tpm") }).to be(true)
        end
      end
    end

    context "when manifest is a Manifest object (TODO 34)" do
      before do
        # Trigger autoload of DeploymentManifest so OimlPki::Manifest
        # is defined. Then build a real Manifest instance.
        OimlPki::DeploymentManifest
        described_class.injected_capability_report = build_report(
          available_schemes: ["FROST-P256"],
          available_storage_backends: ["openpgp-card"],
        )
      end

      it "accepts a Manifest instance via typed accessors" do
        manifest = OimlPki::Manifest.new(
          "deployment" => { "name" => "X", "operator" => "Y", "manifest_version" => 1 },
          "mode" => "certificate_pki",
          "tiers" => [{ "name" => "root", "signing_algorithm" => "FROST-P256" }],
          "quorums" => [{ "name" => "q", "share_storage_backend" => "openpgp-card" }],
        )
        expect(described_class.preflight!(manifest)).to be_nil
      end

      it "rejects a Manifest instance with an unavailable scheme" do
        manifest = OimlPki::Manifest.new(
          "deployment" => { "name" => "X", "operator" => "Y", "manifest_version" => 1 },
          "mode" => "certificate_pki",
          "tiers" => [{ "name" => "root", "signing_algorithm" => "ML-DSA-87" }],
        )
        expect { described_class.preflight!(manifest) }.to raise_error(
          described_class::RequirementError, /ML-DSA-87/
        )
      end
    end
  end

  describe "RequirementError" do
    it "aggregates multiple requirements into one error" do
      req1 = described_class::RequirementError::Requirement.new(
        :scheme, "ML-DSA-87", "available", "missing", "tier root requires ML-DSA-87"
      )
      req2 = described_class::RequirementError::Requirement.new(
        :storage, "tpm", "available", "missing", "quorum q uses tpm storage"
      )
      err = described_class::RequirementError.new([req1, req2])
      expect(err.requirements.length).to eq(2)
      expect(err.message).to include("ML-DSA-87")
      expect(err.message).to include("tpm")
    end
  end

  describe "MIN_GEM_VERSION" do
    it "is pinned to 0.3.0 (the first confium-ruby release with TC module)" do
      expect(described_class::MIN_GEM_VERSION.to_s).to eq("0.3.0")
    end
  end

  describe "KNOWN_SCHEMES" do
    it "includes FROST-P256, FROST-Ed25519, and ML-KEM-768" do
      expect(described_class::KNOWN_SCHEMES).to include("FROST-P256", "FROST-Ed25519", "ML-KEM-768")
    end
  end
end
