---
title: Redundancy and continuity
description: A systematic treatment of CNML failure modes, covering director loss, facility loss, IA officer loss, manufacturer key loss, coordinator failure, transparency log mirror divergence, and CDN outage, with the blast radius, recovery mechanism, and recovery timeline for each.
---

# Redundancy and continuity

CNML is designed to continue operating after the loss of individual directors, officers, hardware keys, facilities, or services. The threshold-cryptography substrate provides the primary redundancy mechanism, and the supporting infrastructure (transparency log mirrors, cached trust anchors, backup hardware) provides secondary mechanisms. This document treats the principal failure modes systematically, identifying for each the blast radius, the recovery mechanism, and the recovery timeline.

![Redundancy and fault tolerance](/diagrams/redundancy-fault-tolerance.svg)

## Director loss

A director may depart through term end, resignation, removal, incapacitation, or death. The blast radius of a single director loss is zero certificates: the director's share is one of seven, and the threshold is five, so the remaining six directors can still produce root-tier signatures. No certificate becomes invalid, and no verifier observes any change.

The recovery mechanism is re-sharing. The remaining committee re-shares to a new committee that excludes the departing director and includes the replacement. The re-sharing ceremony produces a new set of shares, but the aggregate public key is unchanged, so all previously issued certificates remain valid. The recovery timeline is governed by the ceremony cadence: routine departures (term end, planned resignation) are handled at the next annual ceremony, and urgent departures (death, incapacitation, security-driven removal) trigger an emergency re-sharing ceremony authorized by the Presidential Council under its emergency authority. The emergency ceremony is typically completed within days.

If the number of remaining directors falls to or below the threshold, the committee loses the ability to sign until re-sharing restores the headcount. CNML mitigates this by staggering director terms so that no more than two directors depart in a given year, and by maintaining a threshold escrow that allows the surviving committee to recover the aggregate signing capability without the departed shares if a catastrophic loss occurs.

![Re-sharing recovery](/diagrams/resharing-recovery.svg)

## BIML facility loss

The loss of a BIML facility (fire, flood, political event) affects the ceremony laptop, the ceremony runbook, and any locally stored backups. The blast radius depends on what was held at the facility and whether it was the sole copy.

The director shares are not held at any BIML facility: each director holds their own share on their personal hardware token. The ceremony laptop holds ceremony tooling and transitory key material, but the aggregate public key and the director identity certificates are replicated to the transparency log and to the CDN. The runbook is versioned in a git repository with offsite mirrors.

The recovery mechanism is to convene the directors at a backup facility using the replicated runbook and a replacement ceremony laptop. The directors' personal hardware tokens are unaffected by the facility loss. The recovery timeline is the time required to convene a quorum of directors at the backup facility, typically days to weeks depending on travel logistics.

## IA officer loss

An IA officer may depart through the same causes as a director. The blast radius is zero certificates for the same reason: the officer's share is one of three, and the threshold is two, so the remaining two officers can still produce IA-tier signatures.

The recovery mechanism is re-sharing within the IA's quorum. The IA convenes its remaining officers, recruits a replacement officer, and re-shares to the new committee. The aggregate public key is unchanged, so all CNML certificates issued by that IA remain valid. The recovery timeline is shorter than at the BIML Root tier, because an IA's officers are typically co-located or within the same jurisdiction and can convene more quickly.

If an IA loses two of its three officers, the remaining officer cannot produce signatures until re-sharing restores the quorum. CNML mitigates this by recommending that each IA maintain a backup officer who has already been onboarded through a partial re-sharing, so that the recovery does not depend on recruiting and vetting a new officer under time pressure.

## Manufacturer key loss

A manufacturer's signing key may be lost through hardware failure, browser data loss, or passphrase loss. The blast radius is the manufacturer's ability to issue new instance certificates. Existing instance certificates remain valid, because their signatures were produced under the manufacturer's public key and that key is embedded in the certificate.

The recovery mechanism is re-delegation. The manufacturer contacts the IA that issued its Model certificate, proves its identity through the IA's institutional process, and receives a new Model certificate with a new keypair. The old Model certificate is revoked. Instance certificates signed under the old keypair before the revocation date remain valid. The recovery timeline is governed by the IA's institutional process, typically days to weeks.

CNML recommends that manufacturers export their signing keypair to a secure backup (a password manager or a paper backup stored in a physical safe) at provisioning time. The backup defeats the hardware benefit of the browser keystore, but it prevents total key loss, which would require re-delegation for every model the manufacturer produces.

## Coordinator service failure

The coordinator service buffers asynchronous signing messages and aggregates threshold shares. The blast radius of a coordinator outage is the suspension of new signing sessions. Existing certificates remain valid, and verifiers are unaffected, because verification does not contact the coordinator.

The recovery mechanism is a hot standby. BIML operates a backup coordinator in a second location. The standby takes over the session queue when the primary is unavailable. The coordinator holds no signing key material (it is honest-but-curious), so the standby can resume sessions without key recovery. The recovery timeline is the failover time, typically minutes to hours.

If both the primary and the standby coordinator are lost, the directors and officers can still produce signatures through a synchronous ceremony, bypassing the coordinator entirely. The synchronous path is the fallback for total coordinator loss. The recovery timeline for the synchronous path is the time required to convene a quorum synchronously, which is longer than the async path but does not depend on the coordinator.

## Transparency log mirror divergence

The transparency log is mirrored by BIML and by participating member states. A divergence between mirrors indicates either a software bug or an attempt by the canonical operator to present different views to different verifiers. The blast radius is that verifiers that trust the divergent mirror may see a different log state than verifiers that trust the canonical log.

The recovery mechanism is gossip-based detection. Mirrors exchange tree heads through a gossip protocol. A divergence between mirrors is automatically flagged and reported to the CIML CNML sub-committee for investigation. The investigation determines whether the divergence is a software bug (fixed and the mirrors re-synchronized) or an operational irregular (escalated through the incident response process). The recovery timeline for a software bug is the time to deploy the fix and re-synchronize, typically hours to days. The timeline for an operational irregular depends on the investigation.

The OpenTimestamps anchoring provides an independent check on the log's state at past points in time. A tree root that was anchored to Bitcoin cannot be retroactively altered without breaking the Bitcoin proof. A verifier that holds an anchored tree root can detect any subsequent divergence from that root.

## CDN outage

The static CDN distributes trust anchors, CRLs, and the transparency log heads. The blast radius of a CDN outage is that verifiers cannot refresh their trust bundles during the outage. Existing verifications continue, because the verifier caches the trust bundle after the first download.

The recovery mechanism is multi-region CDN redundancy. The CDN is configured with multiple origin regions and multiple edge locations. An outage affecting one region fails over to another. The CDN serves only static files (no server-side logic), so the failover is straightforward. The recovery timeline is the DNS or anycast failover time, typically minutes.

A verifier that has cached the trust bundle can continue verifying CNML certificates offline indefinitely, until the CRL refresh interval expires. The CRL refresh interval is configurable and is typically set to a month or longer for verifiers in remote locations. The offline verification capability is described in [System architecture](/docs/architecture/system).

## Summary of recovery properties

| Failure mode | Blast radius | Recovery mechanism | Recovery timeline |
|---|---|---|---|
| Director loss | Zero certificates | Re-sharing, unchanged aggregate key | Days (emergency) to next ceremony (routine) |
| BIML facility loss | Ceremony tooling | Backup facility, replicated runbook | Days to weeks |
| IA officer loss | Zero certificates | Re-sharing within IA quorum | Days |
| Manufacturer key loss | New instance signing | Re-delegation by IA | Days to weeks |
| Coordinator failure | New signing sessions suspended | Hot standby, or synchronous fallback | Minutes to hours |
| Transparency log divergence | Inconsistent log views | Gossip detection, investigation | Hours to days (bug), variable (irregularity) |
| CDN outage | Trust bundle refresh suspended | Multi-region CDN failover | Minutes |

The system is designed so that no single failure causes certificate invalidation or verifier breakage. The threshold property at the upper tiers provides redundancy against key loss. The transparency log and its mirrors provide redundancy against log manipulation. The CDN and its multi-region configuration provide redundancy against network outage. The cached trust bundle provides redundancy against total network loss at the verifier.

## See also

- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous threshold-signing flow that the re-sharing ceremonies depend on.
- [Transparency and audit](/docs/architecture/transparency) develops the Merkle transparency log, the gossip protocol, and the OpenTimestamps anchoring.
- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) introduces the threshold property that underlies the redundancy model.
