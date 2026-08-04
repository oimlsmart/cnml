---
title: What is CNML?
description: CNML is the digital certificate format developed under the OIML SMART program to succeed the PDF-based OIML-CS certificate of conformity.
---

# What is CNML?

CNML is the Certificat Numérique de Métrologie Légale, the digital certificate format developed under the OIML SMART program. The format was produced by analyzing every existing published OIML-CS Type Approval certificate and digitizing the resulting model in a manner compatible with OIML SMART and the relevant OIML R-Recommendations. CNML is XML, signed using W3C XMLDSig with Exclusive C14N, and verifiable by any party without contacting the issuer.

The PDF-based OIML-CS certificate of conformity is the predecessor format that CNML succeeds. The legal authority of the underlying OIML-CS certificate is unchanged. CNML preserves that authority while adding cryptographic integrity, machine readability, and interoperability with the wider digital metrology infrastructure.

## Complementarity with the PTB Digital Calibration Certificate

CNML and the PTB Digital Calibration Certificate are complementary formats operating at different tiers of the metrology infrastructure. CNML operates at the type-approval tier under OIML-CS. DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each individual recalibration. The full treatment of this relationship, including the collegial alignment with PTB's Quality Infrastructure Digital initiative, is in [CNML and PTB DCC](/docs/concepts/cnml-and-dcc).

## What CNML provides

CNML provides four properties that the PDF format cannot offer. Every CNML file is signed by the issuing authority's private key, and any party can verify the signature using the corresponding public certificate. The file is structured XML constrained by both the CNML XSD and the per-Recommendation JSON Schemas, which permits machine reading and automated validation. All measurement units in a CNML trace to the BIPM Digital SI through the UnitsDB index and UnitsML encoding, with the authority chain running from BIPM Digital SI through UnitsDB and UnitsML into the CNML XML payload. The format consumes DCC files as test-report evidence in the type-approval flow, which makes CNML interoperate with calibration-tier infrastructure rather than replace it. The full properties are developed in [Why CNML](/docs/why-cnml).

## Where CNML fits

```
OIML Certificate of Conformity (PDF, today)
                ↓
                ↓  CNML digitizes the certificate
                ↓
CNML file (*.cnml.xml, signed XML)
                ↓
                ↓  Verifiable by any party
                ↓
Verifier (browser, mobile, market-surveillance terminal at point of inspection)
```

The digitization is structural rather than merely presentational. The signed XML form enables field verification, automated revocation checking, and integration with downstream regulatory systems that the PDF format cannot support.

## A proposal from the OIML SMART programme

CNML is a component of the OIML SMART programme. Every specification, diagram, and operational description in this documentation set is a draft proposal for OIML, not an adopted OIML specification. The proposal evolves as OIML Member States and Corresponding Members review and contribute. OIML, through BIML and CIML, is committed to facilitating adoption of the resulting system by every national metrology laboratory, their accredited test laboratories, and market-surveillance authorities.

## See also

- [Why CNML](/docs/why-cnml) develops the case for adopting the format.
- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) explains the tier distinction and the complementarity with PTB's work.
- [OIML, BIML, CIML, and OIML-CS](/docs/concepts/oiml-institutions) introduces the institutional context.
- [System architecture](/docs/architecture/system) describes the five-tier certificate hierarchy.
