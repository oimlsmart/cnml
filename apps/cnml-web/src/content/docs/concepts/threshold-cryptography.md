---
title: Threshold cryptography in CNML
description: The threshold-signature and threshold-encryption architecture that distributes signing authority across the BIML Root, IA Intermediate, Test Lab, Manufacturer Model, and Manufacturer Instance tiers.
---

# Threshold cryptography in CNML

CNML uses threshold cryptography to distribute signing authority across multiple independent parties at the upper tiers of the certificate hierarchy. No single person can produce a certificate-authority-level signature. Producing such a signature requires a configured quorum of independent signers, each using separate hardware and operating from separate locations. The threshold property defends against single-party compromise and against compelled action directed at any one signer. This page describes the five-tier hierarchy, the algorithms used at each tier, the threshold-encryption path for trade-secret protection, and the asynchronous coordinator model.

## The five-tier certificate hierarchy

CNML organizes certificate authority into five tiers, each with distinct signers, hardware, and scope of authority.

![Five-tier certificate hierarchy](/diagrams/five-tier-hierarchy.svg)

**BIML Root.** The BIML Root signing key is held as a threshold secret shared among seven directors appointed through CIML processes. Producing a root-tier signature requires a quorum of five directors. The directors are drawn from different OIML Member States, and the composition is governed by CIML election and BIML administration rather than by the cryptographic protocol. The root tier signs IA intermediate certificates and binds each to its allocated OIML Recommendation scope.

**IA Intermediate.** Each Issuing Authority operates its own threshold quorum for IA-intermediate signatures. A typical configuration uses three officers per IA, with a threshold of two. The IA intermediate tier signs end-entity certificates within the scope the root allocated. The IA also issues Manufacturer Model Certificates that delegate instance signing to manufacturers for specific instrument models.

**Test Lab.** Test laboratories hold single-party signing keys, typically backed by a PKCS#11-compatible personal hardware token. The test laboratory signs test reports that it submits to an IA as evidence within a type-approval package. The test laboratory does not issue CNML certificates. The IA reviews the test reports and decides whether to issue.

**Manufacturer Model.** A manufacturer producing instruments of an approved model holds a Manufacturer Model Certificate issued by an IA. The certificate is a scoped delegation that authorizes the manufacturer to issue Instance Certificates for one specific model. The manufacturer holds a single-party signing key.

**Manufacturer Instance.** Each individual instrument receives an Instance Certificate that binds the certificate to the instrument's serial number, firmware hash, and calibration data. The manufacturer issues Instance Certificates under its Model Certificate delegation and appends each to the public transparency log.

The lower three tiers use single-party keys because their authority is scoped and because the volume of signatures at the instance tier makes threshold ceremonies impractical. The threshold property is concentrated at the two tiers where compromise would be most damaging: the root and the IA intermediate.

## Algorithms at each tier

The choice of algorithm at each tier reflects the operational requirements and hardware constraints that apply.

| Tier | Algorithm | Threshold | Rationale |
|------|-----------|-----------|----------|
| BIML Root | FROST-Ed25519 (hybrid composite with ML-DSA-65 on the post-quantum branch) | 5-of-7 | Ed25519 for signature compactness and verification speed; FROST for the threshold property; ML-DSA composite for post-quantum migration |
| IA Intermediate | FROST-P256 | 2-of-3 (typical) | P-256 for interoperability with existing PKCS#11 hardware that supports P-256 but not Ed25519 |
| Test Lab | ECDSA-P256 (single-party) | 1-of-1 | Single-party signing on standard PKCS#11 hardware |
| Manufacturer Model | ECDSA-P256 (single-party) | 1-of-1 | Scoped delegation from the IA; single-party suffices because scope is bound |
| Manufacturer Instance | ECDSA-P256 (single-party) | 1-of-1 | High-volume per-instrument signing; scope is narrow and transparency-logged |

FROST (Flexible Round-Optimized Schnorr Threshold signatures) is the threshold-signature protocol used at both threshold tiers. At the BIML Root, FROST operates over the Ed25519 curve. At the IA Intermediate tier, FROST operates over the NIST P-256 curve. The FROST protocol allows a threshold of signers to produce a single aggregate signature that is indistinguishable from a non-threshold signature of the same algorithm. This means the aggregate public key for each tier is a single key, and verifiers do not need to know the threshold configuration to verify.

The post-quantum branch at the BIML Root uses a hybrid composite of Ed25519 with ML-DSA-65, the lattice-based signature scheme standardized in FIPS 204. The composite construction produces signatures that remain valid under either the classical or the post-quantum assumption. This provides a migration path as cryptanalytic capabilities evolve.

## Threshold encryption for trade-secret protection

Test reports submitted by test laboratories to Issuing Authorities may contain manufacturer intellectual property. CNML supports threshold encryption of the confidential sections of such reports to the IA quorum's threshold public key. Decryption requires a threshold ceremony among the IA officers. No single officer can decrypt a confidential section alone.

![Threshold encryption flow](/diagrams/threshold-encryption-flow.svg)

The threshold-encryption path uses an ElGamal-based construction over the NIST P-256 curve for the IA tier and supports threshold ML-KEM-768, standardized in FIPS 203, for post-quantum confidentiality. The technique is surveyed in NIST IR 8214 under threshold decryption. The operational pattern is as follows. The test laboratory encrypts the confidential section of its report to the IA's threshold public key before submission. The IA receives the encrypted report and, when its officers need to review the confidential content, convenes a threshold decryption ceremony. The ceremony is logged in the public audit trail. The plaintext is never exposed to a single party.

## The asynchronous coordinator model


## The framework's threshold requirements

The SIGNATIF framework places four requirements on threshold
operation, all instantiated here: a threshold child's delegation
certificate carries its quorum definition (T, N) as an X.509
extension; member rotation preserves the aggregate key so existing
delegations remain valid without re-issuance; every ceremony
produces a complete transcript (participants, quorum parameters,
payload hash, aggregate signature, and the transparency-log
cross-reference); and the audit algorithm verifies all of it. The
claims are in the [CNML profile of SIGNATIF](/docs/specifications/signatif-profile).

The directors at the BIML Root tier and the officers at the IA Intermediate tier are distributed across time zones. They cannot coordinate synchronously. CNML uses a coordinator service that buffers protocol messages, allowing each signer to participate when convenient. The coordinator is honest-but-curious. It can observe encrypted protocol messages and can log their existence, but it cannot reconstruct the signing key, forge a signer's commitment, or trigger a signing session without signer participation.

The coordinator operates under the threshold property. A compromise of the coordinator can delay signing sessions or drop messages, producing a denial-of-service condition, but cannot produce a valid threshold signature. The signing key material never leaves the signers' hardware. The protocol messages that the coordinator relays are individually authenticated by each signer's identity key and do not reveal the signing key.

The asynchronous model has three operational consequences. First, a signer can participate in a signing session without coordinating real-time availability with the other signers. Second, a signer who becomes temporarily unreachable can resume participation when connectivity returns, as long as the session is still open. Third, the coordinator can be operated by BIML or by a third party without weakening the threshold property, because the coordinator's role is strictly message relay and aggregation.

The operational flow of the coordinator, including the geographic distribution of signers and the resilience of the aggregation path, is developed in [Distributed management](/docs/architecture/distributed-management). The behavior of the system under loss of signers, hardware, or facilities is developed in [Redundancy and continuity](/docs/architecture/redundancy).

## Transparency as a complement to the threshold property

Every CNML certificate is appended to a public Merkle transparency log. Tree roots are anchored to Bitcoin through OpenTimestamps. The transparency property is independent of the threshold property but complements it. The threshold property defends against single-party compromise. The transparency property defends against covert issuance. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. The combination of threshold signing and public transparency is a CNML deployment pattern. The full treatment appears in [Transparency and audit](/docs/architecture/transparency).

## See also

- [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment) develops the relationship between CNML's threshold techniques and the foundational research surveyed by NIST.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous signing flow and the geographic distribution of signers.
- [Redundancy and continuity](/docs/architecture/redundancy) treats the failure modes and recovery mechanisms that apply when signers, hardware, or facilities are lost.
- [Transparency and audit](/docs/architecture/transparency) develops the accountability model that complements the threshold property.
- [NIST IR 8214: Threshold Schemes for Cryptographic Primitives](https://doi.org/10.6028/NIST.IR.8214)
- [FIPS 204 (ML-DSA)](https://csrc.nist.gov/pubs/fips/204/final)
- [FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final)
