# frozen_string_literal: true

require "spec_helper"
require "tmpdir"

# Test MerkleTree + TransparencyPublisher. Real RFC 6962 math, real
# tempdir persistence, no doubles.
RSpec.describe OimlPki::MerkleTree do
  let(:sha256) { ->(data) { OpenSSL::Digest::SHA256.digest(data) } }

  def random_hash(seed = nil)
    seed ? sha256.call(seed.to_s) : SecureRandom.random_bytes(32)
  end

  describe "#append + #length" do
    it "appends leaves and tracks count" do
      t = described_class.new
      expect(t.length).to eq(0)
      expect(t).to be_empty

      seq = t.append(random_hash(1))
      expect(seq).to eq(0)
      expect(t.length).to eq(1)
      expect(t).not_to be_empty

      t.append(random_hash(2))
      t.append(random_hash(3))
      expect(t.length).to eq(3)
    end

    it "rejects leaves that aren't 32 bytes" do
      t = described_class.new
      expect { t.append("short") }.to raise_error(ArgumentError, /32 bytes/)
      expect { t.append("\x00" * 31) }.to raise_error(ArgumentError, /32 bytes/)
    end
  end

  describe "#root" do
    it "returns 32 zero bytes for an empty tree" do
      t = described_class.new
      expect(t.root).to eq("\x00" * 32)
    end

    it "matches a manually computed root for 4 leaves" do
      t = described_class.new
      leaves = (1..4).map { |i| random_hash(i) }
      leaves.each { |l| t.append(l) }

      # Manual: hash_leaf(l), then h(0,1), h(2,3), then h(h01, h23)
      manual_root = sha256.call("\x02" +
        sha256.call("\x02" +
          sha256.call("\x01" + leaves[0]) + sha256.call("\x01" + leaves[1])) +
        sha256.call("\x02" +
          sha256.call("\x01" + leaves[2]) + sha256.call("\x01" + leaves[3])))

      expect(t.root).to eq(manual_root)
    end
  end

  describe "#inclusion_proof + #verify_inclusion" do
    let(:tree) do
      t = described_class.new
      (1..4).each { |i| t.append(random_hash(i)) }
      t
    end

    it "produces a verifiable proof for each leaf" do
      (0..3).each do |seq|
        leaf = tree.entries[seq]
        proof = tree.inclusion_proof(seq)
        expect(tree.verify_inclusion(leaf, proof, tree.root)).to be(true)
      end
    end

    it "fails verification with a tampered leaf" do
      proof = tree.inclusion_proof(2)
      wrong_leaf = random_hash(999)
      expect(tree.verify_inclusion(wrong_leaf, proof, tree.root)).to be(false)
    end

    it "fails verification with a tampered sibling" do
      proof = tree.inclusion_proof(2)
      proof.first.sibling = random_hash(888)
      leaf = tree.entries[2]
      expect(tree.verify_inclusion(leaf, proof, tree.root)).to be(false)
    end

    it "rejects out-of-range sequence numbers" do
      expect { tree.inclusion_proof(-1) }.to raise_error(ArgumentError)
      expect { tree.inclusion_proof(99) }.to raise_error(ArgumentError)
    end
  end

  describe "ProofStep#to_h" do
    it "serializes to wire format (hex sibling + side)" do
      step = OimlPki::MerkleTree::ProofStep.new("\x00" * 32, :right)
      h = step.to_h
      expect(h["sibling"]).to match(/\A[0-9a-f]{64}\z/)
      expect(h["side"]).to eq(:right)
    end
  end
end

RSpec.describe OimlPki::TransparencyPublisher do
  after { described_class.log_file_override = nil }

  let(:cert_hash) { OpenSSL::Digest::SHA256.digest("fake-cert-1") }

  it "record assigns sequential numbers starting at 0" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      seq0 = described_class.record(OpenSSL::Digest::SHA256.digest("a"))
      seq1 = described_class.record(OpenSSL::Digest::SHA256.digest("b"))
      expect(seq0).to eq(0)
      expect(seq1).to eq(1)
    end
  end

  it "proof_for returns a TransparencyProof with verifiable inclusion" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      h1 = OpenSSL::Digest::SHA256.digest("a")
      h2 = OpenSSL::Digest::SHA256.digest("b")
      h3 = OpenSSL::Digest::SHA256.digest("c")

      described_class.record(h1)
      described_class.record(h2)
      described_class.record(h3)

      proof = described_class.proof_for(1)
      expect(proof).to be_a(OimlPki::TransparencyProof)
      expect(proof.sequence).to eq(1)
      expect(proof.leaf_hash).to eq(h2)
      expect(proof.tree_size).to eq(3)
      expect(proof.log_root.bytesize).to eq(32)

      # Verify the proof against the root
      steps = proof.inclusion_proof
      expect(steps.length).to be > 0

      # Manual verification using the same MerkleTree
      t = OimlPki::MerkleTree.new
      t.append(h1); t.append(h2); t.append(h3)
      expect(t.verify_inclusion(h2, steps, proof.log_root)).to be(true)
    end
  end

  it "persistence: log survives across calls" do
    Dir.mktmpdir do |dir|
      path = File.join(dir, "t.log")
      described_class.log_file_override = path

      described_class.record(OpenSSL::Digest::SHA256.digest("a"))
      described_class.record(OpenSSL::Digest::SHA256.digest("b"))

      # Re-open: should still see 2 entries
      proof = described_class.proof_for(1)
      expect(proof.tree_size).to eq(2)
      expect(File.exist?(path)).to be(true)
    end
  end

  it "rejects non-32-byte cert hashes" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      expect { described_class.record("too short") }.to raise_error(ArgumentError)
    end
  end

  describe ".embed_proof" do
    it "inserts <cnml:tlog_proof> before the closing cnml tag" do
      Dir.mktmpdir do |dir|
        described_class.log_file_override = File.join(dir, "t.log")
        described_class.record(OpenSSL::Digest::SHA256.digest("a"))

        cnml_xml = <<~XML
          <?xml version="1.0"?>
          <cnml:cnml xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0">
            <cnml:certificate>
              <cnml:id>test</cnml:id>
            </cnml:certificate>
          </cnml:cnml>
        XML

        proof = described_class.proof_for(0)
        embedded = described_class.embed_proof(cnml_xml, proof)
        expect(embedded).to include("<cnml:tlog_proof")
        expect(embedded).to include("</cnml:cnml>")
        # Proof should appear before closing tag
        expect(embedded.index("<cnml:tlog_proof")).to be < embedded.index("</cnml:cnml>")
      end
    end
  end
end

# RFC 6962 consistency proofs + signed tree heads (SIGNATIF Phase 3).
RSpec.describe OimlPki::MerkleTree, "consistency" do
  def tree_with(n)
    t = OimlPki::MerkleTree.new
    (1..n).each { |i| t.append(OpenSSL::Digest::SHA256.digest("leaf-#{i}")) }
    t
  end

  def roots_at(t, size)
    subset = OimlPki::MerkleTree.new
    t.entries[0, size].each { |h| subset.append(h) }
    subset.root
  end

  it "returns empty proofs for old_size 0 or equal sizes" do
    t = tree_with(5)
    expect(t.consistency_proof(0, 5)).to eq([])
    expect(t.consistency_proof(5, 5)).to eq([])
  end

  it "rejects out-of-range sizes" do
    t = tree_with(3)
    expect { t.consistency_proof(4, 3) }.to raise_error(ArgumentError)
    expect { t.consistency_proof(1, 9) }.to raise_error(ArgumentError)
  end

  it "verifies consistency for every size pair up to 17" do
    t = tree_with(17)
    (1..17).each do |old_size|
      (old_size..17).each do |new_size|
        proof = t.consistency_proof(old_size, new_size)
        ok = t.verify_consistency(
          old_size, new_size, proof, roots_at(t, old_size), roots_at(t, new_size)
        )
        expect(ok).to be(true), "old=#{old_size} new=#{new_size}"
      end
    end
  end

  it "rejects a doctored proof" do
    t = tree_with(9)
    proof = t.consistency_proof(4, 9)
    proof[0] = OpenSSL::Digest::SHA256.digest("forged")
    expect(t.verify_consistency(4, 9, proof, roots_at(t, 4), t.root)).to be(false)
  end

  it "verifies head-to-head (leafless) for every size pair up to 40" do
    t = tree_with(40)
    (1..40).each do |old_size|
      (old_size..40).each do |new_size|
        proof = t.consistency_proof(old_size, new_size)
        ok = t.verify_consistency_heads(
          old_size, roots_at(t, old_size), new_size, roots_at(t, new_size), proof
        )
        expect(ok).to be(true), "old=#{old_size} new=#{new_size}"
      end
    end
  end

  it "rejects a truncated proof head-to-head" do
    t = tree_with(9)
    proof = t.consistency_proof(3, 9)[0, 1]
    expect(t.verify_consistency_heads(3, roots_at(t, 3), 9, t.root, proof)).to be(false)
  end

  it "rejects a proof against the wrong old root" do
    t = tree_with(9)
    proof = t.consistency_proof(4, 9)
    wrong = OpenSSL::Digest::SHA256.digest("not-the-old-root")
    expect(t.verify_consistency(4, 9, proof, wrong, t.root)).to be(false)
  end
end

RSpec.describe OimlPki::TransparencyPublisher, "signed heads" do
  let(:ec_key) { OpenSSL::PKey::EC.generate("prime256v1") }

  after { described_class.log_file_override = nil }

  it "signs a tree head verifiable against the operator public key" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      described_class.record(OpenSSL::Digest::SHA256.digest("a"))
      described_class.record(OpenSSL::Digest::SHA256.digest("b"))

      tree = nil
      described_class.send(:with_persistent_log) { |t| tree = t }
      head = described_class.signed_head(tree, ec_key)
      expect(head[:signature]).to match(/\A[0-9a-f]{128}\z/)

      to_sign = described_class.head_string(head)
      raw = [head[:signature]].pack("H*")
      der = OimlPki::TransparencyPublisherHelpers.p1363_to_der(raw)
      expect(ec_key.verify(OpenSSL::Digest::SHA256.new, der, to_sign)).to be(true)
    end
  end

  it "publishes a signed head and consistency proofs" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      3.times { |i| described_class.record(OpenSSL::Digest::SHA256.digest("x#{i}")) }

      out = File.join(dir, "pub")
      head = described_class.publish_to_directory(out, operator_key: ec_key)
      expect(head).to include(:signature, :public_key)
      expect(File).to exist(File.join(out, "head.json"))
      expect(File).to exist(File.join(out, "consistency", "2.json"))
      expect(File).to exist(File.join(out, "proof", "0.json"))

      consistency = JSON.parse(File.read(File.join(out, "consistency", "2.json")))
      expect(consistency["new_size"]).to eq(3)
    end
  end

  it "leaves the head unsigned without an operator key (backward compatible)" do
    Dir.mktmpdir do |dir|
      described_class.log_file_override = File.join(dir, "t.log")
      described_class.record(OpenSSL::Digest::SHA256.digest("a"))
      head = described_class.publish_to_directory(File.join(dir, "pub"))
      expect(head).not_to include(:signature)
    end
  end
end

# DER conversion for verifying raw P-1363 signatures in specs.
module OimlPki
  module TransparencyPublisherHelpers
    module_function

    def p1363_to_der(raw)
      bytes = raw.bytesize / 2
      r = OpenSSL::ASN1::Integer.new(OpenSSL::BN.new(raw[0, bytes], 2))
      s = OpenSSL::ASN1::Integer.new(OpenSSL::BN.new(raw[bytes, bytes], 2))
      OpenSSL::ASN1::Sequence.new([r, s]).to_der
    end
  end
end

# State binding index + CRL anchoring (SIGNATIF gap H).
RSpec.describe OimlPki::TransparencyPublisher, "state index" do
  after do
    described_class.log_file_override = nil
    described_class.state_bindings_file_override = nil
  end

  def with_keystore(dir)
    described_class.log_file_override = File.join(dir, "t.log")
    described_class.state_bindings_file_override = File.join(dir, "state-bindings.json")
    yield
  end

  it "records bindings and builds the inverted index", :aggregate_failures do
    Dir.mktmpdir do |dir|
      with_keystore(dir) do
        3.times { |i| described_class.record(OpenSSL::Digest::SHA256.digest("s#{i}")) }
        described_class.record_state_bindings(0, ["sha256:AA"])
        described_class.record_state_bindings(1, ["sha256:BB", "AA"])
        described_class.record_state_bindings(2, ["sha256:AA"])

        index = described_class.state_index
        # Bare hex (no sha256: prefix) normalizes too.
        expect(index["aa"]).to eq([0, 1, 2])
        expect(index["bb"]).to eq([1])
      end
    end
  end

  it "publishes state-index.json alongside the proofs" do
    Dir.mktmpdir do |dir|
      with_keystore(dir) do
        described_class.record(OpenSSL::Digest::SHA256.digest("s0"))
        described_class.record_state_bindings(0, ["sha256:CC"])
        out = File.join(dir, "pub")
        described_class.publish_to_directory(out)
        published = JSON.parse(File.read(File.join(out, "state-index.json")))
        expect(published["cc"]).to eq([0])
      end
    end
  end
end
