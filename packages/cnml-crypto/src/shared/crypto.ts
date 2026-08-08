/**
 * Shared WebCrypto handle and text encoding.
 *
 * `const SUBTLE = globalThis.crypto.subtle;` was repeated in 8
 * modules. This file is the single declaration. If the access
 * pattern changes (async availability check, polyfill), one file
 * changes.
 */

export const SUBTLE = globalThis.crypto.subtle;

const TEXT_ENCODER = new TextEncoder();

/** Encode a string as UTF-8 bytes. Reuses a shared TextEncoder. */
export function encodeText(s: string): Uint8Array {
  return TEXT_ENCODER.encode(s);
}
