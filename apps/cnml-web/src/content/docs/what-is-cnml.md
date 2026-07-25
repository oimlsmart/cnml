# What is CNML?

**CNML** = **C**ertificat **N**umérique de **M**étrologie **L**égale (Digital Legal Metrology Certificate).

CNML is the OIML equivalent of PTB's [DCC](https://www.ptb.de/dcc/) (Digital Calibration Certificate). It's an XML-based, cryptographically signed file format for issuing and verifying OIML type-approval certificates.

## Why CNML?

OIML publishes 22 Recommendations covering measuring instruments — load cells (R60), electricity meters (R46), fuel dispensers (R117), and so on. Each Recommendation has its own accuracy class system, characteristic fields, and test requirements.

Until CNML, OIML certificates were issued as PDF files — unverifiable, non-machine-readable, and disconnected from the underlying Recommendations.

CNML brings:

1. **Cryptographic signatures** — every CNML file is signed by the issuing authority's private key. Anyone can verify authenticity with the public cert.
2. **Machine-readable** — XML conforming to the CNML XSD + per-Recommendation JSON Schemas.
3. **Anchored to BIPM Digital SI** — all measurement units trace back to [BIPM's Digital SI](https://www.bipm.org/en/digital-si), the authoritative digital representation of the International System of Units. UnitsML encoding and the UnitsDB index are implementation technologies we use to consume Digital SI; the authority chain runs BIPM Digital SI → UnitsDB → UnitsML → CNML XML.
4. **PTB DCC-compatible** — can import, verify, and (where mappable) export DCC files.

## How CNML differs from DCC

| Aspect | DCC | CNML |
|---|---|---|
| Issuer | PTB (calibration labs) | OIML-issuing authorities |
| Data model | Calibration results chain | CORE + modules + per-Recommendation |
| Units | SI + free-form | BIPM Digital SI (via UnitsDB + UnitsML) |
| Per-domain schema | No (one DCC for all) | Yes (22 per-Recommendation schemas) |
| Signing | XMLDSig | XMLDSig (same standard) |

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
