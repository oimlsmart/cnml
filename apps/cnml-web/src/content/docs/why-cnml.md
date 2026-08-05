---
title: Why CNML
description: The case for adopting CNML as the digital certificate infrastructure for OIML-CS type approvals, written for Issuing Authorities evaluating the format.
---

# Why CNML

CNML is a cryptographically-signed digital certificate format for OIML type approvals, developed under the OIML SMART program. It provides machine-verifiable certification of measuring instruments subject to legal metrology. The legal authority of the underlying OIML-CS type approval is unchanged. CNML adds cryptographic integrity, machine readability, FAIR alignment, and interoperability with the wider digital metrology infrastructure.

## Standards-based and distributed

CNML is built on recognized international standards. The certificate format is X.509 v3 (RFC 5280), the same standard format used by web TLS, extended with an OIML-specific scope extension that uses the standard X.509 v3 extension mechanism. The XML signature is W3C XMLDSig 1.1 with Exclusive C14N. The key algorithms include ECDSA P-256 (NIST FIPS 186), Ed25519 (RFC 8032), and ML-DSA-65 (NIST FIPS 204). The hardware interface is PKCS#11. The transparency log follows the RFC 6962 model. Every cryptographic and structural component traces to a published standard. CNML extends these standards for legal metrology rather than replacing them.

The web TLS public-key infrastructure was designed in the 1990s for high-volume automated issuance of channel-authentication certificates. That architecture centralized signing authority in a single certificate authority per certificate and surrounded that centralization with protective infrastructure: OCSP responders, Certificate Transparency logs, third-party audits, and HSM clusters under compliance regimes. The centralization is efficient at the volume of web browsing but concentrates risk and carries substantial operational overhead.

CNML distributes signing authority across a threshold quorum of independent directors and officers using threshold cryptography, a class of techniques that matured into deployable form in the 2020s through protocols such as FROST and through the standardization work surveyed in NIST IR 8214. The distributed architecture eliminates single-party compromise as a system-wide risk while reducing the operational infrastructure burden: the high-throughput machinery of web PKI is unnecessary at the volume of legal-metrology certification, and the distributed threshold model removes the single-CA-operator risk that the machinery was built to mitigate. The full comparison is in [CNML and typical PKI compared](/docs/architecture/cnml-vs-typical-pki).

## Transparency

CNML is fully transparent by construction. The implementation source code is published under an open-source license. The per-Recommendation schemas are published as YAML and the generated TypeScript types are reproducible by any contributor. The transparency log that records every issued certificate is publicly readable, and the OpenTimestamps proofs that anchor the log to Bitcoin are independently verifiable. The trust anchors that verifiers pin are public. Any party can audit the system, and any party can verify any certificate without contacting the issuer, registering for a service, or holding an account.

Transparency is the central design property. The system is designed so that no aspect of certificate issuance, distribution, or verification depends on trust in a single party. Where a centralized operator exists, the operator's actions are observable. Where a cryptographic claim is made, the underlying data is published.

## Minimal operating burden

CNML is designed to impose a minimal operating burden on Issuing Authorities and verifiers. The software is open-source under a permissive license. Verification runs in a browser without registration: a market-surveillance inspector or a manufacturer verifies a certificate by dropping the file onto the page.

The hardware required is standard PKCS#11-compatible equipment available from multiple vendors. Any PKCS#11-compatible device can serve at any tier; the choice of device is a deployment policy driven by capacity and certification requirements. The full hardware model is described in [Hardware key tiers](/docs/architecture/hardware-tiers).

The static CDN that distributes trust anchors, CRLs, and the transparency log has no API surface and no usage limits. A verifier can verify CNML certificates indefinitely from a single cached download of the trust-anchor bundle.

## Distributed signing authority

CNML distributes signing authority across multiple parties using threshold cryptography. No single person can produce a CA-level signature. Every CA-level signature requires a configured quorum of independent signers, with the participants using their own hardware and operating from separate locations. The full treatment of the threshold architecture is in [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography). The operational flow that allows directors in different time zones to participate asynchronously is in [Distributed management](/docs/architecture/distributed-management).

Distributed signing authority removes single-party compromise as a system-wide risk. It also removes compelled-action risk: a court order or other compulsion directed at one officer cannot complete a threshold signature. The system's behavior under loss of directors, officers, hardware, or facilities is treated systematically in [Redundancy and continuity](/docs/architecture/redundancy).

## Public accountability

Every issued certificate, every threshold decryption event, and every share re-sharing ceremony is appended to a public Merkle transparency log. Tree roots are anchored to Bitcoin through OpenTimestamps. Gossip protocols ensure that a log operator cannot present different views to different verifiers. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. The full treatment is in [Transparency and audit](/docs/architecture/transparency).

## Longevity

Legal-metrology instruments have multi-decade service lifetimes. A load cell installed in 2026 may remain in service in 2046. The certificate must remain verifiable for that entire period. CNML supports multiple `ds:Signature` elements per document, one per algorithm era, so that migration to a new signing algorithm is a re-signing operation that preserves the original signature as historical evidence. The full treatment of the longevity and post-quantum migration path is in [CNML architecture choices](/docs/architecture/cnml-architecture-choices).

## Open and auditable

Every line of code is published. The signature pipeline, the X.509 certificate factory, the keystore encryption, the audit log hash chain, and the verifier are all in the open-source repository. Independent security researchers can audit any component. Pull requests are welcome, and security reports receive priority handling. The implementation inherits cryptographic primitives reviewed in NIST IR 8214 and subsequent threshold-cryptography research surveyed by the [NIST Multi-Party Threshold Schemes project](https://csrc.nist.gov/projects/threshold-cryptography). The alignment with that body of research is developed in [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment).

## OIML as facilitator of adoption

CNML is a component of the OIML SMART programme. OIML, acting through BIML and CIML, is committed to facilitating adoption of the system by every national metrology laboratory, their accredited test laboratories, and the market-surveillance authorities that verify instruments in the field. The institutional structure that governs CNML is described in [OIML, BIML, CIML, and OIML-CS](/docs/concepts/oiml-institutions). The operational guidance for IAs and BIML/CIML staff is in [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml).

The OIML SMART programme is the framework within which CNML evolves. The documentation set published here is a proposal to OIML, not an adopted specification. Member States and Corresponding Members engage through official OIML channels.

## Path forward

CNML adoption proceeds through three phases. In the pilot phase, BIML issues a test root and a small number of IA intermediates on hardware keys. Sample CNMLs are signed for evaluation. In the parallel-run phase, CNML certificates are issued alongside existing certificate formats while Issuing Authorities and verifiers become familiar with the format. In the production phase, CNML becomes the official format. The operational guide for IAs and BIML/CIML staff appears in [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml).

## See also

- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) develops the complementarity with PTB's Digital Calibration Certificate.
- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) introduces the cryptographic substrate.
- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) describes CNML on its own terms.
- [Transparency and audit](/docs/architecture/transparency) develops the accountability model.
- [Hardware key tiers](/docs/architecture/hardware-tiers) describes the PKCS#11 hardware model.
