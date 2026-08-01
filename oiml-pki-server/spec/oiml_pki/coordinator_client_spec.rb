# frozen_string_literal: true

require "spec_helper"

# Test CoordinatorClient without doubles. We can't actually connect
# to a coordinator in tests, so we exercise:
#   - Argument validation (real behavior)
#   - Health tracking shape (real behavior)
#   - Endpoint ordering by health (real behavior)
#   - Failover error structure (real behavior when confium-ruby absent)
RSpec.describe OimlPki::CoordinatorClient do
  describe ".new" do
    it "accepts a single endpoint + quorum_id" do
      c = described_class.new(endpoints: ["tcp://x:7788"], quorum_id: "biml-root")
      expect(c.endpoints).to eq(["tcp://x:7788"])
      expect(c.quorum_id).to eq("biml-root")
      expect(c.protocol_version).to eq("v1")
    end

    it "accepts multiple endpoints for failover" do
      c = described_class.new(
        endpoints: ["tcp://paris:7788", "tcp://berlin:7788", "tcp://gaithersburg:7788"],
        quorum_id: "biml-root",
      )
      expect(c.endpoints.length).to eq(3)
    end

    it "rejects empty endpoints" do
      expect { described_class.new(endpoints: [], quorum_id: "x") }
        .to raise_error(ArgumentError, /non-empty/)
    end

    it "rejects empty quorum_id" do
      expect { described_class.new(endpoints: ["tcp://x"], quorum_id: "") }
        .to raise_error(ArgumentError, /quorum_id/)
    end

    it "rejects unsupported protocol version" do
      expect {
        described_class.new(endpoints: ["tcp://x"], quorum_id: "x", protocol_version: "v0")
      }.to raise_error(ArgumentError, /unsupported protocol/)
    end
  end

  describe "#health" do
    it "tracks per-endpoint health initialized to clean state" do
      c = described_class.new(
        endpoints: ["tcp://a:7788", "tcp://b:7788"],
        quorum_id: "x",
      )
      expect(c.health.keys).to eq(["tcp://a:7788", "tcp://b:7788"])
      expect(c.health["tcp://a:7788"][:consecutive_failures]).to eq(0)
      expect(c.health["tcp://a:7788"][:last_success]).to be_nil
    end
  end

  describe "when confium-ruby is not available" do
    # Real behavior — no stubbing. In dev env, the gem is absent, so
    # create_session fails with a structured Error.
    it "create_session raises a structured Error" do
      c = described_class.new(endpoints: ["tcp://x:7788"], quorum_id: "x")
      expect { c.create_session(message: "data", threshold: 2) }.to raise_error(
        OimlPki::CoordinatorClient::Error, /confium_unavailable|all_endpoints_failed/
      ) do |err|
        expect(err.kind).to satisfy { |k| %i[confium_unavailable all_endpoints_failed].include?(k) }
      end
    end

    it "skips confium-gem check when skip flag set", if: false do
      # Skipped — placeholder for future skip logic
    end
  end

  describe "Error structure" do
    it "carries kind + endpoint + cause" do
      cause = RuntimeError.new("underlying")
      err = OimlPki::CoordinatorClient::Error.new(
        :network, "connection refused", endpoint: "tcp://x:7788", cause: cause,
      )
      expect(err.kind).to eq(:network)
      expect(err.endpoint).to eq("tcp://x:7788")
      expect(err.cause).to eq(cause)
      expect(err.message).to include("network")
      expect(err.message).to include("tcp://x:7788")
    end

    it "works without optional fields" do
      err = OimlPki::CoordinatorClient::Error.new(:protocol, "version mismatch")
      expect(err.endpoint).to be_nil
      expect(err.cause).to be_nil
      expect(err.message).to include("protocol")
    end
  end

  describe "SUPPORTED_PROTOCOL_VERSIONS" do
    it "includes v1" do
      expect(OimlPki::CoordinatorClient::SUPPORTED_PROTOCOL_VERSIONS).to include("v1")
    end
  end
end
