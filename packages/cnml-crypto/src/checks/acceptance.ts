/**
 * Acceptance policy — the verifier's own decision layer (SIGNATIF
 * stage 3 of 3).
 *
 * The classification label is scheme-declared; whether a given
 * verifier accepts a given label is verifier policy. A customs
 * inspector may require B or better; a routine spot check may
 * accept C; nobody accepts F.
 */

import type { Grade } from "../trust_grade.ts";
import type { ClassificationResult } from "./classification.ts";
import type { CoverageReport } from "./coverage.ts";

const GRADE_RANK: Record<Grade, number> = { "A+": 4, "A": 3, "B": 2, "C": 1, "F": 0 };

export interface AcceptancePolicy {
  /** Minimum classification label to accept. */
  minimum_label: Grade;
  /** Whether transparency inclusion is required (overrides classification). */
  require_transparency: boolean;
  /** Whether a time anchor is required (overrides classification). */
  require_timestamp: boolean;
  /** Maximum age of the verification state in ms (0 = no freshness bound). */
  freshness_window_ms: number;
  /** Additional dimensions the verifier demands beyond the classification. */
  required_dimensions: string[];
}

/** Default: accept anything that is not F (the historical behavior). */
export const DEFAULT_ACCEPTANCE_POLICY: AcceptancePolicy = {
  minimum_label: "C",
  require_transparency: false,
  require_timestamp: false,
  freshness_window_ms: 0,
  required_dimensions: [],
};

export interface AcceptanceResult {
  accepted: boolean;
  reasons: string[];
}

export function evaluate(
  report: CoverageReport,
  classification: ClassificationResult,
  policy: AcceptancePolicy = DEFAULT_ACCEPTANCE_POLICY,
): AcceptanceResult {
  const reasons: string[] = [];

  if (GRADE_RANK[classification.label] < GRADE_RANK[policy.minimum_label]) {
    reasons.push(`label ${classification.label} below policy minimum ${policy.minimum_label}`);
  }

  if (policy.require_transparency) {
    const t = report.soft_checks.find((c) => c.check_id === "transparency");
    if (!t || t.status !== "pass") {
      reasons.push("policy requires transparency inclusion");
    }
  }

  if (policy.require_timestamp) {
    const ts = report.soft_checks.find((c) => c.check_id === "timestamp");
    if (!ts || ts.status !== "pass") {
      reasons.push("policy requires a time anchor");
    }
  }

  if (policy.freshness_window_ms > 0) {
    const age = Date.now() - Date.parse(report.verification_time);
    if (Number.isFinite(age) && age > policy.freshness_window_ms) {
      reasons.push(`verification state older than ${policy.freshness_window_ms} ms`);
    }
  }

  const verified = new Set(report.dimensions.filter((d) => d.verified).map((d) => d.dimension));
  for (const dim of policy.required_dimensions) {
    if (!verified.has(dim)) {
      reasons.push(`policy requires the ${dim} dimension`);
    }
  }

  return { accepted: reasons.length === 0, reasons };
}
