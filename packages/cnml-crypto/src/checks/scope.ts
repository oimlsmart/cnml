import type { Check, CheckResult } from "./types.ts";
import { readScopeFromCert, isRecommendationInScope } from "../scope.ts";

/** Check 4: Issuer scope. Reads the oimlAuthorizedRecommendations
 *  extension from the cert in <ds:KeyInfo> and verifies the CNML's
 *  recommendation id is covered.
 *
 *  Gracefully accepts if the cert predates scope governance (no
 *  extension present) — that's a legacy cert, not a failure. */
export const scopeCheck: Check = {
  id: "scope",
  label: "4. Issuer authorized",
  continueOnFail: true,
  run: async (_xml, ctx): Promise<CheckResult> => {
    const rId = ctx.recommendationId;
    if (!rId) {
      return {
        checkId: "scope",
        status: "skip",
        reason: "No recommendation id parsed (depends on schema-valid check)",
      };
    }
    const certPem = ctx.trustedCerts?.[0];
    if (!certPem) {
      return {
        checkId: "scope",
        status: "skip",
        reason: "No issuer cert in CNML <ds:KeyInfo>",
      };
    }
    let scope: string[] | null;
    try {
      scope = await readScopeFromCert(certPem);
    } catch (e) {
      return {
        checkId: "scope",
        status: "warn",
        reason: `Could not read scope extension: ${(e as Error).message}`,
      };
    }
    ctx.issuerScope = scope;

    if (scope === null) {
      return {
        checkId: "scope",
        status: "warn",
        reason: "Cert predates scope governance (legacy). Accept with caution.",
      };
    }
    if (isRecommendationInScope(rId, scope)) {
      return {
        checkId: "scope",
        status: "pass",
        reason: `Issuer authorized for ${rId} (scope: ${scope.join(", ")})`,
      };
    }
    return {
      checkId: "scope",
      status: "fail",
      reason: `Issuer NOT authorized for ${rId}. Authorized scope: ${scope.join(", ")}`,
    };
  },
};
