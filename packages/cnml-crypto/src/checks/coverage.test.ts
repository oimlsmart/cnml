/**
 * Tests for the SIGNATIF three-stage model: coverage report,
 * classification policy, acceptance policy (Phase 1).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildCoverageReport,
  HARD_CHECK_IDS,
  SOFT_CHECK_IDS,
} from "./coverage.ts";
import { classify, DEFAULT_CLASSIFICATION_POLICY } from "./classification.ts";
import { evaluate, DEFAULT_ACCEPTANCE_POLICY } from "./acceptance.ts";
import type { CheckContext, CheckResult } from "./types.ts";
import type { Grade } from "../trust_grade.ts";

function pass(checkId: string): CheckResult {
  return { checkId, status: "pass" };
}
function skip(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "skip", reason };
}
function warn(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "warn", reason };
}
function fail(checkId: string, reason?: string): CheckResult {
  return { checkId, status: "fail", reason };
}

const XML = "<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml='urn:oiml:cnml'/>";

const ALL_HARD_PASS = [
  pass("xml-well-formed"),
  pass("schema-valid"),
  pass("signature"),
  pass("scope"),
  pass("crl"),
];

test("coverage report partitions checks into hard and soft", async () => {
  const ctx: CheckContext = {};
  const report = await buildCoverageReport(XML, ctx, [...ALL_HARD_PASS, skip("transparency")]);
  assert.equal(report.hard_checks.length, 5);
  assert.equal(report.soft_checks.length, 1);
  assert.equal(report.soft_checks[0].check_id, "transparency");
});

test("coverage report artifact_id is deterministic", async () => {
  const a = await buildCoverageReport(XML, {}, ALL_HARD_PASS);
  const b = await buildCoverageReport(XML, {}, ALL_HARD_PASS);
  assert.equal(a.artifact_id, b.artifact_id);
  assert.match(a.artifact_id, /^[0-9a-f]{64}$/);
  const c = await buildCoverageReport(XML + " ", {}, ALL_HARD_PASS);
  assert.notEqual(a.artifact_id, c.artifact_id);
});

test("coverage report records data dimension on signature pass", async () => {
  const report = await buildCoverageReport(XML, {}, [...ALL_HARD_PASS, pass("timestamp")]);
  const data = report.dimensions.find((d) => d.dimension === "data");
  assert.ok(data);
  assert.equal(data.verified, true);
});

test("coverage report records path when anchor fingerprint known", async () => {
  const ctx2: CheckContext = { rootAnchorFingerprint: "abc123", chainLength: 3 };
  const report = await buildCoverageReport(XML, ctx2, ALL_HARD_PASS);
  assert.equal(report.paths.length, 1);
  assert.equal(report.paths[0].root_anchor_fingerprint, "abc123");
  assert.equal(report.paths[0].path_length, 3);
  assert.ok(report.paths[0].dimensions.includes("data"));
});

test("HARD/SOFT id sets are disjoint", () => {
  for (const id of HARD_CHECK_IDS) assert.ok(!SOFT_CHECK_IDS.has(id));
  for (const id of SOFT_CHECK_IDS) assert.ok(!HARD_CHECK_IDS.has(id));
});

test("classification: full pass with timestamp+transparency → A+", () => {
  const r = classify([...ALL_HARD_PASS, pass("timestamp"), pass("transparency")]);
  assert.equal(r.label, "A+");
});

test("classification: hard fail → F with reason", () => {
  const r = classify([fail("signature", "bad sig")]);
  assert.equal(r.label, "F");
  assert.ok(r.reasons.some((x) => x.includes("bad sig")));
});

test("classification: soft fail → C", () => {
  const r = classify([...ALL_HARD_PASS, fail("roughtime", "stale")]);
  assert.equal(r.label, "C");
});

test("classification: hard warn caps to B", () => {
  const r = classify([warn("signature", "no trusted key")]);
  assert.equal(r.label, "B");
});

test("classification with report: missing time dimension caps A+ → A", async () => {
  const results = [...ALL_HARD_PASS, skip("timestamp"), pass("transparency")];
  const report = await buildCoverageReport(XML, {}, results);
  const r = classify(results, report);
  assert.equal(r.label, "A");
});

test("classification with report: transparency absence caps A+ → B", async () => {
  const report = await buildCoverageReport(XML, {}, [...ALL_HARD_PASS, skip("transparency")]);
  const r = classify([...ALL_HARD_PASS, skip("transparency")], report);
  assert.equal(r.label, "B");
});

test("classification: deprecated algorithm downgrades one label", async () => {
  const ctx: CheckContext = { algorithmStatuses: [{ id: "ecdsa-p256", status: "deprecated" }] };
  const results = [...ALL_HARD_PASS, pass("timestamp"), pass("transparency")];
  const report = await buildCoverageReport(XML, ctx, results);
  const r = classify(results, report);
  assert.equal(r.label, "A");
  assert.equal(r.base_label, "A+");
});

test("classification: retired algorithm is a hard fail", async () => {
  const ctx: CheckContext = { algorithmStatuses: [{ id: "rsa-1024", status: "retired" }] };
  const report = await buildCoverageReport(XML, ctx, ALL_HARD_PASS);
  const r = classify(ALL_HARD_PASS, report);
  assert.equal(r.label, "F");
  assert.ok(r.reasons.some((x) => x.includes("retired")));
});

test("custom policy can tighten the top label", async () => {
  const policy = {
    ...DEFAULT_CLASSIFICATION_POLICY,
    top_label: { required_dimensions: ["data", "time", "person"], requires_transparency: true, requires_timestamp: true },
  };
  const results = [...ALL_HARD_PASS, pass("timestamp"), pass("transparency")];
  const report = await buildCoverageReport(XML, {}, results);
  const r = classify(results, report, policy);
  assert.equal(r.label, "A"); // person dimension missing
});

test("default acceptance accepts anything not F", async () => {
  const results = [...ALL_HARD_PASS, skip("timestamp"), skip("transparency")];
  const report = await buildCoverageReport(XML, {}, results);
  const c = classify(results, report);
  const a = evaluate(report, c, DEFAULT_ACCEPTANCE_POLICY);
  assert.equal(c.label, "B");
  assert.equal(a.accepted, true);
});

test("acceptance rejects below minimum label", async () => {
  const results = [...ALL_HARD_PASS, fail("roughtime", "x")];
  const report = await buildCoverageReport(XML, {}, results);
  const c = classify(results, report);
  const a = evaluate(report, c, { ...DEFAULT_ACCEPTANCE_POLICY, minimum_label: "B" });
  assert.equal(a.accepted, false);
  assert.ok(a.reasons.some((r) => r.includes("below policy minimum")));
});

test("acceptance can require dimensions", async () => {
  const results = [...ALL_HARD_PASS, pass("timestamp")];
  const report = await buildCoverageReport(XML, {}, results);
  const c = classify(results, report);
  const a = evaluate(report, c, { ...DEFAULT_ACCEPTANCE_POLICY, required_dimensions: ["person"] });
  assert.equal(a.accepted, false);
  assert.ok(a.reasons.some((r) => r.includes("person")));
});

test("acceptance can require transparency", async () => {
  const results = [...ALL_HARD_PASS, skip("transparency")];
  const report = await buildCoverageReport(XML, {}, results);
  const c = classify(results, report);
  const a = evaluate(report, c, { ...DEFAULT_ACCEPTANCE_POLICY, require_transparency: true });
  assert.equal(a.accepted, false);
  assert.ok(a.reasons.some((r) => r.includes("transparency")));
});

test("grade ranks are totally ordered in the default policy", () => {
  const labels = DEFAULT_CLASSIFICATION_POLICY.labels as readonly Grade[];
  assert.deepEqual([...labels], ["A+", "A", "B", "C", "F"]);
});
