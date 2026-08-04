---
title: CNML and PTB DCC
description: How CNML complements PTB's Digital Calibration Certificate, which operates at the calibration tier while CNML operates at the type-approval tier.
---

# CNML and PTB DCC

CNML and the PTB Digital Calibration Certificate are complementary formats that operate at different tiers of the metrology infrastructure. CNML covers the type-approval tier under OIML-CS. DCC covers the calibration tier under ISO/IEC 17025. The two formats stack rather than compete. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each individual recalibration.

## PTB's leadership in digital calibration certification

The Physikalisch-Technische Bundesanstalt (PTB) pioneered the Digital Calibration Certificate as part of the Quality Infrastructure Digital initiative. The DCC format and its supporting infrastructure are documented at the [PTB DCC project page](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-1120/digital-calibration-certificate.html) and the [DCC within the QI Digital initiative page](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-114/digital-certificate-of-conformity-within-the-qi-digital-initiative.html). The DCC work has produced an XML schema for calibration certificates, a public test infrastructure, and an international community of practice around digital calibration documentation.

CNML builds on the principles established by PTB's DCC work. Both formats are XML. Both are signed using W3C signature standards. Both are designed for machine verification. Both treat the certificate as a structured document rather than a presentational artifact.

## Different tiers of metrology

The complementarity rests on a tier distinction in the metrology infrastructure.

| | DCC | CNML |
|---|---|---|
| Tier | Calibration | Type approval |
| Standard | ISO/IEC 17025 | OIML-CS plus the OIML R-Recommendations |
| Issuer | Calibration laboratories accredited under ISO/IEC 17025 | OIML-Designated Issuing Authorities under the OIML-CS framework |
| Subject | A specific calibrated artifact | A model, or type, of measuring instrument |
| Validity | One certificate per calibration event | One certificate per type approval, valid for the OIML-CS period |
| Use case | Measurement traceability for industry and science | Lawful market placement of regulated measuring instruments |
| Scope | All fields of metrology | Legal metrology, encompassing trade, health, safety, and environmental protection |
| Format | XML DCC signed with XAdES | XML signed with XMLDSig, constrained by per-Recommendation JSON Schemas |

Calibration is the per-event activity of comparing a specific instrument against a reference standard and producing a measurement result with an uncertainty budget. Type approval is the per-model activity of evaluating whether a model of measuring instrument conforms to an OIML Recommendation and is fit for legal use. The two activities are sequential in the life of a regulated instrument: a model receives a type approval before any unit of that model is manufactured, sold, or placed in service, and individual units of that model receive periodic calibrations throughout their service lifetime.

## National program and international initiative

PTB's DCC is a national program. It is developed and operated by PTB as Germany's national metrology institute, in coordination with the German calibration service (DKD/DAkkS) and the European calibration laboratory community. The DCC format is available for adoption by other national metrology institutes and calibration laboratories, and several have adopted or piloted it.

CNML is the OIML international initiative. It is developed under the OIML SMART programme as the digital form of the OIML-CS certificate of conformity. Where DCC serves the calibration tier of the metrology infrastructure, CNML serves the type-approval tier of the legal-metrology infrastructure. The two initiatives operate at different layers, address different standards, and serve different regulatory purposes.

## Interoperation through DCC consumption

CNML is designed to consume DCC files as test-report evidence in the type-approval flow. The `ptb-dcc-compat` package in this repository imports a DCC file and produces a CNML test-report payload. A test laboratory that already produces DCC files for its calibration customers can submit the same DCC file to an Issuing Authority as evidence within a CNML type-approval package. The Issuing Authority verifies the DCC signature, extracts the measurement results, and incorporates them into the CNML evaluation record.

This interoperation avoids duplicate documentation. A laboratory that has invested in DCC tooling does not need to maintain a parallel CNML-only workflow for its type-approval work. The two formats coexist within the same laboratory's operations.

## FAIR alignment and the OIML Bulletin D-CoC article

Both DCC and CNML align with the FAIR principles for scientific data (Findable, Accessible, Interoperable, Reusable). The OIML Bulletin article "[Digital Certificate of Conformity](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)" (March 2025), authored by PTB colleagues, develops the D-CoC framework that complements both formats. CNML's D-CoC output interoperates with the framework described in that article. The FAIR alignment and the D-CoC relationship are developed in [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc).

## Distinct audiences, complementary tooling

DCC and CNML serve distinct audiences within the metrology community. DCC serves calibration laboratories, calibration customers, accreditation bodies, and the research community that relies on SI-traceable measurement results. CNML serves Issuing Authorities, manufacturers of regulated instruments, market-surveillance authorities, and OIML Member States. A national metrology institute that participates in both communities uses DCC for its calibration work and CNML for its type-approval work, with the two formats interchanging data through the consumption path described above.

## See also

- [What is CNML](/docs/what-is-cnml) introduces the format.
- [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc) develops the D-CoC relationship and references the OIML Bulletin article.
- [PTB DCC project page](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-1120/digital-calibration-certificate.html)
- [PTB DCC within the QI Digital initiative](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-114/digital-certificate-of-conformity-within-the-qi-digital-initiative.html)
- [OIML Bulletin D-CoC article, March 2025](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)
