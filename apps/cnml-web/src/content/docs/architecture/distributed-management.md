---
title: Distributed management
description: How threshold cryptography distributes CNML signing authority across geographies, directors, and officers, and how the asynchronous signing ceremony allows participation across time zones.
---

# Distributed management

CNML distributes signing authority across multiple parties using threshold cryptography. The distribution serves two purposes. It removes single-party compromise as a system-wide risk, because producing a CA-level signature requires collaboration among a configured quorum of independent signers. It also allows the signers to be geographically separated, which is a structural property of an international organization whose directors and officers reside in different member states.

![Distributed management](/diagrams/distributed-management.svg)

## Geographic distribution of directors

The BIML Root signing key is held as a threshold secret shared among the OIML directors. The directors are drawn from different OIML member states and reside in different regions. The composition is governed by OIML institutional processes: CIML approval of each director, BIML administration of the ceremony runbook, and a regional-balance requirement that at any time at least four of the seven directors represent distinct OIML regions.

The geographic distribution is a defense against coercion. A directive that targets one director's national jurisdiction cannot complete a root-tier signature, because the threshold requires participation from directors in other jurisdictions. The same property defends against facility loss: the loss of one director's location does not reduce the number of available shares below the threshold, as long as the remaining directors can participate.

## The IA officer quorum

Each Issuing Authority operates its own threshold quorum for intermediate signatures. The typical configuration is two-of-three officers. The officers are IA staff who hold their shares on personal hardware tokens (a PKCS#11-compatible device). The IA operates its own coordinator service or has BIML operate one on its behalf.

The IA quorum is independent of the BIML director quorum. Compromise of the IA quorum cannot produce a root-tier signature, and compromise of the director quorum cannot produce an IA-tier signature. The two quorums are keyed through separate distributed key generation ceremonies, and their aggregate public keys are independent. The IA's aggregate public key is bound to the BIML root through the IA intermediate certificate, which carries the scope extension that limits the IA to its authorized Recommendations.

## The asynchronous signing ceremony

![Async signing flow](/diagrams/async-signing-flow.svg)

The directors are distributed across time zones and cannot coordinate synchronously. CNML uses an asynchronous signing protocol that allows each participant to contribute when convenient. The protocol is mediated by a coordinator service operated by BIML.

The ceremony begins when a signing request enters the coordinator. The coordinator dispatches a signing session and notifies the eligible participants. Each participant reviews the request (the certificate to be signed, the scope, the requesting party) and decides whether to contribute. A participant who approves opens a signing panel in their browser, authenticates with their hardware token, and produces a signature share. The share is encrypted to the coordinator and submitted.

The coordinator buffers incoming shares. The coordinator is honest-but-curious: it can observe that shares have been submitted and can log their existence, but it cannot reconstruct the signing key from the shares it holds, because the threshold property prevents any party holding fewer than the threshold number of shares from reconstructing the key. The coordinator aggregates the shares once the threshold is reached, produces the aggregate signature, and publishes it to the transparency log. The aggregate signature is verifiable under the quorum's aggregate public key, which is a fixed property of the committee and does not change between signing sessions.

## Coordinator aggregation

The coordinator's role is session management and aggregation. It tracks which sessions are open, which participants have contributed, and whether the threshold has been reached. It does not hold signing key material. A compromised coordinator can delay or suppress a signing session (a denial-of-service risk), but it cannot forge a signature, because it cannot produce valid shares on behalf of directors it does not control.

The coordinator's observations are recorded in the hash-chained audit log. Every session lifecycle event (dispatch, share received, threshold reached, signature published) is appended to the log, and the log is anchored to the transparency log. A director or an auditor can reconstruct the full history of a signing session from the audit log entries. The audit log is treated in [Transparency and audit](/docs/architecture/transparency).

## Re-sharing for institutional change

When a director departs (term end, resignation, removal, or death), the remaining committee re-shares to a new committee that excludes the departing director and includes the replacement. The re-sharing ceremony produces a new set of shares for the new committee, but the aggregate public key is unchanged. All certificates issued under the old committee remain valid under the new committee, because the aggregate public key is the verification key and it has not changed.

The re-sharing property is the mechanism that allows institutional change without cryptographic disruption. Directors rotate on staggered terms, officers change roles within an IA, and the system adapts without reissuing certificates or breaking verification. The full treatment of failure modes and recovery timelines is in [Redundancy and continuity](/docs/architecture/redundancy).

## Confidentiality through threshold encryption

Test reports submitted by test laboratories to Issuing Authorities may contain manufacturer intellectual property. CNML supports threshold encryption of the confidential sections of such reports to the IA quorum's threshold public key. A test laboratory encrypts the confidential payload to the IA's threshold public key and submits the encrypted payload as part of the type-approval package. Decryption requires a threshold ceremony among the IA officers: no single officer can decrypt the payload, and the coordinator cannot decrypt it. The technique is surveyed in [NIST IR 8214](https://doi.org/10.6028/NIST.IR.8214) under threshold decryption.

## See also

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) introduces the threshold-signature substrate.
- [Redundancy and continuity](/docs/architecture/redundancy) describes the system's behavior under loss of directors, officers, hardware, or facilities.
- [Transparency and audit](/docs/architecture/transparency) develops the audit log and the Merkle transparency log.
- [Confium integration](/docs/architecture/confium-integration) describes the binding paths through which the CA server and the browser invoke the threshold-cryptography framework.
