# BIML Root CA Operator Manual

## Who you are

You are a staff member at the Bureau International de Métrologie Légale
(BIML) in Paris, responsible for operating the OIML Root CA.

## What you manage

- The OIML Root CA private key (Ed25519 + ML-DSA-65, 25-year validity)
- Accreditation of Issuing Authorities (signing their intermediate CA certs)
- Root-level CRLs (revoking IAs that lose accreditation)
- Publication of trust anchors and PKI artifacts

## What you need

- The air-gapped machine dedicated to Root CA operations
- The Root CA key backup USB sticks (stored in two separate safes)
- The `oiml-pki-server` running on the air-gapped machine

## Starting the CA server

1. Boot the air-gapped machine (no network connection)
2. Insert the Root CA key USB stick
3. Double-click `start-ca.command` (or run `ruby app.rb`)
4. Open Firefox → http://localhost:4455
5. Enter the Root CA key passphrase to unlock the key store

## Operations

### Signing a new IA (when a new authority joins OIML-CS)

1. Receive a CSR (`.csr` file) from the new IA via secure channel
2. Verify their identity:
   - Check OIML-CS accreditation document
   - Phone call to the IA's security officer
   - Compare the CSR's public key fingerprint with the one they reported
3. On the dashboard, click **Sign CSR**
4. Upload the `.csr` file
5. Review the CSR details (subject, algorithm, fingerprint)
6. Select **"Sign as Intermediate CA"** with the Root CA
7. Set validity (default: 10 years)
8. Click **Sign**
9. Download the `.crt` file
10. Send it back to the IA via secure channel

### Publishing artifacts

After any operation (signing a new IA, generating a CRL):

1. Click **Publish Artifacts** on the dashboard
2. Review the list of files to be published
3. Click **Write to output directory**
4. Insert a clean USB stick
5. Copy the `/output/` directory to the USB
6. Safely eject the USB
7. On a network-connected machine: `git push` the contents to the
   `oiml/pki-artifacts` repository
8. GitHub Pages publishes them within minutes

### Revoking an IA

If an IA loses accreditation or is compromised:

1. Click **Manage CRL**
2. Click **Add revocation**
3. Enter the IA's intermediate CA cert serial number (or upload their `.crt`)
4. Select reason: "cessationOfOperation" or "keyCompromise"
5. Click **Generate CRL** → produces the root-level CRL
6. Click **Publish** → write to USB → push to artifacts repo

All verifiers will reject CNMLs signed by the revoked IA after the next
CRL fetch (within 24 hours).

### Root CA backup

Once per year, create a new backup:
1. Click **Backup to USB**
2. Insert USB stick #1 → encrypted backup written
3. Eject, insert USB stick #2 → encrypted backup written
4. Return both to their respective safes

### Root CA rollover (every ~22 years)

See the architecture document for the full rollover ceremony.

## Security rules

- **NEVER** connect the air-gapped machine to any network
- **NEVER** copy the Root CA private key to a network-connected machine
- **ALWAYS** verify identity out-of-band before signing a CSR
- **ALWAYS** require two witnesses for the root key USB safe access
- **ALWAYS** log every operation in the ceremony record book
