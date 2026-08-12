---
title: FAIR principles and D-CoC
description: How CNML implements the FAIR principles for legal-metrology certificates and interoperates with the Digital Certificate of Conformity framework described in the OIML Bulletin.
---

# FAIR principles and D-CoC

The FAIR principles (Findable, Accessible, Interoperable, Reusable) are a set of guidelines for scientific data management that legal-metrology certificates increasingly adopt. CNML implements the FAIR principles in its native XML format and extends the same implementation to the Digital Certificate of Conformity (D-CoC) framework. This page develops the FAIR alignment, introduces the D-CoC framework as described in the OIML Bulletin article published in March 2025, and explains how CNML produces D-CoC output in RDF/XML and JSON-LD for downstream consumers.

## FAIR principles for legal-metrology certificates

The FAIR principles were articulated in the context of scientific data management and have since been adopted across digital-measurement and conformity-assessment communities. The principles state that data should be Findable through persistent identifiers and rich metadata, Accessible through standardized protocols, Interoperable through shared vocabularies and formats, and Reusable through clear licensing and provenance. Legal-metrology certificates have historically fallen short of the FAIR standard because the PDF carrier does not carry structured metadata, does not expose a machine-readable interface, and does not link to a shared vocabulary.

CNML addresses each FAIR dimension as a property of the format itself. The certificate carries a persistent identifier, a structured metadata block, and a cryptographic signature that establishes provenance. The XML carrier is machine-readable by construction. The per-Recommendation JSON Schemas define the vocabulary for each instrument category. The signature chain establishes the authority path from the BIML Root through the IA to the certificate, providing verifiable provenance. The public transparency log provides a findability index: every issued certificate appears in a globally readable log that any search or indexing system can crawl.

## How CNML implements FAIR

| FAIR dimension | CNML implementation |
|---|---|
| Findable | Persistent certificate identifier; entry in the public transparency log; per-Recommendation metadata in the certificate header |
| Accessible | XML format readable by any standards-compliant parser; no registration or account required to verify; trust anchors and CRLs distributed through a public CDN |
| Interoperable | Per-Recommendation JSON Schema vocabulary; D-CoC output in RDF/XML and JSON-LD for downstream semantic-web consumers; units traced through UnitsDB and UnitsML |
| Reusable | Cryptographic signature establishes provenance; revision history records every amendment; open-source libraries for programmatic access |

The transparency log is the central findability mechanism. Every issued certificate is appended to a Merkle log whose tree head is anchored to Bitcoin through OpenTimestamps. A certificate that is not in the log does not verify against a compliant verifier. This makes the log both a findability index and an integrity guarantee.

The interoperability dimension is where D-CoC contributes. The D-CoC format provides a semantic-web representation of the certificate that downstream consumers can ingest using standard RDF tooling. This extends CNML's reach beyond the legal-metrology community to the broader digital-quality-infrastructure ecosystem.

## The D-CoC framework

The Digital Certificate of Conformity (D-CoC) framework was developed for product-conformity certification under the European New Legislative Framework. It is grounded in ISO/IEC 17065 (requirements for bodies certifying products, processes, and services) and ISO/IEC 17067 (fundamentals of product certification and conformity assessment). The framework was originally designed for measuring instruments certified under the European Measuring Instruments Directive, and its data structure is general enough to apply to any product-conformity certificate.

The foundational description of D-CoC in the OIML context appears in the OIML Bulletin article "[Digital Certificate of Conformity](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)" (March 2025), authored by PTB colleagues. That article develops the D-CoC data model, the FAIR alignment, and the interoperability goals that motivate the format. CNML's D-CoC output interoperates with the framework described in that article. The OIML SMART programme acknowledges the contribution of the D-CoC work to the broader digital-quality-infrastructure community.

## How CNML produces D-CoC output

CNML produces D-CoC output as a secondary serialization alongside its native XML format. The `@oiml/cnml-dcoc` package converts any CNML `Certificate` into a D-CoC object that the package then serializes to RDF/XML (`application/rdf+xml`) or JSON-LD (`application/ld+json`). A downstream consumer that operates a triple store or a JSON-LD-aware pipeline can ingest the D-CoC output without learning the OIML-specific CNML vocabulary.

The D-CoC namespace is `https://oimlsmart.org/ns/dcoc/1.0#`. Standard RDF vocabularies are reused where appropriate: vcard for contact details, dcterms for generic metadata, and rdf and xsd for typing. The D-CoC elements map to CNML fields as follows.

| D-CoC element | CNML source |
|---|---|
| `dcoc:certificationScheme` | Derived from `recommendation.scheme` |
| `dcoc:certificationBody` | `issuing_authority` |
| `dcoc:certNo` | `certificate.number` |
| `dcoc:revision` | Latest `revision_history` entry |
| `dcoc:modifications` | Non-initial `revision_history` entries |
| `dcoc:manufacturer` | `manufacturers[0]` |
| `dcoc:categoryOfInstrument` | `certified_type.category` |
| `dcoc:certObjectIDs` | `certified_type.type_designations` |
| `dcoc:certDate` | `certificate.date_issued` |
| `dcoc:certificationCriteria` | `recommendation.id` and `edition` |
| `dcoc:statementOfConformity` | Derived from recommendation and type |
| `dcoc:validity` | Derived from OIML-CS validity period |
| `dcoc:responsibles` | `issuing_authority.person_responsible` and applicants |
| `dcoc:languages` | `["en"]` (extensible) |

The RDF/XML output can be loaded into Apache Jena, GraphDB, Stardog, or any RDF-conformant triple store using SPARQL queries against the dcoc and vcard vocabularies. The JSON-LD output can be consumed by any JSON-LD processor and integrates with linked-data pipelines that traverse the broader quality-infrastructure graph.

The implementation detail of the D-CoC output, including the serialization code and the full element mapping, appears in [D-CoC output and FAIR interchange](/docs/implementation/dcoc-output).

## FAIR as a shared principle

Both CNML and the D-CoC framework treat FAIR as a shared design principle. CNML applies FAIR to the type-approval tier under OIML-CS. D-CoC applies FAIR to the conformity-assessment tier under the New Legislative Framework. The two formats address different regulatory contexts but share the goal of making conformity documentation machine-readable, persistently identifiable, and semantically interoperable. A certificate that carries both a CNML signature and a D-CoC serialization is findable, accessible, interoperable, and reusable across both communities.

## See also

- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) develops the complementarity between CNML and PTB's Digital Calibration Certificate at the calibration tier.
- [D-CoC output and FAIR interchange](/docs/implementation/dcoc-output) documents the serialization implementation and the full element mapping.
- [OIML Bulletin D-CoC article, March 2025](https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)
