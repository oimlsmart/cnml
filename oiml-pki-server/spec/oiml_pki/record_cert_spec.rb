# frozen_string_literal: true

require "spec_helper"
require "tmpdir"
require "json"

# Certificate inclusion in the transparency log (SIGNATIF
# §mandatory-inclusion) and the by-hash index verifiers use to
# confirm chain inclusion (§path-transparency-inclusion).
RSpec.describe OimlPki::TransparencyPublisher, "cert inclusion" do
  after { described_class.log_file_override = nil }

  it "records an issued certificate by its DER hash and publishes the by-hash index" do
    with_test_keystore do |dir, pass|
      described_class.log_file_override = File.join(dir, "t.log")

      ca_cert = OimlPki::CertFactory.generate_root_ca("CN=Root", 5, pass)
      der_hash_hex = OpenSSL::Digest::SHA256.hexdigest(ca_cert.to_der)
      seq = described_class.record_cert(ca_cert.to_der)
      expect(seq).to eq(0)

      expect(described_class.cert_hash_index[der_hash_hex]).to eq(0)

      out = File.join(dir, "pub")
      described_class.publish_to_directory(out)
      lookup = JSON.parse(File.read(File.join(out, "by-hash", "#{der_hash_hex}.json")))
      expect(lookup["sequence"]).to eq(0)
    end
  end

  it "accepts a certificate object directly" do
    with_test_keystore do |dir, pass|
      described_class.log_file_override = File.join(dir, "t.log")
      ca_cert = OimlPki::CertFactory.generate_root_ca("CN=Root", 5, pass)
      expect { described_class.record_cert(ca_cert) }.not_to raise_error
    end
  end
end
