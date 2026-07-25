/**
 * Specs for cnml-crypto scope.ts and crl.ts — pure-logic tests that
 * don't require network or real certs.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  isRecommendationInScope,
  scopeSourcesAgree,
  OIML_SCOPE_OID,
} from "../../cnml-crypto/src/scope.ts";
import {
  isCrlStale,
  isSerialRevoked,
  type Crl,
} from "../../cnml-crypto/src/crl.ts";

describe("Scope verification (scope.ts)", () => {
  test("OID is the placeholder OIML PEN", () => {
    assert.equal(OIML_SCOPE_OID, "1.3.6.1.4.1.99999.1.1");
  });

  test("isRecommendationInScope: covered R-id returns true", () => {
    assert.equal(isRecommendationInScope("R60", ["R60", "R76"]), true);
    assert.equal(isRecommendationInScope("R76", ["R60", "R76"]), true);
  });

  test("isRecommendationInScope: uncovered R-id returns false", () => {
    assert.equal(isRecommendationInScope("R117", ["R60", "R76"]), false);
  });

  test("isRecommendationInScope: null scope (legacy cert) returns true", () => {
    // Backwards-compat: certs issued before scope governance existed
    // are accepted without scope check.
    assert.equal(isRecommendationInScope("R60", null), true);
    assert.equal(isRecommendationInScope("R117", null), true);
  });

  test("isRecommendationInScope: case-sensitive (OIML convention is uppercase)", () => {
    assert.equal(isRecommendationInScope("r60", ["R60"]), false);
    assert.equal(isRecommendationInScope("R60", ["r60"]), false);
  });

  test("scopeSourcesAgree: same list returns true", () => {
    assert.equal(scopeSourcesAgree(["R60", "R76"], ["R60", "R76"]), true);
    // Order doesn't matter:
    assert.equal(scopeSourcesAgree(["R60", "R76"], ["R76", "R60"]), true);
  });

  test("scopeSourcesAgree: different lists return false", () => {
    assert.equal(scopeSourcesAgree(["R60"], ["R60", "R76"]), false);
    assert.equal(scopeSourcesAgree(["R60", "R76"], ["R60", "R117"]), false);
  });

  test("scopeSourcesAgree: either null returns true (single source of truth)", () => {
    assert.equal(scopeSourcesAgree(null, ["R60"]), true);
    assert.equal(scopeSourcesAgree(["R60"], null), true);
    assert.equal(scopeSourcesAgree(null, null), true);
  });
});

describe("CRL parser (crl.ts)", () => {
  // Synthetic fixture — real DER parsing happens in cnml-crypto tests;
  // these tests exercise the in-memory check helpers.
  const baseCrl: Crl = {
    issuer: "CN=Test CA",
    lastUpdate: new Date("2026-01-01T00:00:00Z"),
    nextUpdate: new Date("2026-08-01T00:00:00Z"),
    revoked: [
      { serial: "ABCD1234", revocationDate: new Date("2026-03-01"), reason: "keyCompromise" },
      { serial: "DEADBEEF", revocationDate: new Date("2026-04-15"), reason: "superseded" },
    ],
  };

  test("isSerialRevoked: matching serial returns the entry", () => {
    const entry = isSerialRevoked("ABCD1234", baseCrl);
    assert.ok(entry);
    assert.equal(entry?.reason, "keyCompromise");
  });

  test("isSerialRevoked: non-matching returns null", () => {
    assert.equal(isSerialRevoked("12345678", baseCrl), null);
  });

  test("isSerialRevoked: case-insensitive (normalizes hex)", () => {
    assert.ok(isSerialRevoked("abcd1234", baseCrl));
    assert.ok(isSerialRevoked("0xABCD1234", baseCrl));
  });

  test("isSerialRevoked: empty CRL returns null", () => {
    const empty: Crl = { ...baseCrl, revoked: [] };
    assert.equal(isSerialRevoked("ABCD1234", empty), null);
  });

  test("isCrlStale: nextUpdate in future returns false", () => {
    const now = new Date("2026-06-01");
    assert.equal(isCrlStale(baseCrl, now), false);
  });

  test("isCrlStale: nextUpdate in past returns true", () => {
    const now = new Date("2026-12-01");
    assert.equal(isCrlStale(baseCrl, now), true);
  });

  test("isCrlStale: missing nextUpdate returns false (indeterminate)", () => {
    const noExpiry: Crl = { ...baseCrl, nextUpdate: null };
    assert.equal(isCrlStale(noExpiry, new Date("2030-01-01")), false);
  });
});
