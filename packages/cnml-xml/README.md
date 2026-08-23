# @oimlsmart/cnml-xml

Browser-native TypeScript library for CNML XML serialization.

- `certToCnmlXml(cert)` — generate CNML XML string
- `parseCnmlXml(xml)` — parse CNML XML back to cert object
- Uses native `DOMParser` + `XMLSerializer` — no dependencies

## Usage

```typescript
import { certToCnmlXml, parseCnmlXml } from "@oimlsmart/cnml-xml";
import { R60_SAMPLE } from "@oimlsmart/cnml-schemas/samples/r60-sample.yaml";

const xml = certToCnmlXml(R60_SAMPLE);
console.log(xml);

const back = parseCnmlXml(xml);
// back.certificate.number === R60_SAMPLE.certificate.number
```
