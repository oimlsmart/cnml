# frozen_string_literal: true

# The credential-exchange API (SIGNATIF delivery clause): the
# two-turn holder-initiated protocol over HTTP. Stage (coordinator),
# request + collect (holder), with the identifier-control challenge
# verified server-side.

require "spec_helper"
require "rack/test"
require "json"
require "base64"
require "openssl"
require_relative "../app"

RSpec.describe "the credential exchange API" do
  include Rack::Test::Methods

  def app = Sinatra::Application

  def holder_key
    OpenSSL::PKey::EC.generate("prime256v1")
  end

  def holder_certificate(cn, key)
    cert = OpenSSL::X509::Certificate.new
    cert.subject = OpenSSL::X509::Name.parse("/CN=#{cn}/O=Holder/C=CH")
    cert.issuer = cert.subject
    cert.public_key = key
    cert.not_before = Time.now - 60
    cert.not_after = Time.now + 3600
    cert.serial = OpenSSL::BN.rand(63)
    cert.version = 2
    cert.sign(key, OpenSSL::Digest::SHA256.new)
    cert
  end

  let(:identifier) { "Example Manufacturer #{SecureRandom.hex(4)}" }
  let(:credential) { { "certificate_pem" => "-----BEGIN CERTIFICATE-----" } }
  let(:key) { holder_key }
  let(:cert) { holder_certificate(identifier, key) }

  def post_json(path, body)
    # HTTP_HOST satisfies Sinatra 4's Rack::Protection origin check
    # for JSON posts (same as the enroll spec).
    post path, JSON.generate(body),
         "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost"
  end

  def request_exchange
    post_json("/api/exchange/request", { identifier: identifier })
    expect(last_response.status).to eq(200)
    JSON.parse(last_response.body)
  end

  it "runs the two-turn exchange end to end" do
    post_json("/api/exchange/stage", { identifier: identifier, credential: credential })
    expect(last_response.status).to eq(200)

    challenge = request_exchange
    nonce = Base64.strict_decode64(challenge["nonce"])
    signature = Base64.strict_encode64(key.sign("SHA256", nonce))

    post_json("/api/exchange/collect", {
      exchange_id: challenge["exchange_id"],
      certificate_pem: cert.to_pem,
      signature_b64: signature,
    })
    expect(last_response.status).to eq(200)
    expect(JSON.parse(last_response.body)["credential"]).to eq(credential)
  end

  it "answers 404 when nothing is staged for the identifier" do
    post_json("/api/exchange/request", { identifier: identifier })
    expect(last_response.status).to eq(404)
  end

  it "answers 400 when the signature does not prove control" do
    post_json("/api/exchange/stage", { identifier: identifier, credential: credential })
    challenge = request_exchange
    nonce = Base64.strict_decode64(challenge["nonce"])
    wrong_signature = Base64.strict_encode64(holder_key.sign("SHA256", nonce))

    post_json("/api/exchange/collect", {
      exchange_id: challenge["exchange_id"],
      certificate_pem: cert.to_pem,
      signature_b64: wrong_signature,
    })
    expect(last_response.status).to eq(400)
    expect(JSON.parse(last_response.body)["error"]).to match(/does not prove control/)
  end

  it "answers 400 on a replayed collect" do
    post_json("/api/exchange/stage", { identifier: identifier, credential: credential })
    challenge = request_exchange
    nonce = Base64.strict_decode64(challenge["nonce"])
    collect = {
      exchange_id: challenge["exchange_id"],
      certificate_pem: cert.to_pem,
      signature_b64: Base64.strict_encode64(key.sign("SHA256", nonce)),
    }
    post_json("/api/exchange/collect", collect)
    expect(last_response.status).to eq(200)
    post_json("/api/exchange/collect", collect)
    expect(last_response.status).to eq(400)
    expect(JSON.parse(last_response.body)["error"]).to match(/already completed/)
  end
end
