/**
 * Tests for cross-channel anchor agreement (TODO 44).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  checkCrossChannelAgreement,
  verifyAgainstPrintFingerprint,
  type AgreementResult,
} from "./trust_anchor_agreement.ts";
import {
  validateTrustAnchorSet,
  type TrustAnchorSet,
} from "./trust_anchor.ts";

function makeSet(fingerprint: string): TrustAnchorSet {
  return validateTrustAnchorSet({
    version: "2026.07",
    publishedAt: "2026-07-15T00:00:00Z",
    anchors: [{
      id: "root",
      role: "root",
      public_key_pem: "-----BEGIN PUBLIC KEY-----\nfake\n-----END PUBLIC KEY-----",
      fingerprint_sha256: fingerprint,
    }],
  });
}

// Stub global fetch to return controlled responses per-URL.
function stubFetch(routes: Record<string, unknown>) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [pattern, response] of Object.entries(routes)) {
      if (url.includes(pattern)) {
        if (response instanceof Error) throw response;
        if (typeof response === "number") {
          return new Response("error", { status: response });
        }
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
    }
    return new Response("not found", { status: 404 });
  }) as typeof fetch;
  return () => { globalThis.fetch = original; };
}

test("2-of-3 agreement accepts when 2 channels return matching fingerprints", async () => {
  const fp = "a".repeat(64);
  const restore = stubFetch({
    "trust-anchors.json": {
      version: "2026.07", publishedAt: "x",
      anchors: [{
        id: "root", role: "root", public_key_pem: "PEM", fingerprint_sha256: fp,
      }],
    },
    "tlog.cnml.oiml.org": {
      version: "2026.07", publishedAt: "x",
      anchors: [{
        id: "root", role: "root", public_key_pem: "PEM", fingerprint_sha256: fp,
      }],
    },
    "tlog.nist.gov": {
      version: "2026.07", publishedAt: "x",
      anchors: [{
        id: "root", role: "root", public_key_pem: "PEM", fingerprint_sha256: "b".repeat(64),
      }],
    },
  });

  try {
    const r = await checkCrossChannelAgreement({ required: 2 });
    assert.equal(r.agreed, true);
    assert.equal(r.agreedRootFingerprint, fp);
    assert.equal(r.channelResults.length, 3);
    const okChannels = r.channelResults.filter(c => c.ok).map(c => c.channel);
    assert.ok(okChannels.includes("static-asset"));
    assert.ok(okChannels.includes("transparency-log"));
  } finally {
    restore();
  }
});

test("2-of-3 agreement rejects when all channels disagree", async () => {
  const restore = stubFetch({
    "trust-anchors.json": {
      version: "x", publishedAt: "x",
      anchors: [{ id: "r", role: "root", public_key_pem: "P", fingerprint_sha256: "a".repeat(64) }],
    },
    "tlog.cnml.oiml.org": {
      version: "x", publishedAt: "x",
      anchors: [{ id: "r", role: "root", public_key_pem: "P", fingerprint_sha256: "b".repeat(64) }],
    },
    "tlog.nist.gov": {
      version: "x", publishedAt: "x",
      anchors: [{ id: "r", role: "root", public_key_pem: "P", fingerprint_sha256: "c".repeat(64) }],
    },
  });

  try {
    const r = await checkCrossChannelAgreement({ required: 2 });
    assert.equal(r.agreed, false);
    assert.equal(r.agreedRootFingerprint, null);
    assert.match(r.reason ?? "", /disagreement/);
  } finally {
    restore();
  }
});

test("agreement fails gracefully when network errors", async () => {
  const restore = stubFetch({
    "trust-anchors.json": new Error("network down"),
    "tlog.cnml.oiml.org": new Error("network down"),
    "tlog.nist.gov": new Error("network down"),
  });

  try {
    const r = await checkCrossChannelAgreement({ required: 2 });
    assert.equal(r.agreed, false);
    assert.equal(r.channelResults.length, 3);
    assert.ok(r.channelResults.every(c => !c.ok));
  } finally {
    restore();
  }
});

test("print-manual channel contributes to agreement when fingerprint matches", async () => {
  const fp = "a".repeat(64);
  const restore = stubFetch({
    "trust-anchors.json": {
      version: "x", publishedAt: "x",
      anchors: [{ id: "r", role: "root", public_key_pem: "P", fingerprint_sha256: fp }],
    },
    "tlog.cnml.oiml.org": new Error("down"),
    "tlog.nist.gov": new Error("down"),
  });

  try {
    const r = await checkCrossChannelAgreement({ required: 2, printFingerprint: fp });
    assert.equal(r.agreed, true);
    assert.equal(r.agreedRootFingerprint, fp);
  } finally {
    restore();
  }
});

test("verifyAgainstPrintFingerprint matches case-insensitively", () => {
  const fp = "A".repeat(64);
  const set = makeSet(fp.toLowerCase());
  assert.equal(verifyAgainstPrintFingerprint(set, fp), true);
  assert.equal(verifyAgainstPrintFingerprint(set, "b".repeat(64)), false);
});
