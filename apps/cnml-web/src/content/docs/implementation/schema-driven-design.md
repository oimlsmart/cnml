---
title: Schema-driven design
description: The schema is the specification. CNML renders all Recommendation forms, verification checks, and key backends from declarative data sources, not from bespoke code.
---

# Schema-driven design

CNML is built on the principle that the schema is the specification. Every OIML Recommendation form, every verification check, and every key-storage backend is rendered from a declarative data source rather than from handwritten code. The result is that extending the system requires adding a new file and a registration line, not editing existing modules. This pattern, known as open/closed, is applied uniformly across the schema layer, the verification pipeline, and the key-provider dispatch.

## The schema layer

The canonical OIML-CS certificate schemas are authored as JSON Schema YAML in the OIML-CS certificates repository. This repository holds synced copies of those schemas in the `packages/cnml-schemas/` package and generates type definitions and a schema index from them. The schema set has three layers.

The first layer is the CORE schema, defined in `_core.yaml`. It specifies the universal fields that every OIML certificate carries: the certificate metadata (number, scheme, dates, member state), the party structures (applicant, manufacturer, issuing authority), the structured-value shape that wraps every measurement characteristic, the recommendation reference, and the shared envelope types (test reports, revision entries, footnotes, components, model variants). CORE never varies per Recommendation.

The second layer is the shared modules. These are cross-cutting fragments used by multiple Recommendations. The D 11 environmental module defines the climatic (H1, H2, H3), mechanical (M1, M3), and electromagnetic (E1, E3) classes from OIML D 11:2013. Smaller modules cover power supply, software identification, warm-up procedures, and weighing-capacity tables. A Recommendation schema includes the modules it needs by reference.

The third layer is the per-Recommendation schema. Each OIML Recommendation has its own YAML file: `R60.yaml` for load cells, `R76.yaml` for non-automatic weighing instruments, `R117.yaml` for dynamic measuring systems for liquids other than water, and so on for all twenty-two Recommendations currently modelled. Each Recommendation schema extends CORE, references the shared modules it requires, and adds the Recommendation-specific fields. For R60, these include the accuracy-class enumeration (A, B, C, D), the load-cell characterization field, the classification-symbol pattern, the humidity-marking field, and the list of fifteen applicable D 11 tests. For R76, these include the Roman-numeral accuracy classes (I, II, III, IIII) and the instrument-type field.

The web application renders every Recommendation form from the corresponding schema through a single recursive form component. There is no per-Recommendation form code. The form component reads the schema, walks each field definition, and renders the appropriate input widget based on the field type, constraints, and metadata.

## Adding a new Recommendation

Adding a new OIML Recommendation to CNML requires three steps that involve no changes to existing source files.

First, a new YAML file is placed at `packages/cnml-schemas/src/schemas/R<NN>.yaml`. The file includes the `x-oiml-*` metadata that the schema generator reads to produce the schema index and the TypeScript types.

Second, the `pnpm gen` command is run. This regenerates `packages/cnml-schemas/src/index.ts` and the contents of `packages/cnml-types/` from the schema set. The schema index is the registry that the web application, the documentation pages, and the test-vector generator all read.

Third, the application is rebuilt. The new Recommendation appears automatically in the form selector, in the schemas page, in the documentation set, and in the test-vector corpus. No source file outside the schemas directory is modified.

This open/closed pattern means that the surface area of a schema change is contained to the schema file itself. A Recommendation that needs a new field type (for example, a new measurement-unit class or a new accuracy-encoding scheme) extends the schema set through a new module or a new field definition in CORE, and every Recommendation that references that module or that CORE field inherits the extension.

## The verification pipeline as an open/closed registry

The verification pipeline applies the same open/closed principle to the checks that a verifier runs against a submitted CNML file. Each check is a module that exports a `Check` object conforming to the `Check` interface defined in `packages/cnml-crypto/src/checks/types.ts`. The check registry, defined in `packages/cnml-crypto/src/checks/index.ts`, holds an ordered `CHECKS` array. The verifier iterates the array generically and renders the result of each check.

The current pipeline order is: XML well-formedness, schema validity, signature validity, scope enforcement, CRL status, timestamp anchoring, and transparency-log inclusion. The order matters because earlier checks short-circuit later ones. A file that is not well-formed XML cannot be schema-validated. A file that fails schema validation cannot have its signature checked meaningfully. Adding a new check requires one new file under `checks/` and one entry in the `CHECKS` array. The verification pipeline is developed further in [Verification pipeline](/docs/implementation/verification-pipeline).

## The KeyProvider dispatch pattern

The key-storage layer applies the open/closed principle to the problem of supporting multiple hardware backends. Each backend is a class that inherits from `OimlPki::KeyProvider::Base` and implements the `sign`, `sign_cert`, `sign_crl`, `public_key`, `extractable?`, and `to_h` methods. The `OimlPki::KeyProvider.for(entry)` factory examines an entry's shape and dispatches to the appropriate backend. An entry with a `confium` key dispatches to the Confium threshold backend, an entry with a `pkcs11` key dispatches to the PKCS#11 hardware backend, and an entry with a `privateKey` key dispatches to the software OpenSSL backend.

Adding a new backend requires three additions and no modifications to existing code. First, the backend class is placed in a new file under `lib/oiml_pki/key_provider/`. Second, an autoload entry is added to `lib/oiml_pki.rb`. Third, a dispatch rule is added to the `for` method in `key_provider.rb`. Existing backends and existing call sites are untouched.

## The generation workflow

The schema-driven design depends on a deterministic generation workflow. The canonical schemas live in the OIML-CS certificates repository. When a schema change is made there, the updated YAML files are synced into `packages/cnml-schemas/src/schemas/` in this repository. Running `pnpm gen` then regenerates the TypeScript types and the schema index from the synced YAML set. Running `pnpm vectors:gen` regenerates the twenty-two pre-signed test vectors. Running `pnpm vectors:verify` confirms that every test vector round-trips through serialization, signing, and verification.

When a schema field or a certificate shape disagrees between this repository and the OIML-CS certificates repository, the OIML-CS certificates repository is authoritative. This rule ensures that the schema set remains a faithful copy of the upstream source of truth and that the generation workflow is reproducible.

## Proposal status

CNML is a proposal for OIML from the OIML SMART programme. The schema-driven design described here is a draft architecture. The schema set, the generation workflow, and the open/closed patterns are subject to revision as the proposal evolves and as OIML Member States and Corresponding Members provide feedback.

## See also

- [System architecture](/docs/architecture/system) describes the five-tier hierarchy and the certificate model that the schemas encode.
- [Verification pipeline](/docs/implementation/verification-pipeline) develops the check registry and the scope-enforcement flow.
- [For developers](/docs/roles/for-developers) covers the contribution workflow for schema and code changes.
