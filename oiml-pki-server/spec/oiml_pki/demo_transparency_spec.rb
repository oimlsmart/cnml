# frozen_string_literal: true

# The demo transparency deployment (two committed logs + the public
# mirror) verifies as committed, and the mirror rejects a tampered
# view. Pins the operated state on every suite run: an inconsistent
# rewrite of the committed artifacts fails here before it fails
# anywhere else.

require "spec_helper"
require "open3"
require "tmpdir"

RSpec.describe "the demo transparency deployment" do
  let(:script) { File.expand_path("../../bin/build-demo-transparency", __dir__) }
  let(:web_public) { File.expand_path("../../../apps/cnml-web/public/transparency", __dir__) }

  it "verifies as committed: heads, proofs, mirror, manifest" do
    out, status = Open3.capture2e({ "OIML_PKI_KEYSTORE_DIR" => Dir.mktmpdir }, "ruby", script, "--verify")
    aggregate_failures do
      expect(status.exitstatus).to eq(0), out
      expect(out).to include("log: 22 leaves")
      expect(out).to include("log-b: 22 leaves")
      expect(out).to include("mirror: observing size 22")
      expect(out).to include("OK")
    end
  end

  it "is idempotent: extending with no new vectors changes nothing" do
    out, status = Open3.capture2e({ "OIML_PKI_KEYSTORE_DIR" => Dir.mktmpdir }, "ruby", script)
    expect(status.exitstatus).to eq(0), out
    expect(out).to include("log: unchanged")
    expect(out).to include("log-b: unchanged")
  end

  it "the mirror refuses a tampered leaf view" do
    Dir.mktmpdir do |tmp|
      log = File.join(tmp, "log")
      mirror = File.join(tmp, "mirror")
      FileUtils.cp_r(File.join(web_public, "log"), log)
      FileUtils.cp_r(File.join(web_public, "mirror"), mirror)

      leaf = File.join(log, "leaf", "5")
      tampered = File.binread(leaf).dup
      tampered.setbyte(0, tampered.getbyte(0) ^ 0xFF)
      File.binwrite(leaf, tampered)

      expect do
        OimlPki::TransparencyMirror.sync(log, mirror, mirror_name: "spec-tamper")
      end.to raise_error(OimlPki::TransparencyMirror::MirrorRejected, /does not match the published leaves/)
    end
  end
end
