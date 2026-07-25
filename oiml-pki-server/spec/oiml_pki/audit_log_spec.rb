# frozen_string_literal: true

require "spec_helper"

RSpec.describe OimlPki::AuditLog do
  describe ".append" do
    it "writes one JSON line per entry" do
      with_test_keystore do |dir|
        described_class.append("test.action", details: { foo: "bar" })
        described_class.append("test.action2", details: { baz: "qux" })
        lines = File.readlines(File.join(dir, "audit.log"))
        expect(lines.length).to eq(2)
        expect(JSON.parse(lines.first)["action"]).to eq("test.action")
      end
    end

    it "sets previous_hash on first entry to 'genesis'" do
      with_test_keystore do |dir|
        described_class.append("first", details: {})
        first = JSON.parse(File.readlines(File.join(dir, "audit.log")).first)
        expect(first["previous_hash"]).to eq("genesis")
      end
    end

    it "writes the SHA-256 of the previous entry to head" do
      with_test_keystore do
        described_class.append("a", details: { x: 1 })
        first = described_class.entries.first
        described_class.append("b", details: { y: 2 })
        second = described_class.entries.last
        # 2nd entry's previous_hash equals the SHA-256 of the 1st entry
        expected = "sha256:" + OpenSSL::Digest::SHA256.hexdigest(
          JSON.generate(first, sort: true)
        )
        expect(second["previous_hash"]).to eq(expected)
      end
    end
  end

  describe ".verify_chain" do
    it "returns valid: true on untampered log" do
      with_test_keystore do |dir|
        described_class.append("a", details: {})
        described_class.append("b", details: {})
        described_class.append("c", details: {})
        result = described_class.verify_chain
        expect(result[:valid]).to be(true)
        expect(result[:entries]).to eq(3)
      end
    end

    it "detects tampered lines" do
      with_test_keystore do |dir|
        described_class.append("a", details: { foo: "bar" })
        described_class.append("b", details: {})
        # Tamper: append a malformed line
        File.open(File.join(dir, "audit.log"), "a") { |f| f.puts "tampered-line" }
        result = described_class.verify_chain
        expect(result[:valid]).to be(false)
        expect(result[:broken_at]).to eq(3)
      end
    end

    it "returns valid:true when log doesn't exist yet" do
      with_test_keystore do
        result = described_class.verify_chain
        expect(result[:valid]).to be(true)
        expect(result[:entries]).to eq(0)
      end
    end
  end

  describe ".entries" do
    it "returns entries in insertion order" do
      with_test_keystore do
        described_class.append("first", details: {})
        described_class.append("second", details: {})
        entries = described_class.entries
        expect(entries.map { |e| e["action"] }).to eq(["first", "second"])
      end
    end

    it "returns empty array when log doesn't exist" do
      with_test_keystore do
        expect(described_class.entries).to eq([])
      end
    end
  end
end
