# What is CNML?

**CNML** = **C**ertificat **N**umérique de **M**étrologie **L**égale (Digital Legal Metrology Certificate).

CNML is the **digital form of the OIML-CS certificate of conformity**
— currently issued as PDF files at [oiml.org/extra/certificates](https://www.oiml.org/en/extra/certificates).
It's an XML-based, cryptographically signed file format for issuing
and verifying OIML type-approval certificates.

### CNML vs DCC — different tiers, not equivalents

It's tempting to call CNML "OIML's DCC" but that conflates two
different tiers of metrology:

| | **DCC** (Digital Calibration Certificate) | **CNML** |
|---|---|---|
| **Tier** | Calibration | Type approval |
| **Standard** | ISO/IEC 17025 | OIML-CS (B-3 to B-19) + OIML R-Recommendations |
| **Issuer** | Calibration laboratories | OIML-Designated Issuing Authorities |
| **Subject** | A specific calibrated artifact | A model (type) of measuring instrument |
| **Validity** | Per calibration event (one-off) | ~10 years per type approval |
| **Use case** | Measurement traceability for industry/science | Market access for regulated instruments |
| **Scope** | All metrology (mass, length, electrical, …) | Legal metrology (trade, health, safety, env) |
| **Regulatory** | Voluntary / commercial | Legally required for market placement |
| **Format** | XML (DCC 3.2.0, XAdES-signed) | XML (XMLDSig, per-R JSON Schema) |

A measuring instrument in legal use typically has **both**: a CNML
type approval (covering the model) and periodic DCC calibrations
(covering each recalibration of the specific unit). CNML consumes
DCCs as test-report evidence via the `ptb-dcc-compat` package — they
stack, they don't compete.

## Why CNML?

OIML publishes 22 Recommendations covering measuring instruments — load cells (R60), electricity meters (R46), fuel dispensers (R117), and so on. Each Recommendation has its own accuracy class system, characteristic fields, and test requirements.

Until CNML, OIML certificates were issued as PDF files — unverifiable, non-machine-readable, and disconnected from the underlying Recommendations.

CNML brings:

1. **Cryptographic signatures** — every CNML file is signed by the issuing authority's private key. Anyone can verify authenticity with the public cert.
2. **Machine-readable** — XML conforming to the CNML XSD + per-Recommendation JSON Schemas.
3. **Anchored to BIPM Digital SI** — all measurement units trace back to [BIPM's Digital SI](https://www.bipm.org/en/digital-si), the authoritative digital representation of the International System of Units. UnitsML encoding and the UnitsDB index are implementation technologies we use to consume Digital SI; the authority chain runs BIPM Digital SI → UnitsDB → UnitsML → CNML XML.
4. **DCC-compatible** — consumes DCC files as test-report evidence in the CNML type-approval flow (see TODO 14).

## Where CNML fits

```
OIML Certificate of Conformity (PDF today)
                ↓
                ↓  CNML digitizes the cert
                ↓
CNML file (*.cnml.xml, signed XML)
                ↓
                ↓  Verifiable by anyone
                ↓
Verifier (browser, mobile, kiosk at point of sale)
```
