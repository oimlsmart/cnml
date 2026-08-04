---
title: BIML, CIML, and OIML administration
description: Who governs CNML, who operates it, who audits it — the institutional architecture of OIML applied to the CNML trust framework
---

# BIML, CIML, and OIML administration of CNML

CNML is not just software. It is a **cryptographic trust framework** owned
and operated by the OIML institutional bodies. Without clear governance,
the cryptography is meaningless — a threshold signature is only as
trustworthy as the body that runs the ceremony, attests the quorum, and
adjudicates disputes. This page spells out the administration model in
detail so that member states, observers, and auditors know exactly who
does what, who is accountable, and how decisions cascade into cryptographic
state.

## OIML institutional architecture (recap)

The International Organization of Legal Metrology (OIML) was established
by the **Convention establishing the World Forum on Legal Metrology**
(1955, revised 1968). It is a treaty organization with 60+ member states.
Four institutional bodies exist, with distinct roles in CNML governance:

| Body | Type | Composition | Authority over CNML |
|------|------|-------------|---------------------|
| **International Conference** | Plenary supreme body | All OIML member states; meets every 4 years | Approves the Convention amendments, the OIML Certificate System reform that created CNML, and the BIML/CIML charters that delegate CNML operations |
| **CIML** (Comité International de Métrologie Légale) | Steering committee | One delegate per member state; meets annually | Sets policy: which Recommendations adopt CNML, which IAs are eligible, scope allocations, threshold parameters (T/N), revocation rules |
| **BIML** (Bureau International de Métrologie Légale) | Permanent secretariat | Full-time professional staff in Paris | Operates the root CA, runs the transparency log, administers the coordinator service, manages director onboarding, publishes artifacts |
| **Presidential Council** | Steering committee between sessions | CIML President, two Vice-Presidents, BIML Director | Acts on urgent matters (emergency revocations, ceremony postponement) between CIML sessions |

The separation of policy (CIML) from operations (BIML) is the foundation
of CNML's checks and balances. Neither body can move unilaterally: BIML
cannot change its own charter; CIML cannot run a ceremony without BIML
executing it; Presidential Council emergency actions must be ratified by
the next CIML session.

### Why this matters cryptographically

A threshold-signature scheme defends against key compromise, not against
malicious operation. The same 5-of-7 quorum that protects BIML's root
signing key against external attackers also concentrates immense power
in the hands of the 7 directors. Without institutional checks:

- BIML staff could change the coordinator software and silently log false
  audit entries between ceremonies.
- CIML could change quorum parameters (e.g. 5-of-7 → 1-of-2) under
  emergency pressure, weakening the system.
- Directors could sign out-of-scope certificates without accountability
  if no policy body reviewed their actions.

The administration model below is the social layer that makes the
cryptography meaningful.

## CIML: policy authority

The CIML is the policy-making body for CNML. It does not run ceremonies;
it decides the rules under which ceremonies operate.

### Decision rights exclusive to CIML

| Decision | Required majority | Effective date |
|----------|-------------------|----------------|
| Adopt CNML as the OIML certificate system for a Recommendation | Simple majority | Following CIML session |
| Add or remove an Issuing Authority from the DoMC scope list | Two-thirds majority | Following CIML session |
| Change root quorum parameters (T, N) | Two-thirds majority | Next annual ceremony |
| Approve root renewal (algorithm migration, compromise recovery) | Two-thirds majority | Next annual ceremony |
| Approve director credentials (initial appointment, term renewal) | Simple majority | At the ceremony where the director is onboarded |
| Approve emergency revocation of an IA's scope | Simple majority | Effective immediately |
| Approve annual audit report | Simple majority | At the session where the report is presented |
| Amend the Certificate Policy (CP) and Certification Practice Statement (CPS) | Two-thirds majority | Following CIML session |

The two-thirds supermajority threshold on cryptographic parameter changes
(quorum T/N, root renewal) prevents hasty weakening of the trust framework.
A simple majority can change operations; changing the trust anchor itself
requires broad consensus.

### CIML CNML sub-committee

For day-to-day CNML policy work, the CIML delegates a standing **CNML
sub-committee** (5-9 members elected from the CIML, rotating regionally).
The sub-committee:

- Reviews all IA applications for CNML eligibility
- Audits BIML's annual transparency log reconciliation
- Investigates incidents (with the power to convene emergency CIML
  sessions)
- Recommends revocation or scope reduction to the full CIML
- Maintains the Certificate Policy and CPS for CIML approval

Sub-committee members serve 3-year terms, staggered, with a maximum of
two consecutive terms. Membership rotates across OIML regions (Europe,
Asia-Pacific, Americas, Africa, Middle East/Central Asia) to prevent
capture.

### What CIML does *not* do

- Operate any cryptographic ceremony (that is BIML's role)
- Issue individual certificates (that is the IAs' role)
- Hold shares of the root signing key (that is the directors' role)
- Override an individual IA's certificate issuance decisions within
  that IA's certified scope

This separation prevents the policy body from being a single point of
failure. CIML can change rules; it cannot forge certificates.

## BIML: operational authority

The BIML is the operational arm. It runs the infrastructure and
executes the policies CIML sets. Its staff are full-time professionals
based in Paris, with secure facilities for ceremony work.

### What BIML owns and operates

| Asset | Operator | Backup | Notes |
|-------|----------|--------|-------|
| Root signing key share storage (ceremony laptop) | BIML ceremony team | Encrypted backup in 2 geographically separated BIML facilities | Laptop itself never leaves BIML premises; backup encrypted under separate quorum |
| BIML coordinator service (async signing) | BIML infrastructure team | Hot standby in second OIML member state | Honest-but-curious role; cannot reconstruct keys |
| BIML transparency log | BIML infrastructure team | Mirror on confium.org + 3 member-state mirrors | Tree head anchored to Bitcoin via OpenTimestamps |
| Director identity CA | BIML certificate team | Backup of CA key under separate quorum | Issues identity certs to directors; separate from root signing CA |
| IA cert signing infrastructure (BIML-side tooling) | BIML certificate team | CI/CD pipeline + encrypted artifacts | Issues the BIML-signed IA intermediate cert in async ceremony |
| Annual ceremony runbook | BIML operations team | Versioned in git, signed | The procedural document directors follow at the annual ceremony |
| Audit log infrastructure | BIML infrastructure team | Append-only, hash-chained, transparency-logged | Records every privileged operation; tamper-evident |
| Public artifacts CDN (`pki.oiml.org`, planned) | BIML infrastructure team | Multi-region CDN | Root certs, CRLs, IA certs, transparency log heads |

### BIML staff roles in CNML operations

| Role | Count | Authority | Cannot do |
|------|-------|-----------|-----------|
| Director (member of root quorum) | 7 (rotating) | Hold threshold share; participate in ceremonies; vote | Single-handedly sign anything; bypass quorum |
| Ceremony Chair | 1 (rotating BIML staff) | Conducts ceremony, witnesses steps, signs transcript | Cannot change protocol; cannot sign on behalf of a director |
| Certificate Team Lead | 1 | Issues IA certs after CIML approval; manages director identity CA | Cannot sign a CNML cert (that is IA's role) |
| Infrastructure Lead | 1 | Operates coordinator, transparency log, CDN | Cannot trigger signing ceremonies; cannot issue certs |
| Auditor (internal, BIML) | 1 | Reviews audit logs monthly, reports to CIML | Cannot modify audit log; cannot sign anything |
| External Auditor (independent firm) | contracted | Annual audit, reports to CIML | Same restrictions as internal auditor |

The role separation enforces least privilege. A compromise of the
Infrastructure Lead cannot forge a certificate (the Certificate Team
holds that key). A compromise of the Certificate Team Lead cannot
modify the transparency log (the Infrastructure Team operates it).
The Auditor role is read-only by design.

### BIML as honest-but-curious

BIML operates the coordinator service that buffers async signing
commitments and shares from directors. The coordinator sees encrypted
protocol messages and can log their existence, but cannot:

- Reconstruct the root signing key (threshold property)
- Forge a director commitment (director identity-key signatures)
- Tamper with audit logs (hash-chained, transparency-anchored)
- Trigger a signing session without director participation

This is why BIML staff are acceptable operators even though they are
a small group: the cryptography bounds their authority. A malicious
BIML employee can DoS the system (delay coordinator operations, lose
shares) but cannot forge a signature that would be accepted by a
compliant verifier.

## Presidential Council: emergency authority

Between CIML sessions, the Presidential Council (President, two
Vice-Presidents, BIML Director) holds limited emergency authority. This
matters because CNML incidents (key compromise, IA fraud discovery,
ceremony disruption) cannot always wait for the next annual session.

### Emergency actions the Council can take

| Action | Council action | Ratification |
|--------|----------------|--------------|
| Suspend an IA's scope (pending investigation) | Three-signature approval | Must be ratified or reversed by next CIML session |
| Postpone an annual ceremony (force majeure, pandemic) | Three-signature approval | Must be rescheduled within 90 days |
| Authorize async emergency re-sharing (director loss) | Three-signature approval | Audit-logged, full CIML notified within 7 days |
| Initiate incident response (per TODO 22) | Three-signature approval | Incident report delivered to next CIML session |
| Publish transparency log advisory | Three-signature approval | Standing until revoked |

The Council **cannot**:

- Change quorum parameters (CIML two-thirds majority required)
- Approve root renewal (CIML two-thirds required)
- Revoke a director's credentials unilaterally (must follow the
  director-departure runbook in TODO 53, including the relevant
  quorum's participation in re-sharing)
- Override an IA's certified scope decisions (only CIML can do this)
- Issue any cryptographic signature on behalf of a quorum

The Council is an expediter, not a substitute for CIML. Its decisions
are temporary and must be ratified.

## Directors: the cryptographic authority holders

Directors are the 7 individuals whose shares constitute the BIML root
signing quorum. Their role is unique in CNML: they hold the only key
material that, when threshold-combined, can sign anything as BIML.

### How directors are appointed

1. **Nomination**: A member state nominates one of its citizens, with
   CV, security clearance documentation, and signed undertaking
2. **CIML review**: The CNML sub-committee evaluates the nominee's
   qualifications, conflict of interest, and institutional backing
3. **CIML election**: Simple majority at a CIML session
4. **Background check**: Conducted by BIML certificate team with the
   nominating member state's assistance
5. **Ceremony onboarding**: At the next annual ceremony, the new
   director generates their identity keypair on a BIML-provided
   YubiKey, registers their public identity key, and participates in
   re-sharing to receive their root signing share

### Director obligations

- Maintain confidentiality of share material
- Use only BIML-provided hardware (no personal devices for signing)
- Report loss, theft, or compromise of hardware within 24 hours
- Participate in async signing sessions within 72 hours of notification
- Attend the annual ceremony in person (one waiver per director per
  4-year term, only for medical/family emergency)
- Disclose conflicts of interest on any CNML-related matter (e.g.,
   a director whose national industry is the manufacturer being
   certified recuses themselves)
- Submit to periodic security reviews (annual interview, occasional
   device inspection)

### Director terms and rotation

- **Term**: 4 years, renewable once (maximum 8 consecutive years)
- **Staggered**: Terms overlap so that no more than 2 directors depart
  in a given year (continuity of institutional knowledge)
- **Regional balance**: At any time, at least 4 of the 7 directors
  represent distinct OIML regions; this is encoded as an attribute
  predicate in the deployment manifest (see TODO 67 when added)
- **Mandatory rotation**: A director who has served 8 years must step
  down for at least 4 years before being eligible again

### Director departure

When a director leaves (term end, resignation, removal, death), the
remaining T-of-N committee re-shares to a new committee that excludes
the departing director and includes their replacement. The aggregate
public key is **unchanged** — so all IA certs, CNML certs, and instance
certs issued under that root remain valid. The full procedure is
specified in TODO 53 (director-departure-offboarding).

This is the single most important operational property of the threshold
design: institutional change happens without cryptographic disruption.

## Issuing Authorities: certificate issuance authority

Each Issuing Authority (IA) is a national body — typically a
national metrology institute or designated legal-metrology authority
under the OIML DoMC framework (e.g., PTB in Germany, NMi in the
Netherlands). An IA holds a 2-of-3 threshold quorum of its own,
independently keyed via its own distributed key generation (DKG)
ceremony. The IA:

- Holds a BIML-signed IA intermediate certificate, scoped to specific
  Recommendations per the DoMC framework
- Operates its own coordinator service (or has BIML operate one on
  its behalf)
- Issues CNML certificates within its certified scope only
- Manages its own director/officer rotation via re-sharing
- Reports annually to the CIML CNML sub-committee

### What an IA can and cannot do

| Action | IA can do | Notes |
|--------|-----------|-------|
| Sign a CNML cert for an instrument type within its scope | Yes | 2-of-3 officer quorum, async |
| Issue a Manufacturer Model Cert delegating instance signing | Yes | Scope-bound to the manufacturer + model |
| Sign a CNML cert for an instrument outside its scope | **No** | The scope check (TODO 03) rejects it; the IA cert's scope extension forbids it |
| Issue a CNML cert in another IA's scope | **No** | Verifier rejects via scope check; CIML would treat this as a serious incident |
| Revoke its own CNML certs | Yes | Reported to BIML transparency log |
| Revoke a CNML cert issued by another IA | **No** | Only the issuing IA (or BIML by quorum decision) can revoke |
| Change its own threshold parameters | Yes, internally | But must report to BIML for transparency-log record |
| Issue its own root signing key | **No** | Only BIML root quorum can issue an IA cert |

The scope cryptography is the institutional contract made verifiable.
Without it, an IA could (mistakenly or maliciously) issue certificates
for Recommendations it isn't accredited for, and the verifier would
have no way to detect this without an out-of-band lookup.

## Test laboratories and manufacturers

Below the IAs sit the test laboratories (TLs) and manufacturers. They
do not operate threshold infrastructure — they use single-party ECDSA-P256
keys held in their own hardware (YubiKey, HSM, TPM, or PKCS#11 device).
But their authority is cryptographically derived from IA-issued
certificates, so the chain of accountability is verifiable end-to-end.

### Test laboratory role

A TL is accredited by an IA to perform type-evaluation testing per
OIML Recommendations. The TL holds:

- A TL certificate issued by the IA, identifying the TL, its accreditation
  scope, and validity period
- A single-party signing key (YubiKey-backed)
- Optionally, a single-party encryption key (for encrypting test reports
  to the commissioning IA — TODO 36)

The TL **does not** issue CNML certificates. The TL signs test reports;
the IA reviews them and decides whether to issue a CNML. This keeps
the IA as the accountability boundary for type approval.

### Manufacturer role (delegated signing)

A manufacturer producing instruments of an approved model holds a
**Manufacturer Model Cert** issued by an IA. This cert is a scoped
delegation: it authorizes the manufacturer to issue Instance Certs
for instruments of that specific model only (TODO 32).

The manufacturer:

- Holds a single-party signing key
- Issues Instance Certs binding to specific instruments (serial number,
  firmware hash, calibration data)
- Uploads each Instance Cert to the public transparency log
- Cannot issue Instance Certs for any model other than the one in its
  Model Cert scope

This delegation pattern scales CNML to potentially millions of instruments
per year without forcing the IA to sign each one individually — while
keeping the IA as the cryptographic accountability boundary.

## Auditors and oversight

CNML has three layers of audit:

### Internal BIML audit

A BIML staff auditor reviews audit logs monthly. Findings go to the
BIML Director and (if material) to the CIML CNML sub-committee. The
internal audit covers:

- Every signing session transcript (commitments, shares, signatures)
- Every coordinator operation (session lifecycle, dispatch)
- Every transparency log entry (cert issuance, revocation, head updates)
- Every privileged action by BIML staff (key access, config change)

### External annual audit

An independent auditor (rotating every 5 years) conducts the annual
audit. The audit report is public and includes:

- Physical evidence inspection (ceremony laptop chain of custody)
- Transparency log reconciliation against mirrors
- Compliance with Certificate Policy and CPS (TODO 45)
- Review of incident response actions
- Sampling review of issued certificates against IA scope allocations
- Cryptographic protocol review (any deviations logged and explained)

### CIML member-state review

Any OIML member state can request, through the CNML sub-committee,
access to the audit log infrastructure for verification. Member states
operate their own mirror of the transparency log; a divergence between
the canonical log and a member-state mirror is automatically flagged.

## Dispute resolution and escalation

CNML disputes are institutional, not technical. The cryptography either
verifies or it doesn't; if it doesn't, the cert is rejected. The
institutional process handles what happens next.

### Disputes between member states

If member state A disputes a CNML cert issued by member state B's IA:

1. The dispute is filed with the CIML CNML sub-committee
2. The sub-committee investigates (audit log review, technical review,
   consultation with both IAs)
3. If technical defect found: cert revoked, fix applied, public advisory
4. If scope violation: cert revoked, IA scope possibly reduced, CIML
   action
5. If no defect: dispute dismissed, both parties notified

The threshold cryptography guarantees that a single IA cannot
unilaterally produce an invalid certificate. Disputes are about whether
the IA's decision was correct, not whether the signature is real.

### Disputes between an IA and BIML

If an IA believes BIML has acted improperly (e.g., delayed issuing an
IA cert, mishandled an audit, refused a transparency log entry):

1. IA files complaint with CIML CNML sub-committee
2. Sub-committee investigates with full audit log access
3. If BIML staff error: corrected, staff retraining, possibly disciplinary
4. If systemic: report to full CIML, charter revision proposed

### Escalation to the International Conference

The International Conference (every 4 years) is the final escalation
body. It can amend the Convention, replace the BIML Director, or
dissolve the CNML framework entirely (with supermajority and a
multi-year transition). This has never been invoked for CNML.

## Operational cadence

| Cadence | Activity | Body |
|---------|----------|------|
| Continuous | Async signing sessions (CNML cert issuance, IA cert issuance) | IA / BIML quorums |
| Continuous | Transparency log updates | BIML |
| Daily | Coordinator health check, audit log review | BIML |
| Weekly | Public mirror reconciliation | Member states + BIML |
| Monthly | Proactive share refresh (per TODO 53) | All quorums |
| Monthly | Internal audit report | BIML auditor |
| Quarterly | CNML sub-committee meeting | CIML sub-committee |
| Annually | CIML session (policy, audit report approval) | Full CIML |
| Annually | Root operations ceremony (director rotation, root renewal if needed) | BIML directors |
| Annually | External audit | Independent firm |
| Every 4 years | International Conference (Convention amendments, charter review) | All member states |
| Every 10-20 years | Root renewal (algorithm migration) | BIML directors at ceremony |

## Why this matters for adoption

A national regulator considering CNML adoption needs answers to:

- **Who controls the root?** A 5-of-7 director quorum, elected by CIML
  with regional balance, on BIML-provided hardware.
- **Who controls the IA cert?** The BIML quorum signs IA certs after
  CIML approval; the IA then operates its own 2-of-3 quorum for CNML
  cert issuance.
- **Can BIML forge a CNML cert?** No. CNML certs are signed by the IA's
  quorum, not BIML's. BIML can only sign IA certs.
- **Can the IA forge a CNML outside its scope?** No. The scope check
  (TODO 03) rejects it.
- **Can a single compromised employee forge anything?** No. Every
  privileged action requires a threshold quorum.
- **What if BIML is captured by one government?** The 7 directors are
  from different member states; coercing all 5 of 7 is infeasible.
  BIML staff are bound by their role separation; even a fully
  compromised BIML cannot forge signatures.
- **What if the threshold cryptography has a bug?** Cryptographic
  library diversification (TODO 55) defends against single-bug
  failures; formal verification (TODO 60) is on the roadmap.

This institutional architecture is the answer to "why would I trust
this?". The threshold cryptography makes the answer provable; the
governance makes it legitimate.

## References

- OIML Convention (1955, revised 1968) — establishes BIML and CIML
- OIML Certificate System — the framework CNML digitalizes
- OIML DoMC (Declaration of Mutual Confidence) — the IA accreditation
  process
- [BIML scope governance](/docs/biml-governance) — how scope is
  enforced cryptographically
- [Trust model](/docs/trust-model) — who can issue what
- TODO 39 — Director identity management
- TODO 41 — Director onboarding ceremony runbook
- TODO 45 — Certificate Policy and CPS
- TODO 53 — Director departure and offboarding
- TODO 65 — Geopolitical navigation
