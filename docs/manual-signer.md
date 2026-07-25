# CNML Signer Manual

## Who you are

You are the person responsible for signing OIML-CS certificates at your
Issuing Authority (e.g., M.Ph.D. Schmidt at NMi Certin B.V.). You sign
digital legal metrology certificates (CNMLs) that manufacturers use to
demonstrate compliance.

## What you need

- A web browser (Chrome, Firefox, or Edge)
- Your signing key (generated in the browser, stored locally)
- Your CA-signed certificate (received from your IA's CA operator)
- Access to https://cnml.oiml.org

## First-time setup

### Step 1: Generate your signing key

1. Open https://cnml.oiml.org → **Keys**
2. Click **Generate keypair**
3. Enter an alias (e.g., "M.Schmidt NMi 2026")
4. Enter a passphrase (minimum 8 characters — this encrypts your key at rest)
5. Click **Generate Ed25519** (takes a few seconds)
6. Your key is now stored in this browser. Write down your passphrase.
   If you forget it, the key is permanently lost.

### Step 2: Request a certificate

1. Go to **CSR** (Certificate Signing Request)
2. Fill in your identity:
   - Name: your full name
   - Organization: your IA name
   - Country: your country code
   - OIML Issuer ID: your IA's ID (e.g., NL1)
3. Click **Generate CSR**
4. Download the `.csr` file
5. Send it to your IA's CA operator (internal process)

### Step 3: Import your certificate

1. Wait for your IA CA operator to sign your CSR and return a `.crt` file
2. Go to **Keys** → select your key → **Import certificate**
3. Upload the `.crt` file
4. The browser verifies the certificate chain (your cert → IA → OIML root)
5. Your key is now certified — ready to sign CNMLs

## Daily workflow: signing a CNML

1. Go to **Create** → pick the Recommendation (e.g., R60)
2. Fill in the certificate form (or click **Fill demo data** for a template)
3. Click **Sign and download CNML**
4. The browser signs the XML with your Ed25519 key
5. Your X.509 certificate chain is embedded in the signature
6. (optional) A blockchain timestamp is added via OpenTimestamps
7. Download the `.cnml.xml` file
8. Upload it to the OIML-CS certificate database
9. Send the file to the manufacturer

## Certificate renewal

Your certificate expires every 2-3 years. The browser will show warnings:
- **90 days before expiry**: yellow badge on Keys page
- **60 days before expiry**: orange badge + "Renew now" button
- **30 days before expiry**: red badge + urgent renewal prompt
- **Expired**: cannot sign new CNMLs

To renew:
1. Click **Renew** on the Keys page
2. Choose "Reuse existing key" or "Generate new key"
3. A new CSR is generated → send to your IA CA operator
4. Import the new certificate
5. Both old and new certificates are valid during the overlap period

## Key backup

Your private key is stored ONLY in this browser. If you lose the browser
(e.g., laptop crash, clear browsing data), your key is gone.

To back up:
1. Go to **Keys** → select your key → **Private ↓**
2. Enter your passphrase to unlock
3. Save the `.private.pem` file somewhere secure (password manager, USB)
4. To restore on another device: **Import PEM ↑** on the Keys page

## Troubleshooting

| Problem | Solution |
|---|---|
| "Certificate not found" when signing | You haven't imported your `.crt` yet |
| "Key revoked" | Your key was revoked. Contact your IA CA operator |
| Browser shows "Ed25519 not supported" | Use Chrome 113+ or Firefox 130+; the app polyfills older browsers but native is faster |
| Forgot passphrase | Key is permanently lost. Generate a new key, get a new cert from your IA |
