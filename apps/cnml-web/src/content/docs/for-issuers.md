# For Issuers

How to create and sign a CNML file.

## Prerequisites

1. An OIML-recognized issuing authority (NL1, DE1, etc.)
2. A signing keypair, signed by OIML Root CA (see [Keys](/keys) and [CSR](/csr))
3. The CNML web app at `https://cnml.oimlsmart.org` (or self-hosted)

## Step-by-step

### 1. Open the Create tab

Click **Create** in the top nav. Pick the Recommendation you're issuing under (R60 for load cells, R76 for non-automatic weighing instruments, ...).

### 2. Fill the form

The form is driven by the per-Recommendation JSON Schema. Required fields are marked with `*`. Use **Fill demo data** to seed the form from a real OIML-CS sample certificate, then edit the values to match your equipment.

### 3. Sign and download

When the form is valid, click **Sign and download**.

![Signing flow](/diagrams/signing-flow.svg)

The browser:
1. Builds the cert object from form state
2. Serializes to CNML XML (with UnitsML elements)
3. Loads your private key from IndexedDB (encrypted with your passphrase)
4. Signs the XML using XMLDSig (enveloped, C14N Exclusive, SHA-256)
5. Triggers a download of `<cert-id>.cnml.xml`

Your private key **never leaves the browser**. The signature is computed locally with WebCrypto.

### 4. Distribute the signed CNML

The signed file can be:
- Sent directly to the applicant/manufacturer
- Uploaded to the OIML DoMC (once that integration exists)
- Published on your authority's website for public verification
