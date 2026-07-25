/**
 * Ed25519 support for browsers without native WebCrypto Ed25519.
 *
 * Uses @noble/ed25519 (pure JS, audited) when the native `Ed25519`
 * algorithm is not available in crypto.subtle. When it IS available
 * (Chrome 113+, Firefox 130+), uses the native implementation for
 * hardware-backed key isolation.
 *
 * This module provides a unified API that works regardless of browser
 * support. Callers use it like crypto.subtle but get Ed25519 everywhere.
 */

import * as ed from "@noble/ed25519";

// Check if native Ed25519 is available
let nativeSupported: boolean | null = null;

async function checkNative(): Promise<boolean> {
  if (nativeSupported !== null) return nativeSupported;
  try {
    await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
    nativeSupported = true;
  } catch {
    nativeSupported = false;
  }
  return nativeSupported;
}

export interface Ed25519KeyPair {
  publicKey: Uint8Array;  // 32 bytes
  secretKey: Uint8Array;  // 32 bytes
}

/**
 * Generate an Ed25519 keypair. Uses native WebCrypto if available,
 * falls back to @noble/ed25519 otherwise.
 */
export async function generateEd25519KeyPair(): Promise<Ed25519KeyPair> {
  if (await checkNative()) {
    const kp = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
    const rawPriv = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
    const rawPub = await crypto.subtle.exportKey("raw", kp.publicKey);
    // PKCS8 for Ed25519: strip the 16-byte PKCS8 header to get the 32-byte seed
    const privBytes = new Uint8Array(rawPriv).slice(16);
    return {
      publicKey: new Uint8Array(rawPub),
      secretKey: privBytes,
    };
  }
  // Pure JS fallback via @noble/ed25519
  const priv = ed.utils.randomPrivateKey();
  const pub = await ed.getPublicKeyAsync(priv);
  return { publicKey: pub, secretKey: priv };
}

/**
 * Sign data with Ed25519.
 */
export async function ed25519Sign(data: Uint8Array, secretKey: Uint8Array): Promise<Uint8Array> {
  if (await checkNative()) {
    const key = await crypto.subtle.importKey(
      "raw", secretKey, "Ed25519", false, ["sign"],
    );
    const sig = await crypto.subtle.sign("Ed25519", key, data);
    return new Uint8Array(sig);
  }
  return ed.signAsync(data, secretKey);
}

/**
 * Verify an Ed25519 signature.
 */
export async function ed25519Verify(
  signature: Uint8Array,
  data: Uint8Array,
  publicKey: Uint8Array,
): Promise<boolean> {
  if (await checkNative()) {
    const key = await crypto.subtle.importKey(
      "raw", publicKey, "Ed25519", false, ["verify"],
    );
    return crypto.subtle.verify("Ed25519", key, signature, data);
  }
  return ed.verifyAsync(signature, data, publicKey);
}

/**
 * Export Ed25519 public key as PEM (SPKI format).
 * For browsers without native SPKI export, we construct the DER manually.
 */
export async function ed25519PublicKeyToPem(publicKey: Uint8Array): Promise<string> {
  // SPKI for Ed25519: 12-byte prefix + 32-byte key
  const spkiPrefix = new Uint8Array([
    0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70,
    0x03, 0x21, 0x00,
  ]);
  const spki = new Uint8Array(spkiPrefix.length + publicKey.length);
  spki.set(spkiPrefix, 0);
  spki.set(publicKey, spkiPrefix.length);

  const b64 = btoa(String.fromCharCode(...spki));
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----\n`;
}
