/**
 * The xmldsigjs engine seam (browser vs node): xmldsigjs's own init()
 * only registers the WebCrypto engine when `self`/`window` exist — in
 * node it never runs, and every Application.crypto access throws
 * XMLJS0014 ("WebCrypto module is not found"). Node ≥ 20 ships
 * globalThis.crypto (the same WebCrypto), so register it explicitly.
 * Idempotent: calling setEngine twice just re-registers the same
 * crypto object.
 */

import * as xmldsig from "xmldsigjs";

let ensured = false;

/** Ensure xmldsigjs has a WebCrypto engine in non-browser runtimes. */
export function ensureXmldsigEngine(): void {
  if (ensured) return;
  if (typeof window === "undefined" && typeof self === "undefined") {
    const crypto = globalThis.crypto;
    if (!crypto?.subtle) {
      throw new Error("no WebCrypto available — node ≥ 20 (globalThis.crypto.subtle) or a browser is required for CNML signing");
    }
    xmldsig.Application.setEngine("W3 WebCrypto module (node)", crypto);
  }
  ensured = true;
}
