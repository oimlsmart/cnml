import type { Check, CheckResult } from "./types.ts";
import { readScopeFromCert, isRecommendationInScope } from "../scope.ts";
import {
  extractScopeConditions,
  conditionValuesFromXml,
  evaluateScopeExpression,
} from "../scope-narrowing.ts";

/** Check 4: Issuer scope + scope conditions (SIGNATIF Phase 6).
 *
 * Reads the oimlAuthorizedRecommendations extension from the cert in
 * <ds:KeyInfo> and verifies the CNML's recommendation id is covered.
 * Then evaluates any <cnml:scopeCondition> elements against the
 * artifact's own content (or ctx.scopeConditionValues when the
 * verifier supplies explicit values).
 *
 * Gracefully accepts if the cert predates scope governance (no
 * extension present) — that's a legacy cert, not a failure. */
export const scopeCheck: Check = {
  id: "scope",
  label: "4. Issuer authorized",
  continueOnFail: true,
  run: async (xml, ctx): Promise<CheckResult> => {
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
    if (!isRecommendationInScope(rId, scope)) {
      return {
        checkId: "scope",
        status: "fail",
        reason: `Issuer NOT authorized for ${rId}. Authorized scope: ${scope.join(", ")}`,
      };
    }

    // Scope conditions: executable predicates evaluated against the
    // artifact's own content (measurement.temperature within the
    // approved range, etc.). A violated condition fails the check.
    const conditions = extractScopeConditions(xml);
    if (conditions.length > 0) {
      const values = { ...conditionValuesFromXml(xml), ...ctx.scopeConditionValues };
      const violated: string[] = [];
      for (const cond of conditions) {
        let ok: boolean;
        try {
          ok = evaluateScopeExpression(cond.expression, values);
        } catch (e) {
          return {
            checkId: "scope",
            status: "fail",
            reason: `Scope condition '${cond.id}' is malformed: ${(e as Error).message}`,
          };
        }
        if (!ok) violated.push(cond.id);
      }
      if (violated.length > 0) {
        return {
          checkId: "scope",
          status: "fail",
          reason: `Scope condition(s) not satisfied: ${violated.join(", ")}`,
        };
      }
      return {
        checkId: "scope",
        status: "pass",
        reason: `Issuer authorized for ${rId} (scope: ${scope.join(", ")}); ${conditions.length} scope condition(s) satisfied`,
      };
    }

    return {
      checkId: "scope",
      status: "pass",
      reason: `Issuer authorized for ${rId} (scope: ${scope.join(", ")})`,
    };
  },
};
