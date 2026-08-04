---
title: Comparison with concurrent efforts
description: How CNML relates to — and differs from — PTB DCC, EU eIDAS, US FPKI, ISO 17025 digital, and NIST SP 800-63.
---

# Comparison with concurrent efforts

CNML is not the only effort at digital legal metrology or
digital trust services. This page compares CNML with the most
relevant concurrent efforts, so IAs and standards bodies can make
informed decisions.

## At a glance

| Effort | Scope | Threshold crypto | Air-gapped | OIML-aligned | Open source |
|--------|-------|------------------|-----------|--------------|-------------|
| **CNML** | OIML legal metrology | **5-of-7 root** | **Yes** | **Yes (flagship)** | **Yes** |
| **PTB DCC** | Calibration reports | No | No | Compatible | Partial (interop layer) |
| **EU eIDAS** | EU-wide trust services | No | No | No | No |
| **US FPKI** | US federal PKI | No (single root) | No | No | Yes (schemas) |
| **ISO 17025 digital** | Lab accreditation | No | No | No | Standard |
| **NIST SP 800-63** | Identity proofing | No | No | No | Standard |
| **WebTrust for CAs** | CA audit | No | N/A | No | Audit framework |

## PTB DCC (Digital Calibration Certificate)

[PTB's DCC project](https://www.ptb.de) produces signed XML
calibration certificates for test labs. DCC and CNML are **complementary,
not competing**.

| | PTB DCC | CNML |
|---|---|---|
| **Scope** | Calibration certificates | Type-approval certificates |
| **Issuer** | Test lab | Issuing Authority |
| **Standards** | VDI/VDE/DGQ 2618 | OIML Recommendations |
| **Output format** | DCC XML | CNML XML |
| **Signing** | Single-key (test lab's key) | Threshold (when IA signed) |
| **Open source** | Yes (client + verifier) | Yes (full stack) |
| **Interop with CNML** | DCC can be embedded in CNML | CNML cites DCC test reports |

**Migration path**: a test lab producing DCC today can sign the DCC
and reference it from a CNML. No format change required.

## EU eIDAS (electronic IDentification, Authentication, and trust Services)

[eIDAS 2.0](https://digital-strategy.ec.europa.eu/en/policies/electronic-identity-and-trust-services)
is the EU's regulatory framework for digital trust. It defines
"qualified electronic seals" and "qualified trust service providers."

| | eIDAS | CNML |
|---|---|---|
| **Scope** | EU-wide cross-border trust | OIML international trust |
| **Legal framework** | eIDAS Regulation | OIML Recommendations + national law |
| **Recognition** | All EU member states | All OIML member states |
| **Trust anchors** | EU Trusted List (TSL) | OIML transparency log (TODO 44) |
| **Qualified seals** | Yes, under eIDAS | Maps to BIML threshold signatures |

**Cross-recognition**: CNML can be cross-certified with the eIDAS
framework via the Bridge CA pattern (TODO 50). A verifier in the
eIDAS framework can validate CNML certs via the bridge.

## US Federal PKI (FPKI)

The [US FPKI](https://fpki.idmanagement.gov/) is the US federal
government's trust framework. It uses the Federal Common Policy CA
as a trust anchor for federal agencies.

| | FPKI | CNML |
|---|---|---|
| **Root** | Federal Common Policy CA (single key) | BIML Root (5-of-7 threshold) |
| **Scope** | US federal agencies | International OIML |
| **Issuance volume** | ~50M federal employees | ~30 IAs, ~880 certs total |
| **Algorithms** | PIV (RSA + ECDSA) | FROST-P256 + composite PQC |
| **Cross-certification** | Bridge CA (FedBridge) | Bridge CA (TODO 50) |

Bridge CA cross-signing follows the same pattern as FedBridge.

## ISO/IEC 17025 digital

[ISO/IEC 17025](https://www.iso.org/standard/66912.html) specifies
requirements for testing and calibration laboratories. The "digital"
variant is emerging work to extend 17025 to digital workflows.

| | ISO 17025 | CNML |
|---|---|---|
| **Scope** | Lab competence + methods | Certificates issued by IAs |
| **Issued by** | Accreditation bodies (A2LA, UKAS, RvA) | Issuing Authorities |
| **Format** | Varies (national) | CNML XML (open) |
| **Cert coverage** | Labs (certifying they exist) | Instruments (certifying they comply) |

**Relationship**: ISO 17025 accredits the test labs that produce
data. CNML certifies the instruments based on that data. They
operate at different layers of the assurance chain.

## NIST SP 800-63 (Digital Identity Guidelines)

[NIST 800-63-3](https://pages.nist.gov/800-63-3/) defines Identity
Assurance Levels (IAL) and Authenticator Assurance Levels (AAL).
CNML director ceremonies achieve IAL2/AAL3 by design (TODO 39).

| | NIST 800-63 | CNML |
|---|---|---|
| **IAL2 (supervised in-person)** | Government ID + witness | Director onboarding ceremony (TODO 41) |
| **AAL3 (hardware-backed auth)** | FIDO2 or PKI smartcard | YubiKey + WebAuthn |
| **Replay resistance** | Required at AAL3 | Built into FROST nonce commitments |
| **Verifier impersonation resistance** | Required at AAL3 | WebAuthn origin binding |

CNML maps directly to NIST 800-63 levels; auditors familiar with
800-63 can evaluate CNML with the same criteria.

## WebTrust for CAs

[WebTrust](https://www.webtrust.org/) is the standard audit framework
for CAs serving the public. Criteria cover:

- CA business practices
- Key management procedures
- Certificate lifecycle management
- Audit trail integrity

CNML's CP (TODO 45) maps directly to WebTrust criteria. A WebTrust
auditor can evaluate CNML without framework-specific knowledge.

## ETSI EN 319 411+

[ETSI EN 319 411+](https://www.etsi.org/deliver/etsi_en/319400_319499/)
is the EU CA audit framework. CNML's CP/CPS (TODO 45) explicitly
covers ETSI EN 319 411+ requirements. A CNML deployment can
demonstrate ETSI conformance.

## Comparison with traditional TLS PKI (the contrast)

| | Web TLS PKI | CNML |
|---|---|---|
| **Issuance** | Cloud-issued, automated | Air-gapped, human-reviewed |
| **Volume** | Billions per year | Hundreds per year |
| **Cert lifetime** | 90 days (LE) – 2 years | 2-25 years |
| **Algorithm policy** | RSA + ECDSA, slow PQC migration | Composite classic+PQC from day 1 |
| **Revocation** | OCSP (unreliable) + CRL | CRL only (offline-capable) |
| **Transparency** | CT logs (forced) | Always-on, multi-mirror |
| **Threshold crypto** | None | Yes (5-of-7, 2-of-3) |
| **Compelled-revocation resistance** | None | Yes |
| **Trade-secret confidentiality** | N/A | Yes (threshold encryption) |
| **Open source stack** | Partial | Full |

## What CNML takes from each

| Source | What we adopt |
|--------|---------------|
| **PTB DCC** | XML test report format; DCC interop layer (TODO 14) |
| **EU eIDAS** | Trust list publication format (TODO 50); qualified seal framework |
| **US FPKI** | Bridge CA cross-certification pattern |
| **ISO 17025** | Lab accreditation (CNML assumes accredited labs exist) |
| **NIST 800-63** | IAL2/AAL3 identity proofing levels |
| **WebTrust** | Audit framework mapping (TODO 54) |
| **ETSI EN 319 411+** | CA audit framework |
| **Confium** | Threshold cryptography primitives |
| **RFC 6962** | Transparency log gossip protocol |
| **FIPS 203/204** | ML-KEM, ML-DSA standards |
| **BIPM Digital SI** | Authoritative unit source |

## What CNML adds that others lack

1. **Threshold crypto** as the standard, not the exception
2. **5-tier hierarchy** with explicit delegations
3. **Air-gapped root** with offline-capable verifier
4. **Trade-secret confidentiality** via threshold encryption
5. **Algorithm agility** via composite signatures
6. **Long-term archival** via ERS (RFC 4998)
7. **Compelled-revocation resistance** (unique to threshold crypto)
8. **Multi-language support** at the data model layer

## Coexistence, not replacement

CNML does not aim to replace PTB DCC, eIDAS, FPKI, etc. They operate
at different scopes and jurisdictions. CNML **complements** them:

- A lab producing DCC can sign it and reference from CNML
- A CNML cert can be cross-certified with eIDAS via bridge
- A CNML audit package can satisfy WebTrust + ETSI simultaneously

The goal is **interoperability and adoption** — not winner-take-all.

## See also

- TODO 50 (cross-PKI interop — bridge CAs)
- TODO 14 (DCC interop layer)
- [PTB DCC project](https://www.ptb.de/cms/en/ptb/fachabteilungen/abt1/fb-11/ag-1120/digital-calibration-certificate.html)
- [EU eIDAS Regulation](https://eur-lex.europa.eu/eli/reg/2014/910/oj)
- [US FPKI](https://fpki.idmanagement.gov/)
- [NIST SP 800-63-3](https://pages.nist.gov/800-63-3/)
- [WebTrust](https://www.webtrust.org/)
- [ETSI EN 319 411+](https://www.etsi.org/deliver/etsi_en/319400_319499/)
