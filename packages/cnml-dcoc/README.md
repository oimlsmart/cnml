# @oimlsmart/cnml-dcoc

Digital Certificate of Conformity (D-CoC) output for CNML.
Converts a CNML certificate into a D-CoC object and serializes it
to RDF/XML or JSON-LD.

## Install

```bash
npm install @oimlsmart/cnml-dcoc
```

## Usage

```typescript
import { certToDcoc, dcocToRdfXml, dcocToJsonLd } from "@oimlsmart/cnml-dcoc";

const dcoc = certToDcoc(cnmlCertificate);
const rdfXml = dcocToRdfXml(dcoc);   // application/rdf+xml
const jsonLd = dcocToJsonLd(dcoc);   // application/ld+json
```

The conversion is deterministic: the same CNML certificate always
produces the same D-CoC output.

## License

Same as the CNML project.
