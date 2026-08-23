/**
 * Coverage report — the objective record of what a verification
 * run established (SIGNATIF stage 1 of 3).
 *
 * The coverage report is a deterministic function of the artifact,
 * the trust anchor bundle, and the verifier's cached state: two
 * conforming verifiers with the same inputs produce identical
 * check results, paths, and dimension coverage. (verification_time
 * is advisory metadata and excluded from the determinism claim.)
 *
 * Stage 2 (classification) maps a coverage report to a label under
 * a scheme-declared policy; stage 3 (acceptance) maps the label to
 * the verifier's own accept/reject decision.
 */

import type { CheckContext, CheckResult, CheckStatus } from "./types.ts";
import { sha256Hex } from "../hash.ts";

export interface HardCheckResult {
  check_id: string;
  status: "pass" | "fail";
  reason?: string;
}

export interface SoftCheckResult {
  check_id: string;
  status: "pass" | "fail" | "warn" | "skip" | "pending";
  reason?: string;
}

export interface VerificationPath {
  /** Fingerprint of the root anchor this path terminates at. */
  root_anchor_fingerprint: string;
  /** Number of delegation links in the path. */
  path_length: number;
  /** Which trust dimensions this path validates. */
  dimensions: string[];
}

export interface DimensionCoverage {
  /** The trust dimension (data, person, time, location, ...). */
  dimension: string;
  /** Fingerprint of the signer's key or certificate. */
  source_fingerprint: string;
  /** Whether the dimension's signature verified. */
  verified: boolean;
}

export interface CoverageReport {
  /** SHA-256 of the verified artifact (deterministic id). */
  artifact_id: string;
  /** When the verification was performed (advisory). */
  verification_time: string;
  /** Hard check results. Any fail = overall fail. */
  hard_checks: HardCheckResult[];
  /** Soft check results. Populate coverage but don't fail. */
  soft_checks: SoftCheckResult[];
  /** All valid verification paths from artifact to root anchors. */
  paths: VerificationPath[];
  /** Dimensional coverage: which trust dimensions are attested. */
  dimensions: DimensionCoverage[];
  /** Signature algorithms observed, with registry status (Phase 5). */
  algorithms: { id: string; status: string }[];
  /** Distinct root anchors across all valid paths (§coverage-report). */
  independent_root_count: number;
  /** Multi-log quorum status when a policy applies (§coverage-report). */
  multi_log?: { met: boolean; count: number; m: number; k: number };
}

export const HARD_CHECK_IDS = new Set([
  "xml-well-formed",
  "schema-valid",
  "signature",
  "scope",
  "crl",
]);

export const SOFT_CHECK_IDS = new Set([
  "dimensions",
  "er-binding",
  "timestamp",
  "transparency",
  "roughtime",
  "legacy-compatibility",
]);

function toHard(r: CheckResult): HardCheckResult {
  return {
    check_id: r.checkId,
    status: r.status === "fail" ? "fail" : "pass",
    reason: r.reason,
  };
}

function toSoft(r: CheckResult): SoftCheckResult {
  return { check_id: r.checkId, status: r.status, reason: r.reason };
}

function statusOf(results: readonly CheckResult[], checkId: string): CheckStatus | undefined {
  return results.find((r) => r.checkId === checkId)?.status;
}

/**
 * Build the coverage report from pipeline results.
 *
 * Dimension coverage derives from what each check actually
 * established: the signature check attests the data dimension,
 * the timestamp check the time dimension, the scope check the
 * authorization dimension, and a verified chain the identity
 * dimension. Co-signatures (checks/dimensions.ts) contribute
 * person / environment / location entries via ctx.dimensions.
 */
export async function buildCoverageReport(
  xml: string,
  ctx: CheckContext,
  results: readonly CheckResult[],
): Promise<CoverageReport> {
  const artifact_id = await sha256Hex(new TextEncoder().encode(xml));

  const hard_checks = results.filter((r) => HARD_CHECK_IDS.has(r.checkId)).map(toHard);
  const soft_checks = results.filter((r) => SOFT_CHECK_IDS.has(r.checkId)).map(toSoft);

  const sigStatus = statusOf(results, "signature");
  const tsStatus = statusOf(results, "timestamp");
  const scopeStatus = statusOf(results, "scope");

  const signer = ctx.signerFingerprint ?? "";
  const dimensions: DimensionCoverage[] = [
    { dimension: "data", source_fingerprint: signer, verified: sigStatus === "pass" },
  ];
  if (tsStatus) {
    dimensions.push({ dimension: "time", source_fingerprint: "opentimestamps", verified: tsStatus === "pass" });
  }
  if (scopeStatus) {
    dimensions.push({ dimension: "authorization", source_fingerprint: signer, verified: scopeStatus === "pass" });
  }
  if (sigStatus === "pass" && ctx.chainLength && ctx.chainLength > 0) {
    dimensions.push({ dimension: "identity", source_fingerprint: signer, verified: true });
  }
  for (const d of ctx.dimensions ?? []) {
    dimensions.push(d);
  }

  const paths: VerificationPath[] = [];
  if (sigStatus === "pass" && ctx.rootAnchorFingerprint) {
    const pathDimensions = ["data"];
    if (scopeStatus === "pass") pathDimensions.push("authorization");
    if (ctx.chainLength && ctx.chainLength > 0) pathDimensions.push("identity");
    paths.push({
      root_anchor_fingerprint: ctx.rootAnchorFingerprint,
      path_length: ctx.chainLength ?? 1,
      dimensions: pathDimensions,
    });
  }

  return {
    artifact_id,
    verification_time: new Date().toISOString(),
    hard_checks,
    soft_checks,
    paths,
    dimensions,
    algorithms: ctx.algorithmStatuses ?? [],
    independent_root_count: new Set(paths.map((p) => p.root_anchor_fingerprint)).size,
    multi_log: ctx.multiLogStatus,
  };
}
