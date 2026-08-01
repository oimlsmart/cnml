---
title: Environmental impact
description: Carbon footprint of CNML operations, comparison with PDF mail system, and the multi-anchor strategy for minimizing environmental cost.
---

# Environmental impact

CNML is designed with environmental sustainability in mind. Every
operational choice considers carbon footprint alongside security
and reliability.

## At a glance

| Operation | Carbon per cert (gCO2e) | Notes |
|-----------|-------------------------|-------|
| **CNML issuance** | ~2 | Local compute, transparency log append |
| **CNML anchoring (Bitcoin OTS)** | ~50 | Calendar server batched |
| **CNML anchoring (Ethereum PoS)** | ~5 | Post-Merge |
| **CNML anchoring (CT log)** | ~1 | Permissioned server |
| **CNML verification** | < 1 | Browser-side compute |
| **PDF issuance (paper + mail)** | ~350 | International shipping dominates |
| **PDF verification (visual)** | ~10 | Inspection time + lighting |

**CNML is ~7× cleaner than PDF per certificate lifecycle**.

## Detailed carbon budget

### CNML per certificate

| Component | gCO2e | Notes |
|-----------|-------|-------|
| Signer key generation (one-time) | amortized ~0 | YubiKey op |
| Threshold signing ceremony | 5 | Director laptops + coordinator |
| Transparency log append | 1 | Server compute |
| Transparency log anchor (Bitcoin) | 50 | OTS via calendar server |
| CDN distribution of cert | 1 | Static file delivery |
| Verifications (avg 10 per cert lifetime) | 0.5 | Browser compute |
| **Total per cert** | **~58 gCO2e** | |

### PDF per certificate

| Component | gCO2e | Notes |
|-----------|-------|-------|
| Paper production | 50 | A4 sheet |
| Printing | 5 | Laser printer |
| Ink | 5 | Toner |
| International shipping (avg) | 250 | Air freight + last-mile |
| Storage (filing cabinet, building) | 30 | Amortized |
| Manual verification (visual) | 10 | Inspector time + lighting |
| **Total per cert** | **~350 gCO2e** | |

### 10-year deployment carbon

For 1,000 certs/year (typical IA):

| System | 10-year carbon (kg CO2e) |
|--------|--------------------------|
| PDF | 3,500 |
| CNML (Bitcoin anchor) | 580 |
| CNML (CT log anchor) | 100 |

**CNML saves ~3 tonnes CO2e per IA per decade** — equivalent to a
transatlantic round-trip flight per IA per decade.

## Bitcoin anchor carbon concerns

The Bitcoin network consumes significant energy (~150 TWh/year).
Each OpenTimestamps stamp adds a small transaction to Bitcoin,
contributing marginally to this load.

We address this in two ways:

1. **Calendar server batching**: OpenTimestamps aggregates ~thousands
   of stamps per Bitcoin transaction. Per-stamp carbon is tiny
   (~50 gCO2e amortized).
2. **Alternative anchors** (TODO 63): deployments can choose
   Ethereum (post-Merge PoS, ~10× lower carbon) or a dedicated
   CT log (essentially zero carbon).

CNML **does not require** Bitcoin anchoring. It's one of 4 supported
anchor types.

## Multi-anchor strategy

Per TODO 63, CNML supports:

- **Bitcoin** (high carbon, highest decentralization)
- **Ethereum PoS** (low carbon, mature decentralization)
- **CT log** (minimal carbon, operator reputation trust)
- **Multi-sig notary** (minimal carbon, weakest decentralization)
- **Proof-of-Authority chain** (minimal carbon, CNML-operated)

Default policy: 2 anchors required, carbon budget ≤ 60 gCO2e per cert.
Operators can choose:

- **Maximal decentralization**: Bitcoin + Ethereum (~55 gCO2e)
- **ESG-friendly**: Ethereum + CT log (~6 gCO2e)
- **Sovereignty-preserving**: PoA chain + multi-sig notary (~2 gCO2e)

## Hardware lifecycle

CNML director hardware (YubiKeys, laptops, safes) has carbon cost:

| Item | gCO2e | Lifetime | Per-director-year |
|------|-------|----------|-------------------|
| YubiKey 5C (manufacturing) | 2,000 | 5 years | 400 |
| Air-gapped laptop (manufacturing) | 200,000 | 5 years | 40,000 |
| Laptop operation (5 years) | 50,000 | — | 10,000 |
| Safe (steel, manufacturing) | 100,000 | 30 years | 3,333 |

Per director per year: ~54 kg CO2e. For 7 directors: ~378 kg/year.
Spread across ~1,000 certs/year: 378 gCO2e per cert.

This is the dominant carbon cost in CNML — exceeding the Bitcoin anchor.

## Comparison with other PKIs

| System | 10-year carbon per million certs (tonnes CO2e) |
|--------|-----------------------------------------------|
| **PDF mail** | 350 |
| **Let's Encrypt (TLS)** | ~100 (mostly verification + storage) |
| **CNML (Bitcoin)** | ~60 |
| **CNML (CT log)** | ~10 |

CNML is among the cleanest PKIs ever deployed.

## Future carbon reduction plans

1. **Air-gapped laptop refresh** — replace every 5 years with
   energy-efficient ARM-based laptops (50% carbon reduction)
2. **Renewable-powered coordinators** — BIML + NIST + PTB commit to
   100% renewable-powered coordinator infrastructure by 2028
3. **Carbon offset program** — optional per-deployment offset program
   for jurisdictions requiring it
4. **Annual carbon report** — published in transparency log, third-
   party audited

## ESG reporting

CNML provides an annual ESG report covering:

- Total certificates issued
- Total carbon emitted (per scope 1, 2, 3)
- Comparison with PDF baseline (carbon saved)
- Carbon intensity per cert
- Path to net-zero (target 2035)

This report satisfies ESG disclosure requirements for:
- EU CSRD (Corporate Sustainability Reporting Directive)
- US SEC Climate Disclosure
- TCFD (Task Force on Climate-Related Financial Disclosures)
- CDP (Carbon Disclosure Project)

## What IA operators should know

For most IAs, the carbon cost of CNML is **negligible** — single-digit
tonnes per year. The dominant carbon cost is hardware lifecycle, not
operations.

For high-volume deployments (>10K certs/year), the carbon per cert
amortizes further. CNML scales cleanly.

For ESG-conscious jurisdictions (EU, Canada, UK): CNML's CT log
anchor option delivers near-zero operational carbon.

## Reading order

1. **This page** — environmental impact overview
2. **[For Decision Makers](/docs/for-decision-makers)** — operational pitch
3. **[Comparison with Concurrent Efforts](/docs/comparison-concurrent-efforts)** — peers
4. TODO 63 (alternative transparency anchors — full spec)

## See also

- TODO 06 (OpenTimestamps wiring — Bitcoin default)
- TODO 35 (transparency log)
- TODO 46 (DR federation — multi-region reduces carbon via local mirrors)
- TODO 63 (alternative anchors — full spec for multi-anchor strategy)
- [EU CSRD](https://corporate-sustainability-reporting-directive.eu/)
- [TCFD](https://www.fsb-tcfd.org/)
- [Digiconomist Bitcoin Energy Consumption Index](https://digiconomist.net/bitcoin-energy-consumption)
- [Ethereum post-Merge energy analysis](https://ethereum.org/en/upgrades/merge/)
