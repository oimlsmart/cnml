# Architecture Decision Records

This directory holds the CNML project's architecture decision
records. Each ADR is a short markdown file that records *why* a
decision was made — not what the decision is (the code says that)
but the context, the alternatives, and the consequences.

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-monorepo-with-sharp-seams.md) | Monorepo with sharp internal seams | Accepted |
| [0002](0002-cloudflare-pages-for-static-site.md) | Cloudflare Pages for the static site | Superseded by ADR-0004 |
| [0003](0003-npm-namespace-oiml.md) | npm namespace `@oiml/cnml-*` | Superseded by ADR-0007 |
| [0004](0004-stay-on-github-pages.md) | Stay on GitHub Pages until a concrete trigger fires | Accepted |
| [0005](0005-federated-transparency-logs.md) | Federated transparency logs with cross-anchoring | Accepted |
| [0006](0006-cnml-smi-boundary.md) | CNML and SMI responsibility boundary | Accepted |
| [0007](0007-npm-namespace-oimlsmart.md) | npm namespace `@oimlsmart` | Accepted |

## Format

Each ADR follows the [Nygard template](https://github.com/joelparkerhenderson/architecture-decision-record-template).

```
# ADR-NNNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-MMMM

## Context
The problem. The forces. The alternatives considered.

## Decision
The choice that was made.

## Consequences
What changes. What becomes easier. What becomes harder.
```

## Maintenance

ADRs are append-only. To reverse a decision, write a new ADR that
supersedes the old one. The old ADR's status changes to
"Superseded by ADR-MMMM" but the file stays in place.

To add a new ADR:

1. Copy `0000-template.md` to `NNNN-short-title.md` (next number).
2. Fill in the template.
3. Add an entry to the index table above.
4. Reference the ADR from the code or doc that implements the
   decision (a one-line comment is enough).

## Tooling

The `adr-tools` CLI (`brew install adr-tools`) automates the
workflow: `adr new "Title"`, `adr list`, etc. The repo does not
require the tool — the directory is plain markdown.
