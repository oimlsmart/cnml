---
title: CNML architecture choices
description: CNML described on its own terms, covering the air-gapped CA, scope governance, threshold signing, the transparency log, hardware key tiers, post-quantum readiness, and algorithm-eras archival renewal.
---

# CNML architecture choices

CNML is described here on its own terms. The architecture is presented as a set of properties that the system provides, with the mechanism behind each property. This document does not frame CNML relative to other systems. Each architectural choice is stated as a design decision that serves a requirement of the legal-metrology context.

![Security architecture](/diagrams/security-architecture.svg)

## Air-gapped CA

The BIML Root CA runs on an air-gapped machine. Certificate signing requests arrive via physical media and signed certificates leave via physical media. There is no network path from the CA machine to the internet. The air gap removes network exfiltration as an attack vector against the root signing key.

The air-gapped CA is a Ruby Sinatra application. The keystore is an AES-256-GCM-encrypted JSON file on the local disk. The CA operator is a human, not an automated process. The low issuance tempo of OIML-CS certificates means that the operational friction of physical media transfer is acceptable. The trust anchors (root certificate, intermediate certificates, CRLs) are published to a static site served by a CDN, so verifiers fetch them without any server-side logic or API surface.

## Scope governance

BIML scopes each Issuing Authority to a specific subset of OIML Recommendations through the OIML-CS Declaration of Mutual Confidence framework. The scope is encoded cryptographically as an X.509 v3 extension on each IA intermediate certificate. The extension carries the OID `oimlAuthorizedRecommendations` and a value that is an ASN.1 sequence of Recommendation identifiers (R60, R76, R117, and so on).

The scope is enforced at four layers. At intermediate-cert signing time, the BIML operator specifies the scope based on the DoMC recognition for that IA. At end-entity-cert signing time, the IA's CA server refuses to issue an end-entity certificate that would extend beyond the IA's own scope. At CNML signing time, the signer's browser reads the scope from its own certificate chain and refuses to sign a CNML whose Recommendation identifier is out of scope. At verification time, the verifier reads the scope from the intermediate certificate or from the trust-anchors manifest and rejects any CNML whose Recommendation is not covered. The four layers provide defense in depth. The outer two layers (BIML at signing time, verifier at verification time) are mandatory and suffice for correctness. The inner two layers catch mistakes early.

## Threshold signing

Every CA-level signature in CNML requires a threshold of independent parties. No single individual can produce a root-tier or IA-tier signature. The threshold property defends against single-party compromise and removes single-key loss as a system-wide risk.

The BIML Root tier uses a FROST-style threshold signature scheme over the Ed25519 curve, with a typical configuration of five-of-seven directors. The IA Intermediate tier uses FROST over the NIST P-256 curve, with a typical configuration of two-of-three officers per IA. The choice of P-256 at the IA tier reflects interoperability with existing PKCS#11 hardware. The lower tiers (Test Lab, Manufacturer Model, Manufacturer Instance) use single-party ECDSA P-256 signatures, because the volume of instance-level signing would make threshold coordination impractical.

The directors and officers are distributed across time zones and cannot coordinate synchronously. CNML uses a coordinator service that buffers protocol messages, allowing each participant to contribute when convenient. The coordinator is honest-but-curious: it can observe encrypted protocol messages but cannot reconstruct the signing key. The operational flow is described in [Distributed management](/docs/architecture/distributed-management). The threshold techniques are surveyed in [NIST IR 8214](https://doi.org/10.6028/NIST.IR.8214), and CNML's alignment with that body of research is developed in [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment).

## Transparency log

Every issued CNML certificate is appended to a public Merkle transparency log. The log records certificate issuance, revocation, threshold decryption events, and share re-sharing ceremonies. Tree roots are anchored to Bitcoin through OpenTimestamps, producing timestamp evidence that is verifiable without trusting the log operator. Gossip protocols ensure that the log operator cannot present different views to different verifiers.

The transparency property complements the threshold property. The threshold property defends against single-party compromise of a signing key. The transparency property defends against covert issuance: a certificate that did not appear in the log is rejected by any verifier that demands an inclusion proof. The combination means that neither a single compromised signer nor a covertly operating committee can produce a certificate that a compliant verifier will accept. The full treatment is in [Transparency and audit](/docs/architecture/transparency).

## Hardware key tiers

CNML uses three hardware tiers matched to the sensitivity of the key at each level.

The enterprise HSM tier covers the BIML Root. Devices such as the Thales Luna and the Utimaco SecurityServer provide FIPS 140-2 Level 3 or Level 4 certification and hold the root signing key in hardware that prevents extraction. The CA host sends signing requests via PKCS#11 and the device returns only the signature bytes.

The personal hardware token tier covers the IA intermediate. Devices such as the YubiKey 5 series and the Nitrokey provide FIPS 140-2 Level 3 certification in a personal form factor and hold the IA officer signing key in hardware. The same PKCS#11 interface is used.

The browser software tier covers the per-cert signer. The signer generates an ECDSA P-256 keypair in the browser, and the private key is encrypted with a passphrase-derived AES-GCM key and stored in IndexedDB. The key never leaves the browser. The full treatment is in [Hardware key tiers](/docs/architecture/hardware-tiers).

## Post-quantum readiness

CNML's algorithm policy is ECDSA from day one, with no legacy RSA. The signing algorithm is ECDSA-SHA256 over the NIST P-256 curve. The canonicalization is Exclusive C14N. The digest is SHA-256. The signature format is enveloped XMLDSig.

The post-quantum roadmap carries hybrid composite signatures combining Ed25519 with ML-DSA-65. ML-DSA is the module-lattice digital signature algorithm standardized in [FIPS 204](https://csrc.nist.gov/pubs/fips/204/final). The hybrid approach preserves the classical security of Ed25519 while adding a post-quantum component, so that a verifier that understands either algorithm can validate the signature. The threshold variant of ML-DSA is an active area of research that CNML tracks through the [NIST Multi-Party Threshold Schemes project](https://csrc.nist.gov/projects/threshold-cryptography). The related key-encapsulation standard [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) (ML-KEM) underpins the threshold encryption used to protect manufacturer intellectual property in test reports submitted to IA quorums.

## Algorithm-eras archival renewal

Legal-metrology instruments have service lifetimes measured in decades. A CNML certificate issued today may need to remain verifiable in 2050 or later. Cryptographic algorithms weaken over such horizons. CNML supports multiple `ds:Signature` elements per document, one per algorithm era, so that migration to a new signing algorithm is a re-signing operation that preserves the original signature as historical evidence.

The archival renewal follows the model of Long-Term Archive Service (LTANS) and Evidence Record Syntax (ERS). When an algorithm era ends, the certificates from that era are re-signed using the new era's algorithm, and both signatures are retained. A verifier validates the signature that was valid at the time of original signing, using the algorithm and the trust anchors that were current at that time, and then validates the re-signature that bridges to the current era. The result is that a certificate remains continuously verifiable across algorithm migrations without any break in the chain of evidence.

## Open and auditable

The implementation source code is published under an open-source license. The per-Recommendation schemas are published as YAML, and the generated TypeScript types are reproducible by any contributor. The transparency log is publicly readable, the OpenTimestamps proofs are independently verifiable, and the trust anchors are public. Any party can audit the system, and any party can verify any certificate without contacting the issuer, registering for a service, or holding an account. The system is designed so that no aspect of certificate issuance, distribution, or verification depends on trust in a single party. The OIML SMART programme is the framework within which CNML evolves, and this documentation is a proposal to OIML, not an adopted specification.

## See also

- [System architecture](/docs/architecture/system) is the canonical architectural reference.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous threshold-signing flow.
- [Redundancy and continuity](/docs/architecture/redundancy) describes the system's behavior under loss of directors, officers, hardware, or facilities.
- [Transparency and audit](/docs/architecture/transparency) develops the Merkle transparency log and the OpenTimestamps anchoring.
- [Hardware key tiers](/docs/architecture/hardware-tiers) describes the PKCS#11 hardware model.
- [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment) develops the adoption of techniques surveyed by NIST IR 8214.
