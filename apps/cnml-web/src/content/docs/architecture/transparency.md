---
title: Transparency and audit
description: The Merkle transparency log, gossip monitoring, OpenTimestamps anchoring to Bitcoin, the hash-chained audit log, and how the CNML architecture supports verifiable operation.
---

# Transparency and audit

CNML is designed so that the operation of the system is observable by any interested party. Every issued certificate is recorded in a public Merkle transparency log. The log's tree roots are anchored to Bitcoin through OpenTimestamps, producing timestamp evidence that is verifiable without trusting the log operator. A gossip protocol ensures that the log operator cannot present different views to different verifiers. A hash-chained audit log records every privileged operation within the CA infrastructure. Together, these mechanisms provide verifiable operation: a verifier or an auditor can confirm that the system has behaved as specified without placing trust in any single party.

![Transparency flow](/diagrams/transparency-flow.svg)

## The Merkle transparency log

Every issued CNML certificate is appended to a public Merkle transparency log. The log also records certificate revocations, threshold decryption events, and share re-sharing ceremonies. The log is a append-only Merkle tree: each entry is a leaf, and the tree is built by hashing pairs of leaves up to the root. The tree root is a fixed-size commitment to the entire log contents at the point it was computed.

A verifier that wishes to confirm that a certificate was legitimately issued requests a Merkle inclusion proof from the log. The proof is a path from the certificate's leaf to the current tree root, consisting of the sibling hashes at each level of the tree. The verifier recomputes the root from the leaf and the sibling hashes and compares the result to the published tree root. If the roots match, the certificate is confirmed to be in the log. A certificate that cannot produce an inclusion proof is rejected by a verifier that demands one.

The log is operated by BIML as the canonical source, and it is mirrored by participating OIML member states. The mirrors serve two purposes: they provide redundancy against loss of the canonical log, and they provide independent observation that detects divergence. The canonical log's tree heads are published to the CDN and are available to any verifier.

## OpenTimestamps anchoring

The log's tree roots are anchored to Bitcoin through OpenTimestamps. OpenTimestamps is a protocol that creates a timestamp proof by committing a hash to the Bitcoin blockchain, where the block's timestamp provides an externally verifiable point in time before which the hash must have existed.

Anchoring the Merkle tree roots to Bitcoin means that the log's state at any past point in time is fixed by the Bitcoin proof. The log operator cannot retroactively alter a past tree root without breaking the Bitcoin proof, because the proof commits to the root hash and the block's timestamp commits to the time. A verifier that holds an anchored tree root can confirm that the log's state at that point in time is consistent with the Bitcoin proof, independently of the log operator.

The anchoring provides long-term timestamp evidence. A CNML certificate signed today carries an OpenTimestamps proof that anchors its presence in the log to a Bitcoin block. Decades later, a verifier can confirm that the certificate was in the log at the anchored time, even if the log operator, the CDN, and the mirrors have all changed in the interim.

## Gossip monitoring

The log's integrity machinery is implemented end to end: every tree head is signed by the log operator, RFC 6962 consistency proofs demonstrate that each head extends the previous one, mirrors validate the proof chain and reject a rewritten log, and a gossip quorum requires independent sources to agree on a head before inclusion proofs are trusted against it. Every issued certificate is recorded in the log at issuance, and the published by-hash index lets a verifier confirm that each certificate on a verification path is included. The operator procedures are documented in the [transparency operations runbook](/docs/guides/transparency-operations).

The transparency log is effective only if all verifiers see the same log. A log operator that could present different views to different verifiers could issue a certificate, show it to one verifier through an inclusion proof, and omit it from the view presented to other verifiers. The gossip protocol prevents this.

Gossip works as follows. Verifiers and mirrors periodically exchange the tree heads they have observed. Each participant compares the tree heads it received from others against the tree heads it observed directly. If a participant received a tree head from the canonical log that differs from the tree head another participant received at the same sequence number, the divergence is flagged. A divergence indicates either a software bug or an attempt by the operator to present inconsistent views. Either case is investigated.

The gossip protocol is the mechanism that makes the transparency log a collective observation rather than a single party's assertion. No single operator can produce a covert certificate that one verifier accepts and another rejects without the divergence being detected by the gossip network.

## The hash-chained audit log

The CA infrastructure maintains a hash-chained audit log that records every privileged operation. Each entry in the log contains a description of the operation, a timestamp, the identity of the actor, and a hash of the previous entry. The hash chain makes the log tamper-evident: altering an entry changes its hash, which breaks the chain at that point and is detectable by any party that holds a copy of the chain.

The audit log records signing session transcripts (commitments, shares, aggregate signatures), coordinator operations (session dispatch, share receipt, threshold aggregation), transparency log updates (cert issuance, revocation, tree head advancement), and privileged actions by BIML staff (key access, configuration change). The log is reviewed monthly by an internal BIML auditor and annually by an external auditor. The audit log's tree head is itself anchored to the transparency log, so the audit log is verifiable against the same Bitcoin proofs that protect the certificate log.

## Verifiable operation

The combination of the transparency log, the OpenTimestamps anchoring, the gossip protocol, and the hash-chained audit log produces a system whose operation is verifiable. A verifier can confirm that a specific certificate was issued (inclusion proof in the log), that it was issued at a specific time (OpenTimestamps proof), and that the log's state has been consistent across observers (gossip). An auditor can confirm that the CA infrastructure's privileged operations followed the specified procedures (audit log).

The transparency property complements the threshold property described in [Distributed management](/docs/architecture/distributed-management). The threshold property defends against single-party compromise of a signing key. The transparency property defends against covert issuance by a committee or an operator. The combination means that neither a single compromised signer nor a covertly operating committee can produce a certificate that a compliant verifier will accept.

## Open and auditable

The transparency log, the audit log, the OpenTimestamps proofs, the trust anchors, and the implementation source code are all published. Any party can operate a mirror of the transparency log and participate in the gossip network. Any party can audit the CA infrastructure's privileged operations from the published audit log. Any party can verify any CNML certificate without contacting the issuer, registering for a service, or holding an account. The OIML SMART programme publishes this documentation as a proposal to OIML. The transparency properties described here are design properties of the proposed system, intended to support OIML's institutional oversight through CIML and the International Conference.

## See also

- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous threshold-signing flow whose sessions are recorded in the audit log.
- [Redundancy and continuity](/docs/architecture/redundancy) treats the failure modes that the mirror redundancy and the gossip detection protect against.
- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) describes the transparency log as one of CNML's architectural properties.
