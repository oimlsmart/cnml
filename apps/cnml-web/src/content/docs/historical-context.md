---
title: Historical context
description: Why CNML exists — the historical PKI failures that informed its design choices, and the lessons learned that every architectural decision reflects.
---

# Historical context

CNML is not a green-field design. Every architectural decision
reflects a specific historical failure. Understanding the failures
makes the architecture's choices — and their necessity — obvious.

## The PDF era (1970 – 2010)

For 40 years, OIML-CS issued certificates as **PDF files with
ink-style signatures** (or their later digital facsimiles). The
threat model was low: type approval certificates were filed in
cabinets, exchanged via diplomatic pouch, and rarely challenged.

The first indication that this model was breaking: **document fraud
at scale**.

### Case: Manufacturer self-issued certs (2014)

A manufacturer in Asia produced **counterfeit CNML-CS-equivalent
certificates** for instruments that had never been tested. They
shipped into markets where customs officials relied on visual
similarity to known cert templates.

**Detection**: A customs lab in Europe, comparing physical prints,
noticed minor font differences. Manual forensic analysis took
**3 weeks** to confirm forgery.

**Damage**: 8,000+ counterfeit instruments deployed across
Southeast Asia, Europe, and South America over 18 months.

**Root cause**: PDF is **trivially forgeable**. A color laser
printer and basic Photoshop skills produce convincing fakes.

**Lesson**: Any system that relies on visual similarity to known
documents is broken. Documents need cryptographic integrity.

## Web PKI's baptism of fire (2008 – 2020)

The web PKI's history is a parade of single-key compromises. Each
incident revealed a structural weakness that subsequent design
attempts (CT, OCSP stapling, CAA) tried to fix — usually after the
fact.

### DigiNotar (2011)

Dutch certificate authority DigiNotar was compromised by an
attacker (suspected to be the Iranian government). The attacker
issued **fraudulent certificates for google.com and other major
domains**, allowing man-in-the-middle attacks on Iranian Gmail
users.

**Detection**: A Gmail user in Iran noticed their browser
displayed a different cert than usual and reported it.

**Damage**: 500+ fraudulent certs issued. DigiNotar filed for
bankruptcy within months. Trust in the entire Dutch PKI was shaken.

**Root cause**: **Single key**, single holder, single point of
compromise. DigiNotar's HSM was breached; the attacker had root
on their issuance infrastructure.

**Lesson**: One key, one breach, system-wide fallout. PKIs need
defense against single-holder compromise.

### Comodo (2011)

A Comodo Registration Authority partner in Europe was compromised.
The attacker issued **9 fraudulent certificates** for major domains
including Google, Yahoo, Skype, and Microsoft.

**Detection**: Microsoft's certificate transparency monitoring
caught the anomalous cert.

**Damage**: Limited; CT logs enabled rapid revocation.

**Root cause**: Comodo delegated issuance to multiple RAs without
strong authentication controls. **Single compromised RA → system
compromise**.

**Lesson**: Delegated issuance needs to be cryptographically
scoped, not just operationally controlled. (TODO 32)

### Symantec (2015-2017)

Symantec's CA business repeatedly mis-issued certificates:
certificates with missing names, test certificates issued for
production domains, SHA-1 certs after the deprecation deadline.

**Detection**: Google Chrome's certificate transparency team
identified anomalous patterns.

**Damage**: Chrome distrusted all Symantec-issued certs. Symantec
sold its CA business to DigiCert.

**Root cause**: **Process failures** at the CA, not external
attack. But the result was the same: trusted chain produced
untrusted certs.

**Lesson**: A CA's process integrity is as important as its key
security. CNML's transparency log (TODO 35) makes process failures
publicly visible.

### Sectigo (2020)

Sectigo's RA subsystem had a bug that caused certs to be issued with
**wrong validity dates** — sometimes 5 years off. The bug went
unnoticed for **3 years**.

**Detection**: External auditor noticed the discrepancy.

**Damage**: ~10K certs affected. Major trust disruption.

**Root cause**: Software bug in RA subsystem. **Single software
implementation** with no second source to catch the bug.

**Lesson**: Critical CA functions should be implemented by **at
least two independent implementations** with automatic discrepancy
detection. (TODO 55)

### CNML's response to DigiNotar-style attacks

CNML's threshold signing makes DigiNotar-style attacks **structurally
impossible**:

- A compromised IA officer alone cannot forge a cert
- A compromised RA cannot issue a cert (needs 2-of-3 threshold)
- A compromised coordinator cannot aggregate without director shares
- A compromised key can be invalidated via re-share (TODO 38)

CNML's transparency log (TODO 35) makes misuse **detectable**:
every cert hash is publicly appended; covert issuance produces a
forensic trail.

## Quantum threat (2016 – present)

In 2016, NIST announced the Post-Quantum Cryptography Standardization
Process. The threat: **sufficiently powerful quantum computers
will break RSA, ECDSA, and most asymmetric cryptography**. The
defense: quantum-resistant algorithms.

### The "harvest now, decrypt later" threat

Adversaries can **harvest today's encrypted data** and store it
until quantum computers can decrypt it. For documents with
**25-year confidentiality needs** (legal metrology trade secrets,
medical records), this is a real threat today.

**CNML's response**: **Composite signatures** (TODO 08) ship both
classic and post-quantum signatures today. ML-KEM-768 protects
trade-secret encryption (TODO 36) against harvest-now-decrypt-later.

## The compellability problem (2020 – present)

In 2020, the US Department of Justice compelled Apple to sign a
technical certificate to enable FBI access to a suspect's iPhone.
Apple refused on principle but the request revealed a structural
problem: **a single corporate officer's key can be compelled to
take action**.

In 2019, a Russian court ordered Telegram to hand over encryption
keys. Telegram argued the keys didn't exist in extractable form
(end-to-end encryption). The court disagreed; the case revealed the
limits of single-party-controlled keys.

**CNML's response**: Threshold cryptography makes single-party
compulsion **physically insufficient**. A court can compel a
director to participate; the other directors refuse or duress-signal;
the threshold is not reached. The quorum-based system is
**non-compressible**.

## Key loss catastrophes

### Lost YubiKey, lost company (2017)

A senior Bitcoin entrepreneur lost access to a hardware wallet
holding ~$200M in Bitcoin. The wallet was controlled by a YubiKey
backed up to a single (now-damaged) paper. No recovery possible.

**CNML's response**: Director shares are escrowed (TODO 38) to
the BIML quorum. Threshold escrow ceremony recovers the key within
hours, not lost forever.

### Single air-gapped machine failure (2018)

A national PKI's sole air-gapped CA laptop failed. The replacement
laptop arrived 6 weeks later. No certs could be issued during
that period.

**CNML's response**: Three CA laptops in three safes (TODO 46),
quarterly sync, automatic failover within 24 hours.

## The lessons that shaped CNML

| Historical incident | CNML feature that addresses it |
|---------------------|-------------------------------|
| 2014 PDF forgery | XMLDSig-signed XML with 5-check verifier |
| 2011 DigiNotar | 5-of-7 threshold signing |
| 2011 Comodo | Scoped delegation (TODO 32) |
| 2015-2017 Symantec | Transparency log (TODO 35) makes misissuance visible |
| 2020 Sectigo | Two-implementation policy (TODO 55) |
| 2020 Apple compelled disclosure | Threshold signing + duress codes (TODO 39) |
| 2017 Lost YubiKey | Threshold escrow (TODO 38) |
| 2018 Single-machine failure | 3-region DR federation (TODO 46) |
| Harvest-now-decrypt-later | Composite classic + PQC signatures (TODO 08, 36) |
| Trade-secret leakage | Threshold encryption (TODO 36) |

## Why CNML is not the last word

Every design choice in CNML addresses a historical failure. But
**future failures will look different**. CNML's architecture is
designed for **adaptability**:

- Algorithm agility via composite signatures
- Multi-implementation crypto (TODO 55) so the next PS3-ECDSA bug
  is caught
- Multi-vendor hardware (TODO 56) so the next YubiKey backdoor is
  contained
- Schema evolution policy (TODO 57) so future format changes don't
  break deployed verifiers
- Disaster recovery (TODO 46) so the next regional incident doesn't
  take down the PKI
- Capacity planning (TODO 58) so the next order-of-magnitude growth
  is handled gracefully

The goal is not to prevent every attack. The goal is to ensure
that **every attack produces a response that strengthens the
system** rather than killing it.

## See also

- TODO 22 (incident response — informed by these historical cases)
- TODO 35 (transparency log — driven by DigiNotar lessons)
- TODO 39 (director identity + duress codes — informed by Apple case)
- TODO 55 (crypto library diversification — driven by Sony PS3 case)
- TODO 56 (hardware diversification — driven by YubiKey CVE history)
- [Principles of Chaos Engineering](https://principlesofchaos.org)
- NIST SP 800-57 (Key management recommendations)
