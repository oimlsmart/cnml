/**
 * Composite signatures: Ed25519 with ML-DSA-65.
 *
 * A composite signature requires both components to validate. An attacker
 * must break both the classical elliptic-curve problem and the module
 * learning-with-errors problem to forge a signature. The composite
 * property provides forward security against a cryptographically relevant
 * quantum computer while preserving classical security today.
 *
 * The Ed25519 component provides classical authenticity with small
 * signatures (64 bytes) and small public keys (32 bytes). The ML-DSA-65
 * component (NIST FIPS 204) provides post-quantum authenticity with
 * larger signatures (approximately 3309 bytes) and larger public keys
 * (1952 bytes).
 *
 * Composite value encoding: the signature value and the public key value
 * are each encoded as two base64 strings joined by a single period. The
 * first component is the Ed25519 value, the second is the ML-DSA-65
 * value. The verifier splits on the first period, decodes each component,
 * and verifies both. The signature is valid only when both components
 * verify successfully (AND semantics).
 */

import * as ed from "@noble/ed25519";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { bytesToBase64, base64ToBytes } from "../shared/base64.ts";

const SEPARATOR = ".";

export interface CompositeKeyMaterial {
  ed25519: { publicKey: Uint8Array; secretKey: Uint8Array };
  mlDsa65: { publicKey: Uint8Array; secretKey: Uint8Array };
}

export interface CompositeSignature {
  ed25519: Uint8Array;
  mlDsa65: Uint8Array;
}

export interface CompositeVerification {
  ed25519Valid: boolean;
  mlDsa65Valid: boolean;
  valid: boolean;
}

/**
 * Generate a composite keypair. Produces an Ed25519 keypair and an
 * ML-DSA-65 keypair. The two keypairs are independent: a break of one
 * algorithm does not help the attacker forge the other.
 */
export async function generateCompositeKeyMaterial(): Promise<CompositeKeyMaterial> {
  const edSecret = ed.utils.randomSecretKey();
  const edPublic = await ed.getPublicKeyAsync(edSecret);
  const mlDsa = ml_dsa65.keygen();
  return {
    ed25519: { publicKey: edPublic, secretKey: edSecret },
    mlDsa65: {
      publicKey: new Uint8Array(mlDsa.publicKey),
      secretKey: new Uint8Array(mlDsa.secretKey),
    },
  };
}

/**
 * Sign a payload with both Ed25519 and ML-DSA-65. The same payload
 * bytes are signed by each algorithm. The two signatures are returned
 * as a CompositeSignature.
 */
export async function compositeSign(
  payload: Uint8Array,
  keys: CompositeKeyMaterial,
): Promise<CompositeSignature> {
  const ed25519 = await ed.signAsync(payload, keys.ed25519.secretKey);
  const mlDsa65Sig = ml_dsa65.sign(payload, keys.mlDsa65.secretKey);
  return {
    ed25519: new Uint8Array(ed25519),
    mlDsa65: new Uint8Array(mlDsa65Sig),
  };
}

/**
 * Verify a composite signature. The verification succeeds only when
 * both the Ed25519 component and the ML-DSA-65 component validate
 * against the supplied public keys. If either component fails, the
 * composite verification fails.
 */
export async function compositeVerify(
  payload: Uint8Array,
  signature: CompositeSignature,
  publicKeys: CompositeKeyMaterial,
): Promise<CompositeVerification> {
  const ed25519Valid = await ed.verifyAsync(
    signature.ed25519,
    payload,
    publicKeys.ed25519.publicKey,
  );
  const mlDsa65Valid = ml_dsa65.verify(
    signature.mlDsa65,
    payload,
    publicKeys.mlDsa65.publicKey,
  );
  return {
    ed25519Valid,
    mlDsa65Valid,
    valid: ed25519Valid && mlDsa65Valid,
  };
}

/**
 * Encode a composite signature as a single base64-with-separator string
 * suitable for embedding in an XML element or other text format.
 */
export function encodeCompositeSignature(sig: CompositeSignature): string {
  return `${bytesToBase64(sig.ed25519)}${SEPARATOR}${bytesToBase64(sig.mlDsa65)}`;
}

/**
 * Decode a composite signature previously encoded with
 * encodeCompositeSignature. Throws if the format is invalid.
 */
export function decodeCompositeSignature(encoded: string): CompositeSignature {
  const sep = encoded.indexOf(SEPARATOR);
  if (sep < 0) {
    throw new Error("Invalid composite signature: missing separator");
  }
  const edB64 = encoded.slice(0, sep);
  const mlB64 = encoded.slice(sep + 1);
  return {
    ed25519: base64ToBytes(edB64),
    mlDsa65: base64ToBytes(mlB64),
  };
}

/**
 * Encode composite public key material as a single base64-with-separator
 * string. Useful for embedding both public keys in a single XML element
 * or PEM-style block.
 */
export function encodeCompositePublicKeys(keys: CompositeKeyMaterial): string {
  return `${bytesToBase64(keys.ed25519.publicKey)}${SEPARATOR}${bytesToBase64(keys.mlDsa65.publicKey)}`;
}

/**
 * Decode composite public key material previously encoded with
 * encodeCompositePublicKeys.
 */
export function decodeCompositePublicKeys(encoded: string): {
  ed25519: Uint8Array;
  mlDsa65: Uint8Array;
} {
  const sep = encoded.indexOf(SEPARATOR);
  if (sep < 0) {
    throw new Error("Invalid composite public key: missing separator");
  }
  return {
    ed25519: base64ToBytes(encoded.slice(0, sep)),
    mlDsa65: base64ToBytes(encoded.slice(sep + 1)),
  };
}
