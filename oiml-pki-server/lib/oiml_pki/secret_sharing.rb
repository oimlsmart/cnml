# frozen_string_literal: true

# Shamir's Secret Sharing over GF(p) where p is a prime > 2^256.
#
# Splits a secret byte string into N shares, any K of which can
# reconstruct it. Fewer than K shares reveal zero information about
# the secret (information-theoretic security).
#
# Used by TODO 24 (dual-control CSR signing) to split the root CA
# private key across multiple operators. Neither operator alone can
# sign; both together can.
#
# Implementation notes:
#
#   - Operates in GF(p) where p = 2^256 + 297 (smallest prime > 2^256).
#     Since p > 2^256, any 256-bit secret fits as a field element.
#   - Uses Ruby's native Integer (Bignum) — no OpenSSL::BN gymnastics.
#     Ruby handles arbitrary-precision natively.
#   - Shares are encoded as "<index>:<hex>" strings for transport.
#   - Evaluation points x are 1, 2, 3, ..., n. All distinct, all < p,
#     so all (x_j - x_m) differences are invertible mod p.

module OimlPki
  module SecretSharing
    # Smallest prime > 2^256. Verified prime. All operations are mod this.
    MODULUS = (1 << 256) + 297

    Share = Struct.new(:index, :value, keyword_init: true) do
      def to_s
        "#{index}:#{value.to_s(16)}"
      end

      def self.from_s(str)
        idx, hex = str.split(":", 2)
        new(index: idx.to_i, value: hex.to_i(16))
      end
    end

    module_function

    # Split `secret_bytes` into `n` shares, any `k` of which reconstruct.
    #
    # @param secret_bytes [String] raw bytes (≤ 32 bytes — covers all
    #   CNML algorithm private keys: ECDSA P-256, Ed25519, ML-DSA-65 seed)
    # @param n [Integer] total shares to produce (>= 2)
    # @param k [Integer] threshold (2 <= k <= n)
    # @return [Array<Share>]
    def split(secret_bytes, n:, k:)
      raise ArgumentError, "k must be <= n" if k > n
      raise ArgumentError, "k must be >= 2" if k < 2
      raise ArgumentError, "secret too large (max 32 bytes, got #{secret_bytes.bytesize})" if secret_bytes.bytesize > 32

      # Empty secret → zero placeholder
      return Array.new(n) { |i| Share.new(index: i + 1, value: 0) } if secret_bytes.empty?

      secret = bytes_to_int(secret_bytes)
      coeffs = [secret] + (1...k).map { random_field_element }

      # Evaluate at x = 1, 2, 3, ..., n. All distinct, all non-zero.
      Array.new(n) do |i|
        x = i + 1
        Share.new(index: x, value: eval_poly(coeffs, x))
      end
    end

    # Combine K shares to reconstruct the secret via Lagrange interpolation at x=0.
    #
    # @param shares [Array<Share>] at least k shares from a split() call
    # @return [String] the original secret bytes
    def combine(shares)
      raise ArgumentError, "need at least 2 shares" if shares.length < 2
      # Empty-secret case: all-zero shares reconstruct as ""
      return "" if shares.all? { |s| s.value.zero? }

      secret_int = lagrange_interpolate(shares)
      int_to_bytes(secret_int)
    end

    # ─── Internal ─────────────────────────────────────────────────────────

    # Lagrange interpolation at x=0. Given k points (x_i, y_i),
    # returns the y-value at x=0, which is the polynomial's constant
    # term (= the secret).
    def lagrange_interpolate(shares)
      shares.reduce(0) do |acc, sj|
        numerator = 1
        denominator = 1
        shares.each do |sm|
          next if sm.index == sj.index
          # Lagrange basis at x=0: prod( (0 - x_m) / (x_j - x_m) ) for m != j
          numerator = (numerator * (-sm.index)) % MODULUS
          denominator = (denominator * (sj.index - sm.index)) % MODULUS
        end
        # Normalize to positive mod
        numerator = (numerator % MODULUS + MODULUS) % MODULUS
        denominator = (denominator % MODULUS + MODULUS) % MODULUS
        lagrange = (numerator * mod_inverse(denominator)) % MODULUS
        term = (sj.value * lagrange) % MODULUS
        (acc + term) % MODULUS
      end
    end

    def eval_poly(coeffs, x)
      # Horner's method
      result = 0
      coeffs.reverse_each do |c|
        result = ((result * x) + c) % MODULUS
      end
      result
    end

    def bytes_to_int(bytes)
      bytes.unpack1("H*").to_i(16)
    end

    def int_to_bytes(int)
      hex = int.to_s(16)
      hex = "0#{hex}" if hex.length.odd?
      [hex].pack("H*")
    end

    def random_field_element
      SecureRandom.random_number(MODULUS)
    end

    # Modular inverse via extended Euclidean. Always works for non-zero
    # inputs when the modulus is prime (our case).
    def mod_inverse(a)
      a = a % MODULUS
      raise ArgumentError, "no inverse for 0" if a.zero?
      # Fermat's little theorem: a^(p-2) ≡ a^-1 (mod p) for prime p
      a.pow(MODULUS - 2, MODULUS)
    end
  end
end
