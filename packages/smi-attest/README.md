# @oimlsmart/smi-attest

> **Note:** This package's canonical home is the SMI project at
> `~/src/oimlsmart/smi/`. The copy here is a reference implementation
> placed during the initial design (see ADR-0006). When the SMI
> project publishes `@oimlsmart/smi-attest` from its own repo, this copy
> will be removed.

Signed measurement and calibration attestation formats for OIML SMART
Measuring Instruments (SMI).

## What this package provides

The SMI vision (described in the CIM 2027 extended abstract) requires
every measurement an instrument produces to be cryptographically signed
and bound to the instrument's type-approval certificate. This package
defines the formats and the signing/verification APIs.

## Install

```bash
npm install @oimlsmart/smi-attest
```

## Signed measurements

```typescript
import { signMeasurement, verifyMeasurement } from "@oimlsmart/smi-attest/measurement";

// The instrument signs a measurement:
const signed = await signMeasurement(
  {
    instrumentId: "CNML-INSTANCE-ABC123",
    recommendationId: "R60",
    value: 42.5,
    unit: "kg",
    timestamp: new Date().toISOString(),
    quality: "valid",
    conditions: { temperature: { value: 22.1, unit: "degC" } },
    calibrationStateHash: "abc123...",
    calibrationStateTimestamp: "2026-07-01T00:00:00Z",
  },
  instrumentPrivateKey,
  [instanceCertPem, modelCertPem, iaCertPem, rootCertPem],
);

// A verifier checks it:
const result = await verifyMeasurement(signed);
console.log(result.valid); // true
```

## Calibration attestation

```typescript
import { calibrationHash, isCalibrationRevoked } from "@oimlsmart/smi-attest/calibration";

const hash = await calibrationHash(calibrationPayload);
console.log(hash); // sha256 hex string

const status = isCalibrationRevoked(hash, revocationList);
console.log(status.revoked); // false
```

## License

Same as the CNML project.
