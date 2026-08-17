---
title: QR code delivery
lede: Non-SMART instruments receive a QR code on the device body encoding the passport URL. Scanning opens the certificate identity and verification status.
coord: FEAT / 05
---

# QR code delivery

## Mechanism

CNML certificates reach the field through two delivery paths. SMART Measuring Instruments receive their certificates through the twin GraphQL interface (see the SMI interface feature page). Non-SMART instruments, which include the majority of the installed fleet for the foreseeable transition period, receive a QR code printed on the device body.

The QR code encodes the passport URL of the certificate. The passport URL resolves to a passport endpoint that serves the certificate identity, the issuer, the OIML Recommendation, the type designations, the issuance date, and the current validity status. The endpoint is a read-only projection of the CNML file: it does not expose the full signed XML, only the fields a verifier or inspector needs at the point of inspection.

The QR code is generated when the instance certificate is issued. The manufacturer's signing software requests a passport URL from the passport endpoint, the endpoint allocates the URL, and the signing software embeds the URL in a QR code conforming to ISO/IEC 18004 (the QR code symbology standard). The QR code is then applied to the instrument nameplate or an adjacent durable surface.

Scanning the QR code with any smartphone camera opens the passport URL in the device browser. The passport page presents the certificate identity and a verification status. A verifier who needs the full cryptographic check downloads the CNML file from a link on the passport page and runs the standard verification pipeline.

## Why this design


The passport carries the certificate identifier, the device
identity, the certificate chain summary, the scope summary (the
Recommendation), the validity period, and the revocation status, in
HTML for people and JSON-LD for machines, satisfying the framework's
passport requirements.

The QR code path exists because the installed fleet of legal-metrology instruments is not uniformly SMART-capable. A load cell installed in a weighbridge, a measuring element sealed inside a fuel dispenser, or a pressure gauge built into an industrial assembly has no network interface and will not acquire one. The certificate still needs to be reachable at the instrument. The QR code is the bridge between the digital certificate and the physical device.

The passport endpoint, rather than a direct link to the signed XML, separates the inspector-facing summary from the cryptographer-facing file. An inspector scanning a QR code on a weighbridge at a grain elevator needs the validity status in one screen. The signed XML and the verification pipeline are one click further, available to anyone who needs the full check.

## Operational consequence

A market-surveillance officer scanning a QR code on an instrument in the field sees the certificate identity and status without specialist software. The passport page identifies the issuer, the type approval number, the OIML Recommendation, and whether the certificate is currently valid or revoked. The officer can act on that summary immediately.

The QR code is durable. Once printed on the instrument, the certificate is reachable for the service lifetime of the device without any update to the QR code itself. The passport endpoint is the stable resource. If the certificate is re-issued or superseded, the passport page reflects the new state.

## See also

- [For verifiers](../audiences/verifiers) covers the field-verification flow including QR scanning.
- [SMI interface](../features/smi-interface) describes the SMART-instrument delivery path that shares the passport projection.
- [For manufacturers](../audiences/manufacturers) walks the instance signing and QR printing flow at the production line.
- The passport endpoint and QR generation are implemented as part of the certificate operations flow described in [For IAs and BIML/CIML](../docs/roles/for-ias-biml-ciml). ISO/IEC 18004 is the QR code symbology standard.
