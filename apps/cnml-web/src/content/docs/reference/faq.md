---
title: FAQ
description: Frequently asked questions about CNML, grouped by audience. Issuing Authorities, verifiers, manufacturers, standards bodies, security researchers, and open-source contributors.
---

# FAQ

This page answers common questions about CNML, grouped by audience. The answers are brief and point to the canonical documentation pages for detailed treatment.

CNML is a proposal for OIML from the OIML SMART programme. The answers here describe the proposal as currently drafted and are subject to revision as the proposal evolves and as OIML Member States provide feedback.

## For Issuing Authorities

### What does adopting CNML involve for an IA?

CNML is designed for the staff that IAs already have. CA officers continue approving certificate-signing requests, and the signing step replaces the printing step. Test-laboratory technicians use the same measurement data, and signing is one additional action. IT staff who are familiar with PKCS#11 hardware manage the signing keys using their existing skills. The annual ceremony requires directors to participate asynchronously, without travel.

The CNML training programme consists of a two-day workshop for CA officers, a one-day session for test laboratories, and a half-day session for verifiers.

### What happens if a director or officer refuses to participate in a signing session?

This is by design. Threshold signing (two of three for IA, five of seven for root) means that no single person can compel a signing action. If one director or officer refuses, the threshold cannot be reached and the operation pauses until the quorum is assembled. This property protects against compelled action, insider threats, and coercion. The trade-off is occasional operational delays when participants are unavailable, mitigated by the asynchronous signing protocol and the coordinator's buffering of shares.

### How does an IA handle the loss of a hardware signing key?

Two recovery paths exist. First, each director and officer has a backup hardware key held in a tamper-evident envelope in a secure location. The backup is activated within hours. Second, the lost key's threshold share is recoverable through a threshold-escrow ceremony among the remaining quorum. In both cases, the lost key's identity certificate is revoked, so the lost device cannot be used even if it is found.

### Can an IA keep its existing PDF workflow during the transition?

Yes. CNML supports a phased adoption in which the IA begins issuing CNML certificates alongside its existing processes, then moves to CNML as the primary format. The Certificate Policy and Certification Practice Statement govern the transition timeline.

### What if an IA wants to leave CNML later?

CNML is open source. An IA that leaves CNML can continue operating its certificate infrastructure independently, migrate to another format using the documented CNML XML, and keep its existing certificates verifiable through the public transparency log and the ERS archival records. There is no vendor lock-in. The Certificate Policy and Certification Practice Statement document the IA's operational independence.

## For verifiers

### How does a verifier confirm that a certificate is not revoked?

The verifier checks the certificate's serial number against the CRL published by the issuing IA. The CRL is signed by the IA and timestamped. Revocation events are also recorded in the public transparency log, so a verifier that subscribes to the log receives revocation notifications. The CRL checking mechanism is described in [Verification pipeline](/docs/implementation/verification-pipeline) and the operational workflow is described in [For verifiers](/docs/roles/for-verifiers).

### How does a verifier operate without internet access?

CNML is designed for offline-first verification. A verifier that has loaded the trust-anchor bundle (approximately ten kilobytes) can verify signatures, scope, CRL status, and timestamps without any network connection. The trust-anchor bundle contains the root certificate, the IA intermediate certificates, the scope manifest, and the current CRL for each IA. Only transparency-log inclusion proofs and CRL refresh require network access, and a verifier operating its own log mirror can verify inclusion offline as well. The offline verification model is described in detail in [For verifiers](/docs/roles/for-verifiers).

### How does a verifier integrate CNML checking into existing software?

CNML verification is available through the `@cnml/cnml-crypto` TypeScript library (for browser and Node.js), the `oiml_pki` Ruby gem (for server-side), and the Confium Rust crates (for native deployments). The libraries provide the same check pipeline that the web application runs. CNML does not provide a REST verification API by design, because the verification model is offline-first. A verifier that needs an API surface wraps the library in its own service. The library integration options are described in [For verifiers](/docs/roles/for-verifiers).

### What if a certificate looks valid but the manufacturer says it is forged?

The transparency log resolves this question. The verifier checks the certificate's hash in the log. If the hash is present, the certificate was issued by the IA and the manufacturer's claim is mistaken or false. If the hash is absent, the certificate is forged, and the verifier signs the manufacturer's affidavit and reports the forgery to the IA. Every legitimately issued certificate has a public audit trail in the transparency log.

## For manufacturers

### Does a manufacturer need to change its production line?

For the basic flow, in which the IA issues a certificate per model, no production-line change is needed. The certificate arrives through standard digital channels.

For manufacturer delegated signing, in which a high-volume manufacturer issues instance certificates for each instrument it produces, the manufacturer installs a hardware signing key at the end of each production line. The operator taps the hardware key per instrument, and the instance certificate is issued in seconds. The instance certificate is embedded in the instrument firmware or printed as a QR code.

### Will a manufacturer's competitors see its production volume?

The transparency log shows the hash of each certificate by default. The hash alone does not reveal which manufacturer issued the certificate. Competitors can observe aggregate issuance volume but not a per-manufacturer breakdown. For sensitive sectors, CNML supports hash-only mode (the hash is public, the content is held by the IA) and quorum-revealed mode (the hash is public, the content is encrypted to the IA quorum and revealed through a threshold ceremony).

### What happens if a manufacturer loses its signing hardware key?

Two paths exist. First, the manufacturer holds a backup hardware key at its facility. Second, the lost key's threshold share is recoverable through a BIML or IA quorum ceremony. The lost key's identity certificate is revoked, so the lost device cannot be used even if it is found.

## For standards bodies

### How does CNML relate to the OIML R-Recommendations?

CNML is a format for certificates issued under existing OIML Recommendations. It does not change the technical requirements of any Recommendation. It changes how the resulting certificate is signed, distributed, and verified. CNML schemas are per-Recommendation (R60, R76, R117, and so on) and reflect the existing test-report structures. The Recommendation itself remains authoritative.

### How does CNML relate to the PTB Digital Calibration Certificate?

CNML and the PTB Digital Calibration Certificate (DCC) are complementary formats that operate at different tiers of the metrology infrastructure. CNML operates at the type-approval tier under OIML-CS. DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically holds both a CNML type approval (covering the model) and periodic DCC calibrations (covering each recalibration of the specific unit). The full treatment is in [CNML and PTB DCC](/docs/concepts/cnml-and-dcc).

### How does CNML relate to threshold cryptography?

CNML uses threshold cryptography at two tiers of its hierarchy. At the BIML Root tier, the root signing key is held as a threshold secret shared among the OIML directors, requiring a quorum to produce a signature. At the IA tier, each IA operates its own threshold quorum for its intermediate signatures. The protocol is a FROST construction operated asynchronously through a coordinator service. The full treatment is in [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) and the alignment with NIST threshold-cryptography research is developed in [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment).

### How does CNML relate to the BIPM Digital SI?

The BIPM Digital SI is the authoritative source for unit definitions (kilogram, metre, second, and so on). CNML uses UnitsML and UnitsDB as the implementation layer for unit references, anchored to the BIPM Digital SI for authority.

### What standards does CNML use?

The full list of standards that CNML references is maintained in [Standards index](/docs/reference/standards-index).

## For security researchers

### Has CNML been audited?

CNML is built on Confium, an open-source threshold-cryptography framework written in Rust. Confium has been internally reviewed. Independent third-party audits are planned on an annual cadence. All code is open source and available for public review.

### What is the CNML threat model?

CNML defends against compelled revocation, single-key compromise, covert issuance, algorithm breakage, network attacks, malicious insiders, document fraud, and quantum-computing threats to classical cryptography. Out of scope are physical attacks on hardware-key firmware (mitigated by hardware attestation), zero-day vulnerabilities in browsers (standard web security), and side-channel attacks on signing hardware (physical security).

### How is the transparency log monitored?

The transparency log uses a gossip protocol consistent with RFC 6962. Independent log mirrors replicate every entry. Verifiers require agreement among the mirrors they trust. A diverging log is detected within hours.

## For open-source contributors

### How do I contribute?

Contributions go through pull requests. The contribution workflow, the repository layout, and the build and test commands are described in [For developers](/docs/roles/for-developers).

### What license will CNML use?

The license is to be finalized in coordination with OIML. The libraries will likely use MIT or Apache 2.0. The web application may use a copyleft license.

## See also

- [What is CNML](/docs/what-is-cnml) introduces the format and its origin.
- [Glossary](/docs/reference/glossary) defines the terminology used across CNML documentation.
- [Standards index](/docs/reference/standards-index) lists every standard that CNML references.
- [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml) covers the operational guide for IA officers and BIML and CIML staff.
- [For verifiers](/docs/roles/for-verifiers) covers the verification flow from a verifier's perspective.
- [For developers](/docs/roles/for-developers) covers the contribution workflow for the codebase.
