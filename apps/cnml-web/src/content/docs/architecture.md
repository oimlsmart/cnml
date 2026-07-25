# CNML Architecture

CNML has a strict layering: **CORE → shared modules → per-Recommendation → instance**.

![Certificate model layers](/diagrams/certificate-layers.svg)

## CORE

`_core.yaml` defines the universal fields every OIML cert has:

- `Certificate` — number, scheme, project_number, dates, member_state
- `Party` — applicant / manufacturer / issuing authority (name, address, contact)
- `StructuredValue` — every characteristic is wrapped in this shape (value, unit_id, footnote_markers)
- `Recommendation` — id (R60, R76, ...), edition, amendment, scheme, accuracy_classes
- `TestReport`, `RevisionEntry`, `Footnote`, `Component`, `ModelVariant`

CORE never changes per-Recommendation. It's the stable base.

## Shared modules

Cross-cutting concerns used by multiple Recommendations:

- **D 11 environmental** — climatic (H1/H2/H3), mechanical (M1/M3), electromagnetic (E1/E3) classes from OIML D 11:2013. Used by 14+ Recommendations.
- **Power supply, software, warm-up, weighing capacity** — smaller shared modules.

## Per-Recommendation

Each R (R21, R31, R46, R49, R50, R51, R60, R61, R76, R85, R99, R105–R111, R117, R126, R129, R134, R136, R137, R139) extends CORE + modules with R-specific fields:

- **R60**: `AccuracyClass` enum `{A, B, C, D}`, `LoadCellCharacterization` `{analog_passive, analog_active, digital_passive, digital_active}`, `ClassificationSymbol` pattern (C3, C3MI7.5, ...), `HumidityMarking` (CH/NH/SH — distinct from D 11 H1/H2/H3), 15 D 11 tests applicable.
- **R76**: `AccuracyClass` Roman numerals (I, II, III, IIII), `InstrumentType` (single/multi-interval).
- **R117**: decimal accuracy `{0.3, 0.5, 1, 1.5, 2.5}`, `PressureReference` `{gauge, absolute, differential}`.
- **R134**: three independent axes — vehicle_mass, axle_load, axle_group_load.
- And so on for the other 18 Rs.

## Instance

A real certificate file (one of 880 in the source-of-truth YAML dataset). Each instance validates against its R's schema and serializes to CNML XML.

## Architecture stack

![System architecture](/diagrams/architecture.svg)

The web app (TypeScript) reads schemas from `@cnml/cnml-schemas`, generates forms via `SchemaForm`, signs via `xmldsigjs`, and outputs CNML XML via `@cnml/cnml-xml`. The Ruby project stays YAML-only — it's the source of truth, not a CNML producer.
