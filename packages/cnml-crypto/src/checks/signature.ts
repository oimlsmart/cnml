import type { Check, CheckResult } from "./types.ts";
import { verifyCnmlXml } from "../index.ts";
import { sha256Hex } from "../hash.ts";
import { base64ToBytes } from "../shared/base64.ts";

async function fingerprintCert(base64Der: string): Promise<string> {
  try {
    return await sha256Hex(base64ToBytes(base64Der));
  } catch {
    return "";
  }
}

/** Check 3: XMLDSig signature. Wraps the existing verifyCnmlXml and
 *  translates its output to a CheckResult. Sets ctx.issuerScope for
 *  the scope check (next). */
export const signatureCheck: Check = {
  id: "signature",
  label: "3. Signature valid",
  run: async (xml, ctx): Promise<CheckResult> => {
    let result;
    try {
      // The verifier's trust comes from the context: the embedded chain
      // always, then each trusted key in turn (a browser-held key the
      // document never carried — the CNML leg-1 custody pattern).
      const attempts: Parameters<typeof verifyCnmlXml>[1][] = [
        undefined,
        ...(ctx.trustedCerts ?? []).map((pem) => ({ trustedCertPem: pem })),
        ...(ctx.trustedKeys ?? []).map((key) => ({ trustedPublicKey: key })),
      ];
      result = await verifyCnmlXml(xml);
      for (const opts of attempts) {
        if (!opts) continue;
        if (result.signatureValid && result.digestValid) break;
        const attempt = await verifyCnmlXml(xml, opts);
        if (attempt.signatureValid && attempt.digestValid) {
          result = attempt;
          break;
        }
      }
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
      ctx.chainLength = result.certificateChain.length;
      ctx.signerFingerprint = await fingerprintCert(result.certificateChain[0]);
      ctx.rootAnchorFingerprint = await fingerprintCert(
        result.certificateChain[result.certificateChain.length - 1],
      );
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
