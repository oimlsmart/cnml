/**
 * Optional Confium WASM verification check.
 *
 * Unlike the core checks in the CHECKS pipeline, this check is
 * informational: it reports whether the Confium WASM bundle loaded
 * successfully and whether it could perform a composite-signature
 * verification on the document. It is NOT added to the CHECKS array.
 * VerifyDrop.vue invokes it as an "enhanced verification" step that
 * runs after the main pipeline, with silent degradation when Confium
 * is unavailable (e.g., not installed, no WASM support).
 */

import { loadConfiumWasm, ConfiumWasmUnavailableError } from "../confium-wasm.ts";
import type { CheckResult } from "./types.ts";
import { encodeText } from "../shared/crypto.ts";

export const confiumVerifyCheckId = "confium-wasm";

export interface ConfiumVerifyInput {
  /** Raw CNML XML to verify. */
  xml: string;
  /**
   * Optional composite signature bytes extracted from the document.
   * When absent, the check only probes WASM loadability (proving the
   * WASM bundle is available) without performing an actual verify.
   */
  compositeSignature?: Uint8Array;
  /** Optional public key / share bundle bytes for composite verify. */
  compositePublicKey?: Uint8Array;
}

/**
 * Run the Confium WASM enhanced verification step.
 *
 * Behavior:
 *   - If Confium WASM cannot load, returns a "skip" result (silent).
 *   - If loaded and a composite signature + key are provided, attempts
 *     CompositeSignature.verify() and reports pass/fail.
 *   - If loaded but no composite signature is present, returns a "pass"
 *     result with the WASM version as details (proves availability).
 */
export async function runConfiumVerifyCheck(
  input: ConfiumVerifyInput,
): Promise<CheckResult> {
  let bundle;
  try {
    bundle = await loadConfiumWasm();
  } catch (e) {
    if (e instanceof ConfiumWasmUnavailableError) {
      return {
        checkId: confiumVerifyCheckId,
        status: "skip",
        reason: `Confium WASM unavailable (${e.reason})`,
      };
    }
    return {
      checkId: confiumVerifyCheckId,
      status: "skip",
      reason: `Confium WASM load failed: ${(e as Error).message}`,
    };
  }

  // Composite signature verification is performed only when both the
  // signature and public key are available. The WASM module exposes
  // CompositeSignature.verify(message, signature, publicKey). If the
  // shape differs, we degrade gracefully to an availability report.
  const CompositeSignature = (bundle.module as { CompositeSignature?: unknown }).CompositeSignature;
  const hasSig = input.compositeSignature && input.compositePublicKey;

  if (hasSig && typeof CompositeSignature === "object" && CompositeSignature && typeof (CompositeSignature as { verify?: unknown }).verify === "function") {
    try {
      const verify = (CompositeSignature as { verify: (m: Uint8Array, s: Uint8Array, k: Uint8Array) => boolean }).verify;
      const ok = verify(
        encodeText(input.xml),
        input.compositeSignature!,
        input.compositePublicKey!,
      );
      return {
        checkId: confiumVerifyCheckId,
        status: ok ? "pass" : "fail",
        reason: ok
          ? undefined
          : "Confium composite signature did not verify",
        details: { version: bundle.version, scheme: bundle.availableSchemes },
      };
    } catch (e) {
      return {
        checkId: confiumVerifyCheckId,
        status: "warn",
        reason: `Confium composite verify threw: ${(e as Error).message}`,
        details: { version: bundle.version },
      };
    }
  }

  // No composite signature provided, or the WASM API shape differs.
  // Report successful load — this is the "proves WASM is available" path.
  return {
    checkId: confiumVerifyCheckId,
    status: "pass",
    reason: `Confium WASM available: v${bundle.version}`,
    details: {
      version: bundle.version,
      rustCoreVersion: bundle.rustCoreVersion,
      schemes: bundle.availableSchemes,
      coordinatorProtocols: bundle.coordinatorProtocols,
    },
  };
}
