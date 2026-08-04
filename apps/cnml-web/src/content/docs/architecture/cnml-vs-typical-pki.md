---
title: CNML and typical PKI compared
description: A neutral technical comparison of the CNML public-key infrastructure with the web TLS public-key infrastructure, organized by certificate purpose, issuance tempo, key management, revocation, transparency, and scope governance.
---

# CNML and typical PKI compared

The CNML public-key infrastructure and the web Transport Layer Security public-key infrastructure both build on X.509 certificates, certificate revocation lists, and chain validation. The two systems address different problems. The web TLS infrastructure is optimized for high-volume automated issuance of channel-authentication certificates that authenticate a server for the duration of a connection. The CNML infrastructure is optimized for low-volume, high-assurance issuance of document-signing certificates in a regulated legal-metrology context, where the certificate is the artifact and must remain verifiable for decades. This document compares the two systems across six dimensions without framing either as defective. Each system is well matched to its own purpose.

![PKI comparison](/diagrams/pki-comparison.svg)

## Technical components at a glance

The table below lists every technical component used by each system. Components marked **Standard** are shared between the two systems and trace to the same international standard. Components marked **Modernized** are shared in foundation but extended by CNML with newer techniques. Components marked **CNML addition** have no equivalent in the traditional web PKI architecture and represent the architectural evolution described in the [Architectural evolution](#architectural-evolution) section below.

| Component | Web TLS PKI | CNML | Category |
|---|---|---|---|
| Certificate format | X.509 v3 (RFC 5280) | X.509 v3 (RFC 5280) | Standard |
| Canonicalization | TLS handshake framing | Exclusive C14N (W3C Rec) | Standard |
| XML signature | Not applicable | W3C XMLDSig 1.1 | CNML addition |
| Classical signing | RSA-2048 or ECDSA P-256 | ECDSA P-256 and Ed25519 (RFC 8032) | Modernized |
| Post-quantum signing | Not deployed | ML-DSA-65 (NIST FIPS 204) | CNML addition |
| Composite signatures | Not supported | Ed25519 with ML-DSA-65, both required | CNML addition |
| Signing authority | Single CA operator | Threshold quorum via FROST | Modernized |
| Key storage | Cloud HSM, single operator | Distributed threshold across PKCS#11 devices | Modernized |
| Hardware interface | PKCS#11 (vendor-specific) | PKCS#11 (vendor-neutral, any device) | Standard |
| Issuance | ACME (RFC 8555), automated | Human-reviewed, threshold ceremony | Different optimization |
| Certificate lifetime | 1 to 2 years | Approximately 10 years with archival renewal | Different optimization |
| Revocation checking | OCSP (RFC 6960) and CRL | CRL via static CDN, offline-capable | Modernized |
| Transparency | Certificate Transparency (RFC 6962) | Merkle log (RFC 6962 model) with Bitcoin anchor | Modernized |
| Timestamp evidence | Certificate validity period only | OpenTimestamps anchoring to Bitcoin | CNML addition |
| Scope governance | Policy-only (CA/B Forum) | X.509 v3 extension, cryptographically enforced | CNML addition |
| Verification mode | Online (requires OCSP and CT reachability) | Offline-capable from cached trust anchors | Different optimization |
| Long-term archival | Expired certificates become unverifiable | RFC 4998 Evidence Record Syntax, multi-era | CNML addition |
| Internationalization | Single language per certificate | `xml:lang` per element, multi-language | Modernized |
| Director rotation | Certificate re-issuance required | Threshold re-sharing preserves public key | CNML addition |

**Standard** components are the foundation both systems share. **Modernized** components are shared in foundation but extended by CNML. **CNML addition** components are architecturally new and have no counterpart in the 1990s web PKI design. The sections below develop each dimension in detail.

## Certificate purpose

A web TLS certificate authenticates a server identity and binds it to a public key for the purpose of establishing a secure channel. The certificate's job concludes when the TLS handshake completes and the channel is established. The signed payload is small, the verification context is a live connection, and the certificate is one input among several to the channel's security properties.

A CNML certificate authenticates a document. The signed payload is the complete certificate file, which is a multi-kilobyte XML document carrying the type-approval evaluation record. The certificate is the artifact. It is signed once, distributed independently of the signing party, and verified at unpredictable times that may be years or decades after signing. The signature must remain verifiable for the entire service lifetime of the instrument it covers, which in legal metrology is measured in decades.

## Issuance tempo

![Issuance flow comparison](/diagrams/issuance-flow-comparison.svg)

The web TLS infrastructure issues certificates at high volume through the Automated Certificate Management Environment (ACME) protocol. The issuance tempo supports large fleets of servers with short-lived certificates that are renewed automatically and frequently. The process is automated end to end, and the volume is in the range of millions of certificates per day across the ecosystem.

The CNML infrastructure issues certificates at low volume through a human-reviewed process. Each issuance involves a review of the underlying type-evaluation report, a scope check against the IA's authorized Recommendations, and a threshold signing ceremony among the IA's officers. The total corpus of OIML-CS certificates accumulated over the history of the system is in the low hundreds. The low volume reflects the nature of type approval, which is a per-model evaluation rather than a per-connection credential.

## Key management

The web TLS infrastructure stores CA keys in cloud-hosted hardware security modules operated by the CA. The signing keys for individual servers reside on the servers themselves or in cloud key-management services. Key rotation is frequent and automated, matching the short certificate lifetimes.

The CNML infrastructure stores CA keys in an air-gapped Ruby CA server with USB-only data transfer. The BIML Root signing key is held as a threshold secret shared among the OIML directors, requiring a quorum for every signature. Each IA operates its own threshold quorum for intermediate signatures, with a typical configuration of two-of-three officers. The per-cert signer keys reside in the signer's browser IndexedDB, encrypted at rest with a passphrase-derived AES-GCM key, or in a PKCS#11 hardware token. The threshold property at the upper tiers means that compromise of any single key holder cannot produce a CA-level signature. The full hardware model is described in [Hardware key tiers](/docs/architecture/hardware-tiers).

## Revocation

The web TLS infrastructure relies on the Online Certificate Status Protocol (OCSP) for freshness, with certificate revocation lists as a secondary mechanism. OCSP requires the verifier to reach the CA's responder at verification time, which is acceptable in the always-online context of web browsing.

The CNML infrastructure uses certificate revocation lists distributed through a static CDN. The choice reflects the requirement that a verifier at a remote inspection site may need to verify a CNML certificate with no internet connection. The verifier downloads the CRL once and uses it for an extended period. The same CDN that distributes the trust anchors distributes the CRLs, so the verification bundle is self-contained.

## Transparency

The web TLS infrastructure uses Certificate Transparency logs (RFC 6962) to record issued certificates in a publicly auditable Merkle tree. The logs are operated by multiple parties, and browsers enforce log inclusion as a condition of trust. The transparency property allows independent monitors to detect mis-issuance.

The CNML infrastructure uses a Merkle transparency log that records every issued certificate, every threshold decryption event, and every share re-sharing ceremony. The log tree roots are anchored to Bitcoin through OpenTimestamps, producing timestamp evidence that is independently verifiable without trusting the log operator. Gossip protocols ensure that a log operator cannot present different views to different verifiers. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. The full treatment is in [Transparency and audit](/docs/architecture/transparency).

## Scope governance

![Scope governance comparison](/diagrams/scope-governance-comparison.svg)

The web TLS infrastructure does not enforce per-CA domain restrictions at the browser level. A CA that is trusted by a browser root store can issue a certificate for any domain, subject to the CA's own validation practices and the baseline requirements of the root program. Scope is a policy matter for the CA, not a cryptographic property of the certificate.

The CNML infrastructure encodes scope as a first-class cryptographic property. BIML scopes each IA to a specific subset of OIML Recommendations through an X.509 v3 extension on the IA intermediate certificate. The extension carries an ASN.1 sequence of Recommendation identifiers. The verifier reads the scope from the extension (or from a JSON manifest that mirrors it) and rejects any CNML certificate whose Recommendation identifier is not covered. The same scope is enforced at multiple layers: at intermediate-cert signing time by the BIML operator, at end-entity-cert signing time by the IA's CA server, at CNML signing time by the signer's browser, and at verification time by the verifier. The cryptographic encoding makes the institutional contract verifiable without an out-of-band lookup.

## Architectural evolution

The web TLS public-key infrastructure was designed in the 1990s for a problem that was new at the time: enabling secure connections between web browsers and a rapidly growing population of web servers. The design choices of that era were well matched to the problem. Centralized certificate authorities, automated domain validation, short certificate lifetimes, and browser-enforced root stores produced a system that could scale to billions of connections while maintaining acceptable trust properties for commercial web browsing.

CNML was designed for a different problem that has existed far longer than the web. Legal metrology predates the internet by centuries. OIML was established in 1955. The OIML-CS certificate system has operated in paper form since the 1990s and in PDF form since the 2000s. The requirements of legal-metrology certification, which include multi-decade certificate validity, international institutional governance, regulatory verification at point of inspection, and cryptographic binding to type-evaluation evidence, are not well served by the 1990s web PKI architecture. CNML was designed to serve these requirements directly.

CNML is built entirely on recognized international standards rather than on proprietary technology. The certificate format is X.509 v3 (RFC 5280), the same standard format used by web TLS, extended with an OIML-specific scope extension that uses the standard X.509 v3 extension mechanism. The XML signature is W3C XMLDSig 1.1 with Exclusive C14N. The key algorithms include ECDSA P-256 (NIST FIPS 186), Ed25519 (RFC 8032), and ML-DSA-65 (NIST FIPS 204). The hardware interface is PKCS#11 (RSA Laboratories). The transparency log follows the RFC 6962 Certificate Transparency model. The timestamp anchoring uses OpenTimestamps. Every cryptographic and structural component of CNML traces to a published international standard.

The distributed architecture is the principal difference. The web TLS infrastructure centralizes signing authority in a single certificate authority operator per certificate. That centralization is efficient at high volume but concentrates risk: the compromise of a single CA key compromises every certificate issued by that CA. CNML distributes signing authority across a threshold quorum of independent directors and officers using threshold cryptography, a class of techniques that was researched in the 1990s but matured into deployable form only in the 2020s through protocols such as FROST (Flexible Round-Optimized Schnorr Threshold signatures) and through the standardization work surveyed in NIST IR 8214. The threshold property means that compromise of any single key holder cannot produce a valid signature, and the aggregate public key is preserved across institutional change through re-sharing, so previously issued certificates remain valid without re-issuance.

The distributed architecture also reduces the operational infrastructure burden. A traditional web PKI deployment requires a high-availability OCSP responder, a Certificate Transparency log participant account, a WebTrust-audited CA facility, an HSM cluster under a compliance regime, and a per-certificate pricing or licensing model. CNML replaces this with a lightweight coordinator service, a static CDN for trust-anchor distribution, a public Merkle log anchored to Bitcoin, standard PKCS#11 hardware available from multiple vendors, and open-source software with no per-certificate cost. The reduction is a natural consequence of matching the architecture to the problem: legal-metrology certification operates at low volume with long-lived certificates, so the high-throughput infrastructure of web PKI is unnecessary, and the distributed threshold model eliminates the single-CA-operator risk that the infrastructure was built to mitigate.

## Summary

The comparison is one of optimization targets, not of correctness. The web TLS infrastructure is well suited to its problem, which is high-volume automated issuance for channel authentication in an online context. The CNML infrastructure is well suited to its problem, which is low-volume human-reviewed issuance for document signing in a regulated context with offline verification and multi-decade archival horizons. The two systems share X.509 certificate format, CRL format, chain-validation logic, standard key encodings, XMLDSig, and Exclusive C14N. The differences are architectural, reflecting the different requirements the two systems serve.

## See also

- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) describes CNML on its own terms without comparative framing.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous threshold-signing flow at the CA tiers.
- [Transparency and audit](/docs/architecture/transparency) develops the Merkle transparency log and the OpenTimestamps anchoring.
