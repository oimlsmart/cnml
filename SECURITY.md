# Security policy

## Reporting a vulnerability

Do not open a public GitHub issue for a security vulnerability.

Report vulnerabilities through one of these private channels:

1. **Preferred:** use the GitHub Security Advisory feature on this
   repository. The
   [Report a vulnerability](https://github.com/oimlsmart/cnml/security/advisories/new)
   tab opens a private channel to the maintainers.
2. **Alternative:** email the OIML SMART programme security contact.
   The BIML secretariat coordinates technical engagement with the
   programme.

Include the following in the report:

- A description of the issue and its impact.
- The affected component (the format, the TypeScript verifier, the
  Ruby CA server, the test vectors, or the site).
- A reproduction step or a proof-of-concept. If the proof-of-concept
  is too large for an attachment, share a hosted URL via the private
  channel.
- The reporter's preferred acknowledgement name (or "anonymous").

## Response timeline

- **Acknowledgement:** within 5 working days.
- **Initial assessment:** within 30 days, including a severity rating
  and a fix plan.
- **Fix release:** as soon as practical given the severity. A critical
  signature-verification bypass is treated as urgent; a minor
  documentation typo is not.
- **Public disclosure:** after the fix is released, in the release
  notes. The reporter is acknowledged on request.

## Scope

**In scope:**

- The CNML format specification.
- The TypeScript implementation (`packages/`).
- The Ruby CA server (`oiml-pki-server/`).
- The web application (`apps/cnml-web/`).
- The test vectors (`packages/cnml-test-vectors/`).
- The per-Recommendation schemas (`packages/cnml-schemas/`).

**Out of scope** (report to the upstream maintainer):

- The Confium threshold-cryptography core. Report to the confium
  repository.
- Third-party dependencies (`xmldsigjs`, `pkijs`, `marked`, `qrcode`,
  etc.). Report upstream and we will track the issue here pending a
  fix.
- The OIML SMART org site infrastructure. Report to
  `oimlsmart/oimlsmart.github.io`.

## Threat model summary

The CNML format distributes signing authority across multiple
independent parties using threshold cryptography. A single compromise
does not produce a forged certificate. The verify pipeline runs in
the browser without contacting the issuer. The transparency log
makes covert issuance detectable.

The most likely vulnerabilities are:

- **Signature-verification bypass.** A bug in the verify pipeline
  that accepts a malformed signature. High severity.
- **Scope-extension forgery.** A bug that lets an IA sign outside
  its DoMC scope. High severity.
- **CA-server key compromise.** A path that exposes the CA's private
  key material. Critical.
- **Cross-site scripting on the verifier.** An attacker who can run
  scripts on the verify page can read the dropped file's contents.
  Medium severity (the file is gone when the page unloads).
- **CSP evasion.** The Content-Security-Policy has `style-src
  'unsafe-inline'` for Astro's scoped styles. Script injection is
  still blocked.

## Rewards

There is no bug-bounty programme. Verified vulnerabilities are
acknowledged in the release notes on request.
