/**
 * Spec-shaped verification result (SIGNATIF §verification-results).
 *
 * The result carries the classification label, the valid
 * verification paths, the dimensional coverage, typed failures for
 * hard failures, and downgrades for soft non-passes. Typed failure
 * reasons let a verifier distinguish operational conditions that
 * need different responses. Extensions use the x- prefix.
 */

import type { CoverageReport } from "./coverage.ts";
import type { ClassificationResult } from "./classification.ts";
import type { CheckResult } from "./types.ts";
import { HARD_CHECK_IDS } from "./coverage.ts";
import type { Grade } from "../trust_grade.ts";

export type FailureReason =
  | "format_invalid"
  | "signature_invalid"
  | "chain_broken"
  | "scope_widened"
  | "scope_condition_failed"
  | "revoked"
  | "transparency_missing"
  | `x-${string}`;

export interface FailureEntry {
  check: string;
  reason: FailureReason;
  detail: string;
}

export interface DowngradeEntry {
  check: string;
  /** The soft check's current value (skip / warn / fail). */
  value: string;
}

export interface SpecVerificationResult {
  /** The scheme-defined classification label. */
  classified_grade: Grade;
  /** The set of valid verification paths found. */
  paths: CoverageReport["paths"];
  /** The set of trust dimensions with verified attestations. */
  dimensional_coverage: CoverageReport["dimensions"];
  /** Typed failures, populated when hard checks failed. */
  failures: FailureEntry[];
  /** Soft-check non-passes, populated regardless of the label. */
  downgrades: DowngradeEntry[];
}

function failureReasonFor(r: CheckResult): FailureReason {
  switch (r.checkId) {
    case "xml-well-formed":
    case "schema-valid":
      return "format_invalid";
    case "signature":
    case "dimensions":
      return "signature_invalid";
    case "scope":
      return /condition/i.test(r.reason ?? "") ? "scope_condition_failed" : "scope_widened";
    case "crl":
      return "revoked";
    case "transparency":
      return "transparency_missing";
    default:
      return `x-${r.checkId}`;
  }
}

export function buildSpecResult(
  coverage: CoverageReport,
  classification: ClassificationResult,
  results: readonly CheckResult[],
): SpecVerificationResult {
  const failures: FailureEntry[] = [];
  const downgrades: DowngradeEntry[] = [];

  for (const r of results) {
    if (r.status === "fail" && HARD_CHECK_IDS.has(r.checkId)) {
      failures.push({
        check: r.checkId,
        reason: failureReasonFor(r),
        detail: r.reason ?? `${r.checkId} failed`,
      });
    } else if (r.status !== "pass" && !HARD_CHECK_IDS.has(r.checkId)) {
      downgrades.push({ check: r.checkId, value: r.status });
    }
  }

  // Hard checks passed but no path reached a root anchor: the chain
  // to the trust anchors is broken.
  if (failures.length === 0 && coverage.paths.length === 0) {
    const sig = results.find((r) => r.checkId === "signature");
    if (sig?.status === "pass") {
      failures.push({
        check: "signature",
        reason: "chain_broken",
        detail: "no valid verification path from the artifact to any root anchor",
      });
    }
  }

  return {
    classified_grade: classification.label,
    paths: coverage.paths,
    dimensional_coverage: coverage.dimensions,
    failures,
    downgrades,
  };
}
