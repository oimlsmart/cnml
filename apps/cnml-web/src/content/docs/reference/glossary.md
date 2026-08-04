---
title: Glossary
description: Alphabetical terminology reference for non-experts, covering the terms used across CNML documentation.
---

# Glossary

This glossary defines the terminology used across CNML documentation. It is written for readers who are familiar with legal metrology but may be new to public-key infrastructure, threshold cryptography, or the CNML-specific vocabulary. Each entry is cross-referenced to the documentation page that develops the term in detail.

CNML is a proposal for OIML from the OIML SMART programme. The definitions here describe the proposal as currently drafted and are subject to revision as the proposal evolves.

## A

**Accuracy class.** A category assigned to a measuring instrument type that reflects its performance under specified conditions. OIML Recommendations define accuracy-class enumerations per instrument category. For load cells (OIML R60), the accuracy classes are A, B, C, and D. For non-automatic weighing instruments (OIML R76), the accuracy classes are I, II, III, and IIII.

**Algorithmic agility.** The ability to migrate from one cryptographic algorithm to another without reissuing every certificate. CNML uses composite signatures so that a hash algorithm can weaken without breaking historical verification.

**Asymmetric cryptography.** Public-key cryptography. Each party holds a public key (which anyone can use) and a private key (which only the owner uses).

**Attestation.** Cryptographic proof that a device has a specific configuration. A hardware key's attestation certificate confirms that the device is genuine.

## B

**BIML.** Bureau International de Metrologie Legale. The permanent secretariat of OIML, headquartered in Paris. BIML operates the CNML root tier, runs the transparency log, administers the coordinator service, and publishes the public artifacts.

**BIPM.** Bureau International des Poids et Mesures. The intergovernmental organization that maintains the International System of Units (SI). CNML references measurement units through UnitsML, anchored to the BIPM Digital SI for authoritative definitions.

**Bridge CA.** A certificate authority that cross-signs the roots of two different public-key infrastructures, so that verifiers of one infrastructure can validate certificates from the other.

## C

**CA.** Certificate Authority. The entity that issues certificates. In CNML, the CAs are the BIML Root, the Issuing Authorities, and (for test reports) the test laboratories.

**Certificate.** The signed document that proves an instrument type has been approved. In CNML, the certificate is an XML file signed with XMLDSig.

**CIML.** Comite International de Metrologie Legale. The steering committee of OIML, composed of one delegate per member state. CIML sets CNML policy, including which Recommendations adopt CNML, which IAs are eligible, and the threshold parameters.

**CMS.** Cryptographic Message Syntax (RFC 5652). A standard envelope for signed data, understood by OpenSSL, Adobe, and Thunderbird among others.

**Composite signature.** Two signatures over the same content using two different algorithms (for example, ECDSA and ML-DSA-65). A verifier can validate either signature.

**Confium.** The open-source threshold-cryptography substrate that CNML is built on. Confium is a Rust framework providing threshold signatures, threshold encryption, transparency-log infrastructure, and coordinator services.

**CRL.** Certificate Revocation List. A signed list of certificates that have been revoked before their natural expiration. Verifiers check the CRL before trusting a certificate.

**CT log.** Certificate Transparency log (RFC 6962). A public, append-only Merkle tree of certificates. CNML uses a transparency log modeled on the RFC 6962 design.

## D

**D-CoC.** Digital Certificate of Conformity. The FAIR-aligned RDF/XML and JSON-LD representation of a CNML certificate, used as the machine-readable interchange format for downstream consumers.

**Decryption ceremony.** A threshold event where IA officers jointly decrypt data encrypted to the IA quorum's threshold public key. Every decryption is logged.

**Delegation (scoped).** A pattern where a parent certificate delegates bounded authority to a child certificate. The child can only act within the delegated scope.

**Director.** A BIML-appointed custodian of a threshold share of the root signing key. In the typical CNML configuration, seven directors form the root quorum, and five of seven must participate to produce a root-tier signature.

**DoMC.** Declaration of Mutual Confidence. The OIML framework under which Issuing Authorities mutually recognize each other's type approvals. CNML's cryptographic scope enforcement supports the DoMC framework by binding each IA's scope to its intermediate certificate.

## E

**Encrypted report.** A test report whose confidential section is encrypted to the IA quorum's threshold public key. Decryption requires a threshold ceremony among the IA officers.

**Encapsulation.** In threshold encryption, the step where a fresh symmetric key is encrypted to the threshold public key, and the data is encrypted with the symmetric key.

**End-entity certificate.** The final certificate in a chain, issued to an instrument, a manufacturer, or a person. End-entity certificates are not used to sign other certificates.

**ERS.** Evidence Record Syntax (RFC 4998). A long-term archival format that allows hash-algorithm renewal without breaking the archival chain.

## F

**FROST.** Flexible Round-Optimized Schnorr Threshold signatures. A protocol for producing a single valid signature from the threshold shares of multiple parties. CNML uses FROST for all threshold signing.

## G

**Governance.** The rules and processes by which a public-key infrastructure is operated. In CNML, CIML sets policy, BIML operates the infrastructure, and the transparency log publishes every privileged action for public audit.

**Gossip protocol.** A replication protocol where each log mirror exchanges updates with its peers. Gossip detects divergent log views.

## H

**Hash.** A fixed-length value that uniquely represents a larger input. CNML uses SHA-256 throughout.

**HSM.** Hardware Security Module. A physical device that stores keys and performs cryptographic operations, designed to prevent key extraction. A YubiKey is a small HSM. Enterprise HSMs are available from multiple vendors.

## I

**IA.** Issuing Authority. An OIML-recognized national body designated under the DoMC framework that issues CNML certificates for specific OIML Recommendations. Each IA operates its own threshold quorum for its intermediate signatures.

**IAL.** Identity Assurance Level (NIST SP 800-63). CNML ceremonies meet IAL2, which requires in-person supervised identity proofing.

**Identity key.** The cryptographic key that a director or officer uses to authenticate themselves to the coordinator service. The identity key is separate from the threshold signing share.

**ISO.** International Organization for Standardization.

## K

**KEM.** Key Encapsulation Mechanism. A public-key encryption scheme where the public key is used to encrypt a fresh symmetric key. CNML uses ML-KEM-768 (FIPS 203) for threshold encryption.

**Key escrow.** Storing a key in a form that requires the cooperation of multiple parties to recover.

## L

**Long-term archival.** Maintaining a certificate's verifiability for twenty-five years or longer, across hash-algorithm migrations. CNML uses ERS for archival renewal.

**LTS.** Long-Term Support. A software release cadence that maintains security fixes for an extended period.

## M

**Manifest.** The TOML file describing a CNML deployment, including tiers, quorums, transparency-log endpoints, and asynchronous-signing defaults.

**Merkle tree.** A tree of hashes where every leaf is a hash of data and every internal node is a hash of its two children. Inclusion proofs demonstrate that a leaf exists in the tree. CNML uses RFC 6962-style Merkle trees with domain-separated SHA-256.

**ML-DSA.** Module-Lattice-based Digital Signature Algorithm (FIPS 204). A post-quantum signature standard. CNML uses ML-DSA-65 in composite signatures alongside classical signatures.

**ML-KEM.** Module-Lattice-based Key Encapsulation Mechanism (FIPS 203). A post-quantum KEM standard. CNML uses ML-KEM-768 for threshold encryption of confidential test-report sections.

## O

**OCSP.** Online Certificate Status Protocol. A protocol for checking certificate revocation status in real time. CNML uses CRLs rather than OCSP for its offline-first verification model.

**OIML.** Organisation Internationale de Metrologie Legale. The international standards body for legal metrology, established by the Convention establishing the World Forum on Legal Metrology (1955, revised 1968). OIML publishes the Recommendations that specify type-approval requirements for categories of measuring instruments.

**OTS.** OpenTimestamps. A protocol for proving that data existed at a specific time by anchoring its hash to the Bitcoin blockchain. CNML uses OTS to anchor certificate signing times.

## P

**PBKDF2.** Password-Based Key Derivation Function 2 (RFC 8018). A key-derivation function used to derive encryption keys from passphrases. CNML uses PBKDF2 with a high iteration count to protect browser-stored signing keys.


**PQC.** Post-Quantum Cryptography. Cryptographic algorithms designed to resist attacks by quantum computers. CNML uses composite classical-plus-post-quantum signatures.

**Privacy.** CNML supports three transparency modes per certificate. In full mode, the hash and the content are public. In hash-only mode, the hash is public and the content is held by the IA. In quorum-revealed mode, the hash is public and the content is encrypted to the IA quorum's threshold public key.

## Q

**Quorum.** The set of parties whose threshold shares satisfy a threshold scheme. In the typical CNML configuration, the BIML Root quorum is five of seven directors, and each IA quorum is two of three officers.

## R

**R-id.** Recommendation identifier (for example, R60, R76, R117). An OIML Recommendation specifies the technical requirements for a category of measuring instruments.

**Revocation.** Invalidating a certificate before its natural expiration. Revoked certificates are listed on the CRL.

**Root CA.** The topmost certificate authority in a hierarchy. The root is self-signed and serves as the trust anchor for all subordinate certificates.

**Roughtime.** A protocol for cryptographically signed timestamps from multiple time authorities. CNML uses Roughtime to bind certificate signing times to multiple independent time sources.

## S

**Scope (of an IA certificate).** The set of OIML Recommendations that an IA is authorized to issue certificates for. Scope is enforced cryptographically through the `oimlAuthorizedRecommendations` X.509 v3 extension.

**Shamir's Secret Sharing.** A threshold secret-sharing scheme over a prime field. CNML uses Shamir's Secret Sharing as an air-gapped fallback for ceremonies where the FROST protocol cannot be used.

**Subordinate CA.** A certificate authority whose certificate is signed by another CA (not self-signed). In CNML, the IAs are subordinate to the BIML Root.

## T

**Threshold cryptography.** Cryptographic operations that require T of N shares to complete. No single party can act unilaterally.

**Threshold (T).** The minimum number of shares required to perform a threshold operation. For the BIML Root, T is five. For each IA, T is two.

**Transparency log.** An append-only public log of every issued certificate. The transparency log detects covert issuance, because every legitimately issued certificate appears in the log and a verifier can check for inclusion.

**Trust anchor.** The root public key that a verifier trusts absolutely. CNML distributes the trust anchor through three channels: a static asset on the BIML CDN, the transparency log, and the printed OIML Annual Report.

## U

**Unit (SI).** A standardized measurement unit (kilogram, metre, second, and so on). CNML references units through UnitsML, anchored to the BIPM Digital SI for authoritative definitions.

## V

**Verification.** Confirming that a certificate is valid: signed by a trusted chain, within the issuer's scope, not revoked, time-anchored, scope-appropriate, and present in the transparency log.

**Vendor diversification.** Using hardware from multiple vendors to defend against single-vendor compromise. CNML applies vendor diversification to hardware keys.

## W

**WebAuthn.** Web Authentication (FIDO2). The browser API for hardware-backed public-key authentication. CNML uses WebAuthn for director identity in the browser interface.

**Wycheproof.** Google's project that tests cryptographic libraries against known attacks. CNML references Wycheproof test vectors in its test suite.

## X

**X.509.** The standard format for public-key certificates (RFC 5280). CNML certificates embed X.509 signature information.

**XMLDSig.** XML Digital Signature (W3C Recommendation). CNML uses XMLDSig with Exclusive C14N canonicalization for certificate signatures.

## Y

**YubiKey.** A hardware security key manufactured by Yubico. It supports the OpenPGP smartcard, FIDO2 and WebAuthn, and PIV interfaces. CNML uses the YubiKey 5 series for director and officer identity.

## Z

**Zeroization.** Securely erasing secrets from memory by overwriting with zeros. Zeroization is important for air-gapped CA operations.

## Acronym summary

| Acronym | Expansion |
|---|---|
| BIML | Bureau International de Metrologie Legale |
| BIPM | Bureau International des Poids et Mesures |
| CA | Certificate Authority |
| CIML | Comite International de Metrologie Legale |
| CMS | Cryptographic Message Syntax |
| CNML | Certificat Numerique de Metrologie Legale |
| CP | Certificate Policy |
| CRL | Certificate Revocation List |
| CSR | Certificate Signing Request |
| CT | Certificate Transparency |
| DCC | Digital Calibration Certificate |
| D-CoC | Digital Certificate of Conformity |
| DoMC | Declaration of Mutual Confidence |
| ERS | Evidence Record Syntax |
| FIPS | Federal Information Processing Standards |
| FROST | Flexible Round-Optimized Schnorr Threshold |
| HSM | Hardware Security Module |
| IA | Issuing Authority |
| IAL | Identity Assurance Level |
| ISO | International Organization for Standardization |
| KEM | Key Encapsulation Mechanism |
| ML-DSA | Module-Lattice-based Digital Signature Algorithm |
| ML-KEM | Module-Lattice-based Key Encapsulation Mechanism |
| OCSP | Online Certificate Status Protocol |
| OIML | Organisation Internationale de Metrologie Legale |
| OTS | OpenTimestamps |
| PBKDF2 | Password-Based Key Derivation Function 2 |
| PKCS | Public-Key Cryptography Standards |
| PKI | Public Key Infrastructure |
| PQC | Post-Quantum Cryptography |
| R-id | Recommendation identifier |
| SI | Systeme International (International System of Units) |
| TLS | Transport Layer Security |
| TSP | Time-Stamp Protocol |
| WASM | WebAssembly |
| XML | Extensible Markup Language |
| XMLDSig | XML Digital Signature |

## See also

- [What is CNML](/docs/what-is-cnml) introduces the format and its origin.
- [FAQ](/docs/reference/faq) answers common questions grouped by audience.
- [Standards index](/docs/reference/standards-index) lists every standard that CNML references.
