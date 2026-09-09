---
title: CNML and verifiable credentials
description: How CNML differs from, improves on, and for legal metrology surpasses the W3C Verifiable Credentials model and the registered-entity (recognition) trust technologies, technically and without disparagement.
coord: CONCEPTS / 07
---

# CNML and verifiable credentials

W3C Verifiable Credentials (VC) and the registered-entity trust
technologies built on them are serious work with genuine strengths,
and CNML interoperates with both. They also rest on a different
foundation from CNML's, and for the domain CNML serves the
difference is decisive. This page makes the case technically: how
the models differ, where CNML is better guarantee by guarantee, and
why, for legal metrology, delegated authority is not one option
among several.

Nothing here disparages the credential model. A technology should
be judged against the problem it was built for, and this page names
the problem each model was built for before it names a winner.


## Different: what a trust link is

The deep difference is what a link in the trust chain *is*.

**In the registered-entity model, a link is a claim.** The anchor
issues a recognition credential that says: this organisation was
recognised, at this time, under this arrangement. The recognised
organisation issues certificates; the verifier resolves the
issuer's identifier, walks the recognition links, and decides
whether to accept what it finds. Trust is an assertion about an
issuer's standing, fetched and checked at verification time.

**In the model CNML instantiates, a link is cryptographic
authority.** The root does not merely recognise an Issuing
Authority; it delegates signing authority to the IA's key, narrowed
to a scope, and the delegation is enforced by the verification
mathematics. A certificate outside the delegated scope does not
verify, whatever anyone asserts about the IA's standing. Authority
flows in the keys, not in statements about the holders of the keys.

The legal system draws the same distinction: a licence and a letter
of reference. Legal metrology issues licences.


## Better, guarantee by guarantee

For each obligation a regulator cannot waive, the two models give a
different guarantee.

| Obligation | Recognition-chain model | CNML |
|---|---|---|
| Forging a root act | One anchor key; its compromise forges recognition at will, unbounded within the model | The root signs under a threshold quorum; no single key exists to steal |
| Covert issuance | Credentials carry no public-record requirement; issuance outside any registry is undetectable | Every certificate enters an append-only log; consecutive heads are tied by consistency proofs; a rewritten history is refused by mirrors |
| Which copy governs | Unsettled; independently fetched documents may disagree | The log's provable history governs over any presented copy |
| Reach of revocation | Stops at the revoked credential | Propagates to every artifact hash-bound to the revoked state, across dimensions and chains |
| Out-of-scope issuance | Detected, if at all, by comparing each artifact against recognition claims after acceptance | Rejected by verification itself; the scope is in the delegation |
| Converging attestations | Independent credentials presented side by side | Co-signatures over one canonical payload; each dimension independently verifiable, each undeniable |
| Field verification | An online protocol; identifier resolution and status fetching | Offline, from an anchor bundle, embedded chains, and cached state, in a browser |
| Retiring an algorithm | A matter of agreement between deployments | A signed registry with active, deprecated, and retired statuses enforced by every verifier |
| Telling the verifier what was not checked | Binary accept or reject | Coverage report, scheme-declared classification, and the gaps named |

Three rows do the most work: covert issuance, reach of revocation,
and field verification. They are the rows that no amount of
ecosystem maturity can close, for the reason the next section
gives.


## Superior for the regulated domain, and why in principle

For accreditation registers, mutual-recognition listings, and
institutional directories, none of the rows above is disabling, and
the recognition model serves those uses well. The regulated domain
is different. Four of the guarantees are not features a deployment
could add later; they are consequences of what a trust link is:

**Covert issuance cannot be detected by a model that imposes no
public record.** A credential issued outside any log has no
detectable absence; there is nothing to compare against. The
transparency log is not an optional add-on to the delegated model;
it is the mechanism that makes issuance public, provable, and
fork-resistant.

**Anchor-key compromise cannot be bounded by a model whose whole
authority is one key's signature.** Under threshold signing there is
no single key to compromise; a quorum of directors must convene,
and the ceremony is itself recorded and auditable.

**Revocation cannot reach the measurements made under a withdrawn
state if the credential never knew what depended on it.** In CNML
each artifact hash-binds the authority states it rests on inside
the signed payload, so withdrawing a state flags every artifact
bound to it, including the readings produced under it.

**Scope cannot be enforced at verification if standing is a claim
about the issuer rather than a property of the keys.** A comparison
made after acceptance can be missed or gamed; a delegation enforced
by the mathematics cannot be argued with.

These four are structural. No status list, directory, or credential
format closes them, because each follows from "a link is a claim".
Each also corresponds to a duty an Issuing Authority operates
under: no single point of forgery, no issuance without record, no
silent withdrawal, no certification outside the mandate. That is
the precise sense in which the delegated-authority model is
superior for this domain. It is not that it does the same things
somewhat better; it is that it does the things without which type
approval cannot become digital.


## What the verifiable-credentials work gets right

The comparison above is possible because the VC work set a high
baseline, and CNML adopts or interoperates with each part of it.

**Subject-centric claims.** A credential says something about a
subject, signed by an issuer, presentable by the subject. The data
model is clean, and the interchanges built on it are widely
implemented. CNML emits its certificates as verifiable credentials
with exactly this shape: see
[interoperability composition](/docs/specifications/composition).

**Compact status surfaces.** A status list packs the revocation
state of every issued credential into one signed, compactly encoded
bitstring a verifier fetches once. CNML verifies status lists
alongside certificate revocation lists: either surface answers the
revocation question, and the scheme declares which it operates.

**Honest legal semantics.** The strongest explorations in the
quality-infrastructure space distinguish what a document attests
from what it authorises, and say so inside the document. CNML
carries the same distinction in its emission: a type approval
attests evaluation; the legal permission to use an instrument comes
only from the competent authority of each jurisdiction.


## Composition, not competition

CNML's certificates are expressible as verifiable credentials, its
revocation surface understands status lists, and its emission
carries the legal-semantics fields the best VC work pioneered. A
quality-infrastructure deployment can present CNML approvals through
VC infrastructure while the authority, transparency, and revocation
machinery stays in the delegated model. The presentation layer and
the authority model are different layers, and each is used where it
is strongest.

The SIGNATIF framework records the same comparison from the
standards side, including what each model must still agree before
independent trust infrastructures interoperate, in its comparison
annexes.


## See also

- [Interoperability composition](/docs/specifications/composition):
  the VC and Digital Product Passport mappings, implemented.
- [CNML and typical PKI compared](/docs/architecture/cnml-vs-typical-pki):
  the same style of comparison against web PKI.
- [CNML profile of SIGNATIF](/docs/specifications/signatif-profile):
  the conformance claims and evidence.
