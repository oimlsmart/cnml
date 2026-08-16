/**
 * Tests for formal scope narrowing + scope conditions (SIGNATIF
 * Phase 6).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  narrowed,
  parseScopeExpression,
  evaluateScopeExpression,
  extractScopeConditions,
  conditionValuesFromXml,
} from "../scope-narrowing.ts";

// ─── narrowing invariant ─────────────────────────────────────────

test("wildcard parent is narrowed by anything", () => {
  assert.equal(narrowed({ recommendation: "*" }, { recommendation: "R60" }), true);
  assert.equal(narrowed({ recommendation: "*" }, { recommendation: ["R60", "R76"] }), true);
});

test("set parent is narrowed by subset and single", () => {
  const parent = { recommendation: ["R60", "R76", "R117"] as string[] | "*" };
  assert.equal(narrowed(parent, { recommendation: ["R60", "R76"] }), true);
  assert.equal(narrowed(parent, { recommendation: "R117" }), true);
  assert.equal(narrowed(parent, { recommendation: ["R60", "R129"] }), false);
  assert.equal(narrowed(parent, { recommendation: "R129" }), false);
});

test("single parent is narrowed only by the same value", () => {
  assert.equal(narrowed({ recommendation: "R60" }, { recommendation: "R60" }), true);
  assert.equal(narrowed({ recommendation: "R60" }, { recommendation: "R76" }), false);
  assert.equal(narrowed({ recommendation: "R60" }, { recommendation: "*" }), false);
});

test("undeclared parent dimension is free; undeclared child widens", () => {
  assert.equal(narrowed({}, { recommendation: "R60" }), true);
  assert.equal(narrowed({ model: "LC-500" }, {}), false);
});

test("narrowing holds across multiple dimensions at once", () => {
  const root = { recommendation: ["R60", "R76"] as string[] | "*", model: "*" as const };
  const ia = { recommendation: ["R60"] as string[] | "*", model: "*" as const };
  const manufacturer = { recommendation: "R60", model: "LC-500" };
  const instance = { recommendation: "R60", model: "LC-500", serial: "SN-0042" };
  assert.equal(narrowed(root, ia), true);
  assert.equal(narrowed(ia, manufacturer), true);
  assert.equal(narrowed(manufacturer, instance), true);
  assert.equal(narrowed(root, { recommendation: ["R60", "R117"] }), false);
});

test("conditions are monotonic: child must carry every parent condition", () => {
  const parent = { conditions: [{ id: "temp-range", expression: "x >= 1" }] };
  assert.equal(
    narrowed(parent, {
      conditions: [
        { id: "temp-range", expression: "x >= 1" },
        { id: "humidity", expression: "y < 80" },
      ],
    }),
    true,
  );
  assert.equal(narrowed(parent, { conditions: [{ id: "humidity", expression: "y < 80" }] }), false);
  assert.equal(narrowed(parent, {}), false);
});

// ─── condition language ──────────────────────────────────────────

test("expressions parse into comparisons", () => {
  const cs = parseScopeExpression("measurement.temperature >= -10 AND measurement.temperature <= 40");
  assert.equal(cs.length, 2);
  assert.equal(cs[0].path, "measurement.temperature");
  assert.equal(cs[0].op, ">=");
  assert.deepEqual(cs[0].operand, { kind: "number", value: -10 });
});

test("malformed expressions throw", () => {
  assert.throws(() => parseScopeExpression("measurement.temp"));
  assert.throws(() => parseScopeExpression("measurement.temp >= "));
  assert.throws(() => parseScopeExpression("a > 1 OR b < 2"));
  assert.throws(() => parseScopeExpression(""));
});

test("evaluation: numeric ranges, string equality, path operands", () => {
  const values = { measurement: { temperature: 25, unit: "u-kilogram" }, limits: { maxTemp: 40 } };
  assert.equal(evaluateScopeExpression("measurement.temperature >= -10 AND measurement.temperature <= 40", values), true);
  assert.equal(evaluateScopeExpression("measurement.temperature > 40", values), false);
  assert.equal(evaluateScopeExpression('measurement.unit = "u-kilogram"', values), true);
  assert.equal(evaluateScopeExpression("measurement.temperature <= limits.maxTemp", values), true);
});

test("unknown values fail closed", () => {
  assert.equal(evaluateScopeExpression("measurement.temperature <= 40", {}), false);
  assert.equal(evaluateScopeExpression("nothing.here = 1", { x: 1 }), false);
});

test("type mismatches fail closed", () => {
  assert.equal(evaluateScopeExpression("measurement.unit >= 5", { measurement: { unit: "kg" } }), false);
});

// ─── XML surface ─────────────────────────────────────────────────

const CONDITION_XML = `<?xml version="1.0"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber></cnml:administrativeData>
  <cnml:scopeCondition id="temp-range">measurement.temperature >= -10 AND measurement.temperature <= 40</cnml:scopeCondition>
  <cnml:signedMeasurement>
    <cnml:value>42.5</cnml:value>
    <cnml:temperature>21.3</cnml:temperature>
    <cnml:unit>u-kilogram</cnml:unit>
  </cnml:signedMeasurement>
</cnml:certificatNumeriqueMetrologieLegale>`;

test("scope conditions extract from XML", () => {
  const conds = extractScopeConditions(CONDITION_XML);
  assert.equal(conds.length, 1);
  assert.equal(conds[0].id, "temp-range");
  assert.match(conds[0].expression, /temperature/);
});

test("condition values extract from the artifact's own content", () => {
  const values = conditionValuesFromXml(CONDITION_XML);
  assert.equal(values["measurement.temperature"], 21.3);
  assert.equal(values["measurement.value"], 42.5);
  assert.equal(values["measurement.unit"], "u-kilogram");
  assert.equal(values["certificate.oimlNumber"], "R60/2021-NL1");
});

test("the artifact's own content satisfies its conditions", () => {
  const conds = extractScopeConditions(CONDITION_XML);
  const values = conditionValuesFromXml(CONDITION_XML);
  assert.equal(evaluateScopeExpression(conds[0].expression, values), true);
});

test("out-of-range content fails its conditions", () => {
  const conds = extractScopeConditions(CONDITION_XML);
  const values = { ...conditionValuesFromXml(CONDITION_XML), "measurement.temperature": 55 };
  assert.equal(evaluateScopeExpression(conds[0].expression, values), false);
});

test("singleton sets normalize to single values (spec step 1)", () => {
  // {R60} ≡ R60: parent single, child singleton set → narrowed.
  assert.equal(narrowed({ recommendation: "R60" }, { recommendation: ["R60"] }), true);
  assert.equal(narrowed({ recommendation: ["R60"] }, { recommendation: "R60" }), true);
  assert.equal(narrowed({ recommendation: ["R60"] }, { recommendation: ["R60"] }), true);
  // A genuine two-element set under a single parent value still widens.
  assert.equal(narrowed({ recommendation: "R60" }, { recommendation: ["R60", "R76"] }), false);
});
