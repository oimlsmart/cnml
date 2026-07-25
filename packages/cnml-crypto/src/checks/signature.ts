import type { Check, CheckResult } from "./types.ts";
import { verifyCnmlXml } from "../index.ts";

/** Check 3: XMLDSig signature. Wraps the existing verifyCnmlXml and
 *  translates its output to a CheckResult. Sets ctx.issuerScope for
 *  the scope check (next). */
export const signatureCheck: Check = {
  id: "signature",
  label: "3. Signature valid",
  run: async (xml, ctx): Promise<CheckResult> => {
    let result;
    try {
      result = await verifyCnmlXml(xml);
    } catch (e) {
      return {
        checkId: "signature",
        status: "fail",
        reason: `Verification error: ${(e as Error).message}`,
      };
    }

    if (!result.signaturePresent) {
      return {
        checkId: "signature",
        status: "fail",
        reason: "No <ds:Signature> element found",
      };
    }

    // Stash the certificate chain for the scope check.
    if (result.certificateChain.length > 0) {
      ctx.trustedCerts = result.certificateChain;
    }

    if (result.signatureValid && result.digestValid) {
      return { checkId: "signature", status: "pass" };
    }

    // Distinguish "no cert + no trusted key" (warn) from real failure.
    if (!result.signatureValid && ctx.trustedKeys?.length === 0 && !ctx.trustedCerts?.length) {
      return {
        checkId: "signature",
        status: "warn",
        reason: "Signature present but cannot verify — no trusted key available. Add the issuer's public key on the Keys page.",
      };
    }

    return {
      checkId: "signature",
      status: "fail",
      reason: result.reason ?? "Signature or digest mismatch",
    };
  },
};
