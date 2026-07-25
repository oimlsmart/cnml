# frozen_string_literal: true

require "spec_helper"

RSpec.describe OimlPki::CaStore do
  describe ".save / .load round-trip" do
    it "encrypts and decrypts an entry" do
      with_test_keystore do |dir, pass|
        entries = [
          { "id" => "x", "alias" => "Test", "role" => "root" },
          { "id" => "y", "alias" => "Other", "role" => "intermediate" },
        ]
        described_class.save(entries, pass)
        loaded = described_class.load(pass)
        expect(loaded.length).to eq(2)
        expect(loaded.first["alias"]).to eq("Test")
      end
    end

    it "fails decryption with wrong passphrase" do
      with_test_keystore do |dir, pass|
        described_class.save([{ "id" => "x", "alias" => "Test" }], pass)
        expect { described_class.load("wrong-passphrase") }.to raise_error(OpenSSL::Cipher::CipherError)
      end
    end
  end

  describe ".add" do
    it "replaces an entry with the same id" do
      with_test_keystore do |dir, pass|
        described_class.add({ "id" => "x", "alias" => "v1" }, pass)
        described_class.add({ "id" => "x", "alias" => "v2" }, pass)
        loaded = described_class.load(pass)
        expect(loaded.length).to eq(1)
        expect(loaded.first["alias"]).to eq("v2")
      end
    end
  end

  describe ".find" do
    it "returns the entry with matching id" do
      with_test_keystore do |dir, pass|
        described_class.add({ "id" => "abc", "alias" => "Target" }, pass)
        described_class.add({ "id" => "def", "alias" => "Other" }, pass)
        expect(described_class.find("abc", pass)["alias"]).to eq("Target")
        expect(described_class.find("missing", pass)).to be_nil
      end
    end
  end

  describe "atomic write" do
    it "does not leave a stale .tmp file after save" do
      with_test_keystore do |dir, pass|
        described_class.save([{ "id" => "x" }], pass)
        expect(Dir.children(dir).select { |f| f.end_with?(".tmp") }).to be_empty
      end
    end
  end

  describe "salt reuse" do
    it "uses the same salt across multiple saves" do
      with_test_keystore do |dir, pass|
        described_class.save([{ "id" => "x" }], pass)
        salt1 = File.binread(File.join(dir, "salt.bin"))
        described_class.save([{ "id" => "y" }], pass)
        salt2 = File.binread(File.join(dir, "salt.bin"))
        expect(salt1).to eq(salt2)
      end
    end
  end
end
