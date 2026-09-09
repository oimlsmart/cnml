---
title: CNML and verifiable credentials
description: How CNML relates to the W3C Verifiable Credentials model and to registered-entity (recognition) trust technologies: what each gets right, where the models differ, and why legal metrology requires delegated authority.
coord: CONCEPTS / 07
---

# CNML and verifiable credentials

W3C Verifiable Credentials (VC) and the registered-entity trust
technologies built on them are serious work with real strengths.
This page states plainly how CNML relates to them: what they get
right, where the models differ, and why the requirements of legal
metrology lead to the delegated-authority model CNML
instantiates. The comparison is technical, not competitive in
temperament: the two models solve different problems, and CNML
composes with verifiable credentials rather than competing with
them.


## What the verifiable-credentials work gets right

Three things, and CNML adopts or interoperates with each:

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


## Two models of trust

The deep difference is what a link in the trust chain *is*.

**In the registered-entity model, a link is a claim.** The anchor
issues a recognition credential that says: this organisation was
recognised, at this time, under this arrangement. The organisation
issues certificates; the verifier walks the recognition links to
decide whether to accept one. Trust is an assertion about an
issuer's standing, fetched and checked at verification time.

**In the delegated-authority model CNML instantiates, a link is
cryptographic authority.** The root does not merely recognise the
Issuing Authority; it delegates signing authority to the IA's key,
narrowed to a scope, and that delegation is enforced in the
mathematics. The IA's certificate cannot exist outside its
delegation, and a certificate outside the delegated scope cannot
verify, regardless of what anyone claims about the IA's standing.
Authority flows in the keys, not in statements about the holders of
the keys.

This is the same distinction the legal system draws between a
license and a letter of reference. Legal metrology issues licenses.


## The consequences, requirement by requirement

The choice of model is not aesthetic; each requirement of the
regulated domain follows from it.

**No single compromise may forge a root act.** In the
registered-entity model the anchor signs with one key; compromise of
that key forges recognition at will, and nothing in the model bounds
the damage. In CNML the root signs under a threshold: a quorum of
directors, each holding a share, no share sufficient alone. The key
does not exist in one place to steal.

**Issuance must be a public, provable history.** The
verifiable-credentials model has no answer to "which copy governs"
beyond fetching documents and hoping they agree; the strongest
explorations list this as unsolved. In CNML every issued certificate
enters an append-only transparency log. The log's tree heads are
signed, consecutive heads are connected by consistency proofs, a
mirror that sees a rewritten history refuses it, and the question
"which copy governs" has a technical answer: the log. Covert
issuance is not a posture choice; it is detectable by construction.

**Revocation must reach the artifacts.** A status list says a
credential was revoked. It says nothing about the measurements
produced under the calibration that credential certified. CNML
hash-binds each artifact to the authority states it depends on,
inside the signed payload; revoking a state flags every artifact
bound to it, across dimensions and chains. Revocation propagates to
the readings.

**Signing authority must be scoped, provably.** Recognition
credentials assert that an issuer's *standing* covered a scope; a
separate check must compare each artifact against that assertion. In
CNML the scope is in the delegation itself, narrowed at every link
by a formal invariant, with executable conditions evaluated at
verification time. An out-of-scope certificate does not verify;
there is nothing to compare after the fact.

**Independent attestations must converge on one document.** The
verifiable-credentials model composes independent claims by
presenting them side by side. CNML's co-signatures have the tester
and the calibration authority sign the *same canonical payload* as
the authority, each dimension independently verifiable, each
undeniable. The artifact is the convergence point, not a folder of
credentials.

**Field verification must work offline.** Walking recognition links
and fetching status lists is an online protocol. CNML verifies from
a trust-anchor bundle, embedded chains, and cached state, in a
browser, with no network. A market-surveillance officer in a
warehouse is not a well-connected relying party.

**Migration to post-quantum algorithms must be governed.** A
deployment can migrate cryptosuites by agreement; CNML's migration
runs on a signed algorithm registry with active, deprecated, and
retired statuses enforced by every verifier, so retirement happens
on a published schedule rather than by silent drift.

**The result must be graded honestly.** The verifiable-credentials
model answers yes or no. CNML produces a coverage report of what
was established, a scheme-declared classification of it, and leaves
the accept-or-reject decision to the verifier's own policy. The
verifier is told what was not checked.


## Where each model fits

The registered-entity model is the right tool when the question is
*who is this organisation and what is it recognised for*:
accreditation registers, mutual-recognition listings, institutional
directories. It is a subject-identity technology, and it is good at
that.

The delegated-authority model is the right tool when the question is
*may this key perform this act, and can the act be audited
afterwards*. Type approval is that question. Regulation over
instruments used in trade, health, and safety needs authority that
cannot be forged by one compromised key, issuance that cannot be
covert, revocation that reaches the readings, and verification that
works where the instruments are. Those are not features of a
credential format; they are the obligations of a regulator, and they
require the model CNML builds on.


## Composition, not competition

CNML's certificates are expressible as verifiable credentials, its
passport is already close to the shape, its revocation surface
understands status lists, and its emission carries the
legal-semantics fields the best VC work pioneered. A
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
