/**
 * The holder side of the credential exchange (the delivery clause's
 * two-turn protocol): ask the coordinator for the credential, receive
 * the identifier-control challenge, sign the fresh nonce with the key
 * behind the identifier, collect the credential. The coordinator side
 * is OimlPki::Exchange (the CA server's /api/exchange routes).
 */

import { base64ToBytes, bytesToBase64 } from "./shared/base64.ts";

export type ExchangeFailure =
  | { kind: "nothing_staged" }
  | { kind: "rejected"; reason: string }
  | { kind: "network"; reason: string };

export class ExchangeError extends Error {
  readonly failure: ExchangeFailure;

  constructor(failure: ExchangeFailure) {
    super(`credential exchange failed: ${failure.kind}${"reason" in failure ? ` (${failure.reason})` : ""}`);
    this.name = "ExchangeError";
    this.failure = failure;
  }
}

/** The holder: its identifier, its certificate, and a DER-signer for
 * the challenge nonce (WebCrypto callers wrap subtle.sign plus
 * derFromP1363). */
export interface ExchangeHolder {
  identifier: string;
  certificatePem: string;
  sign: (nonce: Uint8Array) => Promise<Uint8Array>;
}

async function postJson(
  url: string,
  body: unknown,
  fetchFn: typeof fetch,
): Promise<{ status: number; json: Record<string, unknown> | null }> {
  let res: Response;
  try {
    res = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new ExchangeError({ kind: "network", reason: (e as Error).message });
  }
  const json = res.status === 204 ? null : await res.json().catch(() => null);
  return { status: res.status, json: json as Record<string, unknown> | null };
}

/** Run the two-turn exchange. The base endpoint is the coordinator's
 * origin (for example http://localhost:4455); the routes are the
 * /api/exchange/* paths. Answers the collected credential. */
export async function runCredentialExchange(
  baseEndpoint: string,
  holder: ExchangeHolder,
  fetchFn: typeof fetch = fetch,
): Promise<unknown> {
  const ask = await postJson(`${baseEndpoint}/api/exchange/request`, { identifier: holder.identifier }, fetchFn);
  if (ask.status === 404) throw new ExchangeError({ kind: "nothing_staged" });
  if (!ask.json || typeof ask.json.exchange_id !== "string" || typeof ask.json.nonce !== "string") {
    throw new ExchangeError({ kind: "rejected", reason: `unexpected challenge response (${ask.status})` });
  }

  const nonce = base64ToBytes(ask.json.nonce);
  const signature = await holder.sign(nonce);

  const collect = await postJson(
    `${baseEndpoint}/api/exchange/collect`,
    {
      exchange_id: ask.json.exchange_id,
      certificate_pem: holder.certificatePem,
      signature_b64: bytesToBase64(signature),
    },
    fetchFn,
  );
  if (collect.status !== 200) {
    const reason = collect.json && typeof collect.json.error === "string" ? collect.json.error : `status ${collect.status}`;
    throw new ExchangeError({ kind: "rejected", reason });
  }
  if (!collect.json || !("credential" in collect.json)) {
    throw new ExchangeError({ kind: "rejected", reason: "collect response carries no credential" });
  }
  return collect.json.credential;
}

/** WebCrypto ECDSA answers IEEE P1363 raw (r||s); OpenSSL expects a
 * DER SEQUENCE of two INTEGERs. This converts. */
export function derFromP1363(signature: Uint8Array): Uint8Array {
  const half = Math.floor(signature.length / 2);
  const r = derInteger(signature.slice(0, half));
  const s = derInteger(signature.slice(half));
  const body = new Uint8Array(r.length + s.length);
  body.set(r, 0);
  body.set(s, r.length);
  const der = new Uint8Array(2 + body.length);
  der[0] = 0x30;
  der[1] = body.length;
  der.set(body, 2);
  return der;
}

function derInteger(bytes: Uint8Array): Uint8Array {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start++;
  let value = bytes.slice(start);
  if (value[0] & 0x80) {
    value = new Uint8Array([0, ...value]);
  }
  const out = new Uint8Array(2 + value.length);
  out[0] = 0x02;
  out[1] = value.length;
  out.set(value, 2);
  return out;
}
