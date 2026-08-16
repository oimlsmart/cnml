# frozen_string_literal: true

require "json"
require "openssl"

module OimlPki
  # Algorithm registry signing ceremony (SIGNATIF §algorithm-agility).
  #
  # The registry is a signed, versioned document: the scheme operator
  # signs the canonical registry string, and verifiers check the
  # signature before trusting status decisions (deprecated downgrades,
  # retired hard-fails). The browser verifier's implementation is
  # packages/cnml-crypto/src/algorithms.ts — signatures produced here
  # verify there.
  module AlgorithmRegistry
    module_function

    # The canonical string covered by the registry signature.
    # @param algorithms [Array<Hash>] id/status entries in order
    # @return [String]
    def canonical_string(version, published, algorithms)
      algos = algorithms.map { |a| "#{a['id']}:#{a['status']}" }.join(";")
      "CNML-ALG-REGISTRY-v1|#{version}|#{published}|#{algos}"
    end

    # Sign a registry document with the scheme operator's key.
    #
    # @param registry [Hash] the parsed registry JSON
    # @param key [OpenSSL::PKey::EC] P-256 private key
    # @return [Hash] the registry with signature + public_key added
    def sign(registry, key)
      to_sign = canonical_string(registry["version"], registry["published"], registry["algorithms"])
      raw = TransparencyPublisher.der_to_p1363(key.sign(OpenSSL::Digest::SHA256.new, to_sign), 32)
      registry.merge("signature" => raw.unpack1("H*"), "public_key" => key.public_to_pem)
    end

    # Sign a registry file in place (ceremony entry point).
    def sign_file(path, key)
      signed = sign(JSON.parse(File.read(path)), key)
      File.write(path, JSON.pretty_generate(signed) + "\n")
      signed
    end

    # Verify a registry document's signature against its embedded key.
    # @return [Boolean]
    def verified?(registry)
      return false unless registry["signature"] && registry["public_key"]
      to_sign = canonical_string(registry["version"], registry["published"], registry["algorithms"])
      pub = OpenSSL::PKey::EC.new(registry["public_key"])
      der = TransparencyPublisherHelpers.p1363_to_der([registry["signature"]].pack("H*"))
      pub.verify(OpenSSL::Digest::SHA256.new, der, to_sign)
    rescue StandardError
      false
    end
  end
end
