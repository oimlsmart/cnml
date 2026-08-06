---
title: 'For BIML and CIML'
lede: 'BIML operates the OIML Root under CIML policy. Director onboarding, quorum management, and audit oversight are the operational responsibilities that CNML formalizes.'
coord: 'AUD / 02'
---

## The world today

The OIML Root is the apex of the OIML-CS certificate authority hierarchy. The root exists as an institutional fact: the BIML secretariat holds the root signing capability and exercises it under CIML policy. The operational practice around how the root key is generated, where it is stored, who can use it, and under what oversight is documented in BIML internal procedures that are not publicly visible.

The CIML committee sets policy for the OIML-CS system. Policy changes proceed through the CIML committee process. The technical implementation of a policy change, such as adding a new Issuing Authority or revoking an existing one, is carried out by BIML staff. The audit trail of these actions is held in BIML records. A CIML member who wishes to verify that a policy decision was implemented as decided has no independent mechanism short of correspondence with the secretariat.

## What changes

CNML formalizes the root operations in the five-tier certificate hierarchy. The OIML Root CA private key is generated, held, and used inside air-gapped hardware under the custody of BIML. Root signatures require a threshold quorum of BIML directors, with the threshold configured by CIML policy. The threshold is enforced by the cryptography, not by procedure: no director can produce a root signature alone, and no quorum below the configured threshold can produce one.

Director onboarding is a threshold ceremony. A new director's hardware token is enrolled by a quorum of existing directors. The ceremony produces a new share without exposing any existing share. Director offboarding is a re-sharing ceremony that removes the departed director's share without re-issuing the root certificate. The re-sharing is recorded in the transparency log, so CIML members can verify that the roster changed as decided.

Quorum management is a CIML policy decision encoded in the threshold configuration. CIML sets the threshold (for example, 5-of-7 directors). The threshold is enforced at signing time. A change to the threshold is a re-sharing ceremony that produces new shares under the new threshold, recorded in the transparency log.

Audit oversight is provided by the transparency log and the OpenTimestamps anchors. Every root and IA signature appears in the log. Every threshold decryption and re-sharing ceremony appears in the log. A CIML member or any external auditor can verify the log independently. The Bitcoin anchors provide timestamps that no party can backdate.

## What it looks like in practice

The root signing ceremony runs in the app at `/issue/biml-root`. The participating directors each open the app on air-gapped hardware, review the certificate to be signed, and submit their signature shares. The coordinator combines the shares once the threshold is reached. The combined signature is the IA intermediate certificate, signed by the root.

The threshold configuration, director roster, and ceremony log are visible in the transparency log monitor. A CIML member can review the log to verify that the threshold was set as decided, that director onboarding and offboarding occurred as decided, and that every signature in the log carries a valid quorum.

## Proof

The root signing flow in the app exercises the Confium CMP20 threshold key generation and FROST threshold signing against a test root. The test root is a development authority that exercises the same code path as the production root. The transparency log records every ceremony against the test root, and the OpenTimestamps proofs anchor the log to Bitcoin. Any contributor can verify the anchors.

## Your next step

Read the [system architecture](../docs/architecture/system) for the canonical description of the five-tier hierarchy, then read [distributed management](../docs/architecture/distributed-management) for the asynchronous director participation model.

## See also

- [Threshold signing](../features/threshold-signing) describes the FROST quorum that enforces the CIML-configured threshold.
- [For Issuing Authorities](../audiences/issuing-authorities) covers the IA tier that the BIML Root signs.
- [Transparency](../features/transparency) describes the log that records every root and IA ceremony for CIML audit.
