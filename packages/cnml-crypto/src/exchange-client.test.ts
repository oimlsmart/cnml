/**
 * Tests for the credential-exchange holder client (the delivery
 * clause's two-turn protocol). The coordinator here is a real local
 * HTTP server implementing the same contract as the CA server's
 * /api/exchange routes; the holder signs with WebCrypto (the P1363
 * form), and the server verifies the DER form with OpenSSL — the
 * exact wire format the Ruby coordinator expects.
 *
 * The coordinator pins the holder's certificate out-of-band (it
 * knows the key behind the identifier; it does not take key
 * material from the request).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import nodeCrypto from "node:crypto";
import { runCredentialExchange, derFromP1363, ExchangeError, type ExchangeHolder } from "./exchange-client.ts";
import { issueSelfSignedCert } from "./index.ts";

interface Coordinator {
  server: http.Server;
  port: number;
  staged: Map<string, unknown>;
  sessions: Map<string, { identifier: string; nonce: Buffer; used: boolean }>;
  rejectNextCollect: string | null;
}

async function startCoordinator(holder: { certificatePem: string }): Promise<Coordinator> {
  const coordinator: Coordinator = {
    server: null as unknown as http.Server,
    port: 0,
    staged: new Map(),
    sessions: new Map(),
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
        coordinator.sessions.set(id, { identifier: json.identifier, nonce, used: false });
        return reply(200, { exchange_id: id, nonce: nonce.toString("base64") });
      }

      // The exchange id is the protocol's own session key, so it is
      // client-supplied by design; the verification key comes from
      // the certificate pinned at startup, never from the request.
      if (req.url === "/api/exchange/collect" && req.method === "POST") { // codeql[js/user-controlled-bypass]
        const session = coordinator.sessions.get(json.exchange_id);
        if (!session) return reply(400, { error: "unknown exchange" });
        if (session.used) return reply(400, { error: "exchange already completed" });
        if (coordinator.rejectNextCollect) {
          const reason = coordinator.rejectNextCollect;
          coordinator.rejectNextCollect = null;
          return reply(400, { error: reason });
        }
        // The key behind the identifier is known out-of-band; key
        // material never comes from the request (collect carries
        // only the signature).
        const cert = new nodeCrypto.X509Certificate(holder.certificatePem);
        const signature = Buffer.from(json.signature_b64, "base64");
        if (!nodeCrypto.verify("SHA256", session.nonce, cert.publicKey, signature)) {
          return reply(400, { error: "signature does not prove control of the key behind the identifier" });
        }
        session.used = true;
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

async function makeHolder(
  identifier: string,
): Promise<ExchangeHolder & { certificatePem: string }> {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const certificatePem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, `CN=${identifier}`);
  return {
    identifier,
    certificatePem,
    sign: async (nonce: Uint8Array) =>
      derFromP1363(
        new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, nonce)),
      ),
  };
}

test("the holder collects its credential through the two-turn exchange", async () => {
  const identifier = "Example Instruments";
  const holder = await makeHolder(identifier);
  const coordinator = await startCoordinator(holder);
  try {
    const credential = { certificate_pem: "-----BEGIN CERTIFICATE-----" };
    coordinator.staged.set(identifier, credential);

    const collected = await runCredentialExchange(`http://127.0.0.1:${coordinator.port}`, holder);
    assert.deepEqual(collected, credential);
  } finally {
    await stopCoordinator(coordinator);
  }
});

test("nothing staged answers the typed nothing_staged failure", async () => {
  const holder = await makeHolder("Nobody");
  const coordinator = await startCoordinator(holder);
  try {
    await assert.rejects(
      runCredentialExchange(`http://127.0.0.1:${coordinator.port}`, holder),
      (e: unknown) => e instanceof ExchangeError && e.failure.kind === "nothing_staged",
    );
  } finally {
    await stopCoordinator(coordinator);
  }
});

test("a rejected collect surfaces the coordinator's reason", async () => {
  const holder = await makeHolder("Example Instruments");
  const coordinator = await startCoordinator(holder);
  try {
    coordinator.staged.set("Example Instruments", {});
    coordinator.rejectNextCollect = "signature does not prove control of the key behind the identifier";
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

test("WebCrypto P1363 signatures convert to the DER OpenSSL verifies", async () => {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const nonce = nodeCrypto.randomBytes(32);
  const raw = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, nonce));
  const der = derFromP1363(raw);

  const spki = new Uint8Array(await crypto.subtle.exportKey("spki", kp.publicKey));
  const publicKey = nodeCrypto.createPublicKey({ key: Buffer.from(spki), format: "der", type: "spki" });
  assert.equal(nodeCrypto.verify("SHA256", nonce, publicKey, Buffer.from(der)), true);
});
