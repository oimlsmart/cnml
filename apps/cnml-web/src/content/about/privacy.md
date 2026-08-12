---
title: 'Privacy notice'
lede: 'The CNML site does not collect personal data. Files dropped onto the verify page and certificates entered into the QR generator are processed entirely in the browser.'
coord: 'ABOUT / 07'
---

This privacy notice describes what the CNML web application at `https://www.oimlsmart.org/cnml/` collects, what it processes locally, and what third-party content it loads. The notice is short because the answer to most of those questions is "nothing".

CNML is a proposal for OIML from the OIML SMART programme. The privacy posture described here is part of the proposal.

## What the site collects

Nothing.

The site uses no cookies. It runs no analytics. It loads no third-party trackers. The GitHub Pages hosting layer logs aggregate HTTP requests for operational purposes; those logs are not attributable to individuals and are not under this project's control.

The site does not set any `localStorage` keys except the user's theme preference (`cnml-theme`, set to `light` or `dark`). The key is read on every page load and is never transmitted anywhere.

## What the site processes locally

The verify page processes dropped CNML files entirely in the browser. The file is parsed by the in-page XML parser, validated against the schema, and the signature is verified against the trust anchor bundle. The file's content never leaves the user's device. There is no upload step.

The QR code generation page encodes a user-typed certificate identifier into a QR matrix using a pure-JavaScript library. The encoding runs locally. No third-party API is called (the previous implementation called `api.qrserver.com`; no external API is called).

The key management page generates, stores, and uses cryptographic signing keys in the browser. The private key is encrypted with a passphrase-derived AES-GCM key and stored in browser-local encrypted storage. The private key is never transmitted.

## What the site loads from external sources

Nothing.

Fonts are bundled into the site at build time. No request to any third-party font host is made. The verify page's trust anchor bundle is a static JSON file served from the same origin.

The site's external links (to the OIML website, the W3C, the IETF, the NIST, the PTB, and the GitHub repository) are conventional anchor tags. The user's browser follows them on click. No content from those sites is embedded.

## Service worker

A service worker is registered on the verify page only. The worker caches the verify page, its JavaScript and CSS bundles, and the trust anchor bundle. The cache lives on the user's device. The worker does not transmit any data; it serves as an offline cache for the verify page.

The worker can be uninstalled by clearing the browser's site data, or it expires when a new version of the worker replaces it (the cache version increments when the worker logic changes).

## Third-party content

The site embeds no third-party content. There are no embedded videos, no social-media widgets, no comment systems, no advertising, no analytics. The site's only outbound requests are static asset fetches from the same origin.

## Contact

Privacy questions are welcome through the standard GitHub issue channel:

1. Open an issue at `https://github.com/oimlsmart/cnml/issues`.
2. Use the **Question** template, or any template if a specific one is not appropriate.
3. Tag the issue with the **privacy** label.

For sensitive questions, use the GitHub Security Advisory mechanism described in the security policy.

## See also

- [Accessibility statement](accessibility) documents the WCAG 2.1 conformance posture.
- [Contact](contact) describes the engagement channels for the OIML SMART programme.
- [Security policy](https://github.com/oimlsmart/cnml/blob/main/SECURITY.md) (at the repo root) describes vulnerability reporting.
