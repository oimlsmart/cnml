# frozen_string_literal: true

# The machine enrollment endpoint's spec (TODO.ops/12): POST
# /api/enroll signs a CSR with the CA and answers the certificate +
# chain as JSON — the app's CNML bridge's machine path (the ceremony
# UX stays the human one).

require "spec_helper"
require "rack/test"
require "json"
require "openssl"
require_relative "../app"

RSpec.describe "POST /api/enroll" do
  include Rack::Test::Methods

  def app = Sinatra::Application

  it "signs a CSR and answers the certificate + chain as JSON" do
    with_test_keystore do |_dir, passphrase|
      # A root CA in the test keystore (the factory stores it as
      # "root-ca").
      root_cert = OimlPki::CertFactory.generate_root_ca("CN=Test Root CA, O=OIML Test, C=CH", 10, passphrase)

      # The officer's CSR.
      officer_key = OpenSSL::PKey::EC.generate("prime256v1")
      csr = OpenSSL::X509::Request.new
      csr.version = 0
      csr.subject = OpenSSL::X509::Name.parse("/CN=IA Officer DE1/O=OIML IA DE1/C=DE")
      csr.public_key = officer_key
      csr.sign(officer_key, OpenSSL::Digest.new("SHA256"))

      post "/api/enroll", JSON.generate({
        passphrase: passphrase,
        ca_id: "root-ca",
        csr_pem: csr.to_pem,
        role: "end-entity",
        scope: ["R60"],
        validity_years: 1,
      }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }

      expect(last_response.status).to eq(200)
      body = JSON.parse(last_response.body)
      cert = OpenSSL::X509::Certificate.new(body["certificate_pem"])
      expect(cert.subject.to_s).to include("IA Officer DE1")
      expect(body["chain_pem"].first).to eq(root_cert.to_pem)
      # The chain verifies.
      store = OpenSSL::X509::Store.new
      store.add_cert(root_cert)
      expect(store.verify(cert, [cert])).to be(true)
      # The audit log records the enrollment.
      expect(OimlPki::AuditLog.entries.last["action"]).to eq("api.enroll")
    end
  end

  it "rejects a bad passphrase (401) and a missing CSR (400)" do
    with_test_keystore do |_dir, passphrase|
      OimlPki::CertFactory.generate_root_ca("CN=Test Root CA", 10, passphrase)

      post "/api/enroll", JSON.generate({ passphrase: "wrong", ca_id: "root-ca", csr_pem: "x" }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(401)

      post "/api/enroll", JSON.generate({ passphrase: passphrase, ca_id: "root-ca" }), { "CONTENT_TYPE" => "application/json", "HTTP_HOST" => "localhost" }
      expect(last_response.status).to eq(400)
    end
  end
end
