/**
 * Key type declarations shared across key management modules.
 *
 * Centralized here to break circular dependencies between
 * generate / cache / store / import-export.
 */

export type KeyAlgorithm = "ECDSA";

export interface StoredKey {
  id: string;
  alias: string;
  algorithm: KeyAlgorithm;
  publicKeySpki: ArrayBuffer;
  privateKeyPkcs8: ArrayBuffer;
  salt: ArrayBuffer;
  iv: ArrayBuffer;
  created: number;
  fingerprint: string;
  certificatePem?: string;
  /** The CA chain below the officer cert (intermediates + root) —
   *  embedded in the KeyInfo at signing. */
  chainPem?: string[];
  certificateExpiry?: number;
  certificateStatus?: "certified" | "pending" | "expired" | "none";
}

export interface GenerateOptions {
  algorithm?: KeyAlgorithm;
  alias: string;
  passphrase: string;
}
