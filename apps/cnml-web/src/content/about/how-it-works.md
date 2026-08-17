---
title: 'How it works'
lede: 'CNML is a five-tier certificate hierarchy with threshold signing at the upper tiers, a nine-check verification pipeline, and a public transparency log anchored to Bitcoin.'
coord: 'ABOUT / 03'
---

CNML organizes certificate authority into five tiers. Each tier binds a narrower scope to a signature produced by a broader authority. The hierarchy runs from the OIML Root CA at the top to a per-device instance certificate at the bottom, and every link in the chain is verifiable by any holder of the file.

## The five-tier hierarchy

The OIML Root CA sits at tier one. The root private key is generated, held, and used inside air-gapped hardware under the custody of BIML. Root signatures require a threshold quorum of BIML directors, with the threshold configured by CIML policy. The root certificate is the trust anchor that verifiers pin.

Tier two is the Issuing Authority CA. Each OIML-CS Issuing Authority operates an intermediate certificate signed by the root. The IA intermediate carries the X.509 v3 scope extension that constrains the IA to the set of OIML Recommendations it is authorized to issue under the DoMC. IA signatures require a threshold quorum of IA officers.

Tier three is the per-Recommendation type-approval certificate. The IA signs a CNML type approval for a specific instrument model evaluated against a specific OIML Recommendation. This is the direct successor to the existing OIML-CS certificate of conformity.

Tier four is the manufacturer model certificate. The IA delegates signing authority for a specific model to the manufacturer via a certificate that carries a delegation scope extension. The manufacturer then operates the per-model signing key.

Tier five is the per-device instance certificate. The manufacturer signs an instance certificate for each individual instrument produced, binding the serial number, firmware hash, and manufacturing date to the chain. The instance certificate is the certificate that appears on the instrument, delivered by QR code for non-SMART instruments or by the SMI twin interface for SMART instruments.

## The signing ceremony

A CA-level signature is never produced by a single party. The threshold signing ceremony works as follows. A coordinator broadcasts the message to sign to each participant. Each participant produces a signature share on their own hardware, in their own location, without transmitting their private key. The coordinator combines the shares once the configured threshold is reached. The combined signature is a valid signature under the aggregate public key, and no participant learns the aggregate private key. The ceremony proceeds asynchronously, which allows directors in different time zones to participate without coordinating a single meeting.

The coordinator is an untrusted role. A malicious coordinator can suppress the signing ceremony by withholding shares, but cannot forge a signature, cannot learn a private key, and cannot produce a valid combined signature below the configured threshold.

## The verification pipeline

Verification runs in a browser. The verifier drops a CNML file onto the verify page and the pipeline runs nine checks in order. Earlier checks short-circuit later ones, so a file that fails XML well-formedness does not reach the signature check. The check results feed a three-stage outcome: a deterministic coverage report of what was verified, a scheme-declared classification label, and the verifier's own acceptance decision.

1. XML well-formedness. The file parses as XML.
2. Schema validity. The file conforms to the CNML XSD and the per-Recommendation JSON Schema.
3. Signature validity. The XMLDSig signature validates under the signer public key, with Exclusive C14N canonicalization.
4. Scope validity. The signer certificate carries a scope extension that authorizes issuance for the OIML Recommendation named in the certificate.
5. CRL status. The signer certificate is not listed in a revocation list published by its issuer.
6. Timestamp validity. The OpenTimestamps proof anchors the signature to a Bitcoin block height that precedes the verification time.
7. Transparency inclusion. The certificate appears in the public transparency log with a valid Merkle inclusion proof.

Each check is a module that exports a Check object. The verify page iterates the CHECKS array and renders the result. Adding a check is the act of writing a new module and adding one line to the CHECKS array. The order matters because earlier checks establish the preconditions that later checks depend on.

## The transparency log

Every issued certificate is appended to a public Merkle transparency log. The log is a hash tree: each leaf is a certificate, each internal node is the hash of its children, and the root commits to the entire history. A verifier that demands an inclusion proof receives a path from the certificate leaf to the current root and verifies the path by recomputing the hashes.

Tree roots are anchored to Bitcoin through OpenTimestamps. The anchor is a transaction that commits to the tree root in a Bitcoin block. The Bitcoin block height is a timestamp that no party can backdate. Gossip protocols ensure that the log operator cannot present different views to different verifiers: a monitor that observes the log can detect a fork and raise an alert.

## QR code delivery for instruments

The per-device instance certificate is delivered to the instrument. For non-SMART instruments, the manufacturer prints a QR code on the device body. The QR code encodes the passport URL `https://www.oimlsmart.org/cnml/passport/<instance-cert-id>`. A market-surveillance officer scans the QR code and reaches a page that serves the certificate chain, the revocation status, and a verification link.

For SMART instruments, the instance certificate reference is carried by the instrument twin. The twin serves a GraphQL endpoint that exposes the governed aspects of the instrument state, including the Provenance field that carries the CNML certificate reference. The passport endpoint serves the full certificate for verifiers that reach the instrument through the twin.

## Further reading

- [System architecture](../docs/architecture/system) is the canonical description of the hierarchy.
- [Verification pipeline](../docs/implementation/verification-pipeline) documents the check registry.
- [Transparency and audit](../docs/architecture/transparency) develops the accountability model.
