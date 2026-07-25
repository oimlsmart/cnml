# frozen_string_literal: true

require "spec_helper"

RSpec.describe OimlPki::SecretSharing do
  describe ".split / .combine round-trip" do
    it "reconstructs a 32-byte secret from k=2 of n=2 shares" do
      secret = OpenSSL::Random.random_bytes(32)
      shares = described_class.split(secret, n: 2, k: 2)
      expect(shares.length).to eq(2)
      recovered = described_class.combine(shares)
      expect(recovered).to eq(secret)
    end

    it "reconstructs from k=3 of n=5 shares (any subset of size k)" do
      secret = "OIML root CA key!!"  # 18 chars = 18 bytes ≤ 32
      shares = described_class.split(secret, n: 5, k: 3)
      # Any 3 of the 5 should reconstruct
      [shares[0..2], shares[0..1] + [shares[3]], shares[2..4], [shares[0], shares[2], shares[4]]].each do |subset|
        expect(described_class.combine(subset)).to eq(secret.b)
      end
    end

    it "handles empty secret" do
      secret = ""
      shares = described_class.split(secret, n: 2, k: 2)
      recovered = described_class.combine(shares)
      expect(recovered).to eq(secret.b)
    end

    it "handles short secret (1 byte)" do
      secret = "X"
      shares = described_class.split(secret, n: 2, k: 2)
      expect(described_class.combine(shares)).to eq(secret.b)
    end

    it "rejects secrets > 32 bytes (with informative error)" do
      secret = "x" * 33
      expect {
        described_class.split(secret, n: 2, k: 2)
      }.to raise_error(ArgumentError, /secret too large/)
    end
  end

  describe "share indistinguishability" do
    it "k-1 shares alone don't reconstruct the secret" do
      secret = "AAAA" * 8
      shares = described_class.split(secret, n: 3, k: 3)
      # Only 2 shares from a 3-of-3 split — combine should NOT give back secret
      partial = shares.take(2)
      result = described_class.combine(partial)
      expect(result).not_to eq(secret.b)
    end
  end

  describe "share transport" do
    it "Share#to_s / Share.from_s round-trip" do
      secret = "transport test"
      shares = described_class.split(secret, n: 2, k: 2)
      serialized = shares.map { |s| OimlPki::SecretSharing::Share.from_s(s.to_s) }
      expect(described_class.combine(serialized)).to eq(secret)
    end
  end

  describe "argument validation" do
    it "rejects k > n" do
      expect { described_class.split("x", n: 2, k: 3) }.to raise_error(ArgumentError, /k must be <= n/)
    end

    it "rejects k < 2" do
      expect { described_class.split("x", n: 3, k: 1) }.to raise_error(ArgumentError, /k must be >= 2/)
    end

    it "rejects combine with < 2 shares" do
      expect { described_class.combine([]) }.to raise_error(ArgumentError, /need at least 2 shares/)
    end
  end

  describe "tamper detection" do
    it "wrong share produces garbage (not the secret)" do
      secret_a = "a" * 32
      secret_b = "b" * 32
      shares_a = described_class.split(secret_a, n: 2, k: 2)
      shares_b = described_class.split(secret_b, n: 2, k: 2)
      # Mix shares from different splits — should NOT recover either secret
      mixed = [shares_a[0], shares_b[1]]
      result = described_class.combine(mixed)
      expect(result).not_to eq(secret_a.b)
      expect(result).not_to eq(secret_b.b)
    end
  end
end
