# ADR-0006: CNML and SMI responsibility boundary

## Status

Accepted (2026-08-07).

## Context

The CNML project and the SMI (SMART Measuring Instrument) project are
separate codebases under the OIML SMART programme. The SMI full-chain
explainer (CIM 2027 extended abstract) describes capabilities — signed
measurements, calibration attestation, continuous compliance, challenge-
response, deviation surveillance — that build on top of CNML but are
not part of CNML.

An initial implementation placed the signed measurement format and
calibration attestation types in `packages/smi-attest/` inside the
CNML repo (PR #16, TODOs 79-80). On review, this was wrong: the SMI
capabilities belong in the SMI project at `~/src/oimlsmart/smi/`, not
in CNML. The CNML repo's job is the certificate; the SMI repo's job
is the instrument.

## Decision

**CNML owns the certificate. SMI owns the instrument's attestation.**

The boundary is the certificate itself:

### CNML owns (and exports for SMI to consume)

- Certificate format (XML + per-Recommendation JSON Schemas)
- Certificate issuance (CA server, threshold signing, key management)
- Certificate verification (the 7-check pipeline)
- Certificate delivery (QR codes, passport endpoint, trust anchors)
- Instance certificate format (tier 5: binds serial, firmware, model)
- Trust anchor bundle distribution (`/trust-anchors.json`)

### SMI owns (builds on top of CNML)

- Signed measurement format (`SignedMeasurement` type)
- Calibration attestation format (`CalibrationAttestation` type)
- Challenge-response protocol (nonce-bound measurements)
- Continuous compliance engine (re-judges requirements against twin)
- Deviation surveillance (population-scale anomaly detection)
- Twin governed projection (Recommendation-scoped twin interface)
- Evidence persistence (on-device + durable store)
- Operator co-signature (multi-party attestation)
- Twin certification program (TW-1)

### What CNML exports FOR SMI

CNML's `@oimlsmart/cnml-crypto` package provides the APIs SMI needs:
- `verifyCnmlXml()` — verify a signed CNML document
- `runChecks()` — the full 7-check pipeline
- The check registry (extensible for SMI-specific checks)
- CRL checking (`crlCheck` module)
- Certificate chain parsing

CNML's passport endpoint provides:
- The instance cert's fields (serial, firmware, manufacturer, model)
- The certificate chain
- The revocation status
- A verify URL

SMI imports these and builds its measurement verification on top.

## Consequences

**Easier:**
- Each project has a clear scope. Changes to the measurement format
  don't require a CNML release; changes to the certificate format
  don't require an SMI release.
- The `packages/smi-attest/` code in CNML serves as a reference
  implementation. The canonical copy lives in the SMI project.

**Harder:**
- Cross-project coordination: SMI depends on CNML's published types.
  A CNML breaking change requires an SMI update.
- The `@oimlsmart/smi-attest` npm package should be published from the SMI
  project, not from CNML. The CNML copy is a reference.

## The `packages/smi-attest/` package

The code at `packages/smi-attest/` (TODOs 79-80) was placed in CNML
for convenience during the initial design. Its canonical home is the
SMI project. The CNML copy stays as a reference implementation and
is marked as such in its README. When the SMI project publishes
`@oimlsmart/smi-attest` from its own repo, the CNML copy is removed.

## References

- SMI explainer: `../cim-2027/oiml-smi-full-chain-explainer.html`
- CNML instance certificates: TODO.cnml/08
- CNML passport endpoint: TODO.cnml/10, TODO.cnml/25
- The misplaced smi-attest: TODO.cnml/79, TODO.cnml/80
