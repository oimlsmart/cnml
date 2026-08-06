# CNML PKI runbooks

Operational runbooks for the CNML PKI. Each runbook documents a
specific procedure: ceremony, recovery, incident response.

The runbooks are written for the operators who run the system in
production: BIML staff at the root tier, IA officers at the
intermediate tier, and the security lead at each facility.

## Runbook index

| Runbook | Audience | Trigger |
|---|---|---|
| [BIML Root key backup](biml-root-backup.md) | BIML, CIML directors | Root key generation, recovery, re-share |
| [IA keystore backup](ia-keystore-backup.md) | IA officers, IA security lead | IA keystore initialization, recovery |
| [Incident response](incident-response.md) | IA officers, BIML | SEV-1/2/3 incidents |
| [Tabletop exercise](tabletop-exercise.md) | All audiences | Quarterly drill |

## Status

Most runbooks are at the **pilot** stage: the underlying code
exists, but the procedures have not been exercised against a real
quorum. Each runbook's TODO.cnml entry tracks its implementation
status.

The runbooks are part of the proposal's operational maturity
evidence. WebTrust auditors ask to see them; OIML member states
ask to see them; the BIML security lead reviews them quarterly.

## Contributing

Runbook updates go through the standard PR process. Changes to a
runbook that is in active use (post-adoption) require sign-off
from the runbook's named audience (BIML for root-tier, the IA
security lead for IA-tier).

## See also

- [PKI architecture](../pki-architecture.md) — the system
  overview these runbooks operate within.
- [IA manual](../manual-ia.md), [BIML manual](../manual-biml.md),
  [signer manual](../manual-signer.md),
  [verifier manual](../manual-verifier.md) — per-audience
  operational guides.
- TODO.cnml/68 through TODO.cnml/74 — the audit findings that
  drove these runbooks.
