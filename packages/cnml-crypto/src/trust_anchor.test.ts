/**
 * Smoke tests for trust_anchor.ts. Uses Node's built-in test runner.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  validateTrustAnchorSet,
  findAnchor,
  currentRoot,
  getPinnedAnchor,
  verifyPinnedAnchor,
  setAnchorStorage,
  resetAnchorStorage,
  TrustAnchorError,
} from "./trust_anchor.ts";

// In-memory storage backend for Node tests.
const memStore = new Map<string, string>();
function memoryBackend() {
  return {
    getItem: (k: string) => memStore.get(k) ?? null,
    setItem: (k: string, v: string) => { memStore.set(k, v); },
    removeItem: (k: string) => { memStore.delete(k); },
  };
}

function makeAnchor(overrides: Record<string, unknown> = {}) {
  return {
    id: "biml-root-2026",
    role: "root",
    public_key_pem: "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEfakefakefakefakefakefakefakefakefakefakefake\n-----END PUBLIC KEY-----",
    fingerprint_sha256: "a".repeat(64),
    valid_from: "2026-01-01T00:00:00Z",
    valid_until: "2031-01-01T00:00:00Z",
    threshold: { t: 5, n: 7 },
    transparency_log_url: "https://tlog.example.org",
    ...overrides,
  };
}

test("validateTrustAnchorSet accepts a valid set with a root", () => {
  const set = validateTrustAnchorSet({
    version: "2026.07",
    schema_version: "2026.07",
    published_at: "2026-07-15T00:00:00Z",
    anchors: [makeAnchor()],
  });
  assert.equal(set.version, "2026.07");
  assert.equal(set.anchors.length, 1);
  assert.equal(set.anchors[0].role, "root");
});

test("validateTrustAnchorSet accepts snake_case + camelCase aliases", () => {
  const set = validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-15T00:00:00Z",
    anchors: [
      makeAnchor(),  // root
      {
        id: "ia-x", role: "issuing_authority",
        publicKeyPem: "PEM",
        fingerprintSha256: "b".repeat(64),
      },
    ],
  });
  assert.equal(set.anchors[1].role, "issuing_authority");
});

test("validateTrustAnchorSet rejects non-object input", () => {
  assert.throws(() => validateTrustAnchorSet("string"), TrustAnchorError);
  assert.throws(() => validateTrustAnchorSet(null), TrustAnchorError);
  assert.throws(() => validateTrustAnchorSet(42), TrustAnchorError);
});

test("validateTrustAnchorSet rejects missing version", () => {
  assert.throws(
    () => validateTrustAnchorSet({
      publishedAt: "x", anchors: [makeAnchor()],
    }),
    (e: unknown) => e instanceof TrustAnchorError && (e as TrustAnchorError).reason === "validation-failed",
  );
});

test("validateTrustAnchorSet rejects set without a root", () => {
  assert.throws(
    () => validateTrustAnchorSet({
      version: "2026.07",
      publishedAt: "2026-07-15T00:00:00Z",
      anchors: [makeAnchor({ role: "test_lab", id: "lab-1" })],
    }),
    (e: unknown) => e instanceof TrustAnchorError && (e as TrustAnchorError).reason === "no-root",
  );
});

test("validateTrustAnchorSet rejects anchor with invalid fingerprint", () => {
  assert.throws(
    () => validateTrustAnchorSet({
      version: "2026.07",
      publishedAt: "2026-07-15T00:00:00Z",
      anchors: [makeAnchor({ fingerprint_sha256: "not-hex" })],
    }),
    TrustAnchorError,
  );
});

test("findAnchor returns the matching anchor or undefined", () => {
  const set = validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-15T00:00:00Z",
    anchors: [makeAnchor({ id: "a" }), makeAnchor({ id: "b", role: "test_lab" })],
  });
  assert.equal(findAnchor(set, "a")?.role, "root");
  assert.equal(findAnchor(set, "b")?.role, "test_lab");
  assert.equal(findAnchor(set, "z"), undefined);
});

test("currentRoot returns the root anchor", () => {
  const set = validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-15T00:00:00Z",
    anchors: [makeAnchor(), makeAnchor({ id: "ia-1", role: "issuing_authority" })],
  });
  assert.equal(currentRoot(set)?.id, "biml-root-2026");
});

test("pinAnchor + verifyPinnedAnchor: TOFU pins on first, rejects on mismatch", () => {
  setAnchorStorage(memoryBackend());
  memStore.clear();
  const set1 = validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-15T00:00:00Z",
    anchors: [makeAnchor()],
  });

  // First visit: pins + accepts
  verifyPinnedAnchor(set1);
  assert.equal(getPinnedAnchor(), "a".repeat(64));

  // Second visit with same anchor: accepts
  const root1 = verifyPinnedAnchor(set1);
  assert.equal(root1.fingerprintSha256, "a".repeat(64));

  // Third visit with different fingerprint: hard fail
  const set2 = validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-20T00:00:00Z",
    anchors: [makeAnchor({ fingerprint_sha256: "b".repeat(64) })],
  });
  assert.throws(
    () => verifyPinnedAnchor(set2),
    (e: unknown) => {
      if (!(e instanceof TrustAnchorError)) return false;
      return e.reason === "fingerprint-mismatch";
    },
  );

  memStore.clear();
  resetAnchorStorage();
});
