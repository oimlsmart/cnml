/**
 * Classification policy — maps a coverage report to a trust label
 * (SIGNATIF stage 2 of 3).
 *
 * The policy is scheme-declared, not verifier-declared: the CNML
 * scheme (via the deployment manifest) decides what combination of
 * check results and dimensional coverage earns which label. The
 * default policy reproduces the historical trust-grade semantics
 * and layers the SIGNATIF top-label requirements on top:
 *
 *   1. Any hard check failed → F
 *   2. Hard check warned (unverifiable, not disproven) → cap B
 *   3. Soft check failed → cap C
 *   4. Soft check warned / skipped → per-check downgrade map
 *   5. Top label requires data + time dimensions, a timestamp,
 *      and transparency inclusion
 *
 * Stage 3 (acceptance.ts) turns the label into the verifier's own
 * accept/reject decision.
 */

import type { Grade } from "../trust_grade.ts";
import type { ClassificationConfig } from "../manifest.ts";
import type { CoverageReport } from "./coverage.ts";
import type { CheckResult } from "./types.ts";
import { HARD_CHECK_IDS, SOFT_CHECK_IDS } from "./coverage.ts";

const GRADE_RANK: Record<Grade, number> = { "A+": 4, "A": 3, "B": 2, "C": 1, "F": 0 };

export interface ClassificationPolicy {
  /** Ordered labels, best first. */
  labels: readonly Grade[];
  /** Grade when any hard check fails. */
  hard_fail_grade: Grade;
  /** Grade cap when a hard check warns (e.g., unverifiable signature). */
  hard_warn_grade: Grade;
  /** Grade cap when a soft check fails. */
  soft_fail_grade: Grade;
  /** Per-check downgrade when a soft check is skipped. */
  soft_skip_grade: Record<string, Grade>;
  /** Per-check downgrade when a soft check warns. */
  soft_warn_grade: Record<string, Grade>;
  /** Grade cap when the top label's required dimensions are missing. */
  missing_dimension_grade: Grade;
  /** Requirements for the top label (A+). */
  top_label: {
    required_dimensions: readonly string[];
    requires_transparency: boolean;
    requires_timestamp: boolean;
  };
}

export const DEFAULT_CLASSIFICATION_POLICY: ClassificationPolicy = {
  labels: ["A+", "A", "B", "C", "F"],
  hard_fail_grade: "F",
  hard_warn_grade: "B",
  soft_fail_grade: "C",
  soft_skip_grade: {
    // Co-signatures are optional coverage: absence does not downgrade.
    dimensions: "A+",
    timestamp: "A",
    er_binding: "A",
    transparency: "B",
    roughtime: "A",
  },
  soft_warn_grade: {
    dimensions: "B",
    timestamp: "B",
    er_binding: "B",
    transparency: "B",
    roughtime: "B",
  },
  missing_dimension_grade: "A",
  top_label: {
    required_dimensions: ["data", "time"],
    requires_transparency: true,
    requires_timestamp: true,
  },
};

export interface ClassificationResult {
  /** The assigned label. */
  label: Grade;
  /** Label before algorithm-status adjustments (Phase 5). */
  base_label: Grade;
  /** Downgrades applied and why (one per contributing rule). */
  reasons: string[];
  /** Check breakdown (mirrors the coverage report). */
  breakdown: readonly { check_id: string; status: string; reason?: string }[];
}

/**
 * Classify a coverage report under a policy.
 *
 * Works from results alone (report optional) so the presentation
 * layer (computeTrustGrade) and the pipeline (verifyArtifact) share
 * one downgrade engine.
 */
export function classify(
  results: readonly CheckResult[],
  report?: CoverageReport,
  policy: ClassificationPolicy = DEFAULT_CLASSIFICATION_POLICY,
): ClassificationResult {
  const reasons: string[] = [];
  const breakdown = results.map((r) => ({
    check_id: r.checkId,
    status: r.status,
    reason: r.reason,
  }));

  let label: Grade = policy.labels[0];

  const cap = (target: Grade, why: string, record?: string) => {
    if (GRADE_RANK[target] < GRADE_RANK[label]) {
      label = target;
      if (record) reasons.push(record);
    } else if (record && !reasons.includes(record)) {
      reasons.push(record);
    }
    void why;
  };

  for (const r of results) {
    const isHard = HARD_CHECK_IDS.has(r.checkId);
    const isSoft = SOFT_CHECK_IDS.has(r.checkId);
    if (!isHard && !isSoft) continue;

    if (r.status === "fail") {
      if (isHard) {
        reasons.push(r.reason ?? `Check ${r.checkId} failed`);
        return finish("F", "F", reasons, breakdown, policy);
      }
      cap(policy.soft_fail_grade, "soft-fail", `${r.checkId}: ${r.reason ?? "failed"}`);
    } else if (r.status === "warn") {
      const record = r.reason ? `${r.checkId}: ${r.reason}` : undefined;
      if (isHard) {
        cap(policy.hard_warn_grade, "hard-warn", record);
      } else {
        cap(policy.soft_warn_grade[r.checkId] ?? "B", "soft-warn", record);
      }
    } else if (r.status === "skip" && isSoft) {
      cap(
        policy.soft_skip_grade[r.checkId] ?? "A",
        "soft-skip",
        r.reason ? `${r.checkId}: ${r.reason}` : undefined,
      );
    } else if (r.status === "pending" && isSoft) {
      // The attestation is in flight: neither a pass nor a fail — the
      // grade impact of the not-yet-anchored leg is the soft-skip one.
      cap(
        policy.soft_skip_grade[r.checkId] ?? "A",
        "soft-pending",
        r.reason ? `${r.checkId}: ${r.reason}` : undefined,
      );
    }
  }

  if (report) {
    const verified = new Set(
      report.dimensions.filter((d) => d.verified).map((d) => d.dimension),
    );
    for (const dim of policy.top_label.required_dimensions) {
      if (!verified.has(dim)) {
        cap(policy.missing_dimension_grade, "dimension", `missing dimension: ${dim}`);
      }
    }
    if (policy.top_label.requires_transparency) {
      const t = report.soft_checks.find((c) => c.check_id === "transparency");
      if (!t || t.status !== "pass") {
        cap("B", "transparency", "transparency inclusion absent");
      }
    }
    if (policy.top_label.requires_timestamp) {
      const ts = report.soft_checks.find((c) => c.check_id === "timestamp");
      if (!ts || ts.status !== "pass") {
        cap("A", "timestamp", "time anchor absent");
      }
    }
    // Algorithm agility (Phase 5): deprecated → one label down; retired → hard fail.
    // base_label is the pre-adjustment result of the policy rules alone.
    const base = label;
    for (const alg of report.algorithms) {
      if (alg.status === "deprecated") {
        cap(downgradeOne(label, policy), "algorithm-deprecated", `deprecated algorithm: ${alg.id}`);
      } else if (alg.status === "retired") {
        return finish("F", base, [...reasons, `retired algorithm: ${alg.id}`], breakdown, policy);
      }
    }

    return finish(label, base, reasons, breakdown, policy);
  }

  return finish(label, label, reasons, breakdown, policy);
}

function downgradeOne(label: Grade, policy: ClassificationPolicy): Grade {
  const idx = policy.labels.indexOf(label);
  return idx >= 0 && idx < policy.labels.length - 1 ? policy.labels[idx + 1] : label;
}

function finish(
  label: Grade,
  base: Grade,
  reasons: string[],
  breakdown: ClassificationResult["breakdown"],
  _policy: ClassificationPolicy,
): ClassificationResult {
  void _policy;
  return { label, base_label: base, reasons, breakdown };
}


/**
 * Build a ClassificationPolicy from the deployment manifest's
 * [classification] section. Unspecified fields fall back to the
 * default policy; the label order is fixed (A+ > A > B > C > F).
 */
export function classificationPolicyFromManifest(
  config: ClassificationConfig | undefined,
): ClassificationPolicy {
  if (!config) return DEFAULT_CLASSIFICATION_POLICY;
  return {
    ...DEFAULT_CLASSIFICATION_POLICY,
    soft_fail_grade: (config.downgrades?.soft_fail as Grade) ?? DEFAULT_CLASSIFICATION_POLICY.soft_fail_grade,
    hard_warn_grade: (config.downgrades?.hard_warn as Grade) ?? DEFAULT_CLASSIFICATION_POLICY.hard_warn_grade,
    missing_dimension_grade: (config.downgrades?.missing_dimension as Grade) ?? DEFAULT_CLASSIFICATION_POLICY.missing_dimension_grade,
    top_label: {
      required_dimensions: config.top_label?.required_dimensions
        ?? DEFAULT_CLASSIFICATION_POLICY.top_label.required_dimensions,
      requires_transparency: config.top_label?.requires_transparency
        ?? DEFAULT_CLASSIFICATION_POLICY.top_label.requires_transparency,
      requires_timestamp: config.top_label?.requires_timestamp
        ?? DEFAULT_CLASSIFICATION_POLICY.top_label.requires_timestamp,
    },
  };
}