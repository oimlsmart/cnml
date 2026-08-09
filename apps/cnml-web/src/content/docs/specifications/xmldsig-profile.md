---
title: XMLDSig profile
coord: SPEC / 02
---

# CNML XMLDSig profile

This document specifies the XMLDSig algorithm suite used by CNML.

## Canonicalization

CNML uses Exclusive XML Canonicalization 1.0
(`http://www.w3.org/2001/10/xml-exc-c14n#`) for both the
CanonicalizationMethod and the Reference transform.

Exclusive C14N is chosen over Inclusive C14N because CNML documents
carry multiple namespaces (cnml, unitsml, ds). Exclusive C14N
canonicalizes only the namespaces that are visibly used, preventing
namespace injection attacks.

## Signature method

The default signature method is ECDSA-SHA256
(`http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256`).

For post-quantum readiness, CNML supports composite signatures
combining Ed25519 with ML-DSA-65 (NIST FIPS 204). A composite
signature requires both components to validate.

## Reference transform

The Reference uses two transforms:

1. Enveloped Signature transform
   (`http://www.w3.org/2000/09/xmldsig#enveloped-signature`):
   removes the Signature element before digesting the document.

2. Exclusive C14N transform: canonicalizes the remaining document
   for the digest.

The digest method is SHA-256
(`http://www.w3.org/2001/04/xmlenc#sha256`).

## KeyInfo

The KeyInfo element contains an X509Data with one or more
X509Certificate elements. The leaf certificate's public key must
match the signing key. The full chain (leaf, intermediate, root)
may be embedded for chain verification.

For threshold-signed certificates, the group certificate is embedded.
The verifier checks the signature against the group public key and
the chain against the trust anchor bundle.

## Timestamp

CNML signatures may carry an OpenTimestamps proof anchored to the
Bitcoin blockchain. The proof is embedded as an
`<cnml:tlog_proof>` element containing the base64-encoded .ots
binary.

The timestamp proves the signature existed at a specific point in
time. This is critical for legal metrology: an instrument's
type-approval date determines its regulatory status.

## References

- W3C XML Signature Syntax and Processing 1.1
- Exclusive XML Canonicalization 1.0 (RFC 8784)
- NIST FIPS 204 (ML-DSA)
- OpenTimestamps (https://opentimestamps.org/)
