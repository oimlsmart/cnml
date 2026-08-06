---
title: Scope governance
lede: An X.509 v3 extension binds each Issuing Authority to the OIML Recommendations it is authorized to issue. Enforcement is cryptographic and runs at four independent layers.
coord: FEAT / 03
---

# Scope governance

## Mechanism

Each Issuing Authority certificate carries an X.509 v3 extension that enumerates the OIML Recommendations the IA is authorized to issue certificates for. The extension is a structured OID-identified field in the certificate's `extensions` sequence. An IA scoped to OIML R60 (load cells) cannot produce a valid certificate under OIML R117 (measuring systems for liquids other than water) because the scope extension on the IA's certificate does not list R117.

The scope is bound to the certificate at issuance by BIML. BIML signs the IA intermediate certificate only after the OIML-CS DoMC framework authorizes the IA for the requested scope. Once signed, the scope extension is part of the certificate's cryptographic identity. Changing the scope requires a new certificate.

The verification pipeline reads the scope extension from the IA certificate presented in the trust chain. When the pipeline verifies a leaf certificate (a CNML type approval), it checks that the OIML Recommendation identified in the certificate's `recommendation` field appears in the scope of every CA certificate in the chain above it. A chain that violates scope fails the scope check and is rejected.

## Why this design

A policy-only scope model, in which the IA is trusted to stay within its authorization and the verifier takes the IA's word, concentrates the consequence of an IA error or compromise at the verifier. A scope violation discovered after issuance becomes a forensic matter. The cryptographic model moves the scope check into the verification pipeline, so a verifier rejects an out-of-scope certificate without needing to trust the IA.

The four-layer enforcement model is the second design decision. Scope is checked at BIML signing time (BIML refuses to sign an IA certificate requesting a scope the DoMC has not authorized), at IA issuance time (the IA's signing software reads its own scope and refuses to sign a certificate outside it), at the signer browser (the per-cert signing ceremony reads the scope and refuses to produce a signature outside it), and at the verifier (the verification pipeline checks the scope as part of the standard check sequence). An IA that attempts to issue out of scope is blocked at the first three layers; a verifier that receives such a certificate is blocked at the fourth.

## Operational consequence

Scope is a property of the cryptographic chain, not a documented understanding between BIML and the IA. A market-surveillance authority scanning a QR code on an instrument in the field runs the same scope check that BIML ran at issuance, with no additional configuration and no consultation with BIML.

The DoMC framework governs which IAs are authorized for which OIML Recommendations. CNML encodes the DoMC scope as a verifiable cryptographic attribute, so the institutional decision and the technical enforcement share one source of truth.

## See also

- [Verification pipeline](../docs/implementation/verification-pipeline) describes the check sequence including the scope check.
- [For Issuing Authorities](../audiences/issuing-authorities) walks the IA signing flow that the scope extension constrains.
- [System architecture](../docs/architecture/system) places the scope extension in the certificate hierarchy.
- [Scope enforcement flow](../diagrams/scope-enforcement-flow.svg) diagrams the four-layer model.
