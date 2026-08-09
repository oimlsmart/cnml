---
title: Verifying a certificate
coord: GUIDE / 03
---

# Verifying a certificate

This guide covers the CNML verification pipeline: the seven checks,
how to run them, and how to interpret the results.

## The seven-check pipeline

Every CNML certificate is verified through a data-driven pipeline.
Each check is a module that exports a `Check` object. The pipeline
iterates the `CHECKS` array and renders results generically.

| Order | Check | What it verifies |
|-------|-------|-----------------|
| 1 | XML well-formed | The document is parseable XML |
| 2 | Schema valid | The document conforms to the per-Recommendation JSON Schema |
| 3 | Signature valid | The XMLDSig signature verifies against the embedded X.509 cert |
| 4 | Scope valid | The signer's IA is authorized for the Recommendation on the cert |
| 5 | CRL status | The certificate is not on a revocation list |
| 6 | Timestamp | An OpenTimestamps proof anchors the cert to Bitcoin |
| 7 | Transparency | The cert appears in the public Merkle transparency log |

Earlier checks short-circuit later ones. If the XML is malformed,
there is no point checking the signature.

## Running the pipeline

```typescript
import { runChecks } from "@oiml/cnml-crypto/checks";

const results = await runChecks(xmlString, {
  trustedKeys: [cryptoKey],
});

for (const result of results) {
  console.log(`${result.checkId}: ${result.status}`);
  // status: "pass" | "fail" | "warn" | "skip"
}
```

The check context (`ctx`) accumulates state across checks: the parsed
cert, the recommendation ID, the trusted certs. Later checks read
from the context populated by earlier ones.

## Adding a new check

The pipeline is open and closed. Adding a check requires one new file
and one line in the `CHECKS` array:

```typescript
// src/checks/my-check.ts
import type { Check, CheckResult } from "./types.ts";

export const myCheck: Check = {
  id: "my-check",
  label: "9. My custom check",
  continueOnFail: false,
  run: async (xml, ctx): Promise<CheckResult> => {
    // ... verification logic ...
    return { checkId: "my-check", status: "pass", reason: "OK" };
  },
};
```

```typescript
// src/checks/index.ts
import { myCheck } from "./my-check.ts";
export const CHECKS: Check[] = [ /* ... */ , myCheck];
```

## Offline verification

The verifier downloads a trust-anchor bundle once. After that, it can
verify certificates indefinitely without network access. The bundle
contains the root CA certificates and their SHA-256 fingerprints.

The service worker at `/sw.js` caches the verify page and the
trust-anchor bundle, making verification usable offline after one
online visit.

## Next steps

- [QR code delivery](/docs/guides/qr-code-delivery) for how instruments
  receive their certificates.
- [SMI integration](/docs/guides/smi-integration) for the SMART
  Measuring Instrument path.
