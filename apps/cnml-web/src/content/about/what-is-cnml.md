---
title: 'What is CNML'
lede: 'The digital certificate format for OIML type approvals, developed under the OIML SMART programme.'
coord: 'ABOUT / 01'
---

## The name

CNML stands for **Certificat Numérique de Métrologie Légale**. The name is French because legal metrology is an international discipline whose institutional language follows the Convention du Mètre, the founding treaty of the metric system, signed in Paris in 1875. The International Bureau of Weights and Measures (BIPM), the International Organization of Legal Metrology (OIML), and their member states conduct their formal work in French. The CNML name follows this convention.

**Certificat**: a formal attestation, issued under authority, that carries legal weight. **Numérique**: digital, machine-readable, cryptographically verifiable. **de Métrologie Légale**: of legal metrology, the field of measurement regulation that ensures instruments used in trade, health, safety, and environmental protection meet statutory requirements.

## What it is

CNML is the digital certificate format for OIML type approvals. Every measuring instrument placed in legal use in an OIML member state must hold a type-approval certificate attesting that its design meets the requirements of the relevant OIML Recommendation. CNML digitizes that certificate: the evaluation results, the issuing authority's signature, the scope of approval, and the chain of authority from the OIML root down to the individual instrument.

The format was produced under the OIML SMART programme by analyzing every existing published OIML-CS Type Approval certificate and digitizing the resulting model. It covers all 22 OIML Recommendations governing measuring instruments used in trade, health, safety, and environmental protection.

## What it enables

**Verifiable type approvals.** Every certificate carries a threshold signature from a distributed quorum of signers. Any party can verify the certificate in a browser, offline, without contacting the issuer, registering for a service, or holding an account.

**Signed measurements.** The certificate chain extends to the individual instrument. Each instrument signs its measurements with an attested key, binding every reading to the type approval that authorizes it. A regulator can challenge the instrument for a fresh, nonce-bound measurement; a counterfeit cannot answer.

**Public transparency.** Every certificate issued appears in a public transparency log, with tree roots anchored to Bitcoin through OpenTimestamps. No certificate can be silently issued or retroactively inserted. The log is the public record that the mutual-recognition framework needs.

**Individual accountability.** Each evaluator signs their work. A tester credential, scoped to specific Recommendations, binds the evaluation results to the person who produced them. When a result is wrong, the signature identifies the responsible individual.

**Instant field verification.** A market-surveillance officer scans a QR code on the instrument body. The passport page loads: device identity, certificate chain, Recommendation, revocation status. Three seconds. Offline.

## The authority chain

The chain runs from the OIML root through issuing authorities and manufacturers to the individual instrument:

1. **OIML / BIML Root**: threshold-signed by a 5-of-7 director quorum. Delegates type-approval authority to issuing authorities.
2. **Issuing Authority**: scoped to specific Recommendations. Issues type-approval certificates and delegates signing authority to test laboratories and manufacturers.
3. **Test Laboratory**: signs evaluation reports. **Manufacturer Model**: receives a delegated signing key for a specific instrument model.
4. **Manufacturer Instance**: per-device certificate binding serial number, firmware hash, and calibration data to the model certificate.
5. **Signed Measurements**: every measurement signed by the instrument's attested key, timestamped against Bitcoin, traceable to its calibration state.

A certified tester credential branches from the issuing authority, binding individual evaluators to the Recommendations they are authorized to test.

## Standards

CNML builds on established international standards: X.509 v3 certificates, W3C XMLDSig signatures, threshold cryptography (FROST, CMP20), NIST FIPS 204 post-quantum signatures, RFC 6962 Certificate Transparency, and OpenTimestamps. Measurement units trace to the BIPM Digital SI framework. The full standards list is on the [technology page](technology).

CNML is complementary to the Digital Calibration Certificate: CNML operates at the type-approval tier, the DCC operates at the calibration tier. An instrument typically holds both.

CNML is specified as a domain profile of the SIGNATIF trust-infrastructure framework (ISO/TC 154 working draft): the delegation hierarchy, the dimensional attestation model, the transparency requirements, and the verification pipeline follow the framework's normative structure, instantiated for legal metrology. The claimed conformance classes and their evidence are in the [CNML profile of SIGNATIF](/docs/specifications/signatif-profile).

## Further reading

- [Why CNML](why-cnml): the case for adopting the format.
- [How it works](how-it-works): the five-tier hierarchy and verification pipeline.
- [Technology](technology): the standards and cryptographic algorithms.
