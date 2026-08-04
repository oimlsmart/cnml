---
title: System architecture
description: The canonical description of the CNML system architecture, covering the five-tier certificate hierarchy, the layered certificate model, and the data flow from certificate creation to verification.
---

# System architecture

CNML is a cryptographically signed, machine-verifiable digital certificate format for OIML-CS type approvals. The system architecture comprises a five-tier certificate hierarchy that distributes signing authority across institutional bodies, a layered certificate model that separates universal structure from per-Recommendation specifics, and a verification pipeline that any party can execute without contacting the issuer. This document is the canonical architectural reference for CNML. The implementation is developed by Ribose, and the threshold-cryptography substrate is provided by Confium.

## The five-tier certificate hierarchy

CNML organizes signing authority into a five-tier hierarchy. Each tier holds its own threshold parameters and its own signing key material, and each tier's signatures chain cryptographically to the tier above. The thresholds at the upper tiers distribute signing authority across multiple independent parties, so that no single individual can produce a CA-level signature. The thresholds at the lower tiers remain single-party, since the volume of instance-level signing would make threshold coordination impractical.

![System architecture](/diagrams/architecture.svg)

The BIML Root tier is operated by the International Bureau of Legal Metrology under the governance of the CIML. The root signing key is held as a threshold secret shared among the OIML directors. Producing a root-tier signature requires a configured quorum of directors to participate in a threshold signing protocol. The protocol is a FROST-style construction (Flexible Round-Optimized Schnorr Threshold signatures) over the Ed25519 curve, with a typical configuration of five-of-seven directors.

The IA Intermediate tier is operated by each Issuing Authority under the OIML-CS Declaration of Mutual Confidence framework. Each IA operates its own threshold quorum for intermediate signatures. The protocol is FROST over the NIST P-256 curve, with a typical configuration of two-of-three officers per IA. The choice of P-256 at this tier reflects interoperability with existing PKCS#11 hardware.

The Test Lab tier covers test laboratories accredited by an IA to perform type-evaluation testing. A test laboratory holds a single-party ECDSA P-256 signing key and signs test reports that the IA reviews as evidence within a type-approval package. The test laboratory does not issue CNML certificates. The IA remains the accountability boundary for type approval.

The Manufacturer Model tier covers manufacturers that produce instruments of an approved model. An IA issues a scoped delegation certificate to the manufacturer, authorizing the manufacturer to issue instance certificates for instruments of that specific model only. The manufacturer holds a single-party signing key.

The Manufacturer Instance tier covers individual instruments. A manufacturer produces an instance certificate binding a specific instrument to its model approval, incorporating the serial number, firmware hash, and calibration data. The instance certificate is appended to the public transparency log.

## The layered certificate model

CNML structures certificate content in four layers: a CORE layer that carries universal fields, a shared-modules layer that carries cross-cutting concerns, a per-Recommendation layer that carries Recommendation-specific fields, and an instance layer that carries the data of a single real certificate. The layering ensures that the format stays stable as new OIML Recommendations are added, because no bespoke per-Recommendation code exists.

![Certificate model layers](/diagrams/certificate-layers.svg)

The CORE layer defines the universal fields that every OIML-CS certificate carries. These fields include the certificate number, the scheme, the project number, the validity dates, the member state, the parties (applicant, manufacturer, issuing authority), the structured-value shape that wraps every characteristic, the Recommendation identifier, the test report, the revision history, the footnotes, the components, and the model variants. The CORE layer never varies per Recommendation. It is the stable base on which the rest of the format is built.

The shared-modules layer carries cross-cutting concerns used by multiple Recommendations. The OIML D 11:2013 environmental module defines climatic, mechanical, and electromagnetic classes used by fourteen or more Recommendations. Smaller modules cover power supply, software, warm-up, and weighing capacity. A module is referenced by a Recommendation rather than duplicated, so that a correction to a module propagates to every Recommendation that uses it.

The per-Recommendation layer carries the fields specific to a single OIML Recommendation. Each Recommendation extends the CORE layer and the relevant shared modules with fields that describe the instrument category and its accuracy classes. For example, OIML R60 defines a load-cell accuracy class enum, a load-cell characterization field, a classification-symbol pattern, and a humidity marking. OIML R76 defines accuracy classes in Roman numerals and an instrument type. OIML R117 defines decimal accuracy and pressure reference. The same pattern applies to every Recommendation in the system.

The instance layer carries the data of a single real certificate. Each instance validates against the schema for its Recommendation and serializes to CNML XML. The source-of-truth dataset contains the existing published OIML-CS Type Approval certificates, each of which validates against its Recommendation schema.

## The trust chain

A CNML certificate carries its entire verification chain in its `ds:KeyInfo` element. The verifier rebuilds the chain from the per-cert signer certificate up to the root that the verifier holds in its local trust store. The chain has three links.

![Trust chain](/diagrams/trust-chain.svg)

The root is the OIML Root CA, a self-signed certificate operated by BIML under the OIML DoMC framework. Every verifier trusts this root. The intermediate is the IA certificate, signed by the root and scoped to a specific subset of OIML Recommendations through an X.509 v3 extension. The per-cert signer is the end-entity certificate, signed by the IA and embedded in the `ds:KeyInfo` of each CNML certificate.

The scope extension on the IA intermediate certificate is the cryptographic mechanism that binds each IA to the Recommendations it is authorized to sign. The verifier reads the scope from the extension (or from a JSON manifest, for browsers without X.509 extension parsing) and rejects any CNML certificate whose Recommendation identifier is not covered.

## Data flow from creation to verification

The data flow begins with a manufacturer submitting a type-evaluation application to an IA. A test laboratory produces a test report and signs it with its single-party signing key. The IA reviews the test report, verifies the laboratory's signature, and decides whether to issue a CNML certificate. The IA's signing browser reads the scope from the IA intermediate certificate, refuses to sign a CNML whose Recommendation is out of scope, and produces an XMLDSig enveloped signature with Exclusive C14N canonicalization over the ECDSA-SHA256 algorithm on the NIST P-256 curve.

The signed CNML XML is distributed to the manufacturer, the verifier, and the public transparency log. The transparency log records the issuance in a Merkle tree and anchors the tree root to Bitcoin through OpenTimestamps. A verifier receives the CNML XML, drops the file into the verifier, and the verification pipeline executes: XML well-formedness, schema validity, signature validity, scope validity, CRL validity, timestamp validity, and transparency validity. The pipeline is data-driven, so adding a check is a matter of registering a new module in the checks array.

## See also

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) develops the threshold-signature substrate that underlies the upper tiers.
- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) describes CNML on its own terms, covering the air-gapped CA, scope governance, and the post-quantum roadmap.
- [Hardware key tiers](/docs/architecture/hardware-tiers) describes the PKCS#11 hardware model across the three signer tiers.
- [Schema-driven design](/docs/implementation/schema-driven-design) describes how the four-layer certificate model is implemented without per-Recommendation code.
- [Verification pipeline](/docs/implementation/verification-pipeline) describes the data-driven check pipeline that any verifier runs.
