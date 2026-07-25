# CNML Documentation

Source markdown + SVG diagrams for the CNML documentation site.

- `diagrams/` — SVG source files (see TODO 13)
- Section content lands in TODO 12

## Architecture (preview)

```
oiml-cs-certificates/         # source of truth (Ruby)
  schema/_core.yaml           # CORE OIML cert model
  schema/_modules/*.yaml      # shared modules (D 11, etc.)
  schema/R<NN>.yaml           # per-Recommendation

digital-certificates/         # CNML apps + packages
  apps/cnml-web/              # Astro 7 app
  packages/cnml-xsd/          # XSD schemas
  packages/cnml-types/        # TS types from JSON schemas
  packages/cnml-xml/          # XML serialization
  packages/ptb-dcc-compat/    # PTB DCC compatibility
```
