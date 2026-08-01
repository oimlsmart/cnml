/**
 * Tests for trust_grade.ts (TODO 49).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  computeTrustGrade,
  GRADE_COLORS,
  verdictFor,
  type Grade,
} from "./trust_grade.ts";
import type { CheckResult } from "./checks/types.ts";

function pass(checkId: string): CheckResult {
  return { checkId, status: "pass" };
}

function fail(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "fail", reason };
}

function warn(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "warn", reason };
}

function skip(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "skip", reason };
}

const ALL_HARD_PASS = [pass("xml-well-formed"), pass("schema-valid"), pass("signature"), pass("scope"), pass("crl")];

test("all hard checks pass + no soft checks → A+", () => {
  const grade = computeTrustGrade(ALL_HARD_PASS);
  assert.equal(grade.grade, "A+");
});

test("all hard checks pass + timestamp skipped → A (downgrade)", () => {
  const grade = computeTrustGrade([...ALL_HARD_PASS, skip("timestamp")]);
  assert.equal(grade.grade, "A");
});

test("all hard checks pass + transparency skipped → B (more aggressive downgrade)", () => {
  const grade = computeTrustGrade([...ALL_HARD_PASS, skip("transparency")]);
  assert.equal(grade.grade, "B");
});

test("all hard checks pass + timestamp warned → B", () => {
  const grade = computeTrustGrade([...ALL_HARD_PASS, warn("timestamp")]);
  assert.equal(grade.grade, "B");
});

test("any hard check fails → F", () => {
  const r = computeTrustGrade([...ALL_HARD_PASS, fail("signature", "signature invalid")]);
  assert.equal(r.grade, "F");
  assert.ok(r.reasons.some(reason => reason.includes("signature")));
});

test("soft check fails (not hard) → C (significant downgrade)", () => {
  const r = computeTrustGrade([...ALL_HARD_PASS, fail("roughtime", "time anchor invalid")]);
  assert.equal(r.grade, "C");
});

test("multiple soft warnings take the lowest", () => {
  const r = computeTrustGrade([
    ...ALL_HARD_PASS,
    warn("timestamp"),
    warn("transparency"),
    warn("roughtime"),
  ]);
  assert.equal(r.grade, "B");
});

test("reasons list is populated for non-pass checks", () => {
  const r = computeTrustGrade([
    ...ALL_HARD_PASS,
    warn("timestamp", "OTS pending"),
    skip("transparency", "No proof embedded"),
  ]);
  assert.ok(r.reasons.some(reason => reason.includes("OTS pending")));
  assert.ok(r.reasons.some(reason => reason.includes("No proof")));
});

test("breakdown mirrors input results", () => {
  const r = computeTrustGrade([...ALL_HARD_PASS, fail("roughtime", "x")]);
  assert.equal(r.breakdown.length, 6);
  assert.equal(r.breakdown[5].status, "fail");
});

test("gradeResult exposes a non-empty label, verdict, color", () => {
  const r = computeTrustGrade([...ALL_HARD_PASS, skip("timestamp")]);
  assert.ok(r.label.length > 0);
  assert.ok(r.verdict.length > 0);
  assert.match(r.color, /^#[0-9a-f]{6}$/i);
});

test("GRADE_COLORS has all five grades", () => {
  const grades: Grade[] = ["A+", "A", "B", "C", "F"];
  for (const g of grades) {
    assert.match(GRADE_COLORS[g], /^#[0-9a-f]{6}$/i);
  }
});

test("verdictFor returns a verdict string per grade", () => {
  for (const g of ["A+", "A", "B", "C", "F"] as Grade[]) {
    const v = verdictFor(g, "en");
    assert.ok(v.length > 0);
    assert.ok(typeof v === "string");
  }
});
