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
import { dimensionsCheck } from "./dimensions.ts";
import { scopeCheck } from "./scope.ts";
import { crlCheck } from "./crl.ts";
import { erBindingCheck } from "./er_binding.ts";
import { timestampCheck } from "./timestamp.ts";
import { transparencyCheck } from "./transparency.ts";
import { buildCoverageReport } from "./coverage.ts";
import { classify } from "./classification.ts";
import { evaluate } from "./acceptance.ts";
import { buildSpecResult } from "./result.ts";

export type { Check, CheckContext, CheckResult };

// SIGNATIF three-stage verification model:
// coverage (objective facts) → classification (scheme policy) →
// acceptance (verifier policy).
export type {
  CoverageReport,
  HardCheckResult,
  SoftCheckResult,
  VerificationPath,
  DimensionCoverage,
} from "./coverage.ts";
export { buildCoverageReport, HARD_CHECK_IDS, SOFT_CHECK_IDS } from "./coverage.ts";
export type { ClassificationPolicy, ClassificationResult } from "./classification.ts";
export { classify, DEFAULT_CLASSIFICATION_POLICY, classificationPolicyFromManifest } from "./classification.ts";
export type { AcceptancePolicy, AcceptanceResult } from "./acceptance.ts";
export { evaluate, DEFAULT_ACCEPTANCE_POLICY } from "./acceptance.ts";
// Spec-shaped result structure with typed failure reasons
// (SIGNATIF §verification-results).
export type { SpecVerificationResult, FailureEntry, FailureReason, DowngradeEntry } from "./result.ts";
export { buildSpecResult } from "./result.ts";
// Transparency integrity (SIGNATIF Phase 3): consistency proofs,
// signed tree heads, fork detection. Cross-verifies with the Ruby
// TransparencyPublisher.
export type { SignedTreeHead } from "./transparency-consistency.ts";
export {
  verifyConsistency,
  verifyConsistencyHeads,
  verifySignedHead,
  detectFork,
  headString,
  leafHashOf,
  rootOverEntries,
} from "./transparency-consistency.ts";

// The CRL leg's helpers — the app's revocation
// propagation extracts the signing cert's serial with these.
export { readCrlFieldsFromCert } from "./crl.ts";
export { crlCheck } from "./crl.ts";
// The ER-binding leg.
export { erBindingCheck } from "./er_binding.ts";
// Optional Confium WASM enhanced verification (NOT in CHECKS; invoked
// separately by VerifyDrop after the main pipeline).
export { runConfiumVerifyCheck, confiumVerifyCheckId } from "./confium-verify.ts";
export type { ConfiumVerifyInput } from "./confium-verify.ts";
// The pipeline's self-sufficiency seams: the core-schema registration +
// the environment-agnostic per-rec schema lookup.
export { ensureCoreSchemasRegistered, getRecommendationSchema } from "./core_schemas.ts";

/**
 * The canonical check pipeline. Order is significant — each check
 * may depend on results from earlier checks via the CheckContext.
 */
export const CHECKS: Check[] = [
  xmlWellFormedCheck,
  schemaValidCheck,
  signatureCheck,
  dimensionsCheck,
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

/**
 * The SIGNATIF three-stage verification entry point.
 *
 * Stage 1: the coverage report (objective, deterministic facts).
 * Stage 2: classification under a scheme-declared policy.
 * Stage 3: acceptance under the verifier's own policy.
 *
 * runChecks remains the raw check engine; verifyArtifact wraps it.
 */
export interface VerificationOutcome {
  results: CheckResult[];
  coverage: import("./coverage.ts").CoverageReport;
  classification: import("./classification.ts").ClassificationResult;
  acceptance: import("./acceptance.ts").AcceptanceResult;
  /** Spec-shaped result: classified_grade, paths, dimensional_coverage,
   *  typed failures, downgrades. */
  result: import("./result.ts").SpecVerificationResult;
}

export async function verifyArtifact(
  xml: string,
  ctx: CheckContext,
  options?: {
    policy?: import("./classification.ts").ClassificationPolicy;
    acceptance?: import("./acceptance.ts").AcceptancePolicy;
  },
): Promise<VerificationOutcome> {
  const results = await runChecks(xml, ctx);
  const coverage = await buildCoverageReport(xml, ctx, results);
  const classification = classify(results, coverage, options?.policy);
  const acceptance = evaluate(coverage, classification, options?.acceptance);
  const result = buildSpecResult(coverage, classification, results);
  return { results, coverage, classification, acceptance, result };
}
