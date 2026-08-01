/**
 * Smoke tests for manifest.ts (TODO 34).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  validateManifest,
  parseManifestHash,
  tierForRole,
  tierNamed,
  rootTier,
  chainFrom,
  MANIFEST_VERSION,
} from "./manifest.ts";

function makeValidManifest(): Record<string, unknown> {
  return {
    deployment: {
      name: "OIML CNML Production",
      operator: "BIML",
      manifest_version: MANIFEST_VERSION,
    },
    mode: "certificate_pki",
    tiers: [
      {
        name: "biml_root",
        role: "root",
        signing_algorithm: "FROST-Ed25519",
        threshold: { t: 5, n: 7 },
      },
      {
        name: "ia",
        role: "issuing_authority",
        signing_algorithm: "FROST-P256",
        threshold: { t: 2, n: 3 },
        delegated_by: "biml_root",
      },
    ],
    quorums: [
      {
        name: "biml-root",
        threshold: { t: 5, n: 7 },
        coordinator: "tcp://x:7788",
      },
    ],
  };
}

test("MANIFEST_VERSION is 1", () => {
  assert.equal(MANIFEST_VERSION, 1);
});

test("validateManifest accepts a valid five-tier-style manifest", () => {
  const report = validateManifest(makeValidManifest());
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
});

test("validateManifest rejects missing deployment section", () => {
  const report = validateManifest({ mode: "certificate_pki" });
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => /deployment/.test(e)));
});

test("validateManifest rejects unsupported manifest_version", () => {
  const m = makeValidManifest();
  (m.deployment as Record<string, unknown>).manifest_version = 99;
  const report = validateManifest(m);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => /unsupported/.test(e)));
});

test("validateManifest rejects tier chain with no root", () => {
  const m = makeValidManifest();
  // Add delegated_by to the root tier
  (m.tiers as Record<string, unknown>[])[0].delegated_by = "ghost";
  const report = validateManifest(m);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => /no root|unknown/.test(e)));
});

test("validateManifest rejects tier with t > n", () => {
  const m = makeValidManifest();
  ((m.tiers as Record<string, unknown>[])[1].threshold as Record<string, number>).t = 5;
  const report = validateManifest(m);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => /invalid threshold/.test(e)));
});

test("validateManifest warns when threshold tiers exist but no quorums", () => {
  const m = makeValidManifest();
  m.quorums = [];
  const report = validateManifest(m);
  assert.equal(report.valid, true);  // warning, not error
  assert.ok(report.warnings.some(w => /quorums/.test(w)));
});

test("parseManifestHash returns structured Manifest", () => {
  const m = parseManifestHash(makeValidManifest());
  assert.equal(m.deployment.name, "OIML CNML Production");
  assert.equal(m.tiers.length, 2);
  assert.equal(m.quorums.length, 1);
});

test("tierForRole + tierNamed + rootTier", () => {
  const m = parseManifestHash(makeValidManifest());
  assert.equal(tierForRole(m, "root")?.name, "biml_root");
  assert.equal(tierForRole(m, "issuing_authority")?.name, "ia");
  assert.equal(tierForRole(m, "ghost"), undefined);
  assert.equal(tierNamed(m, "ia")?.role, "issuing_authority");
  assert.equal(rootTier(m)?.name, "biml_root");
});

test("rootTier returns undefined when no root", () => {
  // Both tiers have delegated_by pointing to each other (a cycle).
  // Validation rejects (no root) but we can still probe rootTier on
  // a minimal Hash without going through validate.
  const tiers = [
    { name: "a", role: "root", threshold: { t: 1, n: 1 }, delegated_by: "b" },
    { name: "b", role: "ia",   threshold: { t: 1, n: 1 }, delegated_by: "a" },
  ];
  const r = validateManifest({
    deployment: { name: "X", operator: "Y", manifest_version: 1 },
    mode: "certificate_pki", tiers,
  });
  assert.equal(r.valid, false);   // no root
  // Now build via parseManifestHash — which will throw; catch it.
  // Direct construction using coerceToManifest semantics would need
  // the function to be exported. We instead exercise rootTier via a
  // manually-constructed object.
  const directManifest = {
    deployment: { name: "X", operator: "Y", manifestVersion: 1 },
    mode: "certificate_pki",
    tiers: [
      { name: "a", role: "root", delegatedBy: "b" },
      { name: "b", role: "ia",   delegatedBy: "a" },
    ],
    quorums: [],
  } as unknown as Parameters<typeof rootTier>[0];
  assert.equal(rootTier(directManifest), undefined);
});

test("chainFrom walks to root", () => {
  const m = parseManifestHash(makeValidManifest());
  const chain = chainFrom(m, "ia");
  assert.deepEqual(chain.map(t => t.name), ["ia", "biml_root"]);
});

test("chainFrom returns empty for unknown tier", () => {
  const m = parseManifestHash(makeValidManifest());
  assert.deepEqual(chainFrom(m, "ghost"), []);
});
