# CNML PKI — System Architecture

## Purpose

The OIML CNML PKI enables cryptographically verifiable digital legal
metrology certificates. It replaces handwritten signatures on paper
certificates with hybrid Ed25519 + ML-DSA-65 digital signatures backed
by a full X.509 certificate chain.

## Trust hierarchy

```
OIML (legal entity, top authority)
  └─ BIML (operational arm in Paris)
       └─ Root CA (Ed25519 + ML-DSA-65, self-signed, 25-year validity)
            ├─ NMi Certin B.V. CA (NL1)
            │    └─ M.Ph.D. Schmidt (signer, Ed25519+ML-DSA, 2-year cert)
            │         └─ signs CNMLs for manufacturers
            ├─ PTB CA (DE1)
            │    └─ Dr. Härtig (signer)
            └─ NIM CA (CN2)
                 └─ (signer)
```

Authority flows downward. Each parent signs its children's certificates.
Manufacturers are certificate RECIPIENTS — they hold no keys and are
outside the PKI chain.

**See:** `docs/pki-diagrams/01-trust-hierarchy.svg`

## System architecture (three layers)

### Layer 1 — Offline CA operations

Two air-gapped machines, never connected to any network:

- **BIML's machine**: holds the Root CA private key. Signs intermediate
  CA certificates for each Issuing Authority. Signs root-level CRLs.
  Produces signed artifacts (certs, CRLs, trust-anchor manifests).

- **Each IA's machine**: holds their Intermediate CA private key. Signs
  end-entity certificates for individual signers within the authority.
  Signs IA-level CRLs when signer keys are compromised.

Both machines run a local web GUI (no terminal required). The operator
opens a browser to `http://localhost:4455` and clicks buttons. Data
leaves the machine via USB stick only.

**Frequency:** Root operations ~1-2×/year. IA operations monthly.

**See:** `docs/pki-diagrams/07-data-flow.svg`

### Layer 2 — Static CDN (publication)

PKI artifacts are published as static files via a git repository served
by a static hosting provider:

```
trust-anchors.json     ← signed list of trusted roots + intermediates
roots/oiml-root-ca.crt ← root CA certificate
intermediates/         ← one .crt per IA
crls/                  ← one .crl per IA (updated on revocation)
certs-index.json       ← OIML-CS cert statuses (Valid/Withdrawn)
tsa-keys/              ← public keys for timestamp verification
```

The git push IS the publication. Repository validation (automated)
checks every new cert is signed by a known CA and every CRL is fresh.
Free, zero infrastructure, CORS-enabled.

### Layer 3 — Browser (consumption)

Static web app deployed to CDN. Three audience-specific builds:

| Audience | What they do | Keys? |
|---|---|---|
| **Signer** | Generate key, create CSR, import cert, sign CNMLs | Yes |
| **Verifier** | Upload .cnml.xml, verify chain + CRL + status + signature | No |
| **Manufacturer / Public** | Browse certificates, verify | No |

The browser fetches PKI artifacts from the CDN (Layer 2), caches them
in IndexedDB for 24 hours, and falls back to bundled copies if the CDN
is unreachable.

**See:** `docs/pki-diagrams/02-system-architecture.svg`

## Algorithms

ALL levels use the same algorithm suite. No RSA. No ECDSA. No legacy.

| Level | Classical | Post-quantum | Total security |
|---|---|---|---|
| Root CA | Ed25519 | ML-DSA-65 | 128-bit classical + 128-bit PQ |
| Intermediate CA | Ed25519 | ML-DSA-65 | same |
| Signer | Ed25519 | ML-DSA-65 | same |
| CNML signature | Two XMLDSig signatures | — | Accept if either passes |

**Ed25519** (RFC 8032): 128-bit classical security. 32-byte keys.
64-byte signatures. Deterministic signing (no nonce-reuse risk).
Fastest standardised signature algorithm.

**ML-DSA-65** (NIST FIPS 204): ~128-bit post-quantum security. Lattice-
based. Resists Shor's algorithm. ~3300-byte signatures. ~1952-byte keys.

**Hybrid**: every signature operation produces both. If a future quantum
computer breaks Ed25519, ML-DSA still holds. If a lattice attack breaks
ML-DSA, Ed25519 still holds. Verifiers accept if EITHER is valid.

**See:** `docs/pki-diagrams/04-hybrid-signature.svg`

## Key and certificate lifecycle

Every key follows: **generation → certification → active use →
renewal (overlap) → retirement**.

| Key type | Lifetime | Storage | Backup | Renewal trigger |
|---|---|---|---|---|
| Root CA | 25 years | Air-gapped machine | 2× USB → 2 safes | Rollover ceremony at ~22 years |
| Intermediate CA | 10 years | Air-gapped machine | 1× USB → safe | New CSR to BIML at year 8 |
| Signer | 2-3 years | Browser IndexedDB | Encrypted PEM export | Expiry warning at 90/60/30 days |

During renewal, BOTH old and new keys/certs are valid (overlap period).
New CNMLs are signed with the new key. Old CNMLs still verify — their
cert chain + signature are embedded in each CNML file. After the old
cert expires, verifiers reject CNMLs claiming to be signed after the
expiry date. CNMLs genuinely signed during validity remain permanently
verifiable.

**See:** `docs/pki-diagrams/03-key-lifecycle.svg`

## Verification flow (7 steps)

When a verifier uploads a `.cnml.xml`:

1. **XML well-formed?** — parse as XML
2. **Schema valid?** — validate against CNML XSD
3. **Certificate chain?** — extract signer cert from XMLDSig KeyInfo,
   fetch intermediate CA cert from CDN, build chain to trusted root
4. **Cert not expired?** — check notBefore / notAfter
5. **Key not revoked?** — fetch CRL from CDN, check signer serial
6. **Certificate not withdrawn?** — fetch certs-index.json from CDN,
   check OIML-CS status
7. **Signature valid?** — verify BOTH Ed25519 and ML-DSA-65 signatures

Steps 3-6 fetch artifacts from the CDN (cached 24 hours). Step 7 checks
the dual XMLDSig signatures independently.

**See:** `docs/pki-diagrams/06-cert-chain-verification.svg`

## Two separate revocation mechanisms

| Mechanism | What it protects | Trigger | Effect |
|---|---|---|---|
| **CRL (PKI revocation)** | Signing KEY compromised | Key lost, stolen, signer left | CNMLs signed AFTER revocation are rejected. CNMLs signed BEFORE remain valid. |
| **Withdrawal (OIML database)** | PRODUCT non-compliant | Product fails surveillance, fraud, IA error | ALL CNMLs of this certificate are invalid, regardless of signing date. |

Both must pass for a CNML to be accepted.

**See:** `docs/pki-diagrams/05-revocation-vs-withdrawal.svg`

## Audiences and their interfaces

| Audience | Interface | Operations |
|---|---|---|
| BIML Root CA Operator | Air-gapped local web GUI | Create root, sign IA CSRs, root CRL, publish artifacts |
| IA CA Operator | Air-gapped local web GUI | Sign signer CSRs, IA CRL, renew IA cert, publish |
| IA Signer | Browser web app (signer build) | Generate key, create CSR, import cert, sign CNMLs |
| Manufacturer | Browser web app (verify build) | Upload CNML, verify authenticity |
| Verifier / Public | Browser web app (verify build) | Upload CNML, verify authenticity + chain |

Manufacturers and verifiers never see keys, CSRs, CRLs, or any PKI
internals. They upload a file and get ✓ or ✗.

## Root CA rollover (every ~22 years)

1. BIML generates new Root CA keypair (ceremony)
2. New root self-signs its own cert
3. Old root cross-signs the new root cert
4. Both roots published as trusted
5. Each IA generates new CSR, signed by new root
6. Signers renew under new intermediates
7. trust-anchors.json lists both roots during overlap
8. After old root expires: removed from trust anchors
9. All CNMLs signed during old root's validity remain verifiable
   (cert chain is embedded in each CNML)

## Manual summaries

| Manual | Audience | Daily experience |
|---|---|---|
| `manual-biml.md` | BIML Root CA operator | Open air-gapped GUI → sign CSRs → publish → USB |
| `manual-ia.md` | IA CA operator | Open air-gapped GUI → sign signer CSRs → CRL → publish |
| `manual-signer.md` | CNML signer | Open web app → fill form → sign CNML → download |
| `manual-verifier.md` | Verifier / manufacturer | Open web app → upload CNML → see ✓ or ✗ |
