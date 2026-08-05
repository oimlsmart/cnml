# TODO.FULL/01 — BIML Root certificate issuance (sample)

## Problem

The current app handles only one kind of certificate: the per-Recommendation
CNML signed by a single signer. The user requires three distinct scenarios,
each on a separate page. This file tracks the first scenario: the BIML Root
certificate, threshold-signed by 5-of-7 directors.

## Scenario

A BIML Root certificate is the apex of the CNML certificate hierarchy. It
is the trust anchor that all other CNML certificates chain to. In production
it is signed by 5 of 7 OIML directors via FROST threshold signing. For this
sample, the user generates 7 director keys, selects 5 to participate, and
each produces an individual signature over the root certificate payload.
The combined signature is bundled into the output document.

## Scope

- Page route: `/issue/biml-root`
- Vue island: `apps/cnml-web/src/islands/issuing/BimlRootFlow.vue`
- Astro page: `apps/cnml-web/src/pages/issue/biml-root.astro`

## Implementation status

Shipped in this branch. The page generates 7 ECDSA P-256 keypairs, allows
the user to select 5 of 7, signs the root certificate payload with each
selected key, and produces a downloadable JSON bundle containing the
certificate XML, the participant list, the individual signatures, and the
aggregate public key set. The signing is multi-party individual ECDSA, not
FROST threshold signing. Production threshold signing will swap in Confium
WASM when that binding is wired.

## Tests

- Build: the route produces a page
- Flow: generate 7 directors, select 5, sign, download JSON
- Output: the JSON contains 5 signature entries

## See also

- TODO.FULL/02 for IA intermediate issuance
- TODO.FULL/03 for per-Recommendation CNML issuance
