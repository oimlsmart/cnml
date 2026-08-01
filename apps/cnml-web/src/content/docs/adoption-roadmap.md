---
title: Adoption roadmap
description: 5-year strategy for global CNML adoption — pilot programs, founding members, geographic expansion, and the network effects that drive growth.
---

# Adoption roadmap

> A certificate format is worthless without verifiers. This page
> documents CNML's deliberate strategy to bootstrap demand across
> IAs, customs authorities, test labs, manufacturers, and verifiers
> simultaneously.

## The cold-start problem

CNML faces the classic chicken-and-egg of any new infrastructure:

- **IAs won't issue CNMLs** until verifiers exist
- **Customs won't verify CNMLs** until IAs issue them
- **Manufacturers won't request CNMLs** until customs demand them
- **Customs won't demand CNMLs** until manufacturers request them

Web PKI solved this via browser-vendor mandate (HTTPS everywhere).
CNML has no equivalent central authority. Adoption must be seeded —
but with a **focused pilot**, not a large consortium. Two pilot IAs
and two pilot test labs are enough to prove the full 5-tier flow
end-to-end. The small cohort keeps decisions fast and operational
lessons unambiguous. Scale follows proof.

## Five-year timeline

```
Year 1 (2026) — PILOT
  · 2 pilot IAs (1 European, 1 Asian-Pacific)
  · 2 pilot test labs (1 per pilot IA)
  · First 50 CNMLs issued in parallel with PDFs
  · NIST MPTS submission

Year 2 (2027) — EARLY ADOPTION
  · 5-7 IAs issuing CNMLs (pilot cohort + first followers)
  · 2-3 customs authorities piloting CNML verification
  · 500+ CNMLs issued
  · ISO/IEC JTC 1/SC 27 engagement

Year 3 (2028) — REGIONAL EXPANSION
  · 15+ IAs across 3 regions
  · CNML accepted by WCO (World Customs Organization) members
  · 5,000+ CNMLs issued
  · Manufacturers issuing instance certs at scale

Year 4 (2029) — MAINSTREAM
  · 25+ IAs globally
  · CNML is primary format for new issuances
  · 50,000+ CNMLs in circulation
  · PDFs deprecated in major markets

Year 5 (2030) — UNIVERSAL
  · All OIML member states accept CNML
  · PDF becomes legacy (deprecated 2035)
  · 500,000+ CNMLs in circulation
  · Cross-recognition with eIDAS, FPKI, national DIs
```

## Founding pilot cohort

The founding cohort is intentionally small: **two pilot IAs** and
**two pilot test labs**. This is the minimum viable coalition to
prove the full 5-tier flow end-to-end (BIML root → IA → TL →
manufacturer model → instance) without the coordination overhead
of a larger consortium.

### Pilot IAs (Year 1)

| IA | Country | Region | Joined | Initial scope |
|----|---------|--------|--------|---------------|
| NMi Certin B.V. | Netherlands | Europe | 2026 Q3 | R76, R117 |
| NIM | China | Asia-Pacific | 2026 Q4 | R60, R76 |

Pilot IA selection criteria:

- Demonstrated operational maturity (existing DoMC scope)
- Geographic diversity (one Europe, one Asia-Pacific)
- Willingness to assign 2-of-3 officer quorum participants
- Commitment to issue at least 25 CNMLs in Year 1
- Agreement to share anonymized operational telemetry with BIML
  for the first 12 months

### Pilot test labs (Year 1)

| Test lab | Country | Affiliated IA | Joined |
|----------|---------|---------------|--------|
| NMi Certin Test Lab | Netherlands | NMi | 2026 Q3 |
| NIM Test Lab | China | NIM | 2026 Q4 |

Each pilot test lab is affiliated with one pilot IA, ensuring the
TL → IA encrypted-test-report flow (TODO 36) gets real-world
exercise. The labs commit to:

- Sign all test reports with TL keys (TODO 31)
- Encrypt test reports to their affiliated IA's threshold KEM
  public key
- Provide feedback on the TL UI and ceremony workflow

### Why only two?

A larger founding cohort (5+ IAs, 4+ test labs, 5+ manufacturers)
was considered and rejected. Reasons:

- **Coordination overhead scales superlinearly.** Each additional
  pilot adds ceremony participants, integration calls, and decision
  points. Two IAs keeps decision-making fast.
- **Operational lessons are clearer with fewer variables.** When
  something breaks in pilot, we want to know which IA's setup
  caused it. With two pilots, the differential is immediate.
- **Hardware and training budget goes further.** Two well-supported
  pilots produce better evidence than five under-supported ones.
- **The pilot's job is to prove the loop, not to scale.** Scaling
  happens in Year 2 once the loop is proven.

The pilot cohort expands to the first follower wave in Year 2.
Based on initial discussions, PTB (Germany), NIST (USA), and LNE
(France) are expected to join as first followers.

## Incentive structure

| Audience | Incentive to join early |
|----------|-------------------------|
| **Pilot IAs** | Free hardware ($5K), free training, leadership prestige, co-authorship on the NIST MPTS submission |
| **Pilot customs** | Faster clearance data, reduced inspection load |
| **Pilot test labs** | Free DCC-compatible tooling, automated report signing |
| **Pilot manufacturers** | "CNML-certified" marketing, expedited future reviews |
| **Pilot verifiers** | Free verifier, no install, works offline |

## Subsidized hardware program

CNML Hardware Subsidy Fund (CHSF) provides:

- 20 free YubiKey sets for the 2 pilot IAs (10 each — 3 officers +
  2 directors + 5 spares per IA)
- 10 free YubiKeys for the 2 pilot test labs (5 each)
- 50 free secure elements for the first 5 manufacturers onboarded
  by pilot IAs
- Funded by OIML member state contributions + Ribose sponsorship

Apply at: `adoption@cnml.oiml.org`

## Reference deployments

CNML maintains reference deployments for every audience:

### `deployments/reference-ia/`
- Full IA deployment: Ruby CA + manifest + 2 directors + coordinator
- Docker compose: deployable in < 1 hour
- Includes sample CNML issuance flow

### `deployments/reference-verifier/`
- Standalone verifier service
- Loads trust anchors from 3 channels
- 7-check pipeline + trust grade UI

### `deployments/reference-test-lab/`
- Test lab signing setup
- Generates DCC + signs + references from CNML

### `deployments/reference-manufacturer/`
- Manufacturer Model Cert + Instance Cert flow
- Includes secure element simulator

Each reference deployment:
- Documented step-by-step
- Tested in CI
- Versioned with the CNML releases

## Network effects strategy

CNML's value grows with each adoption:

- **Each new IA** → certifiable instruments in that country grow
- **Each new customs authority** → CNML verification infrastructure grows
- **Each new test lab** → DCC-compatible reports grow
- **Each new manufacturer** → CNML-equipped instruments grow

By Year 3, the network effect becomes self-reinforcing. After Year 5,
non-adoption is the harder choice than adoption.

## Strategic communications calendar

12-month calendar of events and communications:

| Month | Activity |
|-------|----------|
| Jan | Annual transparency report (prior year metrics) |
| Feb | OIML CIML annual meeting briefing |
| Mar | BIPM Digital SI workshop |
| Apr | NIST MPTS submission + evaluation |
| May | Regional IA workshops (Asia, Europe, Americas) |
| Jun | Mid-year metrics + press release |
| Jul | Test lab onboarding campaign (DCC compatibility) |
| Aug | Manufacturer onboarding campaign |
| Sep | Customs engagement at WCO |
| Oct | Annual conference (rotating host: 2026 Paris, 2027 Berlin, 2028 Tokyo) |
| Nov | Government + regulator briefings |
| Dec | Year-end summary + 2027 roadmap |

## Metrics dashboard

Public dashboard at `https://cnml.oimlsmart.org/metrics`:

- Total certs issued (running total)
- Active IAs (count + map)
- Active test labs (count)
- Active manufacturers (count + by instrument category)
- Verifier downloads (count + by country)
- Avg verify latency
- Adoption curve (year-over-year)

The dashboard itself is a CNML-verifiable document.

## Press / media strategy

Targeted placements:

- **IEEE Security & Privacy** (technical credibility)
- **OIML Bulletin** (institutional reach)
- **EU NIS2 conference** (regulatory)
- **NIST PQC conference** (US government)
- **Reuters / Bloomberg** legal metrology verticals (industry)
- **China Daily / Xinhua** (Chinese audience)
- **Le Monde / Handelsblatt / Nikkei** (multilingual industry)

Each major cert issuance is announced publicly via:
- Transparency log surface
- Press release
- Newsletter
- Social media

## Country engagement tiers

For each OIML member state, CNML tracks engagement tier:

| Tier | Activity | Count (Year 5 target) |
|------|----------|-----------------------|
| **Founding member** | Signatory to DCC treaty, director seat | 7 |
| **Active member** | Operating IA, full participation | 30+ |
| **Observer** | Participating in workshops, not yet issuing | 20+ |
| **Engaged non-member** | Bilateral discussions, exploring adoption | 15+ |
| **Resistant** | Diplomatic engagement, addressing concerns | varies |

Each tier has a tailored engagement plan with specific milestones.

## Regional coordinators

Three regional coordinators (each ~half-time):

- **Asia-Pacific coordinator**: covers Japan, China, Korea, SE Asia, Australia
- **Europe-Africa coordinator**: covers EU, UK, Eastern Europe, Africa
- **Americas coordinator**: covers USA, Canada, Latin America

Each coordinator:
- Hosts regional workshops
- Manages regional pilot deployments
- Reports to BIML operations

## Annual adoption report

Published every January in the transparency log:

- Certs issued by country
- Verifier downloads
- Active participants per audience
- Adoption curve analysis
- Lessons learned
- Next-year roadmap
- Carbon footprint report (TODO environmental-impact)

## Specific barriers and mitigations

| Barrier | Mitigation |
|---------|------------|
| "We've done PDFs for 40 years" | Migration plan (TODO 48), dual-run support |
| "Cost prohibitive" | TCO analysis (TODO 52), subsidized hardware |
| "We don't trust threshold crypto" | Formal verification (TODO 60), international standards |
| "Our laws don't recognize digital certs" | Legal standing framework (TODO 52), treaty draft (TODO 65) |
| "Sovereignty concerns" | For policy makers (for-policy-makers), DCC treaty |
| "Technical complexity" | Reference deployments, training, workshops |
| "Vendor lock-in" | 100% open source, no proprietary dependencies |

## How to participate

### For an IA

1. Contact `adoption@cnml.oiml.org`
2. Join as observer or active member
3. Receive hardware + training
4. Onboard via TODO 48
5. Issue first CNMLs

### For a customs authority

1. Contact `customs@cnml.oiml.org`
2. Receive verifier deployment assistance
3. Pilot at one port
4. Expand to all ports

### For a test lab

1. Contact `labs@cnml.oiml.org`
2. Receive DCC-compatible tooling
3. Pilot signing flow
4. List in CNML directory

### For a manufacturer

1. Contact `manufacturers@cnml.oiml.org`
2. Receive secure element samples
3. Deploy manufacturer signing setup
4. Issue instance certs

### For a verifier developer

1. Use the open-source libraries
2. Integrate per [For Developers](/docs/for-developers)
3. List in CNML-compatible verifier directory

## See also

- TODO 48 (migration from PDFs)
- TODO 50 (cross-PKI interop)
- TODO 52 (cost model + liability)
- TODO 64 (adoption strategy — formal spec)
- TODO 65 (geopolitical navigation)
- [For Decision Makers](/docs/for-decision-makers) — operational pitch
- [For Policy Makers](/docs/for-policy-makers) — treaty-level pitch
- [Comparison with Concurrent Efforts](/docs/comparison-concurrent-efforts)
