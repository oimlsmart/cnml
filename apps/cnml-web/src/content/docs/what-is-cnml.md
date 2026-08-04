---
title: What is CNML?
description: The digital form of the OIML-CS certificate of conformity, developed under the OIML SMART program by digitizing every published Type Approval certificate in a manner compatible with the relevant OIML R-Recommendations.
---

# What is CNML?

CNML is the Certificat Numérique de Métrologie Légale, the digital certificate format developed under the OIML SMART program. It is the digital successor to the PDF-based OIML-CS certificate of conformity that is currently published at oiml.org. The format was produced by analyzing every existing published OIML-CS Type Approval certificate and digitizing the resulting model in a form compatible with OIML SMART and the relevant OIML R-Recommendations. CNML is XML, cryptographically signed using W3C XMLDSig with Exclusive C14N, and machine-verifiable by any party without contacting the issuer.

## CNML and DCC are different tiers

CNML is sometimes described as the OIML equivalent of the PTB Digital Calibration Certificate (DCC). That description is imprecise and obscures the relationship between the two formats. CNML and DCC operate at different tiers of the metrology infrastructure and serve complementary purposes.

| | DCC | CNML |
|---|---|---|
| Tier | Calibration | Type approval |
| Standard | ISO/IEC 17025 | OIML-CS plus the OIML R-Recommendations |
| Issuer | Calibration laboratories accredited under ISO/IEC 17025 | OIML-Designated Issuing Authorities under the OIML-CS framework |
| Subject | A specific calibrated artifact | A model, or type, of measuring instrument |
| Validity | One certificate per calibration event | One certificate per type approval, valid for the OIML-CS period |
| Use case | Measurement traceability for industry and science | Lawful market placement of regulated measuring instruments |
| Scope | All fields of metrology | Legal metrology, encompassing trade, health, safety, and environmental protection |
| Format | XML DCC 3.2.0 signed with XAdES | XML signed with XMLDSig, constrained by per-Recommendation JSON Schemas |

A measuring instrument in legal use typically holds both. The CNML type approval covers the model, and periodic DCC calibrations cover each individual recalibration of a specific unit. CNML consumes DCC files as test-report evidence through the `ptb-dcc-compat` package, so the two formats stack rather than compete.

## Why CNML exists

OIML publishes Recommendations covering measuring instruments subject to legal control. Each Recommendation defines its own accuracy classes, characteristic fields, and test requirements. R60 governs load cells, R46 governs active electrical energy meters, R117 governs dynamic measuring systems for liquids other than water, and so on. Until CNML, OIML certificates were issued as PDF files. PDF certificates are not machine-verifiable, do not encode their semantics in a structured form, and cannot be consumed by automated verification workflows.

CNML provides four properties that the PDF format cannot offer. First, every CNML file is signed by the issuing authority's private key, and any party can verify the signature using the corresponding public certificate. Second, the file is structured XML constrained by both the CNML XSD and the per-Recommendation JSON Schemas, which permits machine reading and automated validation. Third, all measurement units in a CNML trace to the BIPM Digital SI through the UnitsDB index and UnitsML encoding, with the authority chain running from BIPM Digital SI through UnitsDB and UnitsML into the CNML XML payload. Fourth, the format consumes DCC files as test-report evidence in the type-approval flow, which makes CNML interoperate with calibration-tier infrastructure rather than replace it.

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
