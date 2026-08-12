---
title: For verifiers
description: Verification flow, offline trust-anchor distribution, CRL refresh, library integration, and market-surveillance terminal deployment for CNML verifiers.
---

# For verifiers

This document covers the verification flow for a CNML certificate, the offline trust-anchor distribution model, the CRL refresh procedure, the integration of CNML verification into existing software, and the deployment of market-surveillance terminals. It is written for market-surveillance authorities, customs officers, conformity-assessment bodies, and any party that needs to verify a CNML certificate.

CNML is a proposal for OIML from the OIML SMART programme. The verification model described here is a draft architecture. The trust-anchor distribution, the CRL mechanism, and the library interfaces are subject to revision as the proposal evolves.

## The verification flow

A verifier opens the Verify page in the web application and submits a CNML certificate file. The application runs the seven-check verification pipeline and renders the result of each check.

![Verification flow](/diagrams/verification-flow.svg)

The pipeline runs the following checks in order. The verifier checks that the file is well-formed XML. It checks that the XML conforms to the CNML XSD schema and to the per-Recommendation JSON Schema. It checks that the XMLDSig signature is mathematically correct, confirming that the file has not been tampered with after signing. It checks that the recommendation identifier in the certificate falls within the scope of the Issuing Authority that signed it, reading the scope from the `oimlAuthorizedRecommendations` X.509 v3 extension or from the `trust-anchors.json` manifest. It checks that the certificate has not been revoked, by consulting the CRL published by the issuing IA. It checks that the certificate carries a valid OpenTimestamps proof or RFC 3161 time-stamp token. It checks that the certificate appears in the public transparency log.

A failure at any step short-circuits the pipeline and shows the reason. The verifier renders the certificate's details on success: the recommendation, accuracy class, classification symbol, issuer, applicant, manufacturer, all measurement characteristics, test reports, and revision history.

The verification pipeline is developed in detail in [Verification pipeline](/docs/implementation/verification-pipeline).

## Offline trust-anchor distribution

CNML is designed for offline-first verification. A verifier that has loaded the trust-anchor bundle can verify certificates without an internet connection, with the exception of transparency-log inclusion proofs that require a network round-trip to the log server. The trust-anchor bundle is a small file (approximately ten kilobytes) that contains the root certificate, the IA intermediate certificates, the scope manifest, and the current CRL for each IA.

The trust-anchor bundle is distributed through three channels. The first channel is a static asset served from the BIML CDN, fetchable over HTTPS. The second channel is the transparency log itself, whose tree head embeds the current trust-anchor hash. The third channel is the printed OIML Annual Report, which publishes the root certificate fingerprint for out-of-band verification. A verifier operating in a fully air-gapped environment can receive the bundle on a USB stick and update it on a monthly cadence.

Once the bundle is loaded, all signature checks, scope checks, and CRL checks work offline. The timestamp check works offline because the OpenTimestamps proof is embedded in the certificate and anchors to the Bitcoin block hash, which the verifier validates locally. The transparency-log inclusion check requires network access to fetch the current log head, unless the verifier operates its own log mirror.

## CRL refresh

Each IA publishes a Certificate Revocation List (CRL) that lists the serial numbers of certificates revoked before their natural expiration. The CRL is signed by the IA and carries a next-update timestamp. The verifier checks the certificate's serial number against the CRL during the CRL check in the pipeline.

The verifier caches the CRL locally. When the verifier encounters a certificate, it checks the cached CRL. If the cached CRL's next-update timestamp has passed, the verifier warns that the CRL is stale but does not fail the verification. This graceful-degradation rule ensures that a verifier operating offline or with intermittent connectivity can continue to verify certificates, while surfacing the staleness to the operator.

The CRL refresh cadence is monthly. A verifier with internet connectivity fetches the current CRL from the IA's CRL distribution point (listed in the IA intermediate certificate) on a monthly schedule. A verifier operating in an air-gapped environment receives the updated CRL through the same USB-stick mechanism used for the trust-anchor bundle.

## Library integration

CNML verification is available through open-source libraries for verifiers that need to integrate certificate checking into their existing software.

The library `@oiml/cnml-crypto` provides signature verification, scope checking, CRL parsing, OpenTimestamps validation, and transparency-log inclusion checking. It runs in the browser and in Node.js. The library is the same code that powers the web application's Verify page, so a verifier that integrates the library gets the same verification behavior as the web application.

The Ruby library `oiml_pki` provides server-side verification through the same check pipeline. It is the library that powers the air-gapped CA server, and it can be embedded in a verifier's server-side application.

The Confium Rust crates provide native verification for high-throughput and embedded deployments. The Confium threshold-cryptography substrate is described in [Confium integration](/docs/architecture/confium-integration).

CNML does not provide a REST verification API by design. The verification model is offline-first, and a verifier that wraps the library in a service can build its own API surface. This design ensures that the verification logic runs in the verifier's trust boundary, not in a remote service.

## Market-surveillance terminal deployment

A market-surveillance terminal is a workstation used by a market-surveillance authority to verify CNML certificates in the field. The terminal runs the web application locally (served from the local filesystem or from an intranet server) and carries the trust-anchor bundle and the current CRL in local storage. The terminal does not require internet access for day-to-day verification.

Deploying a market-surveillance terminal involves the following steps. The trust-anchor bundle is loaded onto the terminal from the BIML CDN or from a USB stick. The current CRL for each IA is loaded alongside the bundle. The web application is served locally, either from a static-file server or from a packaged desktop application. The terminal operator verifies certificates by opening the Verify page and submitting the certificate file.

A terminal deployed in a fully air-gapped environment (a customs post, a market-surveillance field office, a laboratory inspection site) verifies certificates without any network connectivity. The operator updates the trust-anchor bundle and the CRL on a monthly schedule by receiving a USB stick from the central authority, or by connecting the terminal to an intranet update server.

## What the verifier confirms

The CNML verifier confirms the following properties of a certificate. The certificate was signed by a key that chains to a trusted root. The certificate's recommendation identifier falls within the scope of the issuing IA. The certificate has not been revoked. The certificate was signed at a time that falls within its validity period, as confirmed by the embedded timestamp proof. The certificate appears in the public transparency log.

The verifier does not confirm the following. The verifier does not confirm the legal validity of the certificate, which is a separate regulatory question. The verifier does not confirm that the physical instrument matches the certificate, which is a separate physical-inspection question. The verifier does not confirm that the IA's evaluation decision was correct, which is an institutional question for the DoMC framework.

## Common verification questions

### How does a verifier confirm that a certificate is not revoked?

The verifier checks the certificate's serial number against the CRL published by the issuing IA. The CRL is signed by the IA, timestamped, and cached locally. If the serial number appears on the CRL, the certificate has been revoked. If the CRL is stale (its next-update timestamp has passed), the verifier warns but does not fail, allowing continued operation with a flagged caveat. Revocation events are also recorded in the public transparency log, and a verifier that subscribes to the log receives revocation notifications.

### How does a verifier operate without internet access?

The verifier loads the trust-anchor bundle and the current CRL onto the local machine. All signature checks, scope checks, and CRL checks work offline. The timestamp check works offline because the OpenTimestamps proof anchors to the Bitcoin block hash, which the verifier validates locally. Only the transparency-log inclusion check requires network access, and a verifier that operates its own log mirror or accepts embedded inclusion proofs can verify offline.

### How does a verifier integrate CNML checking into existing software?

The verifier integrates one of the available libraries into the existing verification application. The libraries provide the same check pipeline that the web application runs. The verifier wraps the library's API in its own application surface.

## See also

- [Verification pipeline](/docs/implementation/verification-pipeline) describes the seven-check pipeline in detail.
- [Transparency and audit](/docs/architecture/transparency) describes the Merkle transparency log that the inclusion check verifies against.
- [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml) covers the IA and BIML operational model from the issuer's perspective.
