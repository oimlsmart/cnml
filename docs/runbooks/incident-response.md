# Incident response runbook

This runbook documents the response to three severity levels of
security incident at an Issuing Authority (IA).

## Severity levels

| Level | Description | Response time |
|---|---|---|
| SEV-1 | IA CA key compromise | Immediate |
| SEV-2 | Signer key compromise | Within 4 hours |
| SEV-3 | Officer threshold share compromise | Within 24 hours |

## SEV-1: IA CA key compromise

The IA's intermediate CA private key is compromised. Every cert ever
signed by this IA is suspect.

### Response

1. **Revoke the IA cert.** BIML adds the IA intermediate cert's
   serial to the root-level CRL. The cert is published immediately.
2. **Notify all verifiers.** The transparency log + CRL distribution
   propagates the revocation within the CRL freshness window.
3. **Generate a new IA keypair.** On the air-gapped CA server:
   ```bash
   # Generate new keypair in the keystore
   ```
4. **Request a new IA cert from BIML.** Generate a CSR, send it via
   the authenticated channel (see [BIML↔IA CSR
   channel](../manual-ia.md)). BIML signs it with the Root.
5. **Re-issue every end-entity cert.** Every metrologist's signing
   cert must be re-issued under the new IA cert. Each signer
   generates a new CSR.
6. **Publish the new trust anchor bundle.** The bundle now includes
   the new IA cert and the revoked old IA cert's CRL entry.
7. **Log the incident.** A `CeremonyTranscript` of type
   `emergency_rotation` is created. The full timeline is recorded.
8. **Post-incident review.** Within 7 days. Root cause, detection
   gap, response time, lessons learned.

### Scripts

- `incident-query.rb --serial <old-ia-serial>` — enumerate all certs
  signed by the old IA.
- `rotate-signer-key.rb` — rotate each signer key.

## SEV-2: Signer key compromise

A metrologist's signing key is compromised. Certificates signed by
this key are suspect but the IA CA is safe.

### Response

1. **Revoke the signer cert.** Add the signer cert's serial to the
   IA-level CRL:
   ```bash
   ruby scripts/rotate-signer-key.rb \
     --revoked-serials <serial> \
     --ca-id <ia-intermediate-id> \
     --new-cn "<metrologist name>" \
     --new-o "<IA name>" \
     --new-c "<country>"
   ```
2. **Generate a new signer keypair.** The metrologist visits
   `/cnml/keys` in the browser, generates a new key.
3. **Request a new signer cert.** The metrologist generates a CSR
   at `/cnml/csr`, sends it to the IA operator.
4. **Issue the new cert.** The operator signs the CSR with the IA
   intermediate.
5. **Publish the CRL.** The IA-level CRL is published to the public
   CRL endpoint.
6. **Log the incident.** An `AuditLog` entry of action
   `signer.rotate` records the old and new serials.

## SEV-3: Officer threshold share compromise

An IA officer's threshold share is compromised. The 2-of-3 signing
quorum is at risk — the attacker has 1 of 3 shares.

### Response

1. **Re-share the threshold quorum.** The remaining officers
   generate a fresh share set. The compromised share is
   mathematically excluded:
   ```bash
   ruby scripts/re-share-officers.rb \
     --remaining-shares share-2.txt share-3.txt \
     --exclude-share share-1.txt \
     --keystore ~/.oiml-pki \
     --passphrase <pw>
   ```
2. **Distribute the new shares.** Each officer receives a new share
   in a tamper-evident envelope.
3. **Log the ceremony.** A `CeremonyTranscript` of type `re_share`
   is created with the list of participants, the new share
   fingerprints, and the ceremony outcome.

## See also

- [BIML Root backup runbook](biml-root-backup.md)
- [IA keystore backup runbook](ia-keystore-backup.md)
- [Tabletop exercise](tabletop-exercise.md)
- [IA manual](../manual-ia.md)
