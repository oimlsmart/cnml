# BIML Root key backup runbook

This runbook documents how BIML generates, splits, distributes, and
recovers the OIML Root CA private key. It is the most
security-sensitive procedure in the CNML system.

The OIML Root is the trust anchor for every certificate in the
system. Loss of the root private key = every cert ever issued
becomes unverifiable. Compromise of the root private key = an
attacker can forge any cert.

## Status

Pilot. Not yet exercised against a real CIML quorum. See TODO.cnml/68.

## Threat model

The procedure must protect against:

- **Loss.** HSM destroyed (fire, flood, earthquake). Recovery via
  M-of-N shares.
- **Theft.** A single share is stolen. Insufficient to reconstruct
  (information-theoretic security).
- **Insider.** A CIML director goes rogue. Their share alone is
  insufficient; M-of-N required.
- **Coercion.** A director is compelled to disclose. Same defense.

## Assumptions

- The HSM at BIML Paris is the primary key store.
- N=7 CIML directors (or designated alternates) hold shares.
- M=5 threshold for reconstruction (5-of-7).
- Shares are distributed in tamper-evident envelopes.
- The ceremony is logged in a `CeremonyTranscript`.

## Initialization ceremony

The ceremony is performed once, when the OIML Root is first
generated.

### Participants

- The 7 CIML directors (or designated alternates)
- The BIML director of security (chair)
- A BIML scribe (records the ceremony)
- Two independent witnesses (CIML members at large)

### Procedure

1. **Convene in person at BIML Paris.** No remote participation;
   the ceremony is air-gapped.

2. **Generate the root keypair on the ceremony laptop.** The
   laptop is booted from a trusted read-only medium (e.g., a
   DVD). The key generation uses Confium's `random_secret_key`
   (Ed25519) or the equivalent for the chosen algorithm suite.

3. **Verify the key generation.** Two independent witnesses
   observe the laptop screen and confirm the key generation
   command matches the procedure.

4. **Shamir-split the private key into 7 shares, threshold 5.**
   Run the script:

   ```bash
   CONFIUM_PASSPHRASE=<pw> \
     ruby scripts/provision-root-backup.rb --threshold 5 --parties 7 \
       --input-root-key <root-key-file> \
       --output-shares <output-dir>
   ```

   The script writes:
   - `<output-dir>/share-1.txt` ... `<output-dir>/share-7.txt`
   - `<output-dir>/manifest.json` (the public key, the threshold,
     the parties, and the share fingerprints)

5. **Print each share on paper.** Each printout goes into a
   tamper-evident envelope, sealed in the ceremony.

6. **Distribute the envelopes.** Each director takes one envelope
   home, in their personal custody. The director stores the
   envelope in their office safe.

7. **Import the root private key into the HSM.** The key never
   leaves the ceremony laptop until this point. After the import,
   the laptop's memory is securely erased (multiple overwrites).

8. **Sign the manifest.** The chair and scribe sign the manifest
   with their personal keys. The signed manifest is published to
   the transparency log.

9. **Log the ceremony.** A `CeremonyTranscript` of type
   `root_signing` is created with:
   - The list of participants
   - The manifest hash
   - The signed manifest
   - The transparency-log inclusion proof

## Recovery procedure

Performed if the HSM is destroyed, the key is lost, or the key is
compromised (in which case: rotate first, then recover).

### Participants

- At least 5 of the 7 CIML directors
- The BIML director of security (chair)
- A BIML scribe
- Two independent witnesses

### Procedure

1. **Convene in person at BIML Paris.** Same air-gapped
   requirement as initialization.

2. **Each director opens their envelope.** The tamper-evident
   seal is verified by the witnesses.

3. **Reconstruct the private key.** Run the script:

   ```bash
   ruby scripts/provision-root-backup.rb --reconstruct \
     --input-shares <share-1.txt> <share-2.txt> <share-3.txt> \
                     <share-4.txt> <share-5.txt> \
     --output-root-key <recovered-key-file>
   ```

   The script reads the M shares, reconstructs the private key,
   and writes it to the output file.

4. **Verify the reconstruction.** The recovered key's public key
   must match the manifest's public key. If it doesn't, at least
   one share is corrupted; do not proceed.

5. **Import the recovered key into a new HSM.** The new HSM is
   then put into service.

6. **Re-seal the shares.** Each director's envelope is re-sealed
   with a new tamper-evident seal. The seal numbers are logged.

7. **Log the recovery.** A `CeremonyTranscript` of type
   `key_recovery` is created.

## Operational cadence

- **Initialization:** once, when the OIML Root is first generated.
- **Re-share:** when a director leaves the CIML (voluntary or
  involuntary). The departed director's share is invalidated; the
  remaining directors re-share to produce a fresh set.
- **Recovery:** rare. Only when the HSM is destroyed or the key is
  compromised.
- **Tabletop:** annually. The ceremony procedure is rehearsed
  without actually splitting or reconstructing the real key.

## See also

- [IA keystore backup runbook](ia-keystore-backup.md) — the
  equivalent procedure for IA-level keys.
- [Incident response runbook](incident-response.md) — what to do
  when things go wrong.
- [IA manual](../manual-ia.md) — the IA operator's guide.
- TODO.cnml/68 — the implementation status of this runbook.
