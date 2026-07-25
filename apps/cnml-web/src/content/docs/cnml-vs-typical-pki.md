# How CNML PKI differs from a typical (web TLS) PKI

Most developers meet PKI through TLS certificates — Let's Encrypt, browser
root stores, ACME automation. The CNML PKI looks superficially similar
(X.509 certs, CRLs, chain validation) but the threat model, economics,
and operational tempo are completely different. This doc explains the
differences and why CNML makes the architectural choices it does.

## At a glance

| Concern | Typical web PKI (TLS) | CNML PKI |
|---------|----------------------|----------|
| **What's signed** | Server identity + public key | A complete certificate document (CNML XML) |
| **Issuance volume** | Billions (mass-issued via ACME) | ~880 total (manually approved, one per instrument type) |
| **Cert lifetime** | 90 days (Let's Encrypt) – 2 years | 2 years (signer) – 25 years (root) |
| **CA location** | Cloud (online, ACME API) | Air-gapped (offline Ruby server, USB data transfer) |
| **CA operator** | Automated bot | Human (BIML staff, IA operators) |
| **Trust distribution** | Browser root stores (Chrome, Firefox, etc.) | Static JSON manifest via GitHub Pages CDN |
| **Revocation** | OCSP / CRLs (mostly OCSP for TLS) | CRLs only (offline verifiers can't reach OCSP) |
| **Identity proof** | Domain control (TXT record, HTTP challenge) | Legal entity verification via OIML DoMC |
| **Authorization scope** | All certificates issued by the CA | Cryptographically scoped per Recommendation |
| **Algorithm policy** | RSA-2048 (legacy) / ECDSA P-256 | ECDSA P-256 today; Ed25519 + ML-DSA-65 hybrid coming |
| **Key storage (CA)** | HSM (cloud provider) | Yubikey/HSM in physical safe (operator-controlled) |
| **Key storage (signer)** | Web server filesystem | Browser IndexedDB (encrypted at rest) |
| **Verification network** | Online (must reach OCSP / CT) | Offline-capable (CDN bundle for air-gapped verifiers) |
| **Audience** | Every browser, every device | Issuing Authorities, verifiers, OIML DoMC participants |
| **Transparency** | Certificate Transparency logs (public) | Trust anchors public; certs themselves not published |
| **Cost of issuance** | Free (Let's Encrypt) – $几百/yr (commercial) | Operational (staff time, hardware) — no per-cert fee |

## Why the differences exist

### 1. Document signing, not channel authentication

A TLS cert authenticates a server for the duration of a connection. The cert's job ends when the TLS handshake completes. A CNML cert authenticates a **document** — the certificate file is the artifact, signed once, distributed and verified independently for decades.

This means:
- The signed payload is large (multi-KB XML, not a few handshake bytes)
- Verification happens at unpredictable times (point of sale, audit, court) — possibly years after signing
- The cert chain must be re-verifiable forever (long-term archival concern)
- Algorithm lifetime matters: 25-year root means algorithms must resist attack until 2051+

### 2. Low volume, high scrutiny

Let's Encrypt issues ~3.5M certs/day. CNML has issued ~880 total in 40
years. Every CNML issuance involves a human review of the underlying type
evaluation report. ACME automation is wrong here — we want a human in
the loop.

### 3. Legal authority, not domain control

TLS validates "you control example.com". CNML validates "you are legally
recognized by OIML as an Issuing Authority for these instrument
categories". The verification is bureaucratic (DoMC process, peer review
by other national metrology institutes) and slow (months). It cannot be
automated.

### 4. Air-gapped CA by default

The root CA's private key is the most valuable secret in the system.
Compromise = forge certificates for any instrument worldwide. Cloud
HSMs are good but they're online — a misconfigured IAM policy or 0-day
in the HSM firmware could leak the key. Air-gapping the CA (offline
Ruby server, USB-only data transfer) makes network exfiltration
impossible. The cost is operational friction (USB shuffling) — acceptable
given the low issuance volume.

### 5. Scope governance as a first-class concept

In TLS, a CA can issue a cert for any domain. Browsers don't enforce
per-CA domain restrictions. In CNML, BIML explicitly scopes each IA to
specific Recommendations (R60, R76, etc.). PTB cannot legitimately issue
R117 (fuel dispenser) certificates. The CNML PKI encodes this scope
cryptographically as an X.509 v3 extension on each intermediate CA cert.

### 6. Offline verification

A customs inspector at a remote border crossing may need to verify a
CNML with no internet. OCSP fails. CT log lookup fails. Even the CDN
might be unreachable. The CNML verifier downloads a trust-anchors bundle
once (cached) and can then verify CNMLs offline indefinitely (until CRL
refresh, which is monthly at most).

## Architectural consequences

These constraints drive specific design choices:

### Choice: Air-gapped Ruby CA server, not cloud API

The CA operator runs a local Sinatra web app on an offline machine. CSRs
arrive via USB; signed certs leave via USB. The keystore is an
AES-256-GCM-encrypted JSON file on the local disk. There is no network
path from the CA to the internet — Period.

### Choice: Static GitHub Pages CDN for trust anchors

Trust anchors (root CA cert, intermediate CA certs, CRLs) are published
to a static site served by GitHub Pages. Browsers fetch this once and
cache aggressively. No API, no server-side logic, no DDoS surface.

### Choice: Browser IndexedDB for signer keys

Each signer (a person at the IA) generates their ECDSA P-256 keypair in
their browser. The private key is encrypted with a passphrase-derived
AES-GCM key and stored in IndexedDB. The key never leaves the browser.
Trade-off: the signer is responsible for backups (export PEM, store in
password manager or on paper). HSM/Yubikey-backed browser signing is on
the roadmap.

### Choice: CRLs, not OCSP

OCSP requires the verifier to reach the CA's OCSP responder at verify
time. For offline verifiers this fails. CNML uses CRLs (signed lists of
revoked serial numbers) distributed via the same CDN as trust anchors.
Verifiers fetch the CRL once and use it for the next 30 days.

### Choice: Cryptographic scope extension on intermediate certs

The `oimlAuthorizedRecommendations` X.509 v3 extension encodes the
scope as an ASN.1 sequence of R-ids. Verifiers parse this and reject
CNMLs whose recommendation isn't covered. Belt-and-suspenders: the same
scope is also listed in the trust-anchors.json manifest.

### Choice: Long root lifetime (25 years), short signer lifetime (2 years)

The root is expensive to rotate (every IA needs to re-establish trust).
Signer keys are cheap to rotate (regenerate in browser, re-issue cert
from IA). The asymmetry drives different policies per layer.

## What CNML borrows from typical PKI

- **X.509 v3 cert format** — universal tooling (OpenSSL, pkijs, xmldsigjs)
- **CRL format** — same RFC 5280 structure
- **Chain validation algorithm** — same path-building logic
- **JSON Web Key / SPKI / PKCS#8 PEM formats** — same key encoding
- **XMLDSig** — same W3C standard for signing XML (used by SAML, SOAP, etc.)
- **Exclusive C14N** — same canonicalization algorithm

The crypto primitives are off-the-shelf. The architecture is what's
different.

## When this design is wrong

The CNML PKI is optimized for: low-volume, high-value, legally-binding,
offline-verifiable document signing. If you're building:

- **High-volume cert issuance** → use a cloud CA + ACME
- **Online-only verification** → use OCSP, it's fresher than CRLs
- **Channel authentication** → use TLS, not document signing
- **Public transparency** → use CT logs (CNML certs are private to the IA)
- **Per-request authorization** → use OAuth/JWT, not cert scope

## See also

- [BIML scope governance](/docs/biml-governance) — how scope is encoded and enforced
- [Cryptography](/docs/cryptography) — algorithms, key management
- [Trust model](/docs/trust-model) — who trusts whom, why
- Diagrams gallery — SVG comparisons
