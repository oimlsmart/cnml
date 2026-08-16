/**
 * Trust grade computation for the verifier UI.
 *
 * Maps the 7+ individual check results into a single letter grade
 * (A+ through F) with a human-readable verdict. Used by the
 * VerifyDrop UI to give non-experts an immediate go/no-go signal
 * while preserving full check detail for experts.
 */

import type { CheckResult, CheckStatus } from "./checks/types.ts";
import { classify, DEFAULT_CLASSIFICATION_POLICY } from "./checks/classification.ts";

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

/** Shape per grade — provides redundant signal for color-blind users. */
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
  /** Shape (color-blind redundancy). */
  readonly shape: GradeShape;
  /** Pattern (color-blind redundancy). */
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
 * The downgrade engine lives in checks/classification.ts (the
 * SIGNATIF stage-2 policy). This wrapper adds the presentation
 * layer: labels, verdicts, colors, shapes, patterns, glyphs.
 */
export function computeTrustGrade(results: readonly CheckResult[]): TrustGradeResult {
  const c = classify(results, undefined, DEFAULT_CLASSIFICATION_POLICY);
  const breakdown = c.breakdown.map((b) => ({
    checkId: b.check_id,
    status: b.status as CheckStatus,
    reason: b.reason,
  }));
  return gradeResult(c.label, c.reasons, breakdown);
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
  // TODO: load translations per locale when i18n ships.
  // For now, English is the only supported locale.
  void locale;
  return VERDICT_SEMANTICS_EN[grade];
}
