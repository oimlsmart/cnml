---
title: 'For manufacturers'
lede: 'The IA delegates per-model signing authority to the manufacturer. The manufacturer signs an instance certificate for each individual device and delivers it by QR code or through the SMI twin.'
coord: 'AUD / 03'
---

## The world today

A manufacturer that produces an instrument subject to legal metrology obtains a type approval from an Issuing Authority. The type approval covers the model. Each individual instrument that comes off the production line carries a nameplate, a serial number, and a reference to the type approval. The reference on the instrument is a printed marking. A verifier who inspects the instrument reads the marking and trusts that the instrument conforms to the approved model.

The gap between the model approval and the individual instrument is not closed cryptographically. The marking is a claim, not a proof. A market-surveillance inspector who questions whether a specific serial number was produced under the approved model has no mechanism short of correspondence with the manufacturer and the IA.

## What changes

CNML closes the gap with the manufacturer instance certificate. The IA issues a manufacturer model certificate (tier four) that delegates signing authority for a specific model to the manufacturer. The delegation is carried in the X.509 v3 scope extension on the model certificate. The manufacturer then generates a signing key and signs an instance certificate (tier five) for each individual device produced.

The instance certificate binds the serial number, the firmware hash, the manufacturing date, and the calibration data to the certificate chain. The chain runs from the instance certificate through the manufacturer model certificate, through the IA intermediate, to the OIML Root. A verifier that reaches the instance certificate can validate the entire chain in a browser.

The instance certificate is delivered to the instrument. For non-SMART instruments, the manufacturer prints a QR code on the device body that encodes the passport URL `https://www.oimlsmart.org/cnml/passport/<instance-cert-id>`. A market-surveillance officer scans the QR code and reaches a page that serves the certificate chain, the revocation status, and a verification link. For SMART instruments, the instance certificate reference is carried by the instrument twin in the Provenance field, and the passport endpoint serves the full certificate.

## What it looks like in practice

The IA issues the manufacturer model certificate at `/issue/per-recommendation` with the delegation scope extension set to the manufacturer and model. The manufacturer receives the certificate and imports it into the app.

The manufacturer generates a signing key in the app at `/keys`. The key can be held in browser IndexedDB (encrypted under AES-GCM with a PBKDF2-derived passphrase) or in PKCS#11 hardware for higher throughput.

For each device produced, the manufacturer runs the instance signing flow at `/issue/manufacturer-instance`. The manufacturer enters the serial number, the firmware hash, the manufacturing date, and the calibration data. The app signs the instance certificate with the manufacturer key and produces the CNML file. The manufacturer prints the QR code at `/qr-code`, which encodes the passport URL for the instance certificate identifier.

The SMART instrument path connects the instance certificate to the twin. The twin serves a GraphQL endpoint at `/twin` that exposes the governed aspects of the instrument state. The Provenance field on the twin carries the instance certificate reference. The passport endpoint serves the full certificate for verifiers that reach the instrument through the twin.

## Proof

The instance certificate chain validates end to end. The verify page at `/verify` runs the seven-check pipeline on an instance certificate, which includes the scope check that validates the manufacturer delegation and the IA authorization. The test vectors exercise the per-Recommendation schema coverage at the model tier. The QR code path and the passport endpoint are exercised by the e2e test suite.

## Your next step

Read the [system architecture](../docs/architecture/system) for the five-tier hierarchy, then read the [hardware key tiers](../docs/architecture/hardware-tiers) page for the PKCS#11 model that applies to the manufacturer signing key.
