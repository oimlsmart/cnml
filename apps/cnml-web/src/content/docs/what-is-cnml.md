---
title: What is CNML?
description: CNML is a cryptographically-signed digital certificate format for OIML type approvals, developed under the OIML SMART programme.
---

# What is CNML?

CNML is the Certificat Numerique de Metrologie Legale, a cryptographically-signed digital certificate format for OIML type approvals. CNML is developed under the OIML SMART program. It provides machine-verifiable certification of measuring instruments subject to legal metrology, built on recognized international standards including X.509 v3, W3C XMLDSig with Exclusive C14N, and NIST FIPS 204.

CNML covers all 22 OIML Recommendations governing measuring instruments used in trade, health, safety, and environmental protection. Each certificate binds a type-approval evaluation to a cryptographic signature produced by a distributed threshold quorum of international signers. Any party can verify a CNML certificate in a web browser without contacting the issuer.

## Complementarity with the PTB Digital Calibration Certificate

CNML and the PTB Digital Calibration Certificate are complementary formats operating at different tiers of the metrology infrastructure. CNML operates at the type-approval tier under OIML-CS. DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each individual recalibration. The full treatment of this relationship, including the collegial alignment with PTB's Quality Infrastructure Digital initiative, is in [CNML and PTB DCC](/docs/concepts/cnml-and-dcc).

## What CNML provides

CNML provides cryptographic integrity, machine readability, FAIR alignment, and interoperability with the wider digital metrology infrastructure. Every CNML file is signed by the issuing authority's private key, and any party can verify the signature using the corresponding public certificate. The file is structured XML constrained by both the CNML XSD and the per-Recommendation JSON Schemas, which permits machine reading and automated validation. The format consumes DCC files as test-report evidence in the type-approval flow, which makes CNML interoperate with calibration-tier infrastructure rather than replace it. The full properties are developed in [Why CNML](/docs/why-cnml).

## See also

- [Why CNML](/docs/why-cnml) develops the case for the technology.
- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) explains the tier distinction and the complementarity with PTB's work.
- [OIML, BIML, CIML, and OIML-CS](/docs/concepts/oiml-institutions) introduces the institutional context.
- [System architecture](/docs/architecture/system) describes the five-tier certificate hierarchy.
