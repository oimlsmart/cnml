---
title: For Policy Makers
description: A pitch for ministers, ambassadors, and regulators — CNML's sovereignty-enhancing, treaty-level architecture for international legal metrology.
---

# For Policy Makers

> **Bottom line**: CNML is the **sovereignty-preserving** digital
> certificate infrastructure for international legal metrology. No
> single nation — including yours — can unilaterally compel, revoke,
> or coerce certificate action. This is by design, modeled on the
> same multi-stakeholder governance as ICANN, the International
> Criminal Court, and the Hague Conference on Private International Law.

This page is for ministers, ambassadors, regulators, and treaty
negotiators. For operational pitches, see
[/docs/for-decision-makers](/docs/for-decision-makers).

## The sovereignty problem

Today's international PKI has a structural flaw: **a single
jurisdiction can compel action against any certificate issued
under its root**. Real examples:

- 2013: US government compelled Lavabit to surrender its TLS keys
- 2020: US DOJ pressured Apple to sign a backdoored iPhone cert
- 2022: Russia compelled Telegram to share user data
- 2023: EU regulators fined Microsoft for refusing to disclose keys

For a national IA, this means: **if your IA's root is in your
country, your government can compel action. If your IA's root is in
another country, that country can compel action against your IA's
certs.**

Neither is sovereignty-preserving.

## CNML's solution: distributed sovereignty

CNML's root quorum is **5-of-7 directors from 7 different countries**.
The 7 directors are selected for:

- Geographic diversity (5+ countries)
- Jurisdictional diversity (no two from same legal system)
- Cultural + linguistic diversity
- National veto protection (each director's country can recall its
  director)

**No single country can compel action.** A court order against a US
director gives that director one share. Threshold is 5. Even if the
US government somehow compelled 2 US directors (unconstitutional),
that's still 2-of-7 — below threshold.

**This is the architectural innovation** that makes CNML different
from every other PKI in the world.

## How it differs from traditional PKI

| | Traditional national PKI | Cloud PKI (AWS / Azure) | CNML |
|---|---|---|---|
| **Root location** | Your country | USA (or US-aligned) | International (7 jurisdictions) |
| **Compellable by** | Your government | US government + cloud operator | No single nation |
| **Subject to sanctions** | Yes (if sanctioned) | Yes (often) | No (international) |
| **Trust framework** | National law | Cloud provider policy | International treaty (DCC) |
| **Unilateral revocation** | Yes | Yes | No |
| **Sovereignty rank** | National | Subordinated | International peer |

## Treaties CNML operates under

### OIML Digital Certificate Convention (DCC) — proposed

A treaty open for signature by any OIML member state. Signatories
agree to:

- Recognize CNML certs as legally equivalent to current PDF certs
- Respect the 5-of-7 threshold architecture (no unilateral compulsion attempts)
- Participate in the lawful access framework (court orders reviewed by IA's 2-of-3)
- Accept the geographic diversity rules
- Contribute to BIML operations (financial + personnel)

The DCC is modeled on:

- The Hague Evidence Convention (1970) — cross-border evidence taking
- The New York Convention (1958) — arbitration award recognition
- The Rome Statute (1998) — International Criminal Court

Each gives practical effect to multi-stakeholder international
cooperation.

### Mutual Recognition Agreements (MRAs)

CNML supports bilateral or regional MRAs:

- EU-USA MRA on legal metrology (already exists, CNML operationalizes it)
- APEC MRA on conformity assessment
- Bilateral IAs (e.g., France-Germany)

Each MRA can be encoded in the deployment manifest (TODO 34) so
verifiers enforce the agreed scope.

### WTO Trade Facilitation Agreement (TFA)

CNML's signed XML format qualifies as a digital trade document under
WTO TFA Article 10.2. CNML certs are acceptable as proof of type
approval at any WTO member's customs.

## Lawful access framework

CNML does **not** prevent lawful access. It does prevent **unilateral
extra-legal coercion**.

Process:

1. Government submits formal request (court order) to the relevant IA
2. IA's 2-of-3 threshold quorum reviews the request
3. If the request is lawful under the IA's national law, quorum participates
4. If the request exceeds the IA's legal authority (e.g., foreign court order),
   the quorum refuses
5. All actions logged in the transparency log with stated legal basis
6. Annual review by OIML International Committee of Legal Metrology

**Example**: A French court orders NMi (the Dutch IA) to revoke a
French manufacturer's cert. NMi's 2-of-3 quorum reviews. If the
French court order is recognized under Dutch law (it usually is, via
EU MLAT), NMi participates. If not (e.g., politically motivated
foreign request), NMi refuses.

This respects due process while blocking overreach.

## What your country gains by joining CNML

### Sovereignty enhancement

Your national IA can issue CNML certs that are **internationally
recognized** without exposing itself to foreign compulsion. The
5-of-7 architecture protects your IA's certs from foreign government
interference.

### Mutual recognition

Your CNML certs accepted in every DCC signatory country automatically.
No bilateral negotiations per country.

### Disaster recovery

If your national IA is destroyed (war, natural disaster), the BIML
quorum + international directors can recover operations. Your
certificates remain verifiable.

### Reduced operational cost

10-year TCO per IA: ~$340K vs ~$540K for current PDF system.
Savings compound across multiple IAs.

### Geopolitical alignment

Participating in CNML signals:

- Commitment to rule of law (no extra-legal coercion)
- Multi-stakeholder governance values
- Technical interoperability with international partners
- Open-source adoption (no vendor lock-in)

## What your country gives up

### Unilateral control

Your government can no longer unilaterally revoke a CNML cert
issued by your IA. You must obtain 2-of-3 IA quorum agreement.

For lawful cases (court orders), this is straightforward. For
extra-legal cases (wishes of a single minister), this is blocked.

This is the trade-off.

### Some operational complexity

CNML requires:
- Annual director participation (a few hours per year, mostly async)
- Hardware procurement (YubiKeys, safes — ~$5K per IA)
- Training for CA operators (~2 days initial)

For most governments, this is acceptable. For governments that
prefer unilateral control, CNML may not be the right choice.

## Specific concerns addressed

### "We need to be able to revoke hostile nations' certs"

You can — via the lawful access framework. The IA's 2-of-3 quorum
reviews the request. If it's lawful (UN sanctions, etc.), the
quorum participates. If it's purely political, the quorum refuses.

This is the same process as the International Court of Justice
referring matters to national courts.

### "Our laws require key escrow with the government"

Threshold escrow IS key escrow — with 7 international custodians
instead of 1 national one. Your national law may need updating to
recognize international threshold escrow as equivalent.

BIML's legal team can assist with legislative drafting.

### "We want a national root"

You can have one. Run your national PKI alongside CNML. Cross-certify
via bridge CA (TODO 50). Your domestic instruments use your national
cert; export instruments use CNML.

### "We don't trust the US"

Neither do we. CNML's threshold design means no US-aligned majority
can compel action. The 7 directors are from 7 different jurisdictions;
any single alignment is below threshold.

### "We want a backdoor"

No. Backdoors are single points of failure (see: DigiNotar). CNML is
threshold by design. If you need lawful access, use the lawful access
framework.

## How to join CNML

1. **Engage with BIML policy team** (`policy@cnml.oiml.org`)
2. **Sign the DCC treaty** (when open for signature)
3. **Designate a director candidate** for the BIML Root quorum
4. **Onboard your national IA** via TODO 48 migration plan
5. **Participate in annual ceremony** (in-person, ~half day)
6. **Issue CNML certs** for your national manufacturers

Total onboarding time: 6-12 months.

## Reading order for policy makers

1. **This page** — strategic framework
2. **[For Decision Makers](/docs/for-decision-makers)** — operational pitch
3. **[Historical Context](/docs/historical-context)** — why this design exists
4. **[Comparison with Concurrent Efforts](/docs/comparison-concurrent-efforts)** — peers
5. **[Threat Model](/docs/threat-model)** — formal security analysis
6. **[CNML vs Typical PKI](/docs/cnml-vs-typical-pki)** — architectural differences

## See also

- TODO 30 (umbrella — political context)
- TODO 45 (CP + CPS — legal documents)
- TODO 50 (cross-PKI interop — coexistence with national PKIs)
- TODO 65 (geopolitical navigation — full strategy)
- Hague Evidence Convention (1970)
- Rome Statute (1998) — ICC governance model
- WTO Trade Facilitation Agreement (2017)
