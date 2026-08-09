---
title: CNML format specification
coord: SPEC / 01
---

# CNML format specification

This document specifies the CNML (Certificat Numerique de Metrologie
Legale) digital certificate format.

## Namespace and version

The CNML XML namespace is:

```
https://oimlsmart.org/schemas/cnml/1.0
```

The version is encoded in the namespace URI. The current format
version is 1.0.

Compatibility rule (W3C convention): same major version is
compatible. Newer minor fields are gracefully ignored by older
verifiers. Different major versions are incompatible.

## Document structure

A CNML document is an XML document with the root element
`cnml:certificatNumeriqueMetrologieLegale`. The document has two
main sections:

1. `administrativeData`: certificate metadata, parties, recommendation
2. `measurementResults`: type evaluation results and characteristics

```xml
<cnml:certificatNumeriqueMetrologieLegale
    xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0"
    xmlns:unitsml="https://unitsml.org/ns/unitsml"
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
    schemaVersion="1.0">
  <cnml:administrativeData>...</cnml:administrativeData>
  <cnml:measurementResults>...</cnml:measurementResults>
</cnml:certificatNumeriqueMetrologieLegale>
```

## Per-Recommendation schemas

Each OIML Recommendation has its own JSON Schema (draft-07) that
defines the fields specific to that instrument category. The schemas
live at `packages/cnml-schemas/src/schemas/R*.yaml`.

The core certificate model (shared across all Recommendations) is
defined in `_core.yaml`. Per-Recommendation schemas extend this model
with Recommendation-specific fields.

## Units

Measurement units use the UnitsML namespace. Unit identifiers resolve
through UnitsDB, which traces back to BIPM Digital SI.

## Signature

CNML documents are signed with XMLDSig (W3C XML Signature Syntax and
Processing 1.1). The signature is enveloped inside the root element.
See the [XMLDSig profile](/docs/specifications/xmldsig-profile) for
algorithm details.

## Instance certificates

Instance certificates (tier 5) bind a specific physical instrument to
its model certificate. The root element is
`cnml:instanceCertificate` with `tier="5"`.

## References

- W3C XML Signature Syntax and Processing 1.1
- RFC 6962 Certificate Transparency
- OIML R-Recommendations (per-Recommendation schemas)
