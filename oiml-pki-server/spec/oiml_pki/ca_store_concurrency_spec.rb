# frozen_string_literal: true

require "spec_helper"
require "thread"

RSpec.describe OimlPki::CaStore, "concurrency" do
  describe "with_lock" do
    it "serializes concurrent adds (no lost updates)" do
      with_test_keystore do |dir, pass|
        # Spawn 10 threads, each adds a unique entry concurrently
        threads = 10.times.map do |i|
          Thread.new do
            OimlPki::CaStore.add({ "id" => "entry-#{i}", "alias" => "Thread #{i}" }, pass)
          end
        end
        threads.each(&:join)

        loaded = OimlPki::CaStore.load(pass)
        expect(loaded.length).to eq(10)
        ids = loaded.map { |e| e["id"] }.sort
        expect(ids).to eq((0...10).map { |i| "entry-#{i}" }.sort)
      end
    end

    it "releases the lock on exception (no deadlock)" do
      with_test_keystore do |dir, pass|
        # First call: add a valid entry
        OimlPki::CaStore.add({ "id" => "ok", "alias" => "Good" }, pass)

        # Second call: deliberately cause an error inside the lock
        # by corrupting the passphrase mid-flow (simulate decryption failure)
        expect {
          OimlPki::CaStore.add({ "id" => "bad" }, "wrong-pass")
        }.to raise_error(OpenSSL::Cipher::CipherError)

        # Third call: should still succeed (lock was released)
        OimlPki::CaStore.add({ "id" => "after-error", "alias" => "Recovered" }, pass)
        loaded = OimlPki::CaStore.load(pass)
        expect(loaded.length).to eq(2)
        expect(loaded.map { |e| e["id"] }).to contain_exactly("ok", "after-error")
      end
    end
  end
end
