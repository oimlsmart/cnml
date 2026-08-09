---
title: Deployment manifest
coord: SPEC / 04
---

# Deployment manifest specification

This document specifies the Confium deployment manifest format.

## Purpose

The deployment manifest (`confium.toml`) is the single source of
truth for a CNML deployment. It defines the five-tier hierarchy,
quorum definitions, transparency log endpoints, and the post-quantum
migration trajectory.

Both the Ruby CA server and the Rust Confium core accept the same
TOML. The Ruby implementation generates the manifest from the
keystore; the TypeScript verifier reads it for trust configuration.

## Structure

The manifest has four top-level sections:

```toml
[deployment]
manifest_version = 1
name = "OIML Pilot 2026"
operator = "BIML"

[tiers.root]
role = "root"
quorum = "root-directors"
signing_algorithm = "FROST-ed25519"

[tiers.ia]
role = "issuing-authority"
parent = "root"
quorum = "ia-officers"
signing_algorithm = "CMP20-ecdsa-p256"

[quorums.root-directors]
threshold = 5
parties = 7
```

## Tier chain

The tier chain is validated on load. Each tier must reference its
parent, forming an unbroken chain from root to instance:

```
root (tier 1) > intermediate (tier 2) > test-lab (tier 3) >
manufacturer-model (tier 4) > instance (tier 5)
```

## Quorum definitions

Each quorum specifies a threshold and party count. The root quorum
(5-of-7 directors) uses FROST threshold signatures. The IA quorum
(2-of-3 officers) uses CMP20. Lower tiers are 1-of-1 (single-party
keys).

## Transparency log

The manifest declares the transparency log operator and endpoint:

```toml
[transparency]
log_operator = "BIML"
log_url = "https://tlog.oimlsmart.org/v1/"
anchoring = "bitcoin"
```

Tree roots are anchored to Bitcoin via OpenTimestamps.

## Validation

The manifest is validated on load. The `DeploymentManifest.validate`
function checks:

- Manifest version matches the expected version
- The tier chain is complete (root to instance)
- Quorum references resolve
- Signing algorithms are supported
- PKCS#11 replacement tokens are not in production configs

## References

- Confium deployment spec (https://confium.org/specs/80-cnml-deployment)
- FROST threshold signatures
- CMP20 (Confium coordinator protocol v1)
