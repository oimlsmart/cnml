---
title: Standards index
description: A complete index of every standard, specification, and recommendation that CNML references, with the role each plays in the architecture.
---

# Standards index

This page indexes every standard, specification, and recommendation that CNML references. Each entry gives the full identifier, the full title, the role the standard plays in the CNML architecture, and a link to the canonical source. Standards are cited by their full identifier on first reference and by their short identifier thereafter, following the OIML SMART writing style guide.

CNML is a proposal for OIML from the OIML SMART programme. The standards referenced here are the standards that the proposal, as currently drafted, depends on. The reference set is subject to revision as the proposal evolves.

## OIML publications

### OIML R-Recommendations

The OIML R-Recommendations specify the technical requirements for categories of measuring instruments. CNML carries one Recommendation identifier per certificate (R60, R76, R117, and so on) and renders the certificate form from the corresponding per-Recommendation JSON Schema. The twenty-two Recommendations currently modelled in the CNML schema set are:

- OIML R 21, Taximeters
- OIML R 31, Diaphragm gas meters
- OIML R 46, Active electrical energy meters
- OIML R 49, Water meters intended for the metering of cold potable water and hot water
- OIML R 50, Continuous totalizing automatic weighing instruments
- OIML R 51, Automatic catchweighing instruments
- OIML R 60, Metrological regulation for load cells
- OIML R 61, Automatic gravimetric filling instruments
- OIML R 76, Nonautomatic weighing instruments
- OIML R 85, Automatic level gauges for measuring the level of liquid in stationary storage tanks
- OIML R 99, Instruments for measuring vehicle exhaust emissions
- OIML R 105, Direct mass flow measuring systems for quantities of liquids in fully loaded flows
- OIML R 106, Automatic rail-weighbridges
- OIML R 107, Discontinuous totalizing automatic weighing instruments
- OIML R 108, Moisture meters for cereal grain and oilseeds
- OIML R 109, Manometers for high pressure
- OIML R 110, Pressure balances
- OIML R 111, Weights of accuracy classes E1, E2, F1, F2, M1, M2, M3
- OIML R 117, Dynamic measuring systems for liquids other than water
- OIML R 126, Evidential breath analyzers
- OIML R 129, Multidimensional measuring systems
- OIML R 134, Automatic instruments for weighing road vehicles in motion
- OIML R 136, Instruments for measuring exhaust gas opacity
- OIML R 137, Gas meters
- OIML R 139, Compressed gaseous fuel measuring systems

The authoritative source for OIML publications is the [OIML website](https://www.oiml.org/en/publications).

### OIML D 11

OIML D 11:2013, *General requirements for electronic measuring instruments*, defines the environmental-class system (climatic, mechanical, and electromagnetic) that fourteen or more Recommendations reference. CNML implements the D 11 classes as a shared schema module that per-Recommendation schemas include by reference.

### OIML B-documents

The OIML B-document series covers the operational framework of the OIML-CS. CNML operates within this framework and is designed as the digital form of the OIML-CS certificate of conformity. The DoMC (Declaration of Mutual Confidence) is the B-document framework under which Issuing Authorities mutually recognize each other's type approvals.

## Trust-infrastructure framework

### SIGNATIF

The SIGNATIF trust-infrastructure framework (ISO/TC 154 working draft) is the general framework for hierarchical, threshold-secured, transparency-logged certificate infrastructures. CNML is specified as a domain profile of SIGNATIF: the delegation model, the dimensional attestation model, the transparency requirements, and the verification pipeline are instantiated from the framework for legal metrology. The conformance claims and their evidence are in the [CNML profile of SIGNATIF](/docs/specifications/signatif-profile). The framework draft is developed at [signatif.github.io](https://signatif.github.io).

## ISO and IEC standards

### ISO/IEC 17025

ISO/IEC 17025, *General requirements for the competence of testing and calibration laboratories*, is the competence standard for calibration and testing laboratories. CNML operates at the type-approval tier under OIML-CS, which is complementary to the calibration tier that operates under ISO/IEC 17025. The relationship is developed in [CNML and PTB DCC](/docs/concepts/cnml-and-dcc).

### ISO/IEC 17065 and ISO/IEC 17067

ISO/IEC 17065, *Conformity assessment, Requirements for bodies certifying products, processes and services*, and ISO/IEC 17067, *Conformity assessment, Fundamentals of product certification and guidelines for product certification schemes*, are the conformance-assessment standards that the D-CoC format is grounded in. CNML's D-CoC output is described in [D-CoC output and FAIR interchange](/docs/implementation/dcoc-output).

## IETF RFCs

### RFC 5280

RFC 5280, *Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile*, defines the X.509 certificate format and the CRL format that CNML uses for its certificate chain and its revocation lists. [Specification](https://www.rfc-editor.org/rfc/rfc5280).

### RFC 5652

RFC 5652, *Cryptographic Message Syntax (CMS)*, defines a standard envelope for signed data. CMS is referenced where CNML needs to interoperate with systems that consume CMS-signed artifacts. [Specification](https://www.rfc-editor.org/rfc/rfc5652).

### RFC 6962

RFC 6962, *Certificate Transparency*, defines the append-only Merkle-tree transparency-log design. CNML's transparency log is modeled on the RFC 6962 design, using domain-separated SHA-256 and inclusion proofs that a verifier validates locally. [Specification](https://www.rfc-editor.org/rfc/rfc6962).

### RFC 8018

RFC 8018, *PKCS 5: Password-Based Cryptography Specification Version 2.1*, defines PBKDF2. CNML uses PBKDF2 with a high iteration count to derive encryption keys from passphrases for the protection of browser-stored signing keys. [Specification](https://www.rfc-editor.org/rfc/rfc8018).

### RFC 4998

RFC 4998, *Evidence Record Syntax (ERS)*, defines the long-term archival format that allows hash-algorithm renewal without breaking the archival chain. CNML uses ERS for long-term archival renewal, ensuring that certificates issued today remain verifiable across hash-algorithm migrations. [Specification](https://www.rfc-editor.org/rfc/rfc4998).

### RFC 3161

RFC 3161, *Internet X.509 Public Key Infrastructure Time-Stamp Protocol (TSP)*, defines the time-stamp token format. CNML accepts RFC 3161 time-stamp tokens alongside OpenTimestamps proofs for binding signing times to external time authorities. [Specification](https://www.rfc-editor.org/rfc/rfc3161).

## W3C and IETF signature standards

### W3C XMLDSig

W3C XML Digital Signature, *XML Signature Syntax and Processing Version 1.1*, defines the XML signature format that CNML uses for all certificate signatures. CNML uses the enveloped-signature form. [Specification](https://www.w3.org/TR/xmldsig-core1/).

### Exclusive C14N

W3C Exclusive XML Canonicalization 1.0, *Exclusive XML Canonicalization Version 1.0*, defines the canonicalization algorithm that CNML uses before computing XMLDSig digests. Exclusive C14N ensures that the signed octet stream is identical on the signer and the verifier regardless of the surrounding XML context. [Specification](https://www.w3.org/TR/xml-exc-c14n/).

## NIST standards

### FIPS 203

FIPS 203, *Module-Lattice-Based Key-Encapsulation Mechanism Standard*, defines ML-KEM. CNML uses ML-KEM-768 for threshold encryption of confidential test-report sections. [Specification](https://csrc.nist.gov/pubs/fips/203/final).

### FIPS 204

FIPS 204, *Module-Lattice-Based Digital Signature Standard*, defines ML-DSA. CNML uses ML-DSA-65 in composite signatures alongside classical signatures, providing post-quantum defense. [Specification](https://csrc.nist.gov/pubs/fips/204/final).

### NIST IR 8214

NIST IR 8214, *Threshold Schemes for Cryptographic Primitives*, published April 2020, surveys the state of the art in threshold schemes for symmetric and public-key primitives. CNML's threshold-signature architecture adopts the conceptual framework established in this report. The alignment is developed in [Alignment with NIST threshold cryptography research](/docs/concepts/nist-threshold-alignment). [Specification](https://doi.org/10.6028/NIST.IR.8214).

### NIST SP 800-53

NIST SP 800-53, *Security and Privacy Controls for Information Systems and Organizations*, is referenced where CNML's security controls are described in terms of the NIST control families. [Specification](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final).

### NIST SP 800-38D

NIST SP 800-38D, *Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC*, defines AES-GCM. CNML uses AES-256-GCM for the encrypted keystore that protects signing keys at rest. [Specification](https://csrc.nist.gov/publications/detail/sp/800-38d/final).

### NIST SP 800-63

NIST SP 800-63, *Digital Identity Guidelines*, defines the Identity Assurance Level (IAL) framework. CNML ceremonies meet IAL2, which requires in-person supervised identity proofing.

## Accessibility standards

### WCAG 2.2 AA

Web Content Accessibility Guidelines 2.2 at conformance level AA, published by the W3C Web Accessibility Initiative, is the accessibility standard that the CNML web application targets. [Specification](https://www.w3.org/TR/WCAG22/).

## Timestamp and blockchain standards

### OpenTimestamps

OpenTimestamps is a protocol for proving that data existed at a specific time by anchoring its hash to the Bitcoin blockchain. CNML uses OpenTimestamps to anchor certificate signing times, producing timestamp proofs that a verifier validates locally without trusting a remote timestamp authority. [Specification](https://opentimestamps.org/).

## Metrology and units

### BIPM Digital SI

The BIPM Digital SI is the authoritative source for International System of Units (SI) definitions. CNML references measurement units through UnitsML and UnitsDB, anchored to the BIPM Digital SI for authority. The relationship is developed in [BIPM Digital SI and measurement units in CNML](/docs/concepts/bipm-digital-si).

### UnitsML and UnitsDB

UnitsML is the markup vocabulary for measurement units, and UnitsDB is the corresponding unit database. CNML uses UnitsML elements for unit references within certificate XML, ensuring that every measurement carries a machine-readable unit identifier that resolves to the BIPM Digital SI definition.

## D-CoC and FAIR

### FAIR principles

The FAIR principles for scientific data (Findable, Accessible, Interoperable, Reusable) underpin the D-CoC format that CNML emits as its machine-readable interchange output. The FAIR alignment and the D-CoC framework are developed in [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc).

### OIML Bulletin D-CoC article

The OIML Bulletin article "[Digital Certificate of Conformity](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)" (March 2025) develops the D-CoC framework that CNML's output interoperates with. It is referenced here as the foundational description of the D-CoC concept and its application to legal metrology.

## PTB DCC

The PTB Digital Calibration Certificate is the calibration-tier digital certificate format developed by the Physikalisch-Technische Bundesanstalt (PTB) as part of the Quality Infrastructure Digital initiative. CNML is complementary to DCC: CNML operates at the type-approval tier, DCC operates at the calibration tier. The full relationship is developed in [CNML and PTB DCC](/docs/concepts/cnml-and-dcc).

- [PTB DCC project page](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-1120/digital-calibration-certificate.html)
- [DCC within the QI Digital initiative](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-114/digital-certificate-of-conformity-within-the-qi-digital-initiative.html)

## See also

- [Glossary](/docs/reference/glossary) defines the terminology used across CNML documentation.
- [FAQ](/docs/reference/faq) answers common questions grouped by audience.
- [Schema-driven design](/docs/implementation/schema-driven-design) describes how the OIML R-Recommendations are rendered from declarative schemas.
- [Verification pipeline](/docs/implementation/verification-pipeline) describes how RFC 5280, RFC 6962, and the W3C XMLDSig standards are applied at verification time.
