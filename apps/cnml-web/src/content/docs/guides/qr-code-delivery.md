---
title: QR code delivery
coord: GUIDE / 04
---

# QR code delivery

This guide covers how CNML certificates are delivered to instruments
via QR codes, and how the passport endpoint serves the public view.

## The delivery flow

For non-SMART instruments (instruments without a network interface),
the manufacturer prints a QR code on the device body. The QR code
encodes the passport URL:

```
https://www.oimlsmart.org/cnml/passport/<instance-cert-id>
```

A market-surveillance officer scans the QR code with a phone or
tablet. The passport page loads and displays:

1. The device identity (manufacturer, model, serial number)
2. The OIML Recommendation the instrument is approved under
3. The certificate chain (instance, model, IA, root)
4. The certificate status (valid, revoked, expired)
5. A link to the full verification pipeline

## The passport endpoint

The passport endpoint serves two representations:

- **HTML** at `/passport/<cert-id>`: the human-readable page
- **JSON-LD** at `/passport/<cert-id>.json`: the machine-readable
  document with `Content-Type: application/ld+json`

The JSON-LD document uses the `MetrologicalCertificatePassport`
type under the `https://www.oimlsmart.org/cnml/passport/v1` context.
SMART instrument twins and market-surveillance aggregators consume
the JSON-LD representation.

## Generating a QR code

The web app provides a QR code generator at `/qr-code`. It encodes
the passport URL for a specific instance certificate and renders the
QR as an SVG that can be printed on the device body.

```typescript
import QRCode from "qrcode";

const passportUrl = `https://www.oimlsmart.org/cnml/passport/${certId}`;
const svg = await QRCode.toString(passportUrl, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  width: 300,
});
```

Error correction level M (15 percent recovery) is the default.
Version is auto-detected by the library based on input length.

## Manufacturer instance flow

The manufacturer instance certificate flow at `/issue/manufacturer-instance`
combines all the pieces:

1. The manufacturer enters the device identity (manufacturer, model,
   serial, firmware hash, manufacturing date)
2. A delegated signing key is generated or loaded
3. The instance cert XML is serialized via `instanceCertToXml()`
4. The XML is signed with XMLDSig
5. A QR code is generated encoding the passport URL
6. The signed XML + cert PEM are bundled for download

## Next steps

- [SMI integration](/docs/guides/smi-integration) for the SMART
  instrument delivery path via the twin GraphQL interface.
- [QR code delivery feature](/features/qr-code-delivery) for
  the design rationale.
