# @oimlsmart/cnml-units

Unit resolver for CNML. Maps measurement unit symbols to their
BIPM Digital SI definitions via UnitsDB and UnitsML.

## Install

```bash
npm install @oimlsmart/cnml-units
```

## Usage

```typescript
import { resolveUnit } from "@oimlsmart/cnml-units";

const unit = resolveUnit("kg");
// → { symbol: "kg", name: "kilogram", siBase: "mass", ... }
```

## License

Same as the CNML project.
