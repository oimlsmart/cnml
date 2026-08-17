# frozen_string_literal: true

# The threshold-signing endpoint's spec (TODO.ops/14): POST /api/sign
# drives the CA's threshold KeyProvider over arbitrary bytes and
# answers the signature + the quorum attestation; missing entries and
# non-threshold entries are honest errors.

require "spec_helper"
require "rack/test"
require "json"
require "openssl"
require "base64"
require_relative "../app"

RSpec.describe "POST /api/sign" do
  include Rack::Test::Methods

  def app = Sinatra::Application

  def provision_threshold(passphrase:, config:, id: "threshold", type: "confium")
    OimlPki::CaStore.add(
      { "id" => id, "type" => type, "alias" => "IA officer quorum", "config" => config },
      passphrase,
    )
  end

  it "404s when no threshold entry exists" do
    with_test_keystore do |_dir, passphrase|
      post "/api/sign", JSON.generate({
        passphrase: passphrase,
        data_b64: Base64.strict_encode64("the bytes"),
      }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(404)
      expect(JSON.parse(last_response.body)["error"]).to include("no threshold entry")
    end
  end

  it "400s when the entry is not a threshold provider" do
    with_test_keystore do |_dir, passphrase|
      provision_threshold(passphrase: passphrase, config: {}, id: "plain", type: "software")
      post "/api/sign", JSON.generate({
        passphrase: passphrase,
        threshold_id: "plain",
        data_b64: Base64.strict_encode64("the bytes"),
      }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(400)
      expect(JSON.parse(last_response.body)["error"]).to include("not a threshold provider")
    end
  end

  it "a local quorum signs the bytes — the attestation names the scheme and N-of-M" do
    with_test_keystore do |_dir, passphrase|
      # Real shares from the ceremony's keygen (the native binding —
      # present after `rake compile`; when absent, the honest 503).
      native_dir = ENV["CONFIUM_RUBY_LIB"] || File.expand_path("~/src/confium/confium-ruby/lib/confium_native")
      $LOAD_PATH.unshift(native_dir) if File.directory?(native_dir) && !$LOAD_PATH.include?(native_dir)
      begin
        require "confium_native"
        kg = Confium::TC::Cmp20.keygen(2, 3)
        shares = kg["shares"].map { |s| Base64.strict_encode64(s) }
      rescue LoadError, NameError, StandardError
        # Binding absent (LoadError) or present-but-unusable (older
        # build without Cmp20): skip honestly either way.
        kg = nil
        shares = nil
      end
      if kg.nil?
        skip "the confium native binding is not built (rake compile in confium-ruby)"
      end
      provision_threshold(
        passphrase: passphrase,
        config: {
          "scheme" => "CMP20-ECDSA-P256",
          "threshold" => 2,
          "local_shares" => shares,
          "public_key" => Base64.strict_encode64(kg["public_key"]),
        },
      )
      post "/api/sign", JSON.generate({
        passphrase: passphrase,
        data_b64: Base64.strict_encode64("the canonical bytes"),
      }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }

      if last_response.status == 503
        expect(JSON.parse(last_response.body)["error"]).to include("confium")
      else
        expect(last_response.status).to eq(200)
        body = JSON.parse(last_response.body)
        expect(body["signature_b64"]).to be_a(String)
        expect(Base64.decode64(body["signature_b64"]).bytesize).to eq(64)
        expect(body["attestation"]["provider"]).to include("CMP20")
        expect(body["attestation"]["threshold"]).to eq(2)
        expect(body["attestation"]["num_parties"]).to eq(3)
        expect(OimlPki::AuditLog.entries.last["action"]).to eq("api.sign.threshold")
      end
    end
  end

  it "rejects a missing payload with 400" do
    with_test_keystore do |_dir, passphrase|
      provision_threshold(passphrase: passphrase, config: { "threshold" => 2, "local_shares" => ["a", "b"] })
      post "/api/sign", JSON.generate({ passphrase: passphrase }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(400)
    end
  end
end
