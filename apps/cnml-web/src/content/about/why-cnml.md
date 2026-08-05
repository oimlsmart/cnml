---
title: 'Why CNML'
lede: 'No existing public-key infrastructure meets the combination of requirements that legal metrology imposes. CNML addresses that gap directly.'
coord: 'ABOUT / 02'
---

The existing OIML-CS certificate of conformity is a PDF document. A PDF is reproducible with consumer-grade image editing software. The widespread availability of generative image models has increased the realism of forged documents. A verifier of a paper or PDF certificate cannot distinguish an original from a reproduction without contacting the issuer, and the contact step is rarely available to a market-surveillance inspector in the field. The certificate format is the weak point of the present system.

CNML replaces the unforgeable-document problem with the cryptographic-signature problem. A CNML file carries a signature that no party can reproduce without access to a threshold quorum of private keys. Verification is a computation that any browser can perform in milliseconds. The question "is this certificate authentic" becomes "does this signature validate against this public key", which is a question with a deterministic answer.

## The requirements that legal metrology imposes

Legal metrology imposes a combination of requirements that no existing PKI was designed to meet simultaneously.

Decades-long validity. A measuring instrument installed in 2026 may remain in legal service in 2046. The certificate must remain verifiable for that entire period, including through migration of the signing algorithm to a post-quantum scheme. Web TLS certificates expire in weeks or months and assume continuous network access for revocation checking.

International governance. The authority to issue OIML-CS certificates is distributed across Issuing Authorities in multiple member states. No single national operator can hold the root. Web PKI centralizes authority in a single certificate authority per certificate and surrounds that centralization with protective infrastructure that does not map onto an intergovernmental governance model.

Distributed signing authority. No single officer can produce a CA-level signature. Every CA-level signature requires a configured quorum of independent signers operating from separate locations on separate hardware. Single-key PKI assigns the signing power to one key holder and treats compromise of that key as a catastrophic event.

Offline verification. A market-surveillance inspector verifies a certificate at the point of inspection, which may be a factory floor, a port of entry, or a retail premises with no network connectivity. The verifier must reach a deterministic result from the file and a cached trust-anchor bundle. Web PKI assumes online revocation checking and real-time access to OCSP responders.

Public transparency. Every issued certificate appears in a public log that any party can audit. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. Web PKI added Certificate Transparency as a monitoring layer after the fact, not as a verification gate.

## Why existing approaches fall short

Web TLS PKI was designed in the 1990s for high-volume automated issuance of channel-authentication certificates. The architecture centralizes signing authority in a single certificate authority per certificate and carries substantial operational overhead. The centralization is efficient at the volume of web browsing but concentrates risk and does not match the international, distributed governance model of OIML-CS.

Single-key PKI assigns the signing power to one key holder. Compromise of that key is a system-wide event. Legal metrology requires that no single officer can forge a certificate, which single-key PKI cannot express.

Blockchain-based approaches provide distributed trust but impose a ledger with throughput and storage characteristics that do not match the issuance volume of legal-metrology certificates. CNML uses a Merkle transparency log anchored to Bitcoin through OpenTimestamps, which provides the tamper-evidence property without operating a ledger of its own.

## What CNML provides

CNML addresses each requirement directly. The five-tier hierarchy distributes authority across the BIML Root, Issuing Authority intermediates, manufacturer model certificates, and per-device instance certificates. Threshold cryptography requires a configured quorum for every CA-level signature. The transparency log records every issued certificate with inclusion proofs verifiable by any party. The trust-anchor bundle is a static CDN download with no API surface. The post-quantum migration path preserves original signatures as historical evidence across algorithm eras.

## Further reading

- [How it works](../about/how-it-works) describes the five-tier hierarchy, the signing ceremony, and the verification pipeline.
- [Technology](../about/technology) lists the standards and algorithms.
- [Transparency and audit](../about/how-it-works) is developed in the architecture documentation.
