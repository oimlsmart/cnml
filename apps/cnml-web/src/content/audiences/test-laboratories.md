---
title: 'For test laboratories'
lede: 'A test laboratory signs its measurement report and encrypts it to the IA threshold. The DCC calibration report and the CNML type approval are complementary documents at different tiers.'
coord: 'AUD / 04'
---

## The world today

A test laboratory accredited under ISO/IEC 17025 conducts the type evaluation of an instrument against an OIML Recommendation. The laboratory produces a test report that documents the measurements, the conditions, and the verdict. The report is delivered to the Issuing Authority, which uses it as evidence for the type-approval decision.

The test report today is a document. It arrives at the IA as a file or on paper. The IA trusts the laboratory on the basis of accreditation and the laboratory's signature on the report. The integrity of the report in transit from the laboratory to the IA depends on the delivery channel. A calibration certificate produced under ISO/IEC 17025 by the same laboratory is a separate document that follows a separate path.

## What changes

CNML introduces two changes to the test-laboratory workflow. The first is signed measurement reports. The laboratory signs its measurement report with its own key, producing a verifiable artifact that the IA can validate without trusting the delivery channel. The signature binds the laboratory identity to the measurement data. The IA validates the signature, the laboratory certificate chain, and the laboratory's accreditation before accepting the report as evidence.

The second is threshold encryption to the IA. The laboratory encrypts the report to the IA threshold public key before transmission. Only a threshold quorum of IA officers can decrypt the report. The encryption protects the report in transit and ensures that no single officer can read it unilaterally. The decryption event is recorded in the transparency log, so the IA has an auditable record of who accessed the report.

The relationship between the laboratory's DCC calibration report and the CNML type approval is one of complementarity, not substitution. The DCC operates at the calibration tier under ISO/IEC 17025. The CNML type approval operates at the type-approval tier under OIML-CS. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each recalibration of the individual instrument. The CNML type-approval flow consumes DCC files as test-report evidence.

## What it looks like in practice

The laboratory signs its measurement report in the app. The report is structured XML conforming to the per-Recommendation report schema. The laboratory's signing key is held in PKCS#11 hardware or in browser IndexedDB. The signed report is a CNML evidence file that the IA can validate.

The laboratory encrypts the signed report to the IA threshold key. The IA threshold public key is published in the IA intermediate certificate. The encryption produces a ciphertext that the IA decrypts through a threshold ceremony. The laboratory transmits the ciphertext over any channel, because the encryption protects the content.

The IA receives the ciphertext, runs the threshold decryption ceremony, and validates the signed report. The report is then consumed as evidence in the type-approval decision. The DCC interop layer in the implementation parses DCC files submitted as calibration evidence and maps the DCC measurement results onto the CNML test-report fields.

## Proof

The DCC interop layer is exercised by the test vectors, which include DCC files as test-report evidence in the type-approval flow. The signed-report and threshold-encryption code paths are exercised by the Ruby CA server test suite and the TypeScript unit tests. The verify page validates signed reports dropped onto it.

## Your next step

Read the [CNML and PTB DCC](../docs/concepts/cnml-and-dcc) page for the tier distinction and the complementarity with the calibration tier, then read the [schema-driven design](../docs/implementation/schema-driven-design) page for the per-Recommendation report schema model.

## See also

- [For Issuing Authorities](../audiences/issuing-authorities) covers the IA threshold decryption ceremony that consumes the signed report.
- [Composite signatures](../features/composite-signatures) describes the signature profile the laboratory applies to its measurement report.
- Sign and submit a measurement report through the [certificate creation entry point](../create).
