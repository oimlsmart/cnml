/**
 * @oimlsmart/smi-attest — entry point.
 *
 * Signed measurement and calibration attestation formats for OIML
 * SMART Measuring Instruments. See:
 *   - measurement.ts — SignedMeasurement type, sign, verify
 *   - calibration.ts — CalibrationAttestation type, hash, revocation
 */

export type {
  SignedMeasurement,
  MeasurementPayload,
  MeasurementSignature,
  OperatorCoSignature,
  MeasurementConditions,
} from "./measurement.ts";

export {
  canonicalize,
  measurementHash,
  signMeasurement,
  verifyMeasurement,
} from "./measurement.ts";

export type {
  CalibrationAttestation,
  CalibrationPayload,
  CalibrationCorrection,
  CalibrationSignature,
  CalibrationRevocationList,
} from "./calibration.ts";

export {
  canonicalizeCalibration,
  calibrationHash,
  isCalibrationRevoked,
} from "./calibration.ts";
