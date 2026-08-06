# Tabletop exercise

A quarterly drill that rehearses the incident-response procedures
without involving real keys. The exercise is facilitated; the
officers walk through a scenario step by step.

## Participants

- The IA's officers (all of them)
- The IA's security lead (facilitator)
- A BIML observer (optional, for root-tier exercises)
- A scribe (records the exercise)

## Frequency

Quarterly. At least one exercise per year covers SEV-1 (the most
severe). The other three quarters rotate between SEV-2 and SEV-3.

## Procedure

1. **The facilitator presents a scenario.** Example: "Officer A's
   laptop was stolen. The keystore is on the laptop. The passphrase
   is unknown to the attacker. What do you do?"
2. **The officers discuss the response.** They walk through the
   incident-response runbook step by step.
3. **The scribe records each step.** Every gap — a script that
   doesn't exist, a step that's unclear, a person who wasn't
   notified — becomes a TODO.
4. **The exercise ends with a debrief.** What went well, what
   didn't, what to fix before the next exercise.

## Scenarios

### Scenario 1: SEV-1 — IA CA key compromise

"A contractor who had temporary access to the CA machine exfiltrated
the keystore file. The passphrase is not known to the contractor."

### Scenario 2: SEV-2 — Signer key compromise

"A metrologist's passphrase was observed by a colleague. The
colleague has since left the organization."

### Scenario 3: SEV-3 — Officer share compromise

"Officer B's safe was broken into. The tamper-evident envelope
containing share-2 was opened. It is unclear whether the share was
photographed."

## Output

A `CeremonyTranscript` of type `incident_response_drill` is
created. The transcript records:
- The scenario presented
- The steps walked
- The gaps identified (as a list of TODOs)
- The debrief summary

The transcript is NOT published to the transparency log (it does
not involve real keys). It is archived internally.

## See also

- [Incident response runbook](incident-response.md)
- [IA manual](../manual-ia.md)
