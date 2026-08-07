/**
 * Calibration attestation format for OIML SMART Measuring Instruments
 * (TODO.cnml/80).
 *
 * A calibration attestation records that an instrument was calibrated
 * at a specific time, by a specific party (the instrument itself or
 * an external laboratory), with specific results. Measurements bind
 * to their calibration state by hash (TODO 79's calibrationStateHash).
 *
 * When a calibration is found wrong, it is revoked by adding its hash
 * to a calibration revocation list. Every measurement bound to that
 * hash is then flagged (not deleted).
 */

export interface CalibrationCorrection {
  parameter: string;
  correction: number;
  unit: string;
  uncertainty: number;
}

export interface CalibrationSignature {
  algorithm: string;
  value: string;
  certificateChain: string[];
}

export interface CalibrationAttestation {
  instrumentId: string;
  recommendationId: string;
  performedAt: string;
  performedBy: "instrument" | "external-laboratory";
  calibratorId?: string;
  calibratorCertChain?: string[];
  referenceStandard: string;
  corrections: CalibrationCorrection[];
  validFrom: string;
  validUntil: string | null;
  signature: CalibrationSignature;
}

export type CalibrationPayload = Omit<CalibrationAttestation, "signature">;

/**
 * Canonical form for signing. Same pattern as measurement: sorted-key
 * JSON, no whitespace.
 */
export function canonicalizeCalibration(payload: CalibrationPayload): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

/**
 * Compute the SHA-256 hash of a calibration attestation.
 * This hash is what measurements reference as `calibrationStateHash`.
 */
export async function calibrationHash(payload: CalibrationPayload): Promise<string> {
  const data = new TextEncoder().encode(canonicalizeCalibration(payload));
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface CalibrationRevocationList {
  issuer: string;
  issuedAt: string;
  entries: Array<{
    calibrationHash: string;
    reason: "incorrect" | "superseded" | "equipment-failure";
    revokedAt: string;
  }>;
  signature: CalibrationSignature;
}

/**
 * Check whether a calibration hash is revoked.
 */
export function isCalibrationRevoked(
  hash: string,
  crl: CalibrationRevocationList,
): { revoked: boolean; reason?: string; revokedAt?: string } {
  const entry = crl.entries.find((e) => e.calibrationHash === hash);
  if (!entry) return { revoked: false };
  return { revoked: true, reason: entry.reason, revokedAt: entry.revokedAt };
}
