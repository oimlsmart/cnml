# ADR-0003: npm namespace `@oiml/cnml-*`

## Status

Accepted (2026-08-06).

## Context

The CNML TS packages (`packages/cnml-*`) are pnpm workspace
packages today. They are consumed by this repo and not published.
When the proposal reaches pilot adoption, external integrators
(manufacturers, regulators, national metrology institutes) will
need to `npm install` the verifier, the schema engine, or the QR
generator without forking the repo.

Three naming options were considered:

- **`@cnml/*`** — the CNML org as the namespace. Concise; says
  "part of CNML". But the org that owns the namespace is OIML
  SMART, not CNML. A separate `@cnml` npm org would have to be
  created and administered.
- **`@oiml/cnml-*`** — the OIML org as the namespace, with `cnml-`
  as a per-package prefix. Says "published by OIML" and "this is
  part of CNML" in the same name.
- **`@oiml/*` without `cnml-` prefix** — drop the per-package
  prefix. Concise, but ambiguous: OIML may publish other formats
  (a DCC library, a units library, a SMI twin client) and
  `@oiml/crypto` does not say "crypto for CNML".

Forces in play:

- **Org identity.** The OIML SMART programme operates the npm
  namespace, not a separate CNML organisation. The package name
  should reflect that.
- **Discoverability.** A contributor who sees
  `@oiml/cnml-crypto` in a package.json knows immediately both
  the publisher (OIML) and the product (CNML).
- **Future-proofing.** OIML may publish other TS libraries. The
  namespace should accommodate them without collision.
- **Convention.** The `@scope/product-*` pattern is what Angular
  (`@angular/core`), Babel (`@babel/core`), and Vue
  (`@vue/compiler-core`) use.

## Decision

Adopt the **`@oiml/cnml-*` namespace** for the CNML TS packages,
and `@oiml/` for the project's other published packages.

Renaming map:

| Current | Published |
|---|---|
| `@cnml/cnml-crypto` | `@oiml/cnml-crypto` |
| `@cnml/cnml-schemas` | `@oiml/cnml-schemas` |
| `@cnml/cnml-types` | `@oiml/cnml-types` |
| `@cnml/cnml-xml` | `@oiml/cnml-xml` |
| `@cnml/cnml-units` | `@oiml/cnml-units` |
| `@cnml/cnml-dcoc` | `@oiml/cnml-dcoc` |
| `@cnml/cnml-xsd` | `@oiml/cnml-xsd` |
| `@cnml/cnml-test-vectors` | (not published — internal corpus) |
| `@cnml/ptb-dcc-compat` | `@oiml/ptb-dcc-compat` |

Reject `@cnml/*` because the org that owns the namespace is OIML
SMART, not a separate CNML organisation. The npm org should match
the GitHub org (`oimlsmart`).

Reject `@oiml/*` without the `cnml-` prefix because OIML will
publish other libraries and the prefix keeps the package list
self-describing.

## Consequences

**Easier:**

- External integrators can `npm install @oiml/cnml-crypto` without
  forking the repo.
- The npm namespace matches the GitHub org. No separate npm org to
  administer.
- The `cnml-` prefix keeps the package list self-describing as the
  OIML portfolio grows.

**Harder:**

- Every existing import in the workspace changes from
  `@cnml/cnml-*` to `@oiml/cnml-*`.
- The npm org `@oiml` must be created on npmjs.com and the
  publishing tokens configured.
- The first publish is irreversible — once `@oiml/cnml-crypto` is
  on npm, the name cannot be reused.

**Follow-up:**

- Create the `@oiml` npm org.
- Rename every `package.json` and every import.
- Add a `publish.yml` workflow.
- Document the public API in each package's README.

## References

- Architecture review (2026-08-06): candidate 4
- TODO.cnml/64: npm publish as `@oiml/cnml-*` (the implementation)
- pnpm workspace: `pnpm-workspace.yaml`
