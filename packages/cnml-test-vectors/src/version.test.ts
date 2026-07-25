/**
 * Specs for cnml-xml version.ts — format version parsing + compatibility.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  parseVersion,
  isCompatible,
  compareVersions,
  compatibilityVerdict,
  SUPPORTED_VERSION,
} from "../../cnml-xml/src/version.ts";

describe("CNML format versioning", () => {
  describe("parseVersion", () => {
    test("extracts major.minor from a 1.0 namespace URI", () => {
      const xml = `<?xml version="1.0"?><cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0"/>`;
      const v = parseVersion(xml);
      assert.ok(v);
      assert.equal(v!.major, 1);
      assert.equal(v!.minor, 0);
    });

    test("extracts major.minor from a 2.5 namespace URI", () => {
      const xml = `<root xmlns:cnml="https://oimlsmart.org/schemas/cnml/2.5"/>`;
      const v = parseVersion(xml);
      assert.equal(v!.major, 2);
      assert.equal(v!.minor, 5);
    });

    test("returns null when no CNML namespace found", () => {
      const xml = `<foo xmlns="http://example.com/"/>`;
      assert.equal(parseVersion(xml), null);
    });
  });

  describe("isCompatible", () => {
    test("same major = compatible", () => {
      const a = { major: 1, minor: 0, namespaceUri: "x" };
      const b = { major: 1, minor: 5, namespaceUri: "y" };
      assert.equal(isCompatible(a, b), true);
    });

    test("different major = incompatible", () => {
      const a = { major: 1, minor: 0, namespaceUri: "x" };
      const b = { major: 2, minor: 0, namespaceUri: "y" };
      assert.equal(isCompatible(a, b), false);
    });
  });

  describe("compareVersions", () => {
    test("orders by major first", () => {
      const v1 = { major: 1, minor: 5, namespaceUri: "" };
      const v2 = { major: 2, minor: 0, namespaceUri: "" };
      assert.equal(compareVersions(v1, v2), -1);
      assert.equal(compareVersions(v2, v1), 1);
    });

    test("orders by minor when major is equal", () => {
      const v1 = { major: 1, minor: 0, namespaceUri: "" };
      const v2 = { major: 1, minor: 5, namespaceUri: "" };
      assert.equal(compareVersions(v1, v2), -1);
    });

    test("returns 0 for identical versions", () => {
      const v = { major: 1, minor: 0, namespaceUri: "" };
      assert.equal(compareVersions(v, v), 0);
    });
  });

  describe("compatibilityVerdict", () => {
    test("returns ok for exact match", () => {
      const doc = { major: 1, minor: 0, namespaceUri: "x" };
      const verdict = compatibilityVerdict(doc);
      assert.equal(verdict.status, "ok");
    });

    test("returns warn for newer minor (forward-compat)", () => {
      const doc = { major: 1, minor: 5, namespaceUri: "x" };
      const verdict = compatibilityVerdict(doc, SUPPORTED_VERSION);
      assert.equal(verdict.status, "warn");
      assert.match(verdict.reason, /newer fields/);
    });

    test("returns fail for newer major (incompatible)", () => {
      const doc = { major: 2, minor: 0, namespaceUri: "x" };
      const verdict = compatibilityVerdict(doc, SUPPORTED_VERSION);
      assert.equal(verdict.status, "fail");
      assert.match(verdict.reason, /newer than this verifier supports/);
    });

    test("returns warn for null version (can't determine)", () => {
      const verdict = compatibilityVerdict(null);
      assert.equal(verdict.status, "warn");
      assert.match(verdict.reason, /Could not determine/);
    });
  });
});
