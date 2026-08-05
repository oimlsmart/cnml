# TODO.FULL/02 — IA intermediate certificate issuance

## Problem

The second scenario: an Issuing Authority intermediate certificate scoped
to a specific OIML Recommendation. This cert sits between the BIML Root
and the per-Recommendation CNML in the chain. It is threshold-signed by
2-of-3 IA officers and carries a scope extension listing the Recommendations
the IA is authorized to issue.

## Scenario

The user picks a Recommendation (for example R60 load cells or R76 weighing
instruments). The page generates 3 IA officer keypairs. The user selects 2
of 3 to participate. Each produces an individual signature over the IA
certificate payload, which includes the scope extension binding the IA to
the chosen Recommendation. The output is a signed IA intermediate certificate
that a per-Recommendation CNML can chain to.

## Scope

- Page route: `/issue/ia-intermediate`
- Vue island: `apps/cnml-web/src/islands/issuing/IaIntermediateFlow.vue`
- Astro page: `apps/cnml-web/src/pages/issue/ia-intermediate.astro`

## Implementation status

Shipped in this branch. The page generates 3 officer keypairs, lets the user
select a Recommendation from the 22 OIML Recommendations, selects 2-of-3
officers, signs the IA intermediate payload with each selected key, and
produces a downloadable JSON bundle. The scope extension is encoded in the
payload as an ASN.1-style sequence of Recommendation identifiers.

## Tests

- Build: the route produces a page
- Flow: pick R60, generate 3 officers, select 2, sign, download JSON
- Output: the JSON contains 2 signature entries and the scope list

## See also

- TODO.FULL/01 for BIML Root issuance
- TODO.FULL/03 for per-Recommendation CNML issuance
