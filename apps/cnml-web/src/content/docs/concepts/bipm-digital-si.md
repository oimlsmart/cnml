---
title: BIPM Digital SI and measurement units in CNML
description: How CNML traces every measurement unit to the BIPM Digital SI framework for authoritative, machine-readable definitions.
---

# BIPM Digital SI and measurement units in CNML

Legal-metrology certificates report measurement results, and every
measurement result carries a unit. The authority for that unit traces
to the International System of Units (SI), maintained by the Bureau
International des Poids et Mesures (BIPM). The BIPM Digital SI
framework brings the SI into a machine-readable form that CNML
consumes directly. Every unit that appears in a CNML certificate
traces through an unbroken authority chain to the SI definition.

## Why the SI matters for legal metrology

A load-cell characteristic expressed in kilonewtons, a temperature in
degrees Celsius, and a pressure in pascals all derive their authority
from the SI. When the SI definition is available in a digital form,
downstream systems can verify that a unit identifier refers to the
intended quantity and can perform unit conversions with provenance.

The BIPM Digital SI initiative is the programme through which BIPM
is rendering the SI in a form suitable for machine consumption. The
initiative addresses the need for authoritative, machine-readable
unit definitions that measurement systems, calibration pipelines, and
conformity-assessment infrastructure can reference without ambiguity.

## How CNML references units

CNML embeds unit identifiers directly in the XML certificate. Each
characteristic carries a unit identifier and, where needed, an inline
structured unit fragment. The identifier resolves to the authoritative
SI definition via the BIPM Digital SI framework.

![Unit authority chain](/diagrams/unitsml-embedding.svg)

This design means a measurement result in a CNML certificate is not an
isolated number with an opaque unit string. The unit is resolvable.
A downstream system that receives a CNML certificate can follow the
identifier to the authoritative SI definition and confirm that the
unit means what the certificate says it means.

## Why this matters for legal metrology

Legal-metrology certificates are consumed by systems that did not
produce them and that may operate in different regulatory and
technical contexts. A market-surveillance authority verifying an
instrument in one jurisdiction may need to interpret a certificate
issued in another. A calibration laboratory consuming a CNML test
report as evidence in a subsequent calibration needs to convert units
with confidence. The authority chain through the BIPM Digital SI
framework makes this possible without ad-hoc unit parsing.

## See also

- [System architecture](/docs/architecture/system) describes the
  certificate model and the per-Recommendation schema structure.
- [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc) develops
  the FAIR alignment that benefits from unit traceability.
