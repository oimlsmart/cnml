# @oimlsmart/cnml-schemas

Full OIML certificate schema stack for the CNML web app.

## Contents

- `src/_core.yaml` — CORE OIML certificate model
- `src/_units.yaml` — UnitsDB closed enums (quantities, prefixes, units)
- `src/_units_local.yaml` — OIML-specific compound units (m/min, mg/L, etc.)
- `src/modules/` — shared modules (D 11 environmental)
- `src/r*.yaml` — 22 per-Recommendation schemas (draft-07 JSON Schema)
- `src/samples/` — sample cert YAMLs for round-trip testing

## Source

The canonical Ruby source-of-truth for these schemas lives in the
OIML-CS certificates repo. This package holds CNML-synced copies.

## Sync

When the Ruby project schemas update, re-copy:

```bash
cp ../../oiml-cs-certificates/schema/_core.yaml src/
cp ../../oiml-cs-certificates/schema/_units.yaml src/
cp ../../oiml-cs-certificates/schema/_units_local.yaml src/
cp ../../oiml-cs-certificates/schema/_modules/*.yaml src/modules/
cp ../../oiml-cs-certificates/schema/R*.yaml src/
```

## Usage

```typescript
import { R60, CORE, RECOMMENDATIONS, getRecommendation } from "@oimlsmart/cnml-schemas";

const r60 = getRecommendation("R60");
// r60.schema is the JSON Schema for R60
```
