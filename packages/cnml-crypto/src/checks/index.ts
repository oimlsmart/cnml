/**
 * Check pipeline — data-driven verification.
 *
 * Each check is a small module that exports a Check object. The
 * VerifyDrop component iterates the CHECKS registry, calls each
 * check's `run` function, and renders the result.
 *
 * Adding a new check is open/closed: write a new file in checks/,
 * add one line to the CHECKS array. No edits to VerifyDrop or any
 * existing check.
 *
 * Check ordering matters — earlier checks short-circuit later ones
 * (no point checking the signature if the XML is malformed).
 */

import type { Check, CheckContext, CheckResult } from "./types.ts";
import { xmlWellFormedCheck } from "./xml_well_formed.ts";
import { schemaValidCheck } from "./schema_valid.ts";
import { signatureCheck } from "./signature.ts";
import { scopeCheck } from "./scope.ts";
import { crlCheck } from "./crl.ts";
import { erBindingCheck } from "./er_binding.ts";
import { timestampCheck } from "./timestamp.ts";
import { transparencyCheck } from "./transparency.ts";

export type { Check, CheckContext, CheckResult };

// The CRL leg's helpers (TODO.ops/13 — the app's revocation
// propagation extracts the signing cert's serial with these).
export { readCrlFieldsFromCert } from "./crl.ts";
export { crlCheck } from "./crl.ts";
// The ER-binding leg (TODO.ops/15).
export { erBindingCheck } from "./er_binding.ts";

/**
 * The canonical check pipeline. Order is significant — each check
 * may depend on results from earlier checks via the CheckContext.
 */
export const CHECKS: Check[] = [
  xmlWellFormedCheck,
  schemaValidCheck,
  signatureCheck,
  scopeCheck,
  crlCheck,
  erBindingCheck,
  timestampCheck,
  transparencyCheck,
];

/**
 * Run the full pipeline. Stops at the first hard failure (status=fail)
 * unless the check explicitly opts into continuing via `continueOnFail`.
 *
 * @returns array of results, in the same order as CHECKS. May be shorter
 *          than CHECKS if a hard failure short-circuited.
 */
export async function runChecks(
  xml: string,
  ctx: CheckContext,
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const check of CHECKS) {
    let result: CheckResult;
    try {
      result = await check.run(xml, ctx, results);
    } catch (e) {
      result = {
        checkId: check.id,
        status: "fail",
        reason: `Check threw: ${(e as Error).message}`,
      };
    }
    results.push(result);
    if (result.status === "fail" && !check.continueOnFail) break;
  }
  return results;
}
