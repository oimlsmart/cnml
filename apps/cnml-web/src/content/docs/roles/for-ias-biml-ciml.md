---
title: For IAs and BIML/CIML
description: Operational guide for Issuing Authority officers and BIML/CIML staff, covering certificate creation, threshold signing responsibilities, scope governance, ceremony participation, and operational cadence.
---

# For IAs and BIML/CIML

This document is the operational guide for Issuing Authority (IA) officers and for the staff of the Bureau International de Metrologie Legale (BIML) and the Comite International de Metrologie Legale (CIML). It covers the certificate creation flow, threshold signing responsibilities, scope governance, director duties, ceremony participation, and the operational cadence of the CNML trust framework.

CNML is a proposal for OIML from the OIML SMART programme. The operational model described here is a draft. The ceremony procedures, the role descriptions, and the cadence schedule are subject to revision as the proposal evolves and as OIML Member States provide feedback.

## Prerequisites

An IA officer needs three things to create and sign a CNML certificate. First, the IA must be an OIML-recognized Issuing Authority designated under the DoMC framework. Second, the IA must hold a signing keypair chained to the OIML Root CA, obtained through the certificate-signing-request (CSR) flow operated by the BIML certificate team. Third, the officer needs access to the CNML web application, either at the public instance or at a self-hosted instance within the IA's network.

A BIML staff member operating the root tier needs a BIML-issued hardware key (a PKCS#11-compatible personal hardware token), a director identity credential, and access to the air-gapped ceremony laptop and the coordinator service.

## The certificate creation flow

### Selecting the Recommendation

The IA officer opens the Create page in the web application and selects the OIML Recommendation under which the certificate is issued. The dropdown is populated from the schema registry, which lists every Recommendation for which a schema has been loaded. The officer selects the Recommendation, and the form component renders the fields defined by that Recommendation's schema.

### Filling the form

The form is rendered from the per-Recommendation JSON Schema. Required fields are marked. The officer may use the demo-data button to seed the form from a real OIML-CS sample certificate, then edit the values to match the equipment under evaluation. The form validates against the schema as the officer types, and fields that fail validation are highlighted.

### Signing and downloading

When the form is valid, the officer clicks the sign button. The browser performs five operations in sequence. It builds the certificate object from the form state. It serializes the object to CNML XML with UnitsML elements for measurement units. It loads the officer's private key from browser-local encrypted storage, decrypting it with the passphrase. It signs the XML using XMLDSig with enveloped signature, Exclusive C14N canonicalization, and the SHA-256 digest algorithm. It triggers a download of the signed file.

The private key never leaves the browser. The signature is computed locally in the browser. No certificate data is transmitted to a server during the signing operation.

![Signing flow](/diagrams/signing-flow.svg)

### Distributing the signed certificate

The signed certificate file can be sent directly to the applicant or manufacturer, uploaded to the OIML DoMC certificate repository, or published on the IA's website for public verification. The transparency-log inclusion proof is embedded in the certificate at signing time, so the verifier can confirm the certificate's presence in the public log without contacting the IA.

## Threshold signing responsibilities

CNML uses threshold signatures at two tiers of the hierarchy. At the BIML Root tier, the root signing key is held as a threshold secret shared among the OIML directors. Producing a root-tier signature requires a configured quorum of directors to participate in a threshold signing protocol. At the IA Intermediate tier, each IA operates its own threshold quorum for its intermediate signatures. The protocol is a FROST construction (Flexible Round-Optimized Schnorr Threshold signatures), operated asynchronously through a coordinator service.

An IA officer participating in a threshold signing session receives a notification from the coordinator. The officer authenticates to the coordinator using their director identity key (a hardware-backed Ed25519 key on a PKCS#11-compatible personal hardware token), reviews the signing payload, and submits their threshold share through the coordinator interface. The coordinator buffers shares from the officers and, once the quorum threshold is reached, aggregates the shares into a single signature. The coordinator is honest-but-curious: it can observe encrypted protocol messages but cannot reconstruct the signing key or produce a valid signature without the threshold number of shares.

The threshold property means that no single officer can produce a valid IA signature, and that a compromise of fewer than the threshold number of officers cannot produce one. The typical IA configuration is a two-of-three officer quorum. The typical BIML Root configuration is a five-of-seven director quorum.

## Scope governance

Each IA is authorized under the DoMC framework to issue certificates for a specific subset of OIML Recommendations. CNML encodes this authorization cryptographically, making it verifiable at signing time and at verification time.

The scope is encoded in two locations. The first is the `oimlAuthorizedRecommendations` X.509 v3 extension in the IA intermediate certificate. The extension carries an ASN.1 sequence of Recommendation identifiers (R60, R76, R117, and so on) that the IA is authorized to issue. The second is the `trust-anchors.json` manifest, a JSON document that maps each intermediate's fingerprint to its scope list. Both sources must agree.

The scope is enforced at four layers. BIML specifies the scope when signing the IA intermediate certificate. The IA's certificate-issuing server refuses to issue end-entity certificates that would extend beyond the IA's scope. The signer's browser reads the scope from its own certificate chain and refuses to sign a CNML whose recommendation identifier is out of scope. The verifier reads the scope from the intermediate certificate or the manifest and rejects a CNML whose recommendation is not covered.

Adding scope to an IA requires a DoMC authorization. BIML then issues a new intermediate certificate (same keypair, expanded scope list) and revokes the old one through the CRL. Removing scope from an IA requires BIML to revoke the existing intermediate. Certificates already signed under the old intermediate remain valid, because the scope check applies at the certificate's `notBefore` timestamp, not at verification time.

## Director duties

Directors are the individuals whose shares constitute the BIML root signing quorum. The typical configuration is seven directors, with a quorum of five required to produce a root-tier signature. Directors are appointed by CIML election, following nomination by an OIML Member State, review by the CIML CNML sub-committee, and a background check conducted by the BIML certificate team.

A director's obligations include the following. The director maintains the confidentiality of their threshold share material. The director uses only BIML-provided hardware for signing operations and does not use personal devices. The director reports loss, theft, or compromise of hardware within twenty-four hours. The director participates in asynchronous signing sessions within seventy-two hours of notification. The director attends the annual ceremony in person, with a limited waiver for medical or family emergencies. The director discloses conflicts of interest on any CNML-related matter and recuses themselves from signing sessions where a conflict exists. The director submits to periodic security reviews, including an annual interview and occasional device inspection.

Director terms are four years, renewable once for a maximum of eight consecutive years. Terms are staggered so that no more than two directors depart in a given year, preserving continuity of institutional knowledge. Regional balance is maintained so that at least four of the seven directors represent distinct OIML regions at any time.

## Ceremony participation

CNML ceremonies are of two types: the annual root operations ceremony and asynchronous signing sessions. Both require director and officer participation under controlled conditions.

### The annual root operations ceremony

The annual ceremony is held in person at a BIML facility. The ceremony covers director rotation, root renewal (if an algorithm migration or compromise recovery is scheduled), and the review of the previous year's audit-log entries. The ceremony is conducted from a signed runbook (the procedural document that the directors follow). A ceremony chair (a rotating BIML staff member) conducts the ceremony, witnesses each step, and signs the transcript.

At the ceremony, a newly appointed director generates their identity keypair on a BIML-provided PKCS#11-compatible hardware token, registers their public identity key with the director identity CA, and participates in a re-sharing protocol to receive their threshold share of the root signing key. A departing director's share is excluded from the new sharing, and the aggregate public key remains unchanged. All previously issued certificates remain valid.

### Asynchronous signing sessions

Asynchronous signing sessions are the day-to-day mechanism for producing root-tier and IA-tier signatures. A session is initiated when a signing payload requires a threshold signature (for example, an IA intermediate certificate needs signing, or an emergency revocation needs issuing). The coordinator dispatches a notification to each director or officer in the quorum.

Each participant authenticates to the coordinator using their hardware identity key, reviews the signing payload, and submits their threshold share. The coordinator buffers the shares and aggregates them once the quorum threshold is reached. The session transcript (commitments, shares, and the final signature) is recorded in the hash-chained audit log. Participants may submit their shares at different times, accommodating directors distributed across time zones.

## Operational cadence

The CNML operational cadence is as follows.

| Cadence | Activity | Body |
|---|---|---|
| Continuous | Asynchronous signing sessions (certificate issuance, IA cert issuance) | IA and BIML quorums |
| Continuous | Transparency log updates | BIML |
| Daily | Coordinator health check, audit log review | BIML infrastructure team |
| Weekly | Public mirror reconciliation | Member states and BIML |
| Monthly | Proactive share refresh | All quorums |
| Monthly | Internal audit report | BIML auditor |
| Quarterly | CIML CNML sub-committee meeting | CIML sub-committee |
| Annually | CIML session (policy, audit report approval) | Full CIML |
| Annually | Root operations ceremony (director rotation, root renewal if scheduled) | BIML directors |
| Annually | External audit | Independent firm |
| Every four years | International Conference (Convention amendments, charter review) | All member states |

## Governance and accountability

The CIML is the policy-making body for CNML. It sets the rules under which ceremonies operate: which Recommendations adopt CNML, which IAs are eligible, scope allocations, threshold parameters, and revocation rules. CIML does not run ceremonies and does not hold shares of the root signing key. The separation of policy (CIML) from operations (BIML) is the foundation of the CNML checks and balances. The Presidential Council (the CIML President, two Vice-Presidents, and the BIML Director) holds limited emergency authority between CIML sessions, and its emergency actions must be ratified by the next CIML session.

BIML operates the root CA, runs the transparency log, administers the coordinator service, manages director onboarding, and publishes the public artifacts (root certificates, CRLs, IA certificates, transparency-log heads). BIML staff are bound by role separation: the ceremony chair cannot sign on behalf of a director, the certificate team cannot trigger signing ceremonies, the infrastructure team cannot modify the audit log, and the auditor role is read-only by design.

## Ceremony records and transparency operations

Every threshold ceremony produces a complete transcript: the participating members with their signatures, the quorum parameters, the canonical payload hash signed, the aggregate threshold signature, and the transparency-log entry for the resulting certificate. An incomplete transcript is not accepted as evidence, and the audit algorithm verifies each element. Root operations publish through the transparency log; the operator procedures, including mirror operation and the registry signing ceremony, are in the [transparency operations runbook](/docs/guides/transparency-operations).

## See also

- [OIML, BIML, CIML, and OIML-CS](/docs/concepts/oiml-institutions) provides the institutional context for the governance model described here.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous signing flow and the geographic distribution of directors.
- [Hardware key tiers](/docs/architecture/hardware-tiers) describes the hardware used by directors and officers.
- [For verifiers](/docs/roles/for-verifiers) covers the verification flow from a verifier's perspective.
- [For developers](/docs/roles/for-developers) covers the contribution workflow for the CA server and the web application.
