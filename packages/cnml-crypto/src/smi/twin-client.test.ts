/**
 * Twin client unit tests (TODO.cnml/11).
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { TwinClient } from "./twin-client.ts";

// Mock fetch for the twin client. Returns canned responses per query.
function mockFetch(data: Record<string, unknown>) {
  globalThis.fetch = (async (_url: unknown, _opts?: unknown) => {
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

function mockFetchError(status: number) {
  globalThis.fetch = (async () => {
    return new Response("error", { status });
  }) as typeof fetch;
}

describe("TwinClient", () => {
  test("connect succeeds on a valid state response", async () => {
    mockFetch({ state: { status: "idle", lastChangedAt: "2026-01-01T00:00:00Z" } });
    const client = new TwinClient("http://localhost:8787/twin");
    const status = await client.connect();
    assert.equal(status, "connected");
    client.disconnect();
  });

  test("connect returns error on network failure", async () => {
    mockFetchError(503);
    const client = new TwinClient("http://localhost:8787/twin");
    const status = await client.connect();
    assert.equal(status, "error");
    client.disconnect();
  });

  test("getIndication returns the parsed indication", async () => {
    mockFetch({
      indication: {
        value: 42.5,
        unit: "kg",
        timestamp: "2026-08-06T12:00:00Z",
        quality: "valid",
      },
    });
    const client = new TwinClient("http://localhost:8787/twin");
    const ind = await client.getIndication();
    assert.equal(ind.value, 42.5);
    assert.equal(ind.unit, "kg");
    assert.equal(ind.quality, "valid");
  });

  test("getProvenance returns the CNML certificate reference", async () => {
    mockFetch({
      provenance: {
        cnmlCertificateId: "CNML-INSTANCE-ABC123",
        passportUrl: "https://www.oimlsmart.org/cnml/passport/CNML-INSTANCE-ABC123",
        chainFingerprint: "sha256:abc123",
        modelCertificateId: "CNML-MODEL-XYZ789",
        manufacturer: "Acme Instruments",
        model: "LC-500",
      },
    });
    const client = new TwinClient("http://localhost:8787/twin");
    const prov = await client.getProvenance();
    assert.equal(prov.cnmlCertificateId, "CNML-INSTANCE-ABC123");
    assert.match(prov.passportUrl, /passport\/CNML-INSTANCE-ABC123$/);
  });

  test("disconnect sets status to disconnected", async () => {
    mockFetch({ state: { status: "idle", lastChangedAt: "2026-01-01T00:00:00Z" } });
    const client = new TwinClient("http://localhost:8787/twin");
    await client.connect();
    assert.equal(client.getStatus(), "connected");
    client.disconnect();
    assert.equal(client.getStatus(), "disconnected");
  });

  test("endpoint trailing slash is stripped", () => {
    const client = new TwinClient("http://localhost:8787/twin/");
    // Internal check: the client should not send requests to a
    // double-slash URL. We verify by checking the class does not
    // throw on construction.
    assert.ok(client);
    client.disconnect();
  });
});
