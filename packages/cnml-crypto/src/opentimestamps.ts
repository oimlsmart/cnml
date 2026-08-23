/**
 * OpenTimestamps integration — the CNML time-attestation leg.
 *
 * Time attestation is REQUIRED in CNML: a signed document carries an
 * OpenTimestamps proof, and the verification pipeline's timestamp leg
 * is a real verdict (pass / pending / fail), never an optional extra.
 *
 * The wire protocol is the public OTS calendar protocol:
 *
 *   - stamp:   POST <calendar>/digest (the 32-byte SHA-256 as the body)
 *              answers a Timestamp ending in a PendingAttestation naming
 *              the calendar; several calendars' answers merge into one
 *              detached proof;
 *   - upgrade: GET  <calendar>/timestamp/<digest-hex> answers the
 *              upgraded Timestamp once the calendar has anchored its
 *              aggregation into a Bitcoin block (404 while in flight).
 *
 * The proof rides INSIDE the signature container — a ds:Object child of
 * ds:Signature, the XAdES unsigned-property posture: the enveloped
 * signature's transform excludes the whole Signature element, so the
 * initial embed and every later upgrade re-embed leave the signed bytes
 * (and therefore the signature) untouched. The proof commits to the
 * SHA-256 of the signed document with the timestamp element REMOVED —
 * i.e. the exact bytes the signer produced; the strip is the commitment
 * rule every verifier recomputes.
 *
 * Environment-safe: WebCrypto + fetch only (browser, Worker, node). The
 * network seams take an injectable fetchImpl; the default calendars are
 * the public OTS calendars, overridable per call.
 */

import { bytesToBase64, base64ToBytes } from "./shared/base64.ts";
import { encodeText } from "./shared/crypto.ts";
import {
  buildDetachedProof,
  bytesToHex,
  collectAttestations,
  mergeTimestamps,
  parseDetachedProof,
  parseTimestamp,
  sha256Bytes,
  type OtsTimestamp,
} from "./ots-format.ts";

// The codec rides this module's public surface (one home for the whole
// OTS leg — the smart instance's relay imports '@cnml/cnml-crypto/ots').
export * from "./ots-format.ts";
export { bytesToBase64, base64ToBytes } from "./shared/base64.ts";

/** The public OpenTimestamps calendars (the default stamp upstreams;
 *  the first answers that arrive merge into one proof). */
export const OTS_DEFAULT_CALENDARS = [
  "https://alice.btc.calendar.opentimestamps.org",
  "https://finney.calendar.opentimestamps.org",
];

export interface OtsOptions {
  /** The calendars to stamp with (default: the public pair). */
  calendars?: string[];
  /** The fetch implementation (tests stub it; the default is globalThis.fetch). */
  fetchImpl?: typeof fetch;
}

// ── the XML embed / strip / extract ──────────────────────────────────

/** The embed block as this module writes it (one contiguous element —
 *  the strip and the upgrade replace match it exactly). */
const EMBED_RE = /<ds:Object><cnml:timestamp>[\s\S]*?<\/cnml:timestamp><\/ds:Object>/;
/** The pre-2026 sibling form (a cnml:timestamp element outside the
 *  signature container) — stripped under the same commitment rule so a
 *  legacy document still verifies against its proof. */
const LEGACY_TIMESTAMP_RE = /<cnml:timestamp>[\s\S]*?<\/cnml:timestamp>/;

/** The commitment rule: the signed document bytes WITHOUT the timestamp
 *  element. Both the embed forms (the ds:Object unsigned property and
 *  the legacy sibling) are removed. */
export function stripTimestampElement(xml: string): string {
  return xml.replace(EMBED_RE, "").replace(LEGACY_TIMESTAMP_RE, "");
}

/**
 * Embed an OTS proof in a signed CNML document. The proof lands in a
 * ds:Object inside ds:Signature (never a sibling of it — a sibling
 * would change the enveloped reference's digest input and BREAK the
 * signature). An existing timestamp element is REPLACED (the upgrade
 * re-embed: same commitment, matured proof).
 */
export function embedTimestampInXml(xml: string, otsProofBase64: string, service = "OpenTimestamps (Bitcoin)"): string {
  const stripped = stripTimestampElement(xml);
  const tsElement =
    `<ds:Object><cnml:timestamp><cnml:otsProof encoding="base64">${otsProofBase64}</cnml:otsProof>` +
    `<cnml:timestampService>${service}</cnml:timestampService></cnml:timestamp></ds:Object>`;
  const sigClose = stripped.indexOf("</ds:Signature>");
  if (sigClose < 0) {
    throw new OtsError("no </ds:Signature> in the document — the timestamp embeds inside the signature container; sign first");
  }
  return stripped.slice(0, sigClose) + tsElement + stripped.slice(sigClose);
}

/** Extract the embedded OTS proof, if present. */
export function extractTimestampFromXml(xml: string): { proof: string; service: string } | null {
  const match = xml.match(/<cnml:otsProof[^>]*>([^<]+)<\/cnml:otsProof>/);
  if (!match) return null;
  const serviceMatch = xml.match(/<cnml:timestampService>([^<]+)<\/cnml:timestampService>/);
  return {
    proof: match[1]!,
    service: serviceMatch?.[1] ?? "unknown",
  };
}

export class OtsError extends Error {}

// ── stamping (the calendar protocol's POST leg) ──────────────────────

export interface OtsStampResult {
  /** The detached proof, base64 (the embeddable form). */
  proof: string;
  /** The calendars whose answers merged into the proof. */
  calendars: string[];
  /** The committed digest (hex) — SHA-256 of the given XML. */
  digestHex: string;
}

/**
 * Stamp a bare digest (the relay's shape: the client hashes, the server
 * submits — the digest's submission is never a key-custody event).
 * Same merge + error posture as stampCnml.
 */
export async function stampDigest(digest: Uint8Array, opts?: OtsOptions): Promise<OtsStampResult> {
  const fetchImpl = opts?.fetchImpl ?? fetch;
  const calendars = opts?.calendars ?? OTS_DEFAULT_CALENDARS;
  const digestHex = bytesToHex(digest);

  const failures: string[] = [];
  let merged: OtsTimestamp | null = null;
  const answered: string[] = [];
  await Promise.all(
    calendars.map(async (calendar) => {
      const base = calendar.replace(/\/+$/, "");
      try {
        const res = await fetchImpl(`${base}/digest`, {
          method: "POST",
          // text/plain keeps the browser's CORS posture a simple request
          // (no preflight); the calendar reads the raw bytes regardless.
          headers: { "content-type": "text/plain" },
          body: digest.slice(),
        });
        if (!res.ok) throw new OtsError(`HTTP ${res.status}`);
        const ts = await parseTimestamp(new Uint8Array(await res.arrayBuffer()), digest);
        merged = merged === null ? ts : mergeTimestamps(merged, ts);
        answered.push(base);
      } catch (e) {
        failures.push(`${base}: ${(e as Error).message}`);
      }
    }),
  );
  if (merged === null) {
    throw new OtsError(`every calendar refused the stamp — ${failures.join("; ")}`);
  }
  return { proof: bytesToBase64(buildDetachedProof(digest, merged)), calendars: answered, digestHex };
}

/**
 * Stamp a CNML document: SHA-256 over the given bytes, submitted to
 * every configured calendar; the answers merge into one detached proof.
 * The given XML must be the SIGNED document WITHOUT a timestamp element
 * (the commitment rule); callers embedding afterwards pass the fresh
 * signature's bytes.
 *
 * Throws only when EVERY calendar failed — the error names each
 * calendar's failure. Time attestation is required: the caller treats
 * this throw as a signing failure, never as a skip.
 */
export async function stampCnml(xml: string, opts?: OtsOptions): Promise<OtsStampResult> {
  return stampDigest(await sha256Bytes(encodeText(xml)), opts);
}

/** Stamp and answer with the proof only (the signing dialog's shape). */
export async function timestampCnml(xml: string, opts?: OtsOptions): Promise<string> {
  return (await stampCnml(xml, opts)).proof;
}

// ── the upgrade query (the calendar protocol's GET leg) ─────────────

/** Ask one calendar for its upgraded timestamp over the digest. Answers
 *  null while the attestation is in flight (404) — never throws on the
 *  pending posture; a network failure also answers null (the caller
 *  retries on the next read). */
export async function fetchCalendarUpgrade(
  digestHex: string,
  calendarUrl: string,
  fetchImpl?: typeof fetch,
): Promise<Uint8Array | null> {
  const impl = fetchImpl ?? fetch;
  try {
    const res = await impl(`${calendarUrl.replace(/\/+$/, "")}/timestamp/${digestHex}`);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// ── the local verdict (no network) ───────────────────────────────────

export interface OtsLocalVerdict {
  status: "attested" | "pending" | "digest-mismatch" | "invalid";
  /** The Bitcoin block height when attested. */
  blockHeight?: number;
  /** The calendars named by the pending attestations (the provenance). */
  calendars: string[];
  /** The digest the proof commits to (hex), when the proof parses. */
  committedDigestHex?: string;
  /** The parse failure's reason when invalid. */
  reason?: string;
}

/**
 * Verify a timestamp proof against a document, LOCALLY: the commitment
 * rule (the document minus its timestamp element) must hash to the
 * proof's declared digest, then the attestations classify — a Bitcoin
 * block header attestation is the anchor; pending attestations name the
 * calendars the upgrade will come from. No network: the upgrade fetch
 * and the block-time resolution are the relay's job (checks/timestamp.ts
 * passes that seam through the check context).
 */
export async function verifyTimestampProof(xml: string, otsProofBase64: string): Promise<OtsLocalVerdict> {
  const strippedDigest = await sha256Bytes(encodeText(stripTimestampElement(xml)));
  let parsed: Awaited<ReturnType<typeof parseDetachedProof>>;
  try {
    parsed = await parseDetachedProof(base64ToBytes(otsProofBase64));
  } catch (e) {
    return { status: "invalid", calendars: [], reason: (e as Error).message };
  }
  if (bytesToHex(parsed.digest) !== bytesToHex(strippedDigest)) {
    return {
      status: "digest-mismatch",
      calendars: [],
      committedDigestHex: bytesToHex(parsed.digest),
    };
  }
  const attestations = collectAttestations(parsed.timestamp);
  const bitcoin = attestations.filter((a) => a.kind === "bitcoin") as Array<{ kind: "bitcoin"; height: number }>;
  if (bitcoin.length) {
    return {
      status: "attested",
      blockHeight: Math.min(...bitcoin.map((b) => b.height)),
      calendars: [],
      committedDigestHex: bytesToHex(parsed.digest),
    };
  }
  const calendars = attestations
    .map((a) => (a.kind === "pending" ? a.uri : null))
    .filter((u): u is string => u !== null);
  return { status: "pending", calendars, committedDigestHex: bytesToHex(parsed.digest) };
}

// ── legacy export (kept for the test-vector tooling) ─────────────────

/**
 * @deprecated The old verify posture hit the (now dead)
 *  opentimestamps.org web API. Use verifyTimestampProof (local) plus the
 *  calendar upgrade seam (fetchCalendarUpgrade) instead.
 */
export async function verifyTimestamp(
  xml: string,
  otsProofBase64: string,
): Promise<{ timestamp: Date | null; blockHeight: number | null; status: string }> {
  const verdict = await verifyTimestampProof(xml, otsProofBase64);
  if (verdict.status === "attested") {
    return { timestamp: null, blockHeight: verdict.blockHeight ?? null, status: "anchored" };
  }
  if (verdict.status === "pending") return { timestamp: null, blockHeight: null, status: "pending" };
  return { timestamp: null, blockHeight: null, status: "verification_failed" };
}
