# frozen_string_literal: true

# The revocation endpoint's spec (TODO.ops/13): POST /api/crl/revoke
# adds the serial and re-issues the CRL (cumulative, persisted on the
# keystore entry); "reinstate" removes it; /crl.pem serves the current
# CRL publicly.

require "spec_helper"
require "rack/test"
require "json"
require "openssl"
require_relative "../app"

RSpec.describe "the revocation endpoints" do
  include Rack::Test::Methods

  def app = Sinatra::Application

  def post_revoke(passphrase:, serial:, action: nil)
    post "/api/crl/revoke", JSON.generate({
      passphrase: passphrase,
      ca_id: "root-ca",
      serial: serial,
      action: action,
    }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
  end

  it "revoke → the serial is on the issued CRL; reinstate removes it; /crl.pem serves publicly" do
    with_test_keystore do |_dir, passphrase|
      root_cert = OimlPki::CertFactory.generate_root_ca("CN=Test Root CA, O=OIML Test, C=CH", 10, passphrase)

      post_revoke(passphrase: passphrase, serial: "12345")
      expect(last_response.status).to eq(200)
      body = JSON.parse(last_response.body)
      expect(body["revoked"]).to eq([12345])
      expect(body["crl_url"]).to include("/crl.pem?ca=")

      # The CRL on the distribution point carries the serial.
      get "/crl.pem", { ca: "OIML Root CA" }, { "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(200)
      crl = OpenSSL::X509::CRL.new(last_response.body)
      expect(crl.revoked.map(&:serial)).to eq([12345])
      # …signed by the CA.
      expect(crl.verify(root_cert.public_key)).to be(true)

      # A second revocation is cumulative (the keystore entry persists).
      post_revoke(passphrase: passphrase, serial: "777")
      expect(JSON.parse(last_response.body)["revoked"]).to eq([12345, 777])

      # Reinstate removes the serial; the re-issued CRL no longer has it.
      post_revoke(passphrase: passphrase, serial: "12345", action: "reinstate")
      expect(JSON.parse(last_response.body)["revoked"]).to eq([777])
      get "/crl.pem", { ca: "OIML Root CA" }, { "HTTP_HOST" => "localhost" }
      crl = OpenSSL::X509::CRL.new(last_response.body)
      expect(crl.revoked.map(&:serial)).to eq([777])

      # The audit log records each transition.
      actions = OimlPki::AuditLog.entries.map { |e| e["action"] }
      expect(actions).to include("api.crl.revoke")
    end
  end

  it "a bad passphrase is a 401, never a 500" do
    with_test_keystore do |_dir, passphrase|
      OimlPki::CertFactory.generate_root_ca("CN=Test Root CA", 10, passphrase)
      post_revoke(passphrase: "wrong", serial: "1")
      expect(last_response.status).to eq(401)
    end
  end
end
