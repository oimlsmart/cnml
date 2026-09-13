---
title: Transparency operations
description: The operator runbook for the transparency infrastructure: publishing the log, running a mirror, the registry signing ceremony, and multi-log policy.
---

# Transparency operations

This guide is for the people who run the infrastructure: the log
operator (BIML or its designate), independent mirror operators, and
the scheme officer who performs the algorithm-registry signing
ceremony. The verifier side is covered in the
[verification pipeline](/docs/implementation/verification-pipeline);
the conformance claims live in the
[CNML profile of SIGNATIF](/docs/specifications/signatif-profile).

Everything below is one command per responsibility. The software
verifies first and refuses on mismatch: operators never have to
trust the incoming data, and a rejection never overwrites the last
good state.


## The log operator: publishing

The CA server records every issued certificate and every issued CRL
into the Merkle log at the moment of issuance, and artifacts by
their canonical payload hash. Publication is a directory render:

```
cd oiml-pki-server
bin/publish LOG_DIR          # head.json, leaf/, proof/, consistency/, by-hash/, state-index.json
```

What the published directory contains:

| File | Contents |
|---|---|
| `head.json` | The signed tree head: root, size, timestamp, operator signature, operator SPKI |
| `leaf/<seq>` | The raw entry hashes |
| `proof/<seq>.json` | Inclusion proofs (RFC 6962 leaf node hashes) |
| `consistency/<m>.json` | Consistency proofs from size m to the head |
| `by-hash/<sha256>.json` | Entry-hash to sequence index (certificate inclusion) |
| `state-index.json` | Authority-state hash to bound-artifact sequences (revocation propagation) |

Serve the directory from any static file host. The operator key
passed at publication signs every tree head; verifiers check the
signature before trusting any proof against the head.


## A mirror operator: replication with fork rejection

A mirror is run by an organization independent of the log operator.
One command, on a schedule (cron):

```
bin/mirror-sync OPERATOR_PUBLISHED_DIR MIRROR_DIR MIRROR_NAME
```

The mirror rebuilds the tree from the published leaves, confirms
the operator head is the tree's actual root, validates the
consistency proof between its previously observed head and the new
head, and only then republishes. A rejected head leaves the mirror
serving its last verified state and exits non-zero, so monitoring
catches it.

Verifiers combine mirrors through the gossip quorum: a tree head is
trusted for inclusion proofs only when a quorum of independent
sources (default 2-of-3) observes the same head. A fork (two
different roots at one size) is cryptographic evidence of
misbehavior.

Claiming the `/conf/mirror` conformance class requires one
independent party to actually run this.


## The scheme officer: registry signing ceremony

The algorithm registry (active, deprecated, retired) is published at
`/.well-known/cnml/algorithms.json`. Signature over the canonical
registry string binds it to the scheme operator:

```
bin/sign-registry PATH/TO/algorithms.json CEREMONY_KEY.pem
```

Run this on the ceremony machine with the scheme key (HSM-backed
where available). The command verifies its own output before
writing. Verifiers check the signature when present and may be
configured to require a signed registry; deprecation then downgrades
affected artifacts one classification label and retirement
hard-fails them, per the [algorithm agility](/docs/specifications/signatif-profile)
policy.


## Multi-log policy

When more than one log operator exists, the deployment manifest
declares the recognized logs and the M-of-K attestation policy:

```toml
[transparency]
[[transparency.logs]]
name = "primary"
endpoint = "https://log.example.org"

[[transparency.logs]]
name = "mirror-eu"
endpoint = "https://log-eu.example.org"
mirror = true

[transparency.multi_log]
m = 2
k = 3
```

The verifier validates each inclusion proof independently and
accepts the artifact only when at least M of the K recognized logs
include it. Declare the policy when the second operator is stood up.


## The demo deployment

The website itself runs an operated transparency deployment, built and
verified by `oiml-pki-server/bin/build-demo-transparency`:

- **Two logs**, each holding the 22 pre-signed test vectors as leaves
  (the leaves are canonical payload hashes: a verifier recomputes a
  leaf from any formatting of the same document). The second log
  exists for the M-of-K multi-log policy (2-of-2).
- **The mirror** (`cnml-site-mirror`) replicates the primary log,
  validating the consistency proof from its previously observed head
  before republishing, with its observation record published beside
  the replicated view.

The artifacts are committed under `/transparency/` and only ever
extended: the append-only story is the git history itself. Extension
is idempotent: running the tool appends only vectors not yet logged,
re-signs the heads, publishes consistency proofs for the new sizes,
and syncs the mirror (which refuses a head that does not extend its
prior observation).

Continuous verification runs on three surfaces:

1. Every test run: the RSpec suite verifies the committed state
   (heads, every inclusion and consistency proof, the by-hash index,
   the mirror's observation) and that extension is idempotent.
2. Every push: the CI rspec job runs the same verification.
3. Daily: the `transparency-verify` workflow downloads the LIVE
   production artifacts and runs the same verification against the
   committed operator keys, so a deployed view that diverges from a
   consistent extension fails loudly.

The demo operator keys (`oiml-pki-server/demo/`) are demo material,
not the scheme's registry-signing ceremony. The verify page's log
endpoint can point at either view: `/transparency/log` (the
operator) or `/transparency/mirror` (the mirror's replicated copy).

## What each party must never do

- Never publish a head that does not match the log's leaves: every
  mirror rejects it, and the rejection is visible evidence.
- Never accept a consistency-proof failure as a transient error: it
  means history was rewritten or the feed is compromised.
- Never sign the registry with a key that is not ceremony-controlled:
  the signature is only as strong as the key ceremony behind it.
