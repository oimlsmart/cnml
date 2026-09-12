/**
 * Tests for the credential-exchange holder client (the delivery
 * clause's two-turn protocol). The coordinator here is a local HTTP
 * server mirroring the CA server's /api/exchange route contract
 * (request answers a fresh single-use nonce; collect answers the
 * staged credential or the failure codes). Signature verification is
 * asserted test-side below against the holder's key; the Ruby
 * coordinator's own verification (pinned certificate, wrong-key and
 * replay rejection) is covered by its RSpec suite.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import nodeCrypto from "node:crypto";
import { runCredentialExchange, derFromP1363, webCryptoHolder, ExchangeError, type ExchangeHolder } from "./exchange-client.ts";
import { issueSelfSignedCert } from "./index.ts";

interface Coordinator {
  server: http.Server;
  port: number;
  staged: Map<string, unknown>;
  sessions: Map<string, { identifier: string; nonce: Buffer }>;
  collected: Array<{ nonce: Buffer; signature: Buffer }>;
  rejectNextCollect: string | null;
}

async function startCoordinator(): Promise<Coordinator> {
  const coordinator: Coordinator = {
    server: null as unknown as http.Server,
    port: 0,
    staged: new Map(),
    sessions: new Map(),
    collected: [],
    rejectNextCollect: null,
  };

  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const json = body ? JSON.parse(body) : {};
      const reply = (status: number, payload: unknown) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(payload));
      };

      if (req.url === "/api/exchange/request" && req.method === "POST") {
        const credential = coordinator.staged.get(json.identifier);
        if (credential === undefined) return reply(404, { error: "nothing staged for that identifier" });
        const nonce = nodeCrypto.randomBytes(32);
        const id = nodeCrypto.randomBytes(16).toString("hex");
        coordinator.sessions.set(id, { identifier: json.identifier, nonce });
        return reply(200, { exchange_id: id, nonce: nonce.toString("base64") });
      }

      if (req.url === "/api/exchange/collect" && req.method === "POST") {
        const session = coordinator.sessions.get(json.exchange_id);
        if (!session) return reply(400, { error: "unknown exchange" });
        if (coordinator.rejectNextCollect) {
          const reason = coordinator.rejectNextCollect;
          coordinator.rejectNextCollect = null;
          return reply(400, { error: reason });
        }
        coordinator.collected.push({
          nonce: session.nonce,
          signature: Buffer.from(json.signature_b64, "base64"),
        });
        return reply(200, { credential: coordinator.staged.get(session.identifier) });
      }

      reply(404, { error: "no such route" });
    });
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  coordinator.server = server;
  coordinator.port = (server.address() as { port: number }).port;
  return coordinator;
}

async function stopCoordinator(coordinator: Coordinator): Promise<void> {
  await new Promise<void>((resolve) => coordinator.server.close(() => resolve()));
}

/** The holder and, for test-side assertions, the DER-verifying public
 * key (the coordinator knows it out-of-band; the holder never
 * presents key material). */
async function makeHolder(
  identifier: string,
): Promise<ExchangeHolder & { publicKeyPem: string }> {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  await issueSelfSignedCert(kp.publicKey, kp.privateKey, `CN=${identifier}`);
  const publicKeyPem = Buffer.from(await crypto.subtle.exportKey("spki", kp.publicKey)).toString("base64");
  return {
    identifier,
    publicKeyPem,
    sign: async (nonce: Uint8Array) =>
      derFromP1363(
        new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, nonce)),
      ),
  };
}

test("the holder collects its credential and the nonce signature verifies", async () => {
  const coordinator = await startCoordinator();
  try {
    const identifier = "Example Instruments";
    const credential = { certificate_pem: "-----BEGIN CERTIFICATE-----" };
    coordinator.staged.set(identifier, credential);

    const holder = await makeHolder(identifier);
    const collected = await runCredentialExchange(`http://127.0.0.1:${coordinator.port}`, holder);
    assert.deepEqual(collected, credential);

    // Verification is asserted here, not in the stub server: the
    // collected signature is the WebCrypto P1363 form converted to
    // DER, and OpenSSL verifies it over the challenged nonce with
    // the holder's key.
    assert.equal(coordinator.collected.length, 1);
    const { nonce, signature } = coordinator.collected[0]!;
    const publicKey = nodeCrypto.createPublicKey({
      key: Buffer.from(holder.publicKeyPem, "base64"),
      format: "der",
      type: "spki",
    });
    assert.equal(nodeCrypto.verify("SHA256", nonce, publicKey, signature), true);
  } finally {
    await stopCoordinator(coordinator);
  }
});

test("nothing staged answers the typed nothing_staged failure", async () => {
  const coordinator = await startCoordinator();
  try {
    const holder = await makeHolder("Nobody");
    await assert.rejects(
      runCredentialExchange(`http://127.0.0.1:${coordinator.port}`, holder),
      (e: unknown) => e instanceof ExchangeError && e.failure.kind === "nothing_staged",
    );
  } finally {
    await stopCoordinator(coordinator);
  }
});

test("a rejected collect surfaces the coordinator's reason", async () => {
  const coordinator = await startCoordinator();
  try {
    coordinator.staged.set("Example Instruments", {});
    coordinator.rejectNextCollect = "signature does not prove control of the key behind the identifier";
    const holder = await makeHolder("Example Instruments");
    await assert.rejects(
      runCredentialExchange(`http://127.0.0.1:${coordinator.port}`, holder),
      (e: unknown) =>
        e instanceof ExchangeError &&
        e.failure.kind === "rejected" &&
        /does not prove control/.test((e.failure as { reason: string }).reason),
    );
  } finally {
    await stopCoordinator(coordinator);
  }
});

test("derFromP1363 encodes minimal DER INTEGERs", () => {
  // r = [01 02], s = [03 04]: SEQUENCE { INTEGER 0102, INTEGER 0304 }
  assert.deepEqual(
    Array.from(derFromP1363(new Uint8Array([0x01, 0x02, 0x03, 0x04]))),
    [0x30, 0x08, 0x02, 0x02, 0x01, 0x02, 0x02, 0x02, 0x03, 0x04],
  );
  // High bit set: the INTEGER gets a leading zero. Leading zero words
  // are stripped first.
  assert.deepEqual(
    Array.from(derFromP1363(new Uint8Array([0x00, 0x80, 0x00, 0x01]))),
    [0x30, 0x07, 0x02, 0x02, 0x00, 0x80, 0x02, 0x01, 0x01],
  );
});

test("webCryptoHolder produces the DER OpenSSL verifies over the challenge nonce", async () => {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const nonce = nodeCrypto.randomBytes(32);
  const holder = webCryptoHolder("Example Instruments", kp.privateKey);
  assert.equal(holder.identifier, "Example Instruments");
  const der = await holder.sign(new Uint8Array(nonce));

  const spki = new Uint8Array(await crypto.subtle.exportKey("spki", kp.publicKey));
  const publicKey = nodeCrypto.createPublicKey({ key: Buffer.from(spki), format: "der", type: "spki" });
  assert.equal(nodeCrypto.verify("SHA256", nonce, publicKey, Buffer.from(der)), true);
});

test("WebCrypto P1363 signatures convert to the DER OpenSSL verifies", async () => {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const nonce = nodeCrypto.randomBytes(32);
  const raw = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, nonce));
  const der = derFromP1363(raw);

  const spki = new Uint8Array(await crypto.subtle.exportKey("spki", kp.publicKey));
  const publicKey = nodeCrypto.createPublicKey({ key: Buffer.from(spki), format: "der", type: "spki" });
  assert.equal(nodeCrypto.verify("SHA256", nonce, publicKey, Buffer.from(der)), true);
});
