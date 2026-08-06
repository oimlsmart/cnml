---
title: 'For developers'
lede: 'CNML is schema-driven and open-source. The library packages, the per-Recommendation YAML model, and the check registry are the integration surface.'
coord: 'AUD / 06'
---

## The world today

A developer integrating legal-metrology certificate validation into a system works with PDF documents and ad hoc parsing. There is no machine-readable schema for the existing OIML-CS certificate. Each IA may structure its PDF differently. Validation logic is bespoke per integration. The test-evidence layer is unstructured and the calibration-tier documents produced under ISO/IEC 17025 follow a different format again.

The absence of a schema means that every consumer of the certificate reinvents the field model. Field names drift across implementations. Two systems that both claim to validate an OIML-CS certificate may be validating different things. There is no conformance test suite, because there is no specification to conform to.

## What changes

CNML is schema-driven. The per-Recommendation YAML schemas are the specification. The schemas define the fields, the measurement constraints, and the evaluation evidence for each of the 22 OIML Recommendations. The generated TypeScript types and JSON Schemas are reproducible by any contributor. Adding a new Recommendation to the system is the act of dropping a YAML schema file and running `pnpm gen`. There is no per-Recommendation code in the implementation.

The library packages are the integration surface. The packages are `cnml-schemas` (the per-Recommendation schemas and the generated index), `cnml-xml` (the CNML XML parser), `cnml-crypto` (the signing and verification code, including the check pipeline), `cnml-units` (the units handling), and `cnml-dcoc` (the D-CoC interchange serialization). The packages are the same code that the web app uses, so an integration that depends on the packages gets the same behavior as the verify page.

The check pipeline is a registry. Each check is a module that exports a Check object. The verify page iterates the CHECKS array and renders the result. An integration that adds a check writes a new module, adds one line to the CHECKS array, and the check runs in the order specified. The order matters because earlier checks establish the preconditions that later checks depend on.

## What it looks like in practice

The repository is a pnpm workspace with a Ruby gem. The workspace packages live under `packages/`. The web app lives under `apps/cnml-web/`. The Ruby CA server lives under `oiml-pki-server/`.

The build commands are:

```bash
pnpm install                              # install all deps
pnpm gen                                  # regenerate schemas index + TS types from YAML
pnpm build                                # production build + audience-build.ts split
pnpm test                                 # TS unit tests (cnml-test-vectors)
pnpm vectors:gen                          # regenerate 22 pre-signed test vectors
pnpm vectors:verify                       # verify all test vectors round-trip
```

The Ruby CA server commands are:

```bash
cd oiml-pki-server && bundle install
cd oiml-pki-server && ruby app.rb         # Sinatra on http://localhost:4455
cd oiml-pki-server && bundle exec rspec   # full Ruby suite
```

The contribution workflow follows the standard fork-and-pull-request model. The style guide defines the register and the prohibited patterns for all public-facing prose. The code quality rules prohibit doubles in specs, hand-rolled serialization on model classes, `require_relative` for internal library code, and `send` to call private methods.

## Proof

The test vectors are 22 pre-signed CNML files that exercise the per-Recommendation schema coverage. Any contributor can regenerate the vectors with `pnpm vectors:gen` and verify that they round-trip with `pnpm vectors:verify`. The Ruby CA server test suite covers the signing ceremonies and the threshold key management. The TypeScript unit tests cover the XML parser, the check pipeline, and the crypto operations.

The implementation source code is published under an open-source license. The signature pipeline, the X.509 certificate factory, the keystore encryption, the audit log hash chain, and the verifier are all in the repository. Security reports receive priority handling through the repository security advisory mechanism.

## Your next step

Read the [schema-driven design](../docs/implementation/schema-driven-design) page, clone the [GitHub repository](https://github.com/oimlsmart/cnml), and run `pnpm install && pnpm vectors:verify` to confirm the vectors round-trip on your machine.

## See also

- [Technology](../about/technology) lists the standards and binding paths the packages build on.
- [For verifiers](../audiences/verifiers) describes the verify page that uses the same packages.
- [Schemas](../schemas) renders the per-Recommendation JSON Schema index the `cnml-schemas` package produces.
