/**
 * Post-quantum cryptography support via @noble/post-quantum.
 *
 * Implements ML-DSA-65 (NIST FIPS 204, formerly CRYSTALS-Dilithium)
 * for future-proof hybrid signatures.
 *
 * ML-DSA-65 provides ~128-bit post-quantum security (equivalent to
 * AES-128). Signatures are ~3300 bytes. Public keys are ~1952 bytes.
 *
 * This module is Phase 2 preparation. The infrastructure supports PQC,
 * but production signing waits for the PQC transition plan.
 */

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { bytesToBase64, base64ToBytes } from "./shared/base64.ts";

export interface MlDsaKeyPair {
  publicKey: Uint8Array;   // 1952 bytes
  secretKey: Uint8Array;   // 4032 bytes
}

export interface MlDsaSignature {
  signature: Uint8Array;   // ~3309 bytes
  publicKey: Uint8Array;   // 1952 bytes (needed for verification)
}

/**
 * Generate an ML-DSA-65 keypair.
 */
export function generateMlDsaKeyPair(): MlDsaKeyPair {
  return ml_dsa65.keygen();
}

/**
 * Sign a message with ML-DSA-65.
 */
export function mlDsaSign(message: Uint8Array, secretKey: Uint8Array): Uint8Array {
  return ml_dsa65.sign(message, secretKey);
}

/**
 * Verify an ML-DSA-65 signature.
 */
export function mlDsaVerify(
  signature: Uint8Array,
  message: Uint8Array,
  publicKey: Uint8Array,
): boolean {
  return ml_dsa65.verify(signature, message, publicKey);
}

/**
 * Export ML-DSA public key as base64 for embedding in XML.
 */
export function mlDsaPublicKeyToBase64(publicKey: Uint8Array): string {
  return bytesToBase64(publicKey);
}

/**
 * Import ML-DSA public key from base64.
 */
export function mlDsaPublicKeyFromBase64(b64: string): Uint8Array {
  return base64ToBytes(b64);
}

/**
 * Hybrid sign: sign the same message with BOTH a classical algorithm
 * (Ed25519/ECDSA) AND ML-DSA-65. Returns both signatures.
 *
 * The classical signature provides current compatibility; the ML-DSA
 * signature provides post-quantum security. Verifiers accept if EITHER
 * passes (graceful degradation for clients without PQC support).
 */
export async function hybridSign(
  message: Uint8Array,
  classicalSign: (data: Uint8Array) => Promise<Uint8Array>,
  mlDsaSecretKey: Uint8Array | null,
): Promise<{
  classical: Uint8Array;
  pqc: Uint8Array | null;
}> {
  const classical = await classicalSign(message);
  const pqc = mlDsaSecretKey ? mlDsaSign(message, mlDsaSecretKey) : null;
  return { classical, pqc };
}

/**
 * Hybrid verify: check at least one signature is valid.
 */
export async function hybridVerify(
  message: Uint8Array,
  classicalSig: Uint8Array,
  classicalVerify: (sig: Uint8Array, data: Uint8Array) => Promise<boolean>,
  pqcSig: Uint8Array | null,
  pqcPublicKey: Uint8Array | null,
): Promise<{ classical: boolean; pqc: boolean; accepted: boolean }> {
  const classical = await classicalVerify(classicalSig, message);
  const pqc = pqcSig && pqcPublicKey ? mlDsaVerify(pqcSig, message, pqcPublicKey) : false;
  return {
    classical,
    pqc,
    accepted: classical || pqc,
  };
}
