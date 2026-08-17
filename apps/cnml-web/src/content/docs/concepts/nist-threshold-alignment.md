---
title: Alignment with NIST threshold cryptography research
description: CNML adopts threshold cryptography techniques surveyed by NIST IR 8214 and the NIST Multi-Party Threshold Schemes project, applied to the legal-metrology context.
---

# Alignment with NIST threshold cryptography research

CNML adopts threshold cryptography techniques surveyed and standardized by the United States National Institute of Standards and Technology (NIST). The adoption is substantive and acknowledged here. CNML applies these techniques in the legal-metrology context, where the requirements of long instrument lifetimes, multi-jurisdictional governance, and regulatory transparency differ from the use cases NIST's threshold cryptography research primarily addresses.

## NIST threshold cryptography work

NIST has been developing threshold cryptography as a research and standardization area for several years. The work is collected at the [NIST Multi-Party Threshold Schemes project page](https://csrc.nist.gov/projects/threshold-cryptography). Three components of that work materially inform CNML's design.

[NIST IR 8214](https://doi.org/10.6028/NIST.IR.8214), titled *Threshold Schemes for Cryptographic Primitives*, published in April 2020, surveys the state of the art in threshold schemes for symmetric primitives, public-key primitives, and post-quantum candidates. The report identifies the threshold property as a defense against single-point-of-compromise and surveys candidate protocols for each primitive class. CNML's threshold-signature architecture adopts the conceptual framework established in IR 8214.

The NIST Threshold Cryptography workshop series, held periodically since 2019, brings together researchers and practitioners to discuss threshold schemes, their security analysis, and their deployment. The workshop proceedings inform NIST's subsequent standardization work. CNML's design tracks the workshop discussions on FROST-style threshold signatures, on threshold encryption, and on post-quantum threshold schemes.

NIST's broader post-quantum cryptography standardization effort, which produced [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) (ML-KEM) and [FIPS 204](https://csrc.nist.gov/pubs/fips/204/final) (ML-DSA), defines the post-quantum primitives on which CNML's hybrid-signature roadmap depends. The threshold variants of these primitives are an active area of research that CNML tracks.

## What CNML adopts


The same constructions instantiate the SIGNATIF framework's threshold
requirements (quorum-in-delegation, aggregate-key continuity,
ceremony records, and the audit algorithm); the mapping is in the
[CNML profile of SIGNATIF](/docs/specifications/signatif-profile).

CNML adopts the following threshold techniques surveyed by NIST.

**Threshold signature at the BIML Root tier.** The BIML Root signing key is held as a threshold secret shared among the OIML directors. Producing a root-tier signature requires a configured quorum of directors to participate in a threshold signing protocol. The protocol CNML uses is a FROST-style construction (Flexible Round-Optimized Schnorr Threshold signatures) over the Ed25519 curve, with hybrid composite signatures support for ML-DSA-65 on the post-quantum branch. The threshold property prevents a single director from producing a root-tier signature and prevents a compromise of fewer than the threshold number of directors from producing one.

**Threshold signature at the IA Intermediate tier.** Each Issuing Authority operates its own threshold quorum for IA-intermediate signatures. The protocol is FROST over the NIST P-256 curve, with a typical configuration of two-of-three officers per IA. The choice of P-256 at the IA tier reflects interoperability with existing PKCS#11 hardware that supports P-256 but not Ed25519.

**Threshold encryption for trade-secret protection.** Test reports submitted by test laboratories to Issuing Authorities may contain manufacturer intellectual property. CNML supports threshold encryption of the confidential sections of such reports to the IA quorum's threshold public key. Decryption requires a threshold ceremony among the IA officers. The technique is surveyed in NIST IR 8214 under threshold decryption.

**Coordinator-mediated asynchronous signing.** The directors are distributed across time zones and cannot coordinate synchronously. CNML uses a coordinator service that buffers protocol messages, allowing each director to participate when convenient. The coordinator is honest-but-curious: it can observe encrypted protocol messages but cannot reconstruct the signing key. This operational pattern follows the threshold-ceremony coordination patterns discussed in the NIST workshops.

## What CNML adds

CNML applies threshold cryptography to a context that NIST's research program does not primarily address.

**Legal-metrology governance.** The threshold quorum at the BIML Root tier is composed of directors drawn from different OIML Member States. The composition is governed by OIML institutional processes (CIML approval, BIML administration), not by the cryptographic protocol. CNML adds an institutional layer on top of the cryptographic threshold property.

**Long archival horizons.** Legal-metrology instruments have service lifetimes measured in decades. A CNML certificate issued in 2026 may need to remain verifiable in 2050 or later. CNML adds long-term archival renewal (ERS), algorithm-era multi-signature support, and a transparency log to the threshold-signature base. These additions are not part of NIST's threshold primitives but are necessary for the legal-metrology deployment.

**OIML-CS scoping.** CNML binds each IA intermediate certificate to a specific subset of OIML Recommendations through an X.509 v3 extension. The scope extension is enforced at verification time. This is a CNML addition that applies the threshold-signature substrate to the OIML-CS type-approval context.

**Public transparency log.** Every issued CNML certificate is appended to a public Merkle transparency log, and tree roots are anchored to Bitcoin through OpenTimestamps. The transparency property is independent of the threshold property but complements it: the threshold property defends against single-party compromise, and the transparency property defends against covert issuance. The combination is a CNML deployment pattern, not a NIST primitive.

## Acknowledgment

CNML's threshold-cryptography substrate would not be possible without the foundational research surveyed and standardized by NIST. The NIST IR 8214 report, the Threshold Cryptography workshops, and the post-quantum standardization effort collectively established the conceptual and technical foundation on which CNML is built. The OIML SMART programme acknowledges this contribution. The acknowledgment is collegial: NIST does not evaluate, endorse, or operate CNML, and the alignment described here is a one-way adoption of NIST's published work.

## See also

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) develops the threshold-signature architecture in CNML's context.
- [System architecture](/docs/architecture/system) describes the five-tier hierarchy that uses the threshold property.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous signing flow.
- [NIST Multi-Party Threshold Schemes project](https://csrc.nist.gov/projects/threshold-cryptography)
- [NIST IR 8214: Threshold Schemes for Cryptographic Primitives](https://doi.org/10.6028/NIST.IR.8214)
- [FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final)
- [FIPS 204 (ML-DSA)](https://csrc.nist.gov/pubs/fips/204/final)
