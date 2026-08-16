/**
 * Challenge-response (SIGNATIF Phase 7).
 *
 * Counterfeit detection: a verifier challenges the instrument with a
 * fresh 128-bit nonce; the instrument answers with a signed
 * measurement that includes the nonce. A static copy of a prior
 * measurement cannot satisfy the challenge, and the freshness window
 * bounds replay.
 *
 * The nonce is part of the canonical payload — the instrument's
 * signature covers it, so the answer is both fresh and authentic.
 */

export const CNML_NS = "https://oimlsmart.org/schemas/cnml/1.0";

/** 128-bit challenge nonce per the SIGNATIF device-signer class. */
export function generateChallenge(): Uint8Array {
  const nonce = new Uint8Array(16);
  crypto.getRandomValues(nonce);
  return nonce;
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase();
  if (!/^[0-9a-f]*$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error("nonce is not a hex string");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Insert <cnml:nonce> (and a fresh <cnml:timestamp>) into the
 * document's <cnml:signedMeasurement>. Call before signing: the
 * nonce is part of the canonical payload.
 */
export function embedChallenge(
  xml: string,
  nonce: Uint8Array | string,
  timestamp: string = new Date().toISOString(),
): string {
  const nonceHex = typeof nonce === "string" ? nonce : toHex(nonce);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const measurement = doc.getElementsByTagNameNS(CNML_NS, "signedMeasurement")[0];
  if (!measurement) {
    throw new Error("no <cnml:signedMeasurement> element to bind the challenge to");
  }

  const existing = measurement.getElementsByTagNameNS(CNML_NS, "nonce")[0];
  if (existing) existing.remove();
  const nonceEl = doc.createElementNS(CNML_NS, "cnml:nonce");
  nonceEl.textContent = nonceHex;
  measurement.appendChild(nonceEl);

  const ts = measurement.getElementsByTagNameNS(CNML_NS, "timestamp")[0];
  if (ts) ts.textContent = timestamp;

  return new XMLSerializer().serializeToString(doc);
}

export interface ChallengePolicy {
  /** Max age of the response in ms (e.g., 30_000). */
  freshness_window_ms: number;
}

export const DEFAULT_CHALLENGE_POLICY: ChallengePolicy = {
  freshness_window_ms: 30_000,
};

export interface ChallengeResult {
  ok: boolean;
  reason?: string;
}

/** Read the nonce and timestamp off a signed measurement. */
export function readChallengeResponse(xml: string): { nonce: string | null; timestamp: string | null } {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const measurement = doc.getElementsByTagNameNS(CNML_NS, "signedMeasurement")[0];
  if (!measurement) return { nonce: null, timestamp: null };
  const nonceEl = measurement.getElementsByTagNameNS(CNML_NS, "nonce")[0];
  const tsEl = measurement.getElementsByTagNameNS(CNML_NS, "timestamp")[0];
  return {
    nonce: nonceEl?.textContent?.trim() ?? null,
    timestamp: tsEl?.textContent?.trim() ?? null,
  };
}

/**
 * Verify a challenge response: the nonce must equal the challenge
 * and the timestamp must be inside the freshness window. Signature
 * validity is the caller's concern (the normal pipeline covers it —
 * the nonce sits inside the signed payload).
 */
export function verifyChallengeResponse(
  xml: string,
  expectedNonce: Uint8Array | string,
  policy: ChallengePolicy = DEFAULT_CHALLENGE_POLICY,
  now: number = Date.now(),
): ChallengeResult {
  const expected = typeof expectedNonce === "string" ? expectedNonce.toLowerCase() : toHex(expectedNonce);
  const { nonce, timestamp } = readChallengeResponse(xml);

  if (!nonce) return { ok: false, reason: "no nonce in the response" };
  if (nonce.toLowerCase() !== expected) {
    return { ok: false, reason: "nonce mismatch — response was not produced for this challenge" };
  }
  try {
    fromHex(nonce);
  } catch {
    return { ok: false, reason: "nonce is not valid hex" };
  }

  if (policy.freshness_window_ms > 0) {
    if (!timestamp) return { ok: false, reason: "no timestamp in the response" };
    const t = Date.parse(timestamp);
    if (!Number.isFinite(t)) return { ok: false, reason: "timestamp is not ISO-8601" };
    const age = now - t;
    if (age < 0) {
      return { ok: false, reason: `timestamp is ${-age} ms in the future` };
    }
    if (age > policy.freshness_window_ms) {
      return { ok: false, reason: `response is ${age} ms old (window ${policy.freshness_window_ms} ms)` };
    }
  }

  return { ok: true };
}
