# frozen_string_literal: true

require "nokogiri"
require "openssl"

module OimlPki
  # Canonical payload computation (XML-native, never string surgery).
  #
  # The canonical payload is the signed document minus every
  # signature-bearing element: ds:Signature, cnml:coSignature, and
  # cnml:tlog_proof wrappers. Canonicalized with Exclusive C14N, it is
  # the byte form every signature covers — and the form whose SHA-256
  # is the transparency log entry (the leaf).
  #
  # The browser verifier computes the identical form with the same
  # exclusive C14N (packages/cnml-crypto/src/xml/canonical-payload.ts);
  # cross-language agreement is pinned by the embedded-proof fixture.
  module CanonicalPayload
    DS_NS = "http://www.w3.org/2000/09/xmldsig#".freeze
    CNML_NS = "https://oimlsmart.org/schemas/cnml/1.0".freeze

    module_function

    # @param cnml_xml [String]
    # @return [String] the exclusive-C14N canonical payload bytes
    def canonical(cnml_xml)
      doc = Nokogiri::XML(cnml_xml) { |c| c.norecover.strict }
      raise ArgumentError, "not well-formed XML" unless doc.errors.empty? && doc.root

      doc.xpath("//ds:Signature", ds: DS_NS).each(&:remove)
      doc.xpath("//cnml:coSignature", cnml: CNML_NS).each(&:remove)
      doc.xpath("//cnml:tlog_proof", cnml: CNML_NS).each(&:remove)

      doc.canonicalize(Nokogiri::XML::XML_C14N_EXCLUSIVE_1_0)
    end

    # @return [String] 32-byte SHA-256 of the canonical payload
    def hash(cnml_xml)
      OpenSSL::Digest::SHA256.digest(canonical(cnml_xml))
    end
  end
end
