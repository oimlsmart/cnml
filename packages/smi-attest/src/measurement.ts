/**
 * Signed measurement format for OIML SMART Measuring Instruments
 * (TODO.cnml/79).
 *
 * Every measurement an SMI produces is signed by the instrument's
 * instance key. The signature binds the value, the timestamp, the
 * conditions, and the calibration state in force. A verifier walks
 * the certificate chain from the instance cert up to the OIML Root
 * to confirm the instrument is genuinely certified.
 *
 * For challenge-response (TODO 81), the `nonce` field binds the
 * measurement to a specific challenge, proving freshness.
 */

export interface MeasurementConditions {
  [parameter: string]: { value: number; unit: string };
}

export interface MeasurementSignature {
  algorithm: "ECDSA-P256-SHA256" | "Ed25519";
  /** Base64-encoded signature bytes. */
  value: string;
  /** PEM-encoded certificate chain: instance -> model -> IA -> root. */
  certificateChain: string[];
  /** Nonce from a challenge-response exchange (optional). */
  nonce?: string;
}

export interface OperatorCoSignature {
  algorithm: string;
  /** Base64-encoded signature bytes. */
  value: string;
  operatorId: string;
  operatorCertChain: string[];
}

/**
 * A signed measurement produced by an OIML SMART Measuring Instrument.
 */
export interface SignedMeasurement {
  instrumentId: string;
  recommendationId: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: "valid" | "invalid" | "warning";
  conditions: MeasurementConditions;
  calibrationStateHash: string;
  calibrationStateTimestamp: string;
  signature: MeasurementSignature;
  operatorCoSignature?: OperatorCoSignature;
}

/**
 * The measurement payload without the signature. This is what gets
 * canonicalized and signed.
 */
export type MeasurementPayload = Omit<SignedMeasurement, "signature" | "operatorCoSignature">;

/**
 * Produce a deterministic canonical form of the measurement payload.
 * JSON with sorted keys, no whitespace. This is the string that gets
 * signed and verified.
 */
export function canonicalize(payload: MeasurementPayload): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

/**
 * Compute the SHA-256 hash of a canonicalized measurement payload.
 * Used for evidence indexing and revocation checking.
 */
export async function measurementHash(payload: MeasurementPayload): Promise<string> {
  const data = new TextEncoder().encode(canonicalize(payload));
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Sign a measurement payload with an ECDSA P-256 private key.
 *
 * The caller provides:
 *   - the measurement payload (everything except signature)
 *   - the instrument's private key (a CryptoKey for signing)
 *   - the certificate chain (PEM strings: instance first, root last)
 *
 * Returns the complete SignedMeasurement with the signature populated.
 */
export async function signMeasurement(
  payload: MeasurementPayload,
  privateKey: CryptoKey,
  certificateChain: string[],
  nonce?: string,
): Promise<SignedMeasurement> {
  const data = new TextEncoder().encode(canonicalize(payload));
  const signatureBytes = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    data,
  );
  const value = b64encode(new Uint8Array(signatureBytes));
  return {
    ...payload,
    signature: {
      algorithm: "ECDSA-P256-SHA256",
      value,
      certificateChain,
      ...(nonce ? { nonce } : {}),
    },
  };
}

/**
 * Verify a signed measurement against a known public key.
 *
 * This function performs the cryptographic signature verification only.
 * Certificate chain validation (is the instance cert issued by a
 * trusted anchor?) is a separate step performed by the CNML check
 * pipeline.
 *
 * @param signed The signed measurement.
 * @param publicKey The ECDSA P-256 public key to verify against.
 * @returns { valid: true } on success, { valid: false, reason } on failure.
 */
export async function verifyMeasurement(
  signed: SignedMeasurement,
  publicKey: CryptoKey,
): Promise<{ valid: boolean; reason?: string }> {
  const { signature, ...rest } = signed;
  const payload: MeasurementPayload = rest;

  try {
    const data = new TextEncoder().encode(canonicalize(payload));
    const sigBytes = b64decode(signature.value);
    const valid = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      publicKey,
      sigBytes,
      data,
    );
    return valid
      ? { valid: true }
      : { valid: false, reason: "signature does not verify" };
  } catch (e) {
    return { valid: false, reason: `verification error: ${(e as Error).message}` };
  }
}

/**
 * Import an ECDSA P-256 public key from a PEM-encoded X.509 certificate.
 */
async function importPublicKeyFromPem(pem: string): Promise<CryptoKey> {
  const der = pemToDer(pem);
  // Use the browser's X509Certificate if available, otherwise parse manually.
  // For Node.js / environments without X509Certificate:
  // We use pkijs or asn1js in the full implementation. Here we provide
  // a simplified path that works when the public key is extractable.
  // The real implementation delegates to @oiml/cnml-crypto's cert parsing.
  const spki = await extractSpkiFromCertDer(der);
  return crypto.subtle.importKey(
    "spki",
    spki,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
}

// --- Utility functions ---

function b64encode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function b64decode(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
