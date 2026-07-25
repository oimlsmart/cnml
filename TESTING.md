# How to test and deploy the CNML system

## Quick start (5 minutes)

```bash
# 1. Install deps
pnpm install

# 2. Start dev server
pnpm dev
# → open http://localhost:4321

# 3. Run all tests
pnpm test           # 46 unit tests (TS)
cd oiml-pki-server && rspec  # 49 Ruby specs
pnpm test:e2e       # 52 browser tests (Playwright)

# 4. Build for production
pnpm build
# → produces dist/ with 66 pages

# 5. Bundle analysis (optional)
ANALYZE=1 pnpm build
# → open dist/stats.html in a browser
```

## Test suite overview

| Suite | Command | Count | What it covers |
|---|---|---|---|
| TS unit | `pnpm test` | 46 | Crypto sign+verify, XML round-trip, D-CoC RDF, DCC import, units resolver, schema validation, scope parser, CRL parser |
| Ruby RSpec | `cd oiml-pki-server && rspec` | 49 | CaStore encrypt/decrypt, CertFactory (root, CSR, scope, CRL), KeyProvider (Software, Pkcs11), AuditLog (hash chain + tamper), SecretSharing (Shamir round-trip + tamper) |
| E2E | `pnpm test:e2e` | 52 | Page loads (22), form fill/reset/save/YAML (7), key gen/download/delete (5), sign+verify round-trip (2), verify test vectors + dropzone + malformed (10), home/cards/schemas/diagrams (6) |
| Smoke | `pnpm smoke` | 1 | Minimal sign+verify round-trip via Node |
| Test vectors | `pnpm vectors:verify` | 22 | Pre-signed CNMLs all verify |

## Testing the full workflow manually

### 1. Key generation + signing

1. Open `http://localhost:4321/keys`
2. Click "Generate keypair" → enter alias + passphrase (≥8 chars)
3. Click "Generate ECDSA P-256" → key appears in list
4. Go to `/create/r60` → click "Fill demo data"
5. Click "Sign and download CNML" → choose key → enter passphrase → sign
6. Optionally check "Anchor to Bitcoin blockchain" for OTS proof
7. Download the `.cnml.xml` file

### 2. Verification round-trip

1. Open `http://localhost:4321/verify`
2. Upload the `.cnml.xml` you just downloaded
3. See 6 check tiles: XML well-formed → Schema valid → Signature → Scope → CRL → Timestamp

### 3. CSR generation

1. Open `http://localhost:4321/csr`
2. Select a key, fill in identity
3. Click "Generate CSR" → download `.csr`
4. (In production: send to IA CA operator, receive `.crt` back)

### 4. CA server (offline testing)

```bash
cd oiml-pki-server
bundle install
ruby app.rb
# → open http://localhost:4455 in a browser
```

On the CA server GUI:
1. Enter a passphrase to create/unlock the key store
2. Click "Create Root CA" → fill in form → generate
3. Click "Sign CSR" → upload `.csr` → select scope (which Recommendations) → sign
4. Click "Publish" → artifacts written to `output/`
5. Click "Audit Log" → see hash-chained operation history

### 5. Test vectors

22 pre-signed CNMLs verify against the verify page:

```bash
pnpm vectors:gen    # generate fresh vectors (ECDSA P-256)
pnpm vectors:verify # verify all 22
```

### 6. Ruby PKI server tests

```bash
cd oiml-pki-server
bundle exec rspec
# 49 specs covering:
#   - CaStore: encrypt/decrypt, atomic writes, salt reuse
#   - CertFactory: root CA, CSR sign with scope, CRL generation
#   - KeyProvider: Software sign/public_key/label, Pkcs11 config
#   - AuditLog: append, verify_chain, tamper detection
#   - SecretSharing: split/combine 2-of-2, 3-of-5, tamper detection
```

### 7. Yubikey provisioning (requires hardware)

```bash
export OIML_PKCS11_PIN=123456
export OIML_PKCS11_MODULE=/opt/homebrew/lib/opensc-pkcs11.so
ruby scripts/provision-yubikey.rb \
  --cn "NMi Intermediate CA" \
  --algorithm ECDSA-P256 \
  --validity 10
```

## Architecture: check pipeline

The verify page uses a data-driven check pipeline
(`packages/cnml-crypto/src/checks/`). Each check is a module that
exports a `Check` object. The pipeline runs them in order, short-circuiting
on hard failures.

| # | Check | Module | Status |
|---|-------|--------|--------|
| 1 | XML well-formed | `xml_well_formed.ts` | ✅ |
| 2 | CNML schema valid | `schema_valid.ts` | ✅ (via ajv) |
| 3 | Signature valid | `signature.ts` | ✅ |
| 4 | Issuer authorized | `scope.ts` | ✅ (parser) |
| 5 | Not revoked | `crl.ts` | stub (needs CDN) |
| 6 | Blockchain timestamp | `timestamp.ts` | ✅ (via OTS) |

Adding a check = new file in `checks/` + one line in the `CHECKS` array.

## Deployment

### GitHub Pages (automatic on push to main)

```bash
git push origin main
```

The workflow builds the site and deploys to:
- `https://oimlsmart.github.io/digital-certificates/` — public site

### Audience-specific builds

`scripts/audience-build.ts` splits the production build:

| Audience | Directory | What they see |
|---|---|---|
| Signer | `dist/signer/` | Create, keys, CSR, verify |
| Verifier | `dist/verifier/` | Verify only |
| Public | `dist/public/` | Everything (read-only) |
| CA operators | `oiml-pki-server/` | Ruby app for air-gapped machine |

### Bundle analysis

```bash
ANALYZE=1 pnpm build
open dist/stats.html
```

Shows treemap of every module in the production bundle with gzipped
and Brotli sizes.
