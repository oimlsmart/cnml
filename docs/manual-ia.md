# Issuing Authority (IA) CA Operator Manual

## Who you are

You are a security or quality officer at an Issuing Authority (e.g., NMi
Certin B.V., PTB, NIM). You operate your IA's Intermediate CA, which
signs certificates for individual signers within your organization.

## What you manage

- Your IA's Intermediate CA private key (Ed25519 + ML-DSA-65, 10-year validity)
- Signer certificates (Ed25519, 2-3 year validity per signer)
- IA-level CRLs (revoking compromised signer keys)

## Operations

### Signing a signer CSR

When a new metrologist needs signing rights:

1. Receive a CSR (`.csr` file) from the metrologist
2. Verify:
   - They are employed by your IA (HR check)
   - Their public key fingerprint matches what they reported
3. On the air-gapped CA server dashboard, click **Sign CSR**
4. Upload the `.csr` file
5. Select **"Sign as End-Entity Certificate"** with your Intermediate CA
6. Set validity (default: 2 years)
7. Set key usage: `digitalSignature, nonRepudiation`
8. Click **Sign** → download `.crt`
9. Send the `.crt` back to the signer

### Renewing your IA certificate (every 8 years)

Your intermediate CA cert expires every 10 years. Start renewal at year 8:

1. On the dashboard, click **Renew IA Certificate**
2. This generates a new CSR with your existing key (or a new key)
3. Download the `.csr`
4. Send to BIML (their Root CA operator will sign it)
5. When you receive the new `.crt`: click **Import Renewed CA Cert**
6. Both old and new certs are valid during the overlap period

### Revoking a signer key

When a signer leaves, loses their device, or their key is compromised:

1. Click **Manage CRL**
2. Click **Add revocation**
3. Enter the signer's certificate serial number
   (or upload their `.crt` to extract it automatically)
4. Select reason:
   - `keyCompromise` — device lost or stolen
   - `affiliationChanged` — signer left the organization
   - `cessationOfOperation` — signer's role terminated
5. Click **Add to CRL**
6. Click **Generate CRL** → produces the IA-level CRL
7. Click **Publish** → write to USB → push to artifacts repo

Verifiers will reject CNMLs signed by the revoked key (after the next
CRL fetch, within 24 hours).

### Monitoring signer certificates

The dashboard shows all signer certificates you've issued:
- Active signers with their validity dates
- Certificates expiring soon (60/90 days)
- Revoked certificates

### Publishing artifacts

Same as BIML: write to USB → push to the artifacts repo. The artifacts
repo updates within minutes via GitHub Pages.

## Security rules

- Keep the air-gapped machine offline at all times
- The Intermediate CA key must NEVER be on a network-connected machine
- Verify signer identity out-of-band before signing any CSR
- Revoke signer keys immediately when they leave or lose devices
- Log every operation
