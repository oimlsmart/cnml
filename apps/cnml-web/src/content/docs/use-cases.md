---
title: CNML beyond legal metrology
description: How the CNML trust framework generalizes — pharma, environmental monitoring, customs, food safety, academic credentials, vehicle type approval, medical devices, and more
---

# CNML beyond legal metrology

CNML was designed for OIML type-approval certificates, but the
architecture — a five-tier threshold-signed hierarchy with scoped
delegation, transparency log, and field verification — solves the
same class of trust problems in many other domains. This page maps
the architecture to other use cases so prospective adopters can see
whether CNML fits their problem.

## The pattern that makes CNML general

CNML works whenever these conditions hold:

1. **An institution issues authoritative certificates** attesting that
   a thing (product, person, process, document) conforms to a
   standard.
2. **No single party can be trusted with the signing key** — either
   because of geopolitical concerns, insider threat, or regulatory
   requirement.
3. **Verification happens in the field by parties who didn't issue
   the certificate** (customs officer, customer, regulator, partner,
   public).
4. **Delegation scales**: a national authority delegates to local
   authorities, which delegate to accredited labs or manufacturers,
   which delegate to specific products or instances.
5. **Longevity matters**: certificates must remain verifiable for
   years or decades (longer than typical TLS certificates).
6. **Transparency is a feature, not a bug**: the existence of every
   issued certificate is a public, auditable record.

If your problem fits this pattern, CNML applies. Below are concrete
domains where it does.

## Use case: pharmaceutical track and trace

The pharmaceutical supply chain is plagued by counterfeit drugs. The
US DSCSA (Drug Supply Chain Security Act), EU FMD (Falsified Medicines
Directive), and similar regulations require serialized, traceable
packaging. Today's solutions rely on GS1 barcodes + central databases,
with weak cryptographic integrity.

### How CNML generalizes

- **Tier 1 (Root)**: WHO or regional regulator (FDA, EMA), 5-of-7
  director quorum
- **Tier 2 (National)**: National medicines regulator, 2-of-3 quorum
- **Tier 3 (Manufacturer)**: Drug manufacturer, single-party signing
  under Model Cert scope
- **Tier 4 (Lot)**: Each lot has a Model Cert from the manufacturer
- **Tier 5 (Instance)**: Each package gets an Instance Cert, signed
  by the manufacturer under the lot's scope

Field verification (customs officer, pharmacist, customer) scans a
QR code, downloads the Instance Cert from the transparency log, and
path-validates to the WHO root. Counterfeits fail path validation.

### Specific benefits

- No single regulator's compromise can flood the supply chain with
  counterfeit-accepting certs
- Lot-level scope prevents a manufacturer from issuing certs for a
  different manufacturer's products
- Revocation: a recalled lot's certs are auto-revoked via the Model
  Cert scope check
- Transparency log: every package ever certified is publicly
  auditable, supporting post-market surveillance

## Use case: environmental monitoring equipment

Air quality monitors, water quality sensors, emissions detectors —
these instruments produce regulatory-grade measurements. Their
calibration and type approval must be tamper-evident.

### How CNML generalizes

- **Tier 1 (Root)**: International body (e.g., WMO, BIPM for SI
  traceability), threshold-signed
- **Tier 2 (National)**: Environmental regulator (EPA in US, EEA in
  EU), 2-of-3 quorum
- **Tier 3 (Test lab)**: Accredited calibration laboratory,
  single-party signing
- **Tier 4 (Manufacturer)**: Instrument manufacturer,
  single-party signing under Model Cert scope
- **Tier 5 (Instance)**: Each deployed sensor gets an Instance Cert
  binding serial number + calibration data + firmware hash

Verification at the regulatory check (e.g., a permit inspection)
validates that the deployed sensor is the one whose calibration was
attested.

### Specific benefits

- In-the-field firmware tampering is detected (firmware hash mismatch)
- Re-calibration events are appended to the Instance Cert history
  via the transparency log
- Revocation: a sensor's cert is revoked if its model is found to
  produce inaccurate readings

## Use case: customs HS classification

Goods entering a country are classified under the Harmonized System
(HS) codes for tariff assessment. Today, exporters self-declare HS
codes; customs inspectors verify against paper certificates of origin.
Disputes are slow and adversarial.

### How CNML generalizes

- **Tier 1 (Root)**: WCO (World Customs Organization), threshold-signed
- **Tier 2 (National)**: National customs authority, 2-of-3 quorum
- **Tier 3 (Issuing authority)**: Chamber of commerce or accredited
  origin-certifier
- **Tier 4 (Exporter)**: Exporting company, single-party signing under
  accreditation scope
- **Tier 5 (Shipment)**: Each shipment gets an Instance Cert binding
  HS code + origin + goods description

Customs in the importing country scans a QR code on the bill of
lading; the CNML cert is downloaded and path-validated against the
WCO root.

### Specific benefits

- Eliminates HS code fraud (an exporter cannot claim a different HS
  code without a new cert from the accredited origin-certifier)
- Speeds customs clearance (verification in seconds, not days)
- Enables mutual recognition: WCO member states' certs are mutually
  accepted when their root signs the same chain

## Use case: food safety and origin

Organic certification, geographic-origin protection (Champagne,
Parmigiano-Reggiano), and food-safety attestations are high-value
targets for fraud. Current paper-based systems are easy to forge.

### How CNML generalizes

- **Tier 1 (Root)**: International body (e.g., FAO/WHO Codex
  Alimentarius), threshold-signed
- **Tier 2 (National)**: National food safety regulator (USDA, EFSA)
- **Tier 3 (Certifier)**: Accredited certifier (e.g., organic
  certification body)
- **Tier 4 (Producer)**: Farm or producer
- **Tier 5 (Lot)**: Each lot/batch gets a cert

Consumers scan a QR code at point of sale to verify origin and
certifications.

### Specific benefits

- Counterfeit "organic" or "Champagne" claims detected at point of
  sale via path validation
- Provenance transparency log: every batch is publicly auditable
- Scope cryptography enforces geographic-origin protection (a
  Champagne cert can only be issued by certifiers accredited for
  the Champagne region)

## Use case: academic credentials

Diplomas, transcripts, and professional certifications are routinely
falsified. Existing digital credential systems (Open Badges, Verifiable
Credentials) lack a robust institutional hierarchy.

### How CNML generalizes

- **Tier 1 (Root)**: National or international accreditation body
  (e.g., regional accreditor in the US), threshold-signed
- **Tier 2 (University)**: Accredited university, 2-of-3 quorum of
  registrar + provost + IT security
- **Tier 3 (Department)**: Department, single-party signing under
  university delegation
- **Tier 4 (Credential)**: Each diploma/cert is an Instance Cert
  binding recipient + program + date + honors

Employers verify by scanning a QR code on the diploma or entering
the cert ID into a verification portal.

### Specific benefits

- Eliminates diploma mill fraud (a non-accredited institution cannot
  issue certs that path-validate to the accreditation root)
- Revocation: an overturned credential is revoked via the issuing
  university's quorum
- Transparency log: every issued credential is publicly auditable
  (with privacy-preserving options per TODO 51)

## Use case: vehicle type approval

Every vehicle sold in a market must pass type approval (ECE in Europe,
FMVSS in the US, similar elsewhere). Today's approvals are paper-based
and slow to verify.

### How CNML generalizes

- **Tier 1 (Root)**: International body (e.g., UNECE WP.29 for the
  1958 Agreement), threshold-signed
- **Tier 2 (National)**: Type approval authority (KBA in Germany,
  VCA in UK, NHTSA in US), 2-of-3 quorum
- **Tier 3 (Test lab)**: Accredited technical service
- **Tier 4 (Manufacturer)**: Vehicle manufacturer, single-party
  signing under Model Cert scope (specific vehicle model + variant)
- **Tier 5 (Instance)**: Each VIN gets an Instance Cert binding
  type approval + variant + emissions data

Law enforcement, insurers, and customers verify a vehicle's
certifications by scanning a QR code on the registration document.

### Specific benefits

- Defeats VIN cloning fraud (each VIN has a unique, path-validating
  cert)
- Recalls are transparent-log entries; affected VINs are immediately
  identifiable
- Emissions fraud (the Volkswagen "dieselgate" pattern) becomes
  harder: the certified emissions data is cryptographically bound
  to the type approval, and any later discrepancy is detectable

## Use case: medical device conformity

Medical devices require conformity assessment (CE marking in EU, FDA
510(k) or PMA in US). The current system is paper-and-PDF heavy,
hard to verify, and prone to certificate forgery.

### How CNML generalizes

- **Tier 1 (Root)**: International regulator (IMDRF — International
  Medical Device Regulators Forum), threshold-signed
- **Tier 2 (National)**: National regulator (FDA, EMA, PMDA, NMPA),
  2-of-3 quorum
- **Tier 3 (Test lab)**: Accredited testing laboratory
- **Tier 4 (Manufacturer)**: Device manufacturer
- **Tier 5 (Instance)**: Each device unit (by serial number) gets
  an Instance Cert

Hospital procurement, regulators, and patients verify device
authenticity by scanning a QR code on the device or its packaging.

### Specific benefits

- Defeats counterfeit medical device distribution
- Recall management: all units affected by a recall are publicly
  listed in the transparency log
- Field software updates: a new firmware hash is appended to the
  device's Instance Cert history, providing a tamper-evident
  software lineage

## Use case: financial audit attestations

Audit firms issue attestations (financial statement audits, SOC
reports, ESG attestations). These are high-stakes documents where
forgery and repudiation are major risks.

### How CNML generalizes

- **Tier 1 (Root)**: International audit regulator (e.g., IAASB,
  IFAC), threshold-signed
- **Tier 2 (Firm)**: Audit firm (Big 4 or regional), 2-of-3 quorum
  of engagement partner + concurring partner + firm IT security
- **Tier 3 (Engagement)**: Specific client engagement
- **Tier 4 (Attestation)**: Each attestation report gets a cert
  binding client + period + opinion + signature

Banks, regulators, and investors verify attestations by entering
the attestation ID or scanning a QR code on the report.

### Specific benefits

- Defeats audit report forgery (a non-accredited firm cannot issue
  path-validating certs)
- Engagement-level scope prevents a firm from signing on behalf of
  a different engagement or different client
- Threshold signature at the firm level prevents a single partner
  from issuing fraudulent attestations

## Use case: standards body document publication

Standards bodies (ISO, IEC, ASTM, IEEE) publish documents that
carry authority. The current PDF-based system has no cryptographic
integrity verification; modified PDFs circulate as "the standard".

### How CNML generalizes

- **Tier 1 (Root)**: Standards body (e.g., ISO), threshold-signed
  by the technical management board
- **Tier 2 (Committee)**: Technical committee, 2-of-3 quorum of
  committee officers
- **Tier 3 (Working group)**: Working group that drafts the standard
- **Tier 4 (Document)**: Each published standard gets a cert binding
  document hash + version + publication date

Anyone verifying a standard can cryptographically confirm that the
PDF they have is the authentic, unmodified document ISO published.

### Specific benefits

- Eliminates distribution of modified standards
- Version history is transparent-log visible
- Withdrawn standards are marked revoked; their continued use is
  detectable

## What CNML does NOT solve

CNML is not the right tool for every digital-attestation problem.
Specifically, it does not fit when:

- **Real-time issuance is required** (e.g., per-transaction tokens
  in payments). CNML's async ceremony model adds minutes-to-hours
  latency. Use a fast single-signer scheme and reserve CNML for the
  root authority.
- **Privacy of certificate existence is paramount** (e.g., medical
  records where even the existence of a record is sensitive). CNML's
  transparency log is public-by-design; selective disclosure (TODO 51)
  helps but doesn't make certificates invisible.
- **The "thing" being certified has no stable identity** (e.g.,
  ephemeral digital content). CNML's Instance Certs bind to specific
  physical or digital identifiers; without a stable identifier, the
  cert has nothing to anchor to.
- **The verifying audience is too narrow to justify the
  infrastructure**. If only one party ever verifies (e.g., internal
  corporate documents), a single-signer PKI is simpler.
- **The institution does not have the operational maturity for
  threshold ceremonies**. CNML requires that the institution commit
  to the operational model — annual ceremonies, director rotation,
  audit access. If this commitment isn't realistic, CNML will fail
  operationally even if it succeeds cryptographically.

## When to choose CNML over alternatives

| Need | Best choice |
|------|-------------|
| High-stakes, multi-party, long-lived, field-verified | **CNML** (Mode 3) |
| Existing PKI that should become threshold-backed | Confium Mode 2 (PKCS#11 drop-in) |
| Peer-to-peer MPC, custody, BFT signing | Confium Mode 1 (no PKI) |
| Lightweight Verifiable Credentials with simple issuer | W3C VC + simple signatures |
| Web TLS | Standard Web PKI + CA/B Forum rules |
| Internal corporate signing | Single-signer PKI |

CNML is the right choice when the stakes are high enough to justify
the operational overhead of threshold ceremonies, and when the
verifying audience is broad enough that interoperability matters.

## How to adapt CNML for a new domain

If you're considering CNML for a new domain, the adaptation process
is:

1. **Map your institution to the tier hierarchy.** Who is the root
   authority? Who are the intermediate authorities? What is being
   certified, and by whom?
2. **Choose threshold parameters.** How many parties must collaborate
   at each tier? What regional/role balance is required?
3. **Define scope.** What are the equivalent of OIML Recommendations?
   What is each authority accredited to certify?
4. **Define delegation rules.** Can authorities delegate to
   subordinates? Under what scope constraints?
5. **Define transparency policy.** What is public? What is
   privacy-preserved? What are the retention rules?
6. **Define revocation policy.** Who can revoke? For what reasons?
   What is the audit trail?
7. **Adopt the CNML XML schema or define your own.** CNML is
   XML-based; domains may prefer JSON, CBOR, or other formats. The
   architecture is format-agnostic.
8. **Stand up the infrastructure.** Use Confium as the threshold
   backend; use the CNML Ruby PKI server as the air-gapped
   ceremony infrastructure; use the CNML browser app as the
   verifier.

The CNML project welcomes inquiries from organizations considering
similar deployments. The architecture is general; the specific
configuration is what makes each deployment unique.

## References

- [Architecture](/docs/architecture) — CNML tier hierarchy
- [Confium integration](/docs/confium-architecture) — how the
  threshold backend works
- [For decision makers](/docs/for-decision-makers) — the business
  case
- [BIML, CIML, and OIML administration](/docs/administration) —
  institutional governance model
- [Adoption roadmap](/docs/adoption-roadmap) — the 5-year plan
- [Threat model](/docs/threat-model) — what CNML defends against
- TODO 64 — Adoption strategy
- TODO 50 — Cross-PKI interop
