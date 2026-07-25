# @cnml/cnml-xsd

W3C XML Schema Definition (XSD) for CNML 1.0.

## Files

- `src/cnml-1.0.xsd` — the schema. Covers core CNML elements, UnitsML elements, and XMLDSig payload.

## Usage

Import the schema text directly:

```ts
import xsd from "@cnml/cnml-xsd";
// xsd is the XSD source as a string (with @rollup/plugin-yaml or a raw loader)
```

Or for offline validation:

```bash
xmllint --schema packages/cnml-xsd/src/cnml-1.0.xsd --noout file.cnml.xml
```

## Scope

See `TODO.cnml/03-xsd-schema.md` for the original scope and acceptance criteria.
