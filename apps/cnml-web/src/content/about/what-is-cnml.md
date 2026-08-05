---
title: 'What is CNML'
lede: 'CNML is the digital certificate format developed under the OIML SMART program to succeed the PDF-based OIML-CS certificate of conformity.'
coord: 'ABOUT / 01'
---

CNML is the Certificat Numerique de Metrologie Legale, a cryptographically signed digital certificate format for OIML type approvals. The work to produce CNML was conducted under the OIML SMART program. It consisted of analyzing every existing published OIML-CS Type Approval certificate and digitizing the resulting model in a manner compatible with OIML SMART and the relevant OIML R-Recommendations. The PDF-based OIML-CS certificate of conformity is the predecessor format that CNML succeeds.

CNML provides machine-verifiable certification of measuring instruments subject to legal metrology. Every certificate binds a type-approval evaluation to a cryptographic signature produced by a distributed threshold quorum of independent signers. Any party can verify a CNML certificate in a web browser without contacting the issuer, registering for a service, or holding an account.

## What CNML covers

CNML covers all 22 OIML Recommendations governing measuring instruments used in trade, health, safety, and environmental protection. Each Recommendation corresponds to a per-Recommendation JSON Schema that defines the certificate fields, the measurement constraints, and the evaluation evidence. The schemas are the specification: adding a new Recommendation to the system is the act of dropping a YAML schema file and regenerating the index. There is no per-Recommendation code in the implementation.

The format binds the model-level type approval to a chain of authority that runs from the OIML Root CA through an Issuing Authority intermediate and, for SMART instruments, through a manufacturer model certificate down to a per-device instance certificate. The chain is verifiable end to end by any holder of the file.

## What CNML provides

CNML provides cryptographic integrity, machine readability, FAIR alignment, and interoperability with the wider digital metrology infrastructure. Cryptographic integrity comes from X.509 v3 certificates and W3C XMLDSig signatures with Exclusive C14N canonicalization. Machine readability comes from the XML structure constrained by both the CNML XSD and the per-Recommendation JSON Schemas. FAIR alignment comes from stable identifiers, structured metadata, and the D-CoC interchange serialization. Interoperability comes from consuming PTB Digital Calibration Certificate files as test-report evidence in the type-approval flow.

## Standards CNML builds on

Every cryptographic and structural component of CNML traces to a published standard. The certificate format is X.509 v3 (RFC 5280) extended with an OIML-specific scope extension that uses the standard X.509 v3 extension mechanism. The XML signature is W3C XMLDSig 1.1 with Exclusive C14N. The signing algorithms include ECDSA P-256 (NIST FIPS 186), Ed25519 (RFC 8032), and ML-DSA-65 (NIST FIPS 204). The hardware interface is PKCS#11. The transparency log follows the RFC 6962 Certificate Transparency model, with tree roots anchored to Bitcoin through OpenTimestamps. The full list of standards is in the [technology page](../about/technology).

## Complementarity with the PTB Digital Calibration Certificate

CNML and the PTB Digital Calibration Certificate are complementary formats operating at different tiers of the metrology infrastructure. CNML operates at the type-approval tier under OIML-CS. DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each individual recalibration.

## Further reading

- [Why CNML](../about/why-cnml) develops the case for the technology.
- [How it works](../about/how-it-works) describes the five-tier hierarchy and the verification pipeline.
- [Technology](../about/technology) lists the standards and algorithms CNML builds on.
