---
title: BIPM Digital SI and measurement units in CNML
description: How BIPM Digital SI provides authoritative unit definitions and how CNML traces units through UnitsDB and UnitsML into the XML certificate.
---

# BIPM Digital SI and measurement units in CNML

Legal-metrology certificates report measurement results, and every measurement result carries a unit. The authority for that unit traces to the International System of Units (SI), maintained by the Bureau International des Poids et Mesures (BIPM). The BIPM Digital SI initiative is bringing the SI into a machine-readable form. CNML consumes that machine-readable SI through two intermediary layers, UnitsDB and UnitsML, so that every unit that appears in a CNML certificate traces through an unbroken authority chain to the SI definition. This page describes that chain and explains how CNML embeds unit references in its XML.

## BIPM Digital SI

The SI is the international system of units, defined by the General Conference on Weights and Measures (CGPM) and maintained by BIPM. The BIPM Digital SI initiative is the program through which BIPM is rendering the SI in a digital form suitable for machine consumption. The initiative addresses the need for authoritative, machine-readable unit definitions that measurement systems, calibration pipelines, and conformity-assessment infrastructure can reference without ambiguity.

The Digital SI work matters to legal metrology because every measurement result in an OIML certificate depends on a unit. A load-cell characteristic expressed in kilonewtons, a temperature in degrees Celsius, and a pressure in pascals all derive their authority from the SI. When the SI definition is available in a digital form, downstream systems can verify that a unit identifier refers to the intended quantity and can perform unit conversions with provenance.

## UnitsDB

UnitsDB is the reference registry of units maintained by the NIST Units program. It provides persistent identifiers for units of measurement, each linked to the SI definition it derives from, and carries metadata including the unit symbol, the quantity kind, and the conversion factors to related units. UnitsDB assigns a stable identifier to each unit that other systems can reference without resolving the full SI definition on every use.

CNML references units by their UnitsDB identifiers. A characteristic in a CNML certificate carries a `unit_id` field whose value is a UnitsDB identifier. This means that the unit of every reported value in a CNML certificate is resolvable to a canonical entry in a maintained registry, which in turn traces to the BIPM Digital SI definition.

## UnitsML

UnitsML is the XML markup language for units of measure, developed under NIST and adopted across the measurement-science community. It provides a structured XML representation of a unit, including its symbol, its quantity kind, and its relationship to the SI base units. UnitsML allows a unit to be embedded inline in an XML document so that a parser can extract the full unit definition without an external lookup.

CNML embeds UnitsML fragments where a certificate needs to express a unit in its full structured form rather than by identifier alone. The embedding pattern keeps the unit definition co-located with the measurement value, so that a verifier or a downstream consumer can process the value without a separate registry fetch. The identifier-based reference to UnitsDB and the inline UnitsML embedding are complementary: the identifier provides the canonical handle, and the inline fragment provides the self-contained description.

![UnitsML embedding](/diagrams/unitsml-embedding.svg)

## The authority chain

The unit authority chain in CNML runs from BIPM Digital SI through UnitsDB through UnitsML to the CNML XML certificate. BIPM Digital SI provides the authoritative definition of the SI unit. UnitsDB provides the persistent identifier and the registry entry that links the unit to its SI definition. UnitsML provides the XML representation that a CNML certificate embeds or references. CNML XML carries the measurement value together with its unit identifier and, where needed, its inline UnitsML fragment.

| Layer | Role | Maintainer |
|---|---|---|
| BIPM Digital SI | Authoritative SI unit definition | BIPM |
| UnitsDB | Persistent unit identifier and registry entry | NIST Units program |
| UnitsML | XML representation of a unit for inline embedding | NIST and the measurement-science community |
| CNML XML | Measurement value with unit identifier and optional inline UnitsML | OIML SMART programme |

This chain means that a measurement result in a CNML certificate is not an isolated number with an opaque unit string. The unit is resolvable. A downstream system that receives a CNML certificate can follow the identifier to the registry, and the registry to the SI definition, and can confirm that the unit means what the certificate says it means.

## Why this matters for legal metrology

Legal-metrology certificates are consumed by systems that did not produce them and that may operate in different regulatory and technical contexts. A market-surveillance authority verifying an instrument in one jurisdiction may need to interpret a certificate issued in another. A calibration laboratory consuming a CNML test report as evidence in a subsequent calibration needs to convert units with confidence. A research pipeline aggregating measurement results across many certificates needs consistent unit handling. The authority chain through BIPM Digital SI, UnitsDB, and UnitsML makes this possible without ad-hoc unit parsing.

The unit-handling model also supports the FAIR alignment developed in [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc). A unit that traces to a machine-readable SI definition is interoperable across systems and reusable across contexts. The D-CoC output that CNML produces for semantic-web consumers benefits from the same unit traceability.

## See also

- [System architecture](/docs/architecture/system) describes the certificate model and the per-Recommendation schema structure within which unit references appear.
- [Schema-driven design](/docs/implementation/schema-driven-design) develops the data-driven schema approach that defines how units appear in each Recommendation form.
