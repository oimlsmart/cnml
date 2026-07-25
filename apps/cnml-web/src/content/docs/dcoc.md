# D-CoC — Digital Certificate of Conformity

CNML emits certificates not only in its native XML format but also in the
**Digital Certificate of Conformity (D-CoC)** format developed by the
European Coordination Group for Notified Bodies in Legal Metrology (NoBoMet).

## Why a second format?

D-CoC is grounded in the FAIR principles (Findable, Accessible, Interoperable,
Reusable) and on ISO/IEC 17065 + ISO/IEC 17067. It was originally designed
for EU notified bodies certifying measuring instruments under the Measuring
Instruments Directive, but its data structure is general enough to apply to
any product-conformity certificate under the New Legislative Framework.

CNML adopts D-CoC as the **machine-readable interchange format** for OIML-CS
certificates — a lingua franca that downstream consumers (market surveillance,
national metrology institutes, manufacturer registries) can ingest without
having to learn the OIML-specific vocabulary.

See the OIML Bulletin article:
[The Digital Certificate of Conformity (2025-03)](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)

## How is it generated?

The `@cnml/cnml-dcoc` package converts any CNML `Certificate` into a D-CoC
object, then serializes to RDF/XML or JSON-LD:

```ts
import { certToDcoc, dcocToRdfXml, dcocToJsonLd } from "@cnml/cnml-dcoc";

const dcoc = certToDcoc(cnmlCert);
const rdfXml   = dcocToRdfXml(dcoc);    // application/rdf+xml
const jsonLd   = dcocToJsonLd(dcoc);    // application/ld+json
```

## D-CoC top-level elements

| Element                                | Cardinality | CNML source                                   |
| -------------------------------------- | ----------- | --------------------------------------------- |
| `dcoc:certificationScheme`             | 1..1        | derived from `recommendation.scheme`           |
| `dcoc:certificationBody`               | 1..1        | `issuing_authority`                            |
| `dcoc:certNo`                          | 1..1        | `certificate.number`                           |
| `dcoc:revision`                        | 1..1        | latest `revision_history[].revision`           |
| `dcoc:modifications`                   | 0..1        | non-initial `revision_history[]` entries       |
| `dcoc:manufacturer`                    | 1..1        | `manufacturers[0]`                             |
| `dcoc:categoryOfInstrument`            | 1..1        | `certified_type.category`                      |
| `dcoc:certObjectIDs`                   | 1..∞        | `certified_type.type_designations[]`           |
| `dcoc:certDate`                         | 1..1        | `certificate.date_issued`                      |
| `dcoc:certificationCriteria`           | 1..∞        | `recommendation.id` + `edition`                |
| `dcoc:additionallyAppliedDocuments`    | 0..∞        | (future — accuracy class annexes, etc.)        |
| `dcoc:statementOfConformity`           | 1..1        | derived from recommendation + type             |
| `dcoc:validity`                        | 1..1        | derived (OIML-CS certs are indefinite)          |
| `dcoc:responsibles`                    | 1..∞        | `issuing_authority.person_responsible` + applicants |
| `dcoc:previousCertificates`            | 0..∞        | (future — link to predecessor cert)            |
| `dcoc:languages`                       | 1..∞        | `["en"]` (single language so far)              |

## Vocabulary

The D-CoC namespace is `https://oimlsmart.org/ns/dcoc/1.0#`. Standard RDF
vocabularies are reused where appropriate:

- **vcard:** for contact details (`vcard:fn`, `vcard:hasEmail`, `vcard:hasAddress`)
- **dcterms:** for generic metadata (`dcterms:identifier`)
- **rdf:** + **xsd:** for typing (`rdf:parseType="Resource"`, `rdf:datatype="xsd:date"`)

## Sample output

For OIML certificate `R60/2021-A-NL1-26.12 Rev. 0`:

```xml
<rdf:RDF xmlns:rdf="…" xmlns:dcoc="…" xmlns:vcard="…" xmlns:dcterms="…">
  <dcoc:DigitalCertificateOfConformity rdf:about="https://certs.oiml.org/R60-2021-A-NL1-26.12-Rev.-0/rev0">
    <dcoc:certificationScheme>OIML-CS-Scheme-A</dcoc:certificationScheme>
    <dcoc:certNo>R60/2021-A-NL1-26.12 Rev. 0</dcoc:certNo>
    <dcoc:certificationBody rdf:parseType="Resource">
      <vcard:fn>NMi Certin B.V.</vcard:fn>
      <vcard:hasEmail>certin@nmi.nl</vcard:hasEmail>
      <dcoc:registrationID>NL1</dcoc:registrationID>
    </dcoc:certificationBody>
    <dcoc:manufacturer rdf:parseType="Resource">
      <vcard:fn>Técnicas de electrónica y automatismos S.A.</vcard:fn>
    </dcoc:manufacturer>
    <dcoc:certObjectID rdf:parseType="Resource">
      <dcoc:objectIDKind>type_designation</dcoc:objectIDKind>
      <dcoc:objectIDValue>740D</dcoc:objectIDValue>
    </dcoc:certObjectID>
    <dcoc:certDate rdf:datatype="xsd:date">2026-07-02</dcoc:certDate>
    <dcoc:statementOfConformity>The instrument type "740D, 740CPD" conforms to the requirements of OIML R60:2021.</dcoc:statementOfConformity>
    <dcoc:validity rdf:parseType="Resource">
      <dcoc:validFromDate rdf:datatype="xsd:date">2026-07-02</dcoc:validFromDate>
      <dcoc:geographicScope>OIML member states</dcoc:geographicScope>
    </dcoc:validity>
  </dcoc:DigitalCertificateOfConformity>
</rdf:RDF>
```

## Ingest in triple stores

The RDF/XML output can be loaded into Apache Jena, GraphDB, Stardog, or
any RDF-conformant triple store using SPARQL queries against the dcoc:
and vcard: vocabularies.
