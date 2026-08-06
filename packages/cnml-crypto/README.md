# @oiml/cnml-crypto

The CNML cryptographic verification pipeline, composite signature
primitives, and SMI twin client.

## Install

```bash
npm install @oiml/cnml-crypto
```

## Check pipeline

The verify pipeline is a registry of independent checks. Each check
is a module in `src/checks/`. Adding a check is one file plus one
line in the `CHECKS` array.

```typescript
import { runChecks, CHECKS } from "@oiml/cnml-crypto/checks";

const results = await runChecks(xmlString, {
  trustedCerts: [pemString],
});

for (const r of results) {
  console.log(r.checkId, r.status, r.reason);
}
```

The default pipeline runs 7 checks in order:

1. `xml-well-formed` — XML parses
2. `schema-valid` — CNML root element + per-R JSON Schema
3. `signature` — XMLDSig enveloped + Exclusive C14N
4. `scope` — X.509 v3 scope extension (DoMC enforcement)
5. `crl` — certificate not revoked
6. `timestamp` — OpenTimestamps or RFC 3161 proof
7. `transparency` — Merkle inclusion proof

## Composite signatures

```typescript
import { compositeSign, compositeVerify } from "@oiml/cnml-crypto";
```

Composite signatures combine Ed25519 (classical) with ML-DSA-65
(post-quantum) using AND semantics. A verifier can validate either
signature independently.

## SMI twin client

```typescript
import { TwinClient } from "@oiml/cnml-crypto/smi/twin-client";

const client = new TwinClient("http://localhost:8787/twin");
await client.connect();
const indication = await client.getIndication();
const provenance = await client.getProvenance();
```

The twin client connects to a SMART Measuring Instrument's GraphQL
endpoint and exposes the live indication, state, and CNML certificate
provenance.

## License

Same as the CNML project.
