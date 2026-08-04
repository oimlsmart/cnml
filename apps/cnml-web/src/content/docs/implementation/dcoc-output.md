---
title: D-CoC output and FAIR interchange
description: The implementation of Digital Certificate of Conformity output in CNML, covering RDF/XML and JSON-LD serialization, the vocabulary, and triple-store ingestion.
---

# D-CoC output and FAIR interchange

CNML emits certificates in its native XML format and in the Digital Certificate of Conformity (D-CoC) format. The D-CoC format is grounded in the FAIR principles for scientific data (Findable, Accessible, Interoperable, Reusable) and on the ISO/IEC 17065 and ISO/IEC 17067 conformance-assessment standards. It was originally developed for notified bodies certifying measuring instruments, and its data structure is general enough to apply to any product-conformity certificate. CNML adopts D-CoC as the machine-readable interchange format for OIML-CS certificates, providing a lingua franca that downstream consumers (market-surveillance systems, national metrology institutes, manufacturer registries) can ingest without learning the OIML-specific vocabulary.

The OIML Bulletin article "[Digital Certificate of Conformity](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)" (March 2025), authored by PTB colleagues, develops the D-CoC framework that CNML's output interoperates with. That article is the foundational description of the D-CoC concept and its application to legal metrology. CNML's D-CoC output is designed to be consumable by the systems described in that article.

## Generation

The `@cnml/cnml-dcoc` package converts a CNML certificate into a D-CoC object and serializes it to RDF/XML or JSON-LD. The conversion is deterministic: the same CNML certificate always produces the same D-CoC output.

```ts
import { certToDcoc, dcocToRdfXml, dcocToJsonLd } from "@cnml/cnml-dcoc";

const dcoc = certToDcoc(cnmlCert);
const rdfXml = dcocToRdfXml(dcoc);   // application/rdf+xml
const jsonLd = dcocToJsonLd(dcoc);   // application/ld+json
```

The `certToDcoc` function reads the CNML certificate's fields and maps them to the D-CoC element set. The `dcocToRdfXml` function serializes the D-CoC object to an RDF/XML document that uses the D-CoC vocabulary and standard RDF vocabularies. The `dcocToJsonLd` function serializes the same object to a JSON-LD document that carries the same triples in a JSON syntax.

## D-CoC elements and CNML sources

The D-CoC element set maps to CNML certificate fields as follows.

| D-CoC element | Cardinality | CNML source |
|---|---|---|
| `dcoc:certificationScheme` | 1..1 | `recommendation.scheme` |
| `dcoc:certificationBody` | 1..1 | `issuing_authority` |
| `dcoc:certNo` | 1..1 | `certificate.number` |
| `dcoc:revision` | 1..1 | latest `revision_history` entry |
| `dcoc:modifications` | 0..1 | non-initial `revision_history` entries |
| `dcoc:manufacturer` | 1..1 | `manufacturers[0]` |
| `dcoc:categoryOfInstrument` | 1..1 | `certified_type.category` |
| `dcoc:certObjectIDs` | 1..infinity | `certified_type.type_designations` |
| `dcoc:certDate` | 1..1 | `certificate.date_issued` |
| `dcoc:certificationCriteria` | 1..infinity | `recommendation.id` and `recommendation.edition` |
| `dcoc:additionallyAppliedDocuments` | 0..infinity | accuracy-class annexes and supplementary documents |
| `dcoc:statementOfConformity` | 1..1 | derived from recommendation and type |
| `dcoc:validity` | 1..1 | derived from OIML-CS certificate validity rules |
| `dcoc:responsibles` | 1..infinity | `issuing_authority.person_responsible` and applicant parties |
| `dcoc:previousCertificates` | 0..infinity | predecessor-certificate links |
| `dcoc:languages` | 1..infinity | language tags present on the certificate |

The `dcoc:statementOfConformity` element carries the human-readable conformity statement. For a CNML certificate issued under OIML R60, the statement reads that the instrument type conforms to the requirements of the specified OIML Recommendation edition.

## Vocabulary

The D-CoC namespace is `https://oimlsmart.org/ns/dcoc/1.0#`. Standard RDF vocabularies are reused where appropriate. The `vcard` vocabulary is used for contact details (`vcard:fn`, `vcard:hasEmail`, `vcard:hasAddress`). The `dcterms` vocabulary is used for generic metadata (`dcterms:identifier`). The `rdf` and `xsd` vocabularies are used for typing (`rdf:parseType="Resource"`, `rdf:datatype="xsd:date"`).

## Sample RDF/XML output

The following is an excerpt of the RDF/XML output for a certificate issued under OIML R60.

```xml
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dcoc="https://oimlsmart.org/ns/dcoc/1.0#"
         xmlns:vcard="http://www.w3.org/2006/vcard/ns#"
         xmlns:dcterms="http://purl.org/dc/terms/">
  <dcoc:DigitalCertificateOfConformity
      rdf:about="https://certs.oiml.org/R60-2021-A-NL1-26.12-Rev.-0/rev0">
    <dcoc:certificationScheme>OIML-CS-Scheme-A</dcoc:certificationScheme>
    <dcoc:certNo>R60/2021-A-NL1-26.12 Rev. 0</dcoc:certNo>
    <dcoc:certificationBody rdf:parseType="Resource">
      <vcard:fn>NMi Certin B.V.</vcard:fn>
      <vcard:hasEmail>certin@nmi.nl</vcard:hasEmail>
      <dcoc:registrationID>NL1</dcoc:registrationID>
    </dcoc:certificationBody>
    <dcoc:manufacturer rdf:parseType="Resource">
      <vcard:fn>Tecnicas de electronica y automatismos S.A.</vcard:fn>
    </dcoc:manufacturer>
    <dcoc:certObjectID rdf:parseType="Resource">
      <dcoc:objectIDKind>type_designation</dcoc:objectIDKind>
      <dcoc:objectIDValue>740D</dcoc:objectIDValue>
    </dcoc:certObjectID>
    <dcoc:certDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2026-07-02</dcoc:certDate>
    <dcoc:statementOfConformity>The instrument type "740D, 740CPD" conforms to the requirements of OIML R60:2021.</dcoc:statementOfConformity>
    <dcoc:validity rdf:parseType="Resource">
      <dcoc:validFromDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2026-07-02</dcoc:validFromDate>
      <dcoc:geographicScope>OIML member states</dcoc:geographicScope>
    </dcoc:validity>
  </dcoc:DigitalCertificateOfConformity>
</rdf:RDF>
```

## Triple-store ingestion

The RDF/XML output can be loaded into any RDF-conformant triple store, including Apache Jena, GraphDB, and Stardog. Once loaded, the D-CoC data is queryable through SPARQL against the `dcoc` and `vcard` vocabularies. This enables downstream consumers to integrate OIML-CS certificate data into their existing knowledge-graph infrastructure without building a CNML-specific parser.

The JSON-LD output serves the same purpose for consumers that prefer JSON-based tooling. A JSON-LD document carries the same triples as the RDF/XML document and can be loaded into the same triple stores through their JSON-LD import facilities, or consumed directly by JSON-LD-aware application frameworks.

## FAIR alignment

CNML's D-CoC output aligns with the FAIR principles. The D-CoC document is Findable through its persistent identifier (the `rdf:about` URI) and its registration in the public transparency log. It is Accessible through standard HTTP retrieval of the URI. It is Interoperable through its use of standard RDF vocabularies and its serialization in two widely supported formats (RDF/XML and JSON-LD). It is Reusable through its clear provenance (the CNML certificate and the signing IA), its explicit license framework (to be determined in coordination with OIML), and its grounding in the ISO/IEC 17065 and ISO/IEC 17067 conformance-assessment standards.

## Proposal status

CNML is a proposal for OIML from the OIML SMART programme. The D-CoC output described here is a draft implementation. The vocabulary, the element mapping, and the serialization formats are subject to revision as the proposal evolves and as the D-CoC framework described in the OIML Bulletin article develops further.

## See also

- [FAIR principles and D-CoC](/docs/concepts/fair-and-dcoc) develops the D-CoC relationship and references the OIML Bulletin article.
- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) describes how CNML complements the PTB Digital Calibration Certificate at a different tier of metrology.
- [Schema-driven design](/docs/implementation/schema-driven-design) describes the schema layer that the D-CoC conversion reads from.
- [OIML Bulletin D-CoC article, March 2025](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)
