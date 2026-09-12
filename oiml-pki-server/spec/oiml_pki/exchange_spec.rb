# frozen_string_literal: true

# The credential-exchange coordinator (SIGNATIF delivery clause):
# stage -> request -> collect, with the identifier-control challenge
# (sign the fresh nonce with the key behind the identifier).

require "spec_helper"
require "base64"
require "openssl"

RSpec.describe OimlPki::Exchange::Coordinator do
  # A controllable clock for the freshness-window spec.
  class ExchangeClock
    attr_accessor :now

    def initialize(now)
      @now = now
    end
  end

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
  let(:coordinator) { described_class.new }

  def signed_nonce(session, signing_key = key)
    signing_key.sign("SHA256", session.nonce)
  end

  it "delivers the staged credential after the holder proves control" do
    coordinator.stage(identifier, credential)
    session = coordinator.request(identifier)
    expect(session).not_to be_nil
    expect(session.nonce.bytesize).to eq(32)
    expect(session.state).to eq(:challenge_issued)

    delivered = coordinator.collect(session.id, certificate_pem: cert.to_pem, signature: signed_nonce(session))
    expect(delivered).to eq(credential)
    expect(coordinator.instance_variable_get(:@sessions)[session.id].state).to eq(:collected)
  end

  it "mints distinct nonces per request" do
    coordinator.stage(identifier, credential)
    first = coordinator.request(identifier)
    second = coordinator.request(identifier)
    expect(first.nonce).not_to eq(second.nonce)
  end

  it "challenges nothing for an identifier with nothing staged" do
    expect(coordinator.request(identifier)).to be_nil
  end

  it "rejects a signature from a different key" do
    coordinator.stage(identifier, credential)
    session = coordinator.request(identifier)
    other_key = holder_key
    expect do
      coordinator.collect(session.id, certificate_pem: cert.to_pem, signature: signed_nonce(session, other_key))
    end.to raise_error(OimlPki::Exchange::Error, /does not prove control/)
  end

  it "rejects a certificate that names another holder" do
    coordinator.stage(identifier, credential)
    session = coordinator.request(identifier)
    other_cert = holder_certificate("Someone Else", holder_key)
    expect do
      coordinator.collect(session.id, certificate_pem: other_cert.to_pem, signature: signed_nonce(session, key))
    end.to raise_error(OimlPki::Exchange::Error, /does not name the holder/)
  end

  it "rejects a replayed collect (the challenge is single-use)" do
    coordinator.stage(identifier, credential)
    session = coordinator.request(identifier)
    coordinator.collect(session.id, certificate_pem: cert.to_pem, signature: signed_nonce(session))
    expect do
      coordinator.collect(session.id, certificate_pem: cert.to_pem, signature: signed_nonce(session))
    end.to raise_error(OimlPki::Exchange::Error, /already completed/)
  end

  it "rejects an unknown exchange id" do
    expect do
      coordinator.collect("deadbeef", certificate_pem: cert.to_pem, signature: "x")
    end.to raise_error(OimlPki::Exchange::Error, /unknown exchange/)
  end

  it "rejects a challenge answered after the freshness window" do
    clock = ExchangeClock.new(Time.now)
    slow_coordinator = described_class.new(clock: clock)
    slow_coordinator.stage(identifier, credential)
    session = slow_coordinator.request(identifier)
    clock.now += OimlPki::Exchange::FRESHNESS_WINDOW + 1
    expect do
      slow_coordinator.collect(session.id, certificate_pem: cert.to_pem, signature: signed_nonce(session))
    end.to raise_error(OimlPki::Exchange::Error, /expired/)
  end
end
