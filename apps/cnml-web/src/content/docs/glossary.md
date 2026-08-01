---
title: Glossary
description: Terminology for non-experts — what the words used in CNML documentation actually mean.
---

# Glossary

A non-technical reference for terminology used across CNML
documentation. Cross-references the more detailed pages.

## A — Authority

**ACM** — Automated Certificate Management Environment. Protocol
for automated TLS certificate issuance (e.g., Let's Encrypt). CNML
deliberately does NOT use ACME — human review is required.

**Algorithmic agility** — The ability to migrate from one cryptographic
algorithm to another without reissuing every certificate. CNML uses
composite signatures (TODO 08) so a hash algorithm can weaken without
breaking historical verification.

**Asymmetric cryptography** — Public-key cryptography. Each party has a
public key (anyone can use) and a private key (only the owner uses).

**Attestation** — Cryptographic proof that a device has a specific
configuration. A YubiKey's attestation certificate proves the device
is genuine, not a counterfeit.

## B — BIML

**BIML** — Bureau International de Métrologie Légale. The
international body that coordinates legal metrology, headquartered
in Paris, France. Operates the CNML root tier.

**Bridge CA** — A certificate authority that cross-signs the roots of
two different PKIs, so verifiers of one PKI can validate certificates
from the other. (TODO 50)

## C — Confium / Certificate

**CA** — Certificate Authority. The entity that issues certificates.
In CNML: BIML Root, IA, Test Lab.

**Cert (certificate)** — The signed XML document that proves an
instrument is type-approved. (TODO 14)

**CMS** — Cryptographic Message Syntax (RFC 5652). A standard
envelope for signed data. Adobe, OpenSSL, Thunderbird understand
CMS. (TODO 37)

**Composite signature** — Two signatures over the same content using
two different algorithms (e.g., ECDSA + ML-DSA-65). Verifiers can
validate either. (TODO 08)

**Confium** — Open-source threshold cryptography framework written
in Rust (43 crates, 725+ tests). CNML is built on Confium.

**CRL** — Certificate Revocation List. A signed list of certificates
that have been revoked before their natural expiration. Verifiers
check the CRL before trusting a certificate. (TODO 05)

**CT log** — Certificate Transparency log (RFC 6962). A public,
append-only Merkle tree of all certificates. Verifiers check that
every certificate is in the CT log. (TODO 35)

## D — Decryption / DoMC

**Decryption ceremony** — A 2-of-3 threshold event where IA officers
jointly decrypt data encrypted to the IA quorum's public key. Every
decryption is logged. (TODO 36)

**Delegation (scoped)** — A pattern where a parent cert delegates
bounded authority to a child cert. The child can only act within the
delegated scope. (TODO 32)

**Director** — A BIML-appointed custodian of a quorum share. In CNML,
7 directors form the root quorum; 3 form each IA quorum.

**DoMC** — Declaration of Mutual Confidence. The OIML framework for
IAs to mutually recognize each other's type approvals. CNML's
cryptographic scope enforcement supports DoMC.

**D-CoC** — Digital Certificate of Conformity. The FAIR-aligned
RDF/XML + JSON-LD representation of a CNML certificate. (TODO 25)

## E — Encapsulation / EP

**Encrypted report** — A test report whose confidential section is
encrypted to the IA quorum's threshold public key. (TODO 36)

**Encapsulation** — In threshold encryption, the "key wrapping" step:
encrypt a fresh symmetric key to the threshold public key, then
encrypt the data with the symmetric key.

**eIDAS** — EU regulation on electronic identification, authentication,
and trust services. eIDAS 2.0 (2024) provides the legal framework
that CNML's qualified seals satisfy. (TODO 50)

**End-entity cert** — The final cert in a chain — issued to an
instrument, manufacturer, or person. Not used to sign other certs.

**ERS** — Evidence Record Syntax (RFC 4998). Long-term archival
format that allows hash algorithm renewal without breaking the
archival chain. (TODO 37)

## F — FROST / Forge

**Forge (verb)** — To create a fake certificate that passes verification.
Typical PKI: forgeable by one compromised key. CNML: requires
threshold cooperation.

**FROST** — Flexible Round-Optimized Schnorr Threshold signatures.
A protocol for producing a single signature from multiple parties'
shares. Used by CNML for all threshold signing. (TODO 30)

## G — GIF / Gas / Governance

**Governance** — The rules and processes by which a PKI is operated.
In CNML: BIML governs the 5-tier hierarchy; IAs govern their own
scope; transparency logs publish every action.

**Gossip protocol** — A replication protocol where each log mirror
exchanges updates with peers. Detects divergent log views.

## H — Hash / HSM

**Hash** — A fixed-length value that uniquely represents a much larger
input. CNML uses SHA-256 throughout.

**HSM** — Hardware Security Module. A physical device that stores
keys and performs crypto operations, designed to prevent extraction.
YubiKey is a small HSM; Thales Luna / Utimaco are enterprise HSMs.

## I — IA / Identity

**IAL** — Identity Assurance Level (NIST SP 800-63). CNML ceremonies
meet IAL2 (in-person supervised identity proofing).

**IA** — Issuing Authority. A national body (NMi for Netherlands,
PTB for Germany, NIST for USA) that issues CNML certificates for
specific OIML Recommendations.

**Identity key** — The cryptographic key a director uses to
authenticate themselves (separate from threshold shares). Ed25519.

## K — Key / KEM

**KEM** — Key Encapsulation Mechanism. A public-key encryption scheme
where the public key is used to encrypt a fresh symmetric key.
CNML uses ML-KEM-768 (FIPS 203) for threshold encryption.

**Key escrow** — Storing a key in a form that requires cooperation
of multiple parties to recover. (TODO 38)

## L — Log / LTS

**Long-term archival** — Maintaining a certificate's verifiability
for 25+ years, across hash algorithm migrations. (TODO 20, 37)

**LTS** — Long-Term Support. A software release cadence that
maintains security fixes for years.

## M — ML / Manifest

**Manifest** — The TOML file describing a CNML deployment: tiers,
quorums, transparency log endpoints, async signing defaults. (TODO 34)

**Merkle tree** — A tree of hashes where every leaf is a hash of data
and every internal node is a hash of its two children. Inclusion
proofs show that a leaf exists in the tree. CNML uses RFC 6962-style
trees with domain-separated SHA-256.

**ML-DSA** — Module-Lattice-based Digital Signature Algorithm
(FIPS 204). A post-quantum signature standard. CNML uses ML-DSA-65
in composite signatures.

**ML-KEM** — Module-Lattice-based Key Encapsulation Mechanism
(FIPS 203). A post-quantum KEM standard. CNML uses ML-KEM-768 for
threshold encryption.

**MPTS** — Migration to Post-Quantum Cryptography Test (NIST program).
CNML is targeted for MPTS submission in Q2 2027.

## O — OIML / OTS

**OIML** — Organisation Internationale de Métrologie Légale. The
international standards body for legal metrology. Publishes
Recommendations (R60, R76, etc.) specifying type approval requirements.

**OTS** — OpenTimestamps. A protocol for proving data existed at a
specific time by anchoring to Bitcoin block hashes. (TODO 06)

## P — PDF / Privacy

**PDF certificate** — The legacy OIML-CS format: a PDF file with
ink-style signatures. Subject to forgery; no revocation path.
(TODO 48 covers migration)

**PQC** — Post-Quantum Cryptography. Algorithms designed to resist
quantum computer attacks. CNML uses composite classic+PQC signatures.

**Privacy** — CNML supports three transparency modes per cert (TODO 51):
public content, hash-only (content held by IA), or quorum-revealed
(content encrypted to IA threshold).

## Q — Quorum / Q

**Quorum** — The set of parties whose threshold share satisfies a
threshold scheme. BIML Root: 5-of-7 directors. Each IA: 2-of-3 officers.

## R — Revocation / Root

**R-id** — Recommendation identifier (e.g., "R60", "R76", "R117").
Specifies the technical requirements for a category of instruments.

**Revocation** — Invalidating a certificate before its natural
expiration. Logged in the CRL. (TODO 05)

**Root CA** — The topmost certificate authority in a hierarchy.
Self-signed; serves as the trust anchor for all subordinate certs.

**Roughtime** — A protocol for cryptographically-signed timestamps
from multiple servers. CNML uses Roughtime to bind cert signing times
to multiple time authorities. (TODO 47)

## S — Scope / Shamir

**Scope (of an IA cert)** — The set of Recommendations the IA is
authorized to issue certificates for. Enforced cryptographically via
the `oimlAuthorizedRecommendations` X.509 extension.

**Shamir's Secret Sharing** — A threshold secret sharing scheme over
GF(p). Used by CNML as an air-gapped fallback for ceremonies. (TODO 24)

**Subordinate CA** — A CA cert signed by another CA (not self-signed).
In CNML: IAs are subordinate to BIML Root.

## T — Threshold / Transparency

**Threshold cryptography** — Cryptographic operations requiring T-of-N
shares. No single party can act unilaterally. (TODO 30)

**Threshold (T)** — Minimum number of shares needed to perform a
threshold operation (e.g., 5 for BIML Root).

**Transparency log** — Append-only public log of every issued
certificate. Detects covert issuance. (TODO 35)

**Trust anchor** — The root public key that a verifier trusts
absolutely. CNML distributes the trust anchor via three channels
(static asset, transparency log, printed Annual Report). (TODO 44)

## U — USR / Unit

**Unit (SI)** — A standardized measurement unit (kilogram, metre,
second, ...). CNML references units via BIPM Digital SI for
authoritative source. (TODO architecture.md)

## V — Verify / Vendor

**Verification** — Confirming a certificate is valid: signed by a
trusted chain, not revoked, time-anchored, scope-appropriate,
transparent, timestamp-correct, and grade-A+ trustworthy. (TODO 49)

**Vendor diversification** — Using hardware from multiple vendors
to defend against single-vendor compromise. (TODO 56)

## W — WebAuthn / Wycheproof

**WebAuthn** — Web Authentication standard (FIDO2). Browser API for
hardware-backed public-key authentication. Used by DirectorSignPanel.

**Wycheproof** — Google's project that tests crypto libraries
against known attacks. CNML references Wycheproof vectors in tests.

## X — X.509 / XMLDSig

**X.509** — The standard format for public-key certificates
(RFC 5280). CNML certs embed X.509 signatures.

**XMLDSig** — W3C XML Digital Signature standard. CNML uses
XMLDSig (with Exclusive C14N canonicalization) for cert signatures.

## Y — YubiKey

**YubiKey** — A hardware security key by Yubico. Supports
OpenPGP smartcard, FIDO2/WebAuthn, and PIV interfaces. CNML uses
YubiKey 5 series for director identity. (TODO 39, 56)

## Z — Zeroize

**Zeroization** — Securely erasing secrets from memory by
overwriting with zeros. Important for air-gapped CA operations.

## Acronym soup

| Acronym | Meaning |
|---------|---------|
| AAL | Authenticator Assurance Level |
| BIPM | Bureau International des Poids et Mesures |
| CA | Certificate Authority |
| CMS | Cryptographic Message Syntax |
| CNML | Certificat Numérique de Métrologie Légale |
| CP | Certificate Policy |
| CPS | Certification Practice Statement |
| CRL | Certificate Revocation List |
| CT | Certificate Transparency |
| DCC | Digital Calibration Certificate |
| D-CoC | Digital Certificate of Conformity |
| EP | (Romanian Standards Body) |
| ERS | Evidence Record Syntax |
| FIPS | Federal Information Processing Standards |
| FROST | Flexible Round-Optimized Schnorr Threshold |
| HSM | Hardware Security Module |
| IA | Issuing Authority |
| IAL | Identity Assurance Level |
| ISO | International Organization for Standardization |
| KEM | Key Encapsulation Mechanism |
| ML-DSA | Module-Lattice-Based Digital Signature Algorithm |
| ML-KEM | Module-Lattice-Based Key Encapsulation Mechanism |
| MPTS | Migration to Post-Quantum Cryptography Test |
| NIST | National Institute of Standards and Technology |
| OCSP | Online Certificate Status Protocol |
| OIML | Organisation Internationale de Métrologie Légale |
| OTS | OpenTimestamps |
| PKCS | Public-Key Cryptography Standards |
| PKI | Public Key Infrastructure |
| PQC | Post-Quantum Cryptography |
| PTB | Physikalisch-Technische Bundesanstalt (Germany) |
| R-id | Recommendation identifier |
| SI | Système International (international unit system) |
| TLS | Transport Layer Security |
| TODO | Task (in roadmap) |
| TSP | Time-Stamp Protocol |
| WASM | WebAssembly |
| XML | Extensible Markup Language |
| XMLDSig | XML Digital Signature |
