---
title: 'Technology'
lede: 'CNML builds on published international standards for certificates, signatures, threshold cryptography, and transparency. No component is proprietary.'
coord: 'ABOUT / 04'
---

CNML is built on recognized international standards. Every cryptographic and structural component traces to a published specification. The implementation extends these standards for legal metrology rather than replacing them, and the per-Recommendation schema model is the only part of the system that is OIML-specific.

## Certificate format

The certificate format is X.509 v3 as specified in RFC 5280. This is the same standard format used by web TLS, extended with an OIML-specific scope extension that uses the standard X.509 v3 extension mechanism. The scope extension carries the OIML Recommendation identifiers that the certificate is authorized to issue for. The extension is enforced at four layers: at signing time in the CA, at verification time in the pipeline, at the schema layer in the per-Recommendation JSON Schema, and at the transparency log layer in the inclusion proof.

## XML signatures

The XML signature is W3C XMLDSig 1.1 with Exclusive C14N canonicalization (RFC 3741). XMLDSig is an enveloped signature: the Signature element is carried inside the CNML XML document and references the document content. Exclusive C14N canonicalizes the XML so that the signature is stable across XML processors that may differ in whitespace handling, namespace prefix assignment, or attribute ordering. The signature is verifiable by any conformant XMLDSig implementation.

## Signing algorithms

CNML supports multiple signing algorithms, with multiple `ds:Signature` elements per document so that migration to a new algorithm preserves the original signature as historical evidence.

ECDSA P-256 (NIST FIPS 186) is the baseline algorithm for the current era. Ed25519 (RFC 8032) is supported for high-throughput signing operations. ML-DSA-65 (NIST FIPS 204) is the post-quantum algorithm. CNML uses composite signatures that combine a classical algorithm with ML-DSA-65 under AND semantics: both signatures must validate for the composite signature to be considered valid. This construction provides continuity through the post-quantum migration, because a verifier that trusts either algorithm era accepts the certificate while a verifier that demands both gets a stronger assurance.

The composite signature profile is documented in the CNML XMLDSig profile specification.

## Threshold cryptography

Threshold cryptography distributes signing authority across a quorum of independent participants. The FROST protocol and the CMP20 key generation protocol are the threshold schemes used at the BIML Root and IA tiers. BLS aggregate signatures are used where the participant count is large. The threshold schemes are surveyed in NIST IR 8214 and the subsequent NIST Multi-Party Threshold Schemes project. The implementation inherits cryptographic primitives reviewed in that body of research.

The threshold-cryptography substrate is provided by Confium, which ships FROST variants, BLS, CMP20, GG18, ML-KEM, and supporting transport and store crates. The Ruby CA server invokes Confium through a C ABI over `libconfium`. The browser verifier invokes Confium through WebAssembly. Cross-machine participants reach the coordinator through length-prefixed CBOR over TCP, WSS, or QUIC.

## Hardware tiers

CNML operates on any PKCS#11-compatible hardware. The choice of device at each tier is a deployment policy driven by capacity and certification requirements, not a constraint of the format.

The BIML Root operates on enterprise-grade HSM hardware held in an air-gapped facility. The IA tier operates on personal hardware tokens (YubiKey or equivalent) held by IA officers. The per-cert signer tier operates in browser IndexedDB, with the private key encrypted under AES-GCM with a PBKDF2-derived key. Any PKCS#11-compatible device can serve at any tier. Hardware is described by capability, certification level, and vendor name, not by price.

The full hardware model is described in the architecture documentation.

## Transparency and timestamping

The transparency log follows the RFC 6962 Certificate Transparency model. Every issued certificate is appended to a Merkle hash tree. Tree roots are anchored to Bitcoin through OpenTimestamps, which commits to the tree root in a Bitcoin transaction. The Bitcoin block height provides a timestamp that no party can backdate. Gossip protocols allow monitors to detect a log that presents different views to different verifiers.

OpenTimestamps is the standard that defines how a hash commitment is embedded in the Bitcoin blockchain. The proof that the commitment appeared in a given block is verifiable by any party that has access to the Bitcoin block headers.

## Further reading

- [Architecture choices](../docs/architecture/cnml-architecture-choices) describes CNML on its own terms.
- [Hardware key tiers](../docs/architecture/hardware-tiers) documents the PKCS#11 hardware model.
- [Threshold cryptography in CNML](../docs/concepts/threshold-cryptography) introduces the cryptographic substrate.
- [Confium integration](../docs/architecture/confium-integration) documents the binding paths.
