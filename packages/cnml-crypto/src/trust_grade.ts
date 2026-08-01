/**
 * Trust grade computation for the verifier UI (TODO 49).
 *
 * Maps the 7+ individual check results into a single letter grade
 * (A+ through F) with a human-readable verdict. Used by the
 * VerifyDrop UI to give non-experts an immediate go/no-go signal
 * while preserving full check detail for experts.
 *
 * @see TODO.roadmap/49-verifier-ux-trust-grade.md
 */

import type { CheckResult, CheckStatus } from "./checks/types.ts";

/** Five-grade trust scale. */
export type Grade = "A+" | "A" | "B" | "C" | "F";

/** Color (hex) per grade. WCAG AAA contrast against white. */
export const GRADE_COLORS: Record<Grade, string> = {
  "A+": "#0a6b2c",  // deep green
  "A":  "#1a8a3a",  // green
  "B":  "#b8860b",  // dark goldenrod
  "C":  "#cc5500",  // orange
  "F":  "#a00000",  // deep red
};

/** Shape per grade — provides redundant signal for color-blind users (TODO 61). */
export type GradeShape = "circle" | "square" | "triangle" | "hexagon" | "x";

export const GRADE_SHAPES: Record<Grade, GradeShape> = {
  "A+": "circle",
  "A":  "circle",
  "B":  "square",
  "C":  "triangle",
  "F":  "x",
};

/** Pattern per grade — provides additional redundant signal. */
export type GradePattern = "solid" | "striped" | "dotted" | "warning";

export const GRADE_PATTERNS: Record<Grade, GradePattern> = {
  "A+": "solid",
  "A":  "solid",
  "B":  "striped",
  "C":  "dotted",
  "F":  "warning",
};

/** Short icon glyph per grade (Unicode — works in any font). */
export const GRADE_GLYPHS: Record<Grade, string> = {
  "A+": "✓",
  "A":  "✓",
  "B":  "?",
  "C":  "!",
  "F":  "✗",
};

/** Hard checks — any failure = grade F. */
const HARD_CHECK_IDS = new Set([
  "xml-well-formed",
  "schema-valid",
  "signature",
  "scope",
  "crl",
]);

/** Soft checks — failure / warning downgrades the grade but does not produce F. */
const SOFT_CHECK_IDS = new Set([
  "timestamp",
  "transparency",
  "roughtime",
  "legacy-compatibility",
]);

/** Mapping from soft-check ID to the grade it downgrades to when absent. */
const SOFT_DOWNGRADE_WHEN_SKIP: Record<string, Grade> = {
  "timestamp":    "A",   // no timestamp → A (still valid)
  "transparency": "B",   // no transparency proof → B (less public accountability)
  "roughtime":    "A",   // no roughtime → A
};

const SOFT_DOWNGRADE_WHEN_WARN: Record<string, Grade> = {
  "timestamp":    "B",
  "transparency": "B",
  "roughtime":    "B",
};

/** Per-grade verdict semantics (English default; i18n hook). */
const VERDICT_SEMANTICS_EN: Record<Grade, string> = {
  "A+":
    "This certificate is fully verified against international standards. Proceed with full confidence.",
  "A":
    "This certificate is valid. Standard operational trust applies.",
  "B":
    "This certificate has minor concerns. Verify additional details manually if high-stakes.",
  "C":
    "This certificate could not be fully verified. Treat with caution and contact the issuing authority for confirmation.",
  "F":
    "This certificate is INVALID. Do not accept. Report to authorities.",
};

/** Per-grade short label. */
const GRADE_LABELS_EN: Record<Grade, string> = {
  "A+": "Grade A+ Trusted",
  "A":  "Grade A Trusted",
  "B":  "Grade B Likely valid",
  "C":  "Grade C Insufficient",
  "F":  "Grade F Untrusted",
};

/** Computed trust grade + verdict. */
export interface TrustGradeResult {
  /** Letter grade A+ through F. */
  readonly grade: Grade;
  /** Short label (e.g., "Grade A+ Trusted"). */
  readonly label: string;
  /** Verdict semantics — full sentence shown to user. */
  readonly verdict: string;
  /** Hex color for UI. */
  readonly color: string;
  /** Shape (color-blind redundancy — TODO 61). */
  readonly shape: GradeShape;
  /** Pattern (color-blind redundancy — TODO 61). */
  readonly pattern: GradePattern;
  /** Glyph (single-character icon). */
  readonly glyph: string;
  /** Reasons contributing to the grade (one per non-pass check). */
  readonly reasons: readonly string[];
  /** Check breakdown for the details view. */
  readonly breakdown: readonly { checkId: string; status: CheckStatus; reason?: string }[];
}

/**
 * Compute the trust grade from check results.
 *
 * Algorithm:
 *   1. Any hard check failed → grade F
 *   2. Otherwise, start from A+ and downgrade per soft check outcomes
 *   3. Skip on soft check → downgrade to SOFT_DOWNGRADE_WHEN_SKIP
 *   4. Warn on soft check → downgrade to SOFT_DOWNGRADE_WHEN_WARN
 *   5. Take the lowest grade produced
 */
export function computeTrustGrade(results: readonly CheckResult[]): TrustGradeResult {
  const reasons: string[] = [];
  const breakdown = results.map(r => ({
    checkId: r.checkId,
    status: r.status,
    reason: r.reason,
  }));

  // Hard check failure → F
  for (const r of results) {
    if (r.status === "fail" && HARD_CHECK_IDS.has(r.checkId)) {
      reasons.push(r.reason ?? `Check ${r.checkId} failed`);
      return gradeResult("F", reasons, breakdown);
    }
  }

  // Start from A+; downgrade per soft check
  const gradeRank: Record<Grade, number> = { "A+": 4, "A": 3, "B": 2, "C": 1, "F": 0 };
  let currentGrade: Grade = "A+";

  for (const r of results) {
    if (!SOFT_CHECK_IDS.has(r.checkId)) continue;

    // Always record a reason for non-pass soft checks — the user wants
    // to know what was suboptimal even if the grade was already capped
    // lower by a different check.
    if (r.status !== "pass" && r.reason) {
      reasons.push(`${r.checkId}: ${r.reason}`);
    }

    if (r.status === "skip") {
      const target = SOFT_DOWNGRADE_WHEN_SKIP[r.checkId] ?? "A";
      if (gradeRank[target] < gradeRank[currentGrade]) {
        currentGrade = target;
      }
    } else if (r.status === "warn") {
      const target = SOFT_DOWNGRADE_WHEN_WARN[r.checkId] ?? "B";
      if (gradeRank[target] < gradeRank[currentGrade]) {
        currentGrade = target;
      }
    } else if (r.status === "fail") {
      // Soft check failed — still a hard downgrade to C
      if (gradeRank["C"] < gradeRank[currentGrade]) {
        currentGrade = "C";
      }
    }
  }

  return gradeResult(currentGrade, reasons, breakdown);
}

function gradeResult(
  grade: Grade,
  reasons: readonly string[],
  breakdown: readonly { checkId: string; status: CheckStatus; reason?: string }[],
): TrustGradeResult {
  return {
    grade,
    label: GRADE_LABELS_EN[grade],
    verdict: VERDICT_SEMANTICS_EN[grade],
    color: GRADE_COLORS[grade],
    shape: GRADE_SHAPES[grade],
    pattern: GRADE_PATTERNS[grade],
    glyph: GRADE_GLYPHS[grade],
    reasons,
    breakdown,
  };
}

/** Get a verdict string for a grade, with locale override (i18n hook). */
export function verdictFor(grade: Grade, locale: string = "en"): string {
  // TODO: load translations per locale when i18n ships (TODO 17).
  // For now, English is the only supported locale.
  void locale;
  return VERDICT_SEMANTICS_EN[grade];
}
