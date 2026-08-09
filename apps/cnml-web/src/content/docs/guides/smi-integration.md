---
title: SMI integration
coord: GUIDE / 05
---

# SMI integration

This guide covers how CNML connects to the SMART Measuring Instrument
(SMI) ecosystem through the twin GraphQL interface.

## The boundary

Per ADR-0006, CNML owns the certificate and SMI owns the instrument's
attestation. The boundary is the certificate itself:

- **CNML** exports: `verifyCnmlXml()`, `runChecks()`, the check
  registry, CRL checking, the passport endpoint, trust anchor bundles
- **SMI** imports these and builds: signed measurements, calibration
  attestation, compliance monitoring, deviation surveillance, twin
  projection

CNML does not define the measurement format or the compliance engine.
Those are SMI concerns.

## The twin GraphQL interface

A SMART Measuring Instrument exposes a digital twin at a `/twin`
GraphQL endpoint. The twin carries three fields relevant to CNML:

- `get_indication`: the current measurement reading
- `watch_state`: the instrument's state changes
- `Provenance`: the CNML instance certificate reference

The twin client queries `Provenance` alongside `get_indication`, so
any measurement read can be accompanied by a check of the
certificate that authorizes the instrument for legal use.

## The passport projection

The passport endpoint serves the same read-only view to both
QR-scanning inspectors and twin-querying management systems. A single
projection serves both paths:

- The QR code on the device body resolves to the passport HTML page
- The twin's `Provenance` field carries the certificate reference
  that resolves to the passport JSON-LD

The compliance monitoring loop (continuously checking indications
against certificate validity) is an SMI concern, not a CNML concern.
CNML provides the certificate reference and the passport projection.

## Next steps

- [SMI interface feature](/features/smi-interface) for the
  design rationale.
- [CNML and SMI boundary](/docs/architecture/system) for how
  the layers fit together.
