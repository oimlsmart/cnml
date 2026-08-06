---
title: SMI interface
lede: SMART Measuring Instruments receive their certificates through a twin GraphQL interface. The twin carries the CNML reference and the live compliance status.
coord: FEAT / 06
---

# SMI interface

## Mechanism

A SMART Measuring Instrument (SMI) is a measuring instrument with a network interface and a digital twin. The twin exposes a GraphQL endpoint through which the instrument and its management system exchange indication data, state changes, and provenance. CNML connects to the SMI ecosystem through the twin's `Provenance` field.

The twin's `Provenance` type carries the CNML instance certificate reference. The reference resolves to a passport projection that presents the certificate identity, the issuer, the OIML Recommendation, the type designations, and the current validity status. The twin client queries `Provenance` alongside `get_indication` and `watch_state`, so any indication read can be accompanied by a check of the certificate that authorizes the instrument for legal use.

The passport projection served to the twin is the same read-only view served to a verifier scanning a QR code. The projection is a stable interface: it presents the certificate identity and status without exposing the full signed XML. The full CNML file remains available for cryptographic verification through a link on the passport page.

The connection between CNML and the SMI ecosystem is read-only at the certificate layer. The certificate authorizes the instrument model for legal use; the twin reports the instrument's live indication and state. Compliance monitoring combines the two: an indication read is meaningful under legal-metrology rules only when the instrument holds a valid CNML type approval.

## Why this design

The twin interface was chosen because it is the canonical integration point for SMART instruments. SMART instruments already speak GraphQL through their twins for indication and state. Adding `Provenance` to the schema, rather than inventing a separate certificate-lookup protocol, keeps the integration inside the existing SMI architecture.

The passport projection, shared with the QR code path, is the second design decision. A single read-only view of the certificate serves both the QR-scanning inspector and the twin-querying management system. The certificate layer does not maintain two projections and does not risk drift between the field view and the SMI view.

## Operational consequence

An SMI that reports an indication through its twin also reports the CNML certificate that authorizes it. A management system that reads indications can verify the authorization in the same query. The compliance status is live: if a certificate is revoked, the passport projection reflects the revocation, and the twin's next `Provenance` read carries the new status.

The full compliance monitoring loop, in which indications are continuously checked against certificate validity and scope, is part of the OIML SMART instrument ecosystem rather than part of CNML itself. CNML provides the certificate reference and the passport projection. The monitoring policy that decides what to do when an instrument's certificate lapses is defined at the SMI layer.

## See also

- [QR code delivery](../features/qr-code-delivery) describes the non-SMART delivery path that shares the passport projection.
- [For verifiers](../audiences/verifiers) covers the verification flow that the passport projection feeds.
- [System architecture](../docs/architecture/system) places the SMI interface in the overall certificate model.
- The OIML SMART instrument ecosystem defines the twin GraphQL schema and the compliance monitoring loop.
