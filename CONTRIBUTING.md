# Contributing to CNML

CNML is the Certificat Numérique de Métrologie Légale, the digital
certificate format developed under the OIML SMART programme. The
format, the TypeScript web implementation, the Ruby CA server, the
per-Recommendation schemas, and the test vectors all live in this
repository. Contributions are welcome.

## Welcome

The following contribution types are welcome:

- **Per-Recommendation schemas** for OIML Recommendations not yet covered.
- **Test vectors** that exercise the existing schemas and the check pipeline.
- **Documentation** improvements (clarity, accuracy, missing sections).
- **Bug fixes** with a regression test.
- **Performance improvements** with a measurement.

The following are not in scope for this repository:

- The OIML SMART style guide itself — that lives in
  [oimlsmart/styleguide](https://github.com/oimlsmart/styleguide).
- The Confium threshold-cryptography core — that lives in the confium
  repository.
- The OIML ontology publication — that lives in
  [oimlsmart/oimlsmart.github.io](https://github.com/oimlsmart/oimlsmart.github.io).

## Setup

Prerequisites:

- Node.js 24 or later
- pnpm 11 or later
- Ruby 3.4 or later (for the CA server)
- OpenSSL 3.x (for X.509 cert + CRL operations)

```bash
git clone https://github.com/oimlsmart/cnml.git
cd cnml
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`. The Ruby CA server:

```bash
cd oiml-pki-server
bundle install
ruby app.rb    # http://localhost:4455
```

## Conventions

### Writing

All public-facing content follows the
[OIML SMART style guide](https://github.com/oimlsmart/styleguide/blob/main/WRITING_STYLE.md).
The binding rules:

- Academic register, not marketing
- No em-dashes (use a comma or colon)
- No "CNML succeeds the PDF" framing — CNML is a new scheme
- No marketing superlatives (cutting-edge, world-class, etc.)
- No naming specific hardware vendors (PKCS#11-compatible devices are
  equivalent)

The style-guide linter enforces these. Run `pnpm lint:style` before
pushing.

### Code

- **Open/closed principle.** Adding a new check, a new KeyProvider
  backend, or a new OIML Recommendation is a new file plus one
  registry entry, not an edit to existing code.
- **DRY.** Shared logic lives in `apps/cnml-web/src/lib/` or the
  relevant package's `src/`. The catch-all routes use
  `markdown-page.ts`. The check pipeline is in
  `packages/cnml-crypto/src/checks/`.
- **Model-driven.** Schemas are data. Per-Recommendation forms render
  from YAML, not from bespoke code. The verify pipeline iterates a
  registry.
- **No AI attribution in commits.** The commit author is the human.
  No `Co-authored-by: Claude` or `Generated with` trailers.

### Commit messages

Descriptive subject line (imperative, lowercase first word preferred)
followed by a body explaining why. Match the existing style:

```
Fix logo color-scheme: use CSS class-based switching, not prefers-color-scheme
```

## Tests

Before pushing:

```bash
pnpm test              # integration vectors + check pipeline
pnpm test:audit        # link integrity, page rendering, OG metadata
pnpm test:crypto       # per-check unit tests
pnpm test:web          # markdown-page helper
pnpm test:lint         # style-guide linter unit tests
pnpm lint:style        # style-guide linter on the corpus
pnpm budget            # bundle size budget
pnpm build             # full production build
```

For the Ruby CA server:

```bash
cd oiml-pki-server && bundle exec rspec
```

For Playwright e2e (auto-starts the dev server on :4455):

```bash
pnpm test:e2e
```

## Adding a new OIML Recommendation

The schema-driven design means no per-R code. To add a new
Recommendation:

1. Drop `packages/cnml-schemas/src/schemas/R<NN>.yaml` with the
   `x-oiml-*` metadata block.
2. Run `pnpm gen` to regenerate the schema index and the TypeScript
   types.
3. Add at least one test vector under
   `packages/cnml-test-vectors/src/vectors/`.
4. Run `pnpm vectors:verify` to confirm the vector round-trips through
   the signer and the verifier.

The new Recommendation appears in the UI, the schemas page, and the
forms automatically.

## Pull requests

- Branch from `main`, rebase before merge.
- The repo uses **rebase-merge**. The PR's commits land linearly on
  `main`; no merge commit.
- One concern per PR. Mixed refactors and feature changes are hard to
  review.
- Include updated tests. A bug fix without a regression test will be
  sent back.
- Run all the test scripts above before requesting review.

## Code review

Reviewers look for:

- Tests covering the change.
- OCP/DRY/MECE adherence.
- Style-guide compliance (run `pnpm lint:style`).
- No AI attribution trailers.
- No accidental deletions of source files (the repo enforces a strict
  "store rather than delete" rule for source).

## Reporting issues

Open a GitHub issue. For security issues, see `SECURITY.md`.

## License

By contributing, you agree that your contributions are licensed under
the project's license.
