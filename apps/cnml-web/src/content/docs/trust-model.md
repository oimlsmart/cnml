# Trust Model

Who can issue CNML files, and who decides what's trustworthy?

## Who can issue

Only **OIML-recognized issuing authorities** can issue CNML files. Recognition is granted by OIML via the DoMC (Declaration of Mutual Confidence) process.

Current recognized issuers (the OIML `issuer_id` codes):

- **NL1** — NMi Certin B.V. (Netherlands)
- **DE1** — PTB (Germany)
- **CN2** — NIM (China)
- **CZ1** — CMI (Czech Republic)
- **DK2/DK3** — DFM / TresCal (Denmark)
- **FR2** — LNE (France)
- **GB1** — NMO (United Kingdom)
- **CH1** — METAS (Switzerland)
- **SE1** — RISE (Sweden)
- ...and others

A CNML file from an unrecognized issuer is technically valid XML, but verifiers will reject it with "issuer not trusted".

## Who can verify

Anyone. The web app runs entirely in the browser. No server-side verification, no API key, no account.

You can verify a CNML file:
- On the CNML web app (`https://cnml.oimlsmart.org/verify`)
- With any XMLDSig-compliant tool (`xmlsec1`, `xmldsigjs`, Java JSR-105, .NET SignedXml)
- Programmatically via the `@cnml/cnml-xml` TypeScript library

## OIML DoMC relationship

The OIML [Declaration of Mutual Confidence](https://www.oiml.org/en/oiml-system/mutual-confidence) is the agreement that establishes which authorities recognize each other's type-evaluation work. CNML builds on DoMC by:

- Issuing authorities receive DoMC-recognized X.509 certificates from OIML
- The OIML Root CA cert is published in the DoMC registry
- CNML signatures chain to this root

CNML does **not** replace DoMC — it makes DoMC verifiable cryptographically.

## Revocation

If an issuing authority's key is compromised:

1. Authority notifies OIML
2. OIML publishes the revoked cert in a CRL (Certificate Revocation List)
3. CNML verifiers check the CRL before accepting a signature
4. Affected CNMLs must be re-signed with the authority's new key

**Status:** The CRL pipeline is specified in `TODO.cnml-pki/06-certificate-status.md` and `TODO.cnml-pki/11-integration-wiring.md`. The `oiml-pki-server` can already emit CRLs; browser-side CRL fetch + check is the remaining wiring task.
