# ADR-0005: Federated transparency logs with cross-anchoring

## Status

Accepted (2026-08-06).

## Context

TODO.cnml/72 surfaced the design question: should each Issuing Authority
run its own transparency log, or should there be a single global log
operated by BIML?

Three options were considered:

- **Option A: Federated logs (each IA its own log, cross-anchored).**
  Each IA operates its own log. Periodically, each log's root is
  appended to every other log. The set of all logs is verifiably
  consistent.
- **Option B: Single global log (BIML operates the log).**
  BIML runs one log. Every IA publishes to it via a secure append API.
- **Option C: Hybrid (BIML operates the log, IAs run mirrors).**
  BIML is the single source of truth. IAs run read-only mirrors.

Forces in play:

- **IA autonomy.** The DoMC framework treats IAs as independent
  authorities. A single global log operated by BIML centralizes
  trust in a way that conflicts with the IA-autonomy model.
- **Verifier complexity.** Federated logs require the verifier to
  track N logs. The `@oiml/cnml-crypto` check pipeline absorbs this
  complexity once.
- **Gossip protocol.** RFC 6962 §6 describes gossip between
  independent monitors. Federated logs are a natural fit; a single
  global log makes gossip trivial but unnecessary.
- **Failure isolation.** If one IA's log goes down, the other IAs'
  logs continue. A single global log is a single point of failure.
- **Cross-anchoring complexity.** Federated logs need a protocol
  for cross-anchoring. This is real work but the Confium substrate
  already implements distributed coordination.

## Decision

Adopt **Option A: Federated logs with cross-anchoring.**

Each IA operates its own transparency log. The cross-anchoring
protocol works as follows:

1. **Daily cross-anchor.** Each IA appends every other IA's current
   log root to its own log. The root is a 32-byte Merkle root. The
   entry type is `cross_anchor`.
2. **Inclusion proof for cross-anchors.** The cross-anchor entry
   itself gets an inclusion proof in the host log. The verifier can
   prove that IA-A's root was in IA-B's log at a specific time.
3. **Consistency check.** A verifier of a cert in IA-A's log
   follows: cert → IA-A inclusion proof → IA-A root → IA-B
   cross-anchor → IA-B root → ... around the loop. If any IA's root
   does not appear in the others' logs within the cross-anchor
   window (24 hours), the verifier flags a consistency violation.
4. **BIML observer.** BIML operates a gossip witness that fetches
   every IA's head hourly, signs it, and publishes the signed heads.
   Verifiers can check BIML's witness signatures as a liveness
   signal.

Reject Option B because IA autonomy is a hard requirement of the
DoMC framework. A single global log operated by BIML would
centralize trust in a way the framework does not allow.

Reject Option C for the same reason: the mirrors add complexity
without removing BIML as the single source of truth.

## Consequences

**Easier:**

- IA autonomy is preserved. Each IA's log is its own.
- Failure isolation. One IA's log going down does not affect others.
- The gossip protocol matches RFC 6962 §6 naturally.

**Harder:**

- The verifier must track N logs. The check pipeline handles this
  transparently.
- Cross-anchoring is real protocol work. Each IA's CA server must
  fetch other IAs' roots daily and append them.
- BIML's gossip witness is one more service to operate.

**Follow-up:**

- TODO.cnml/71 implements the public publication of each log.
- The cross-anchoring protocol is a future TODO once the logs are
  publicly accessible.
- The BIML gossip witness is a future TODO once the cross-anchoring
  protocol is stable.

## References

- TODO.cnml/72 (the finding this ADR resolves)
- RFC 6962 §6 (gossip protocol)
- ADR-0001 (monorepo with sharp seams — IAs are independent
  deployables)
