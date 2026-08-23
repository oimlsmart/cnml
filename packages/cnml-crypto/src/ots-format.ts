/**
 * ots-format — the minimal OpenTimestamps wire codec.
 *
 * Implements exactly the slice of the OTS format the CNML timestamp leg
 * needs, and no more:
 *
 *   - the DetachedTimestampFile envelope (magic, version 1, the SHA-256
 *     file-hash op tag, the committed digest, then the Timestamp);
 *   - the Timestamp tree: the ops the public calendars emit (append,
 *     prepend, sha256), forks (0xff), and the attestation leaf marker
 *     (0x00);
 *   - the attestations we classify: PendingAttestation (a calendar URI
 *     to upgrade from), BitcoinBlockHeaderAttestation (a block height —
 *     the anchor), LitecoinBlockHeaderAttestation; unknown tags are
 *     preserved byte-exact so a proof round-trips losslessly.
 *
 * The format is the reference implementations' (python-opentimestamps,
 * javascript-opentimestamps): varuint is 7-bit little-endian groups
 * with the high bit continuing; varbytes is a varuint length prefix;
 * an attestation serializes as its 8-byte tag + varbytes(payload);
 * Timestamp serialization sorts attestations and ops and 0xff-prefixes
 * every branch but the last. The conformance fixture for this codec is
 * a real alice.btc.calendar.opentimestamps.org answer (ots-format.test.ts).
 *
 * Environment-safe: WebCrypto only (crypto.subtle), no node built-ins —
 * the browser, the Worker relay, and node tests share this module.
 */

// ── varuint / varbytes ───────────────────────────────────────────────

export function writeVaruint(out: number[], value: number): void {
  if (value === 0) {
    out.push(0);
    return;
  }
  let v = value;
  while (v !== 0) {
    let b = v & 0x7f;
    v >>>= 7;
    if (v !== 0) b |= 0x80;
    out.push(b);
  }
}

export function writeVarbytes(out: number[], bytes: Uint8Array): void {
  writeVaruint(out, bytes.length);
  for (const b of bytes) out.push(b);
}

/** A byte cursor for deserialization. */
export class Cursor {
  readonly bytes: Uint8Array;
  pos = 0;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }
  read(n: number): Uint8Array {
    if (this.pos + n > this.bytes.length) {
      throw new OtsFormatError(`truncated: need ${n} bytes at ${this.pos}, have ${this.bytes.length - this.pos}`);
    }
    const out = this.bytes.slice(this.pos, this.pos + n);
    this.pos += n;
    return out;
  }
  readByte(): number {
    return this.read(1)[0]!;
  }
  readVaruint(): number {
    let value = 0;
    let shift = 0;
    for (;;) {
      const b = this.readByte();
      value |= (b & 0x7f) << shift;
      shift += 7;
      if (!(b & 0x80)) return value;
      if (shift > 35) throw new OtsFormatError("varuint exceeds the 64-bit range this codec supports");
    }
  }
  readVarbytes(maxLen = 8192): Uint8Array {
    const len = this.readVaruint();
    if (len > maxLen) throw new OtsFormatError(`varbytes length ${len} exceeds the ${maxLen}-byte cap`);
    return this.read(len);
  }
  assertEof(): void {
    if (this.pos !== this.bytes.length) {
      throw new OtsFormatError(`trailing garbage: ${this.bytes.length - this.pos} bytes after the timestamp`);
    }
  }
}

export class OtsFormatError extends Error {}

// ── ops ──────────────────────────────────────────────────────────────

const OP_APPEND = 0xf0;
const OP_PREPEND = 0xf1;
const OP_SHA256 = 0x08;

export interface OtsOp {
  tag: number;
  /** The argument for append/prepend; absent for sha256. */
  arg?: Uint8Array;
}

function serializeOp(op: OtsOp): number[] {
  const out = [op.tag];
  if (op.tag === OP_APPEND || op.tag === OP_PREPEND) writeVarbytes(out, op.arg ?? new Uint8Array());
  return out;
}

/** Apply an op to a message. Unsupported ops fail honestly — the public
 *  calendars emit only append/prepend/sha256 chains. */
async function applyOp(op: OtsOp, msg: Uint8Array): Promise<Uint8Array> {
  if (op.tag === OP_APPEND) {
    const out = new Uint8Array(msg.length + (op.arg?.length ?? 0));
    out.set(msg);
    out.set(op.arg ?? new Uint8Array(), msg.length);
    return out;
  }
  if (op.tag === OP_PREPEND) {
    const out = new Uint8Array(msg.length + (op.arg?.length ?? 0));
    out.set(op.arg ?? new Uint8Array());
    out.set(msg, op.arg?.length ?? 0);
    return out;
  }
  if (op.tag === OP_SHA256) {
    return new Uint8Array(await crypto.subtle.digest("SHA-256", msg.slice()));
  }
  throw new OtsFormatError(`unsupported op tag 0x${op.tag.toString(16)} — the calendar chain uses an op this codec does not apply`);
}

function opKey(op: OtsOp): string {
  return serializeOp(op).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── attestations ─────────────────────────────────────────────────────

const TAG_PENDING = "83dfe30d2ef90c8e";
const TAG_BITCOIN = "0588960d73d71901";
const TAG_LITECOIN = "06869a0d73d71b45";

export type OtsAttestation =
  | { kind: "pending"; uri: string }
  | { kind: "bitcoin"; height: number }
  | { kind: "litecoin"; height: number }
  /** A tag this codec does not classify, kept byte-exact (tag hex +
   *  the raw payload) so the proof round-trips losslessly. */
  | { kind: "unknown"; tag: string; payload: Uint8Array };

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(b: Uint8Array): string {
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function serializeAttestation(a: OtsAttestation): number[] {
  const payload: number[] = [];
  let tag: string;
  if (a.kind === "pending") {
    tag = TAG_PENDING;
    writeVarbytes(payload, new TextEncoder().encode(a.uri));
  } else if (a.kind === "bitcoin") {
    tag = TAG_BITCOIN;
    writeVaruint(payload, a.height);
  } else if (a.kind === "litecoin") {
    tag = TAG_LITECOIN;
    writeVaruint(payload, a.height);
  } else {
    tag = a.tag;
    for (const b of a.payload) payload.push(b);
  }
  const out: number[] = Array.from(hexToBytes(tag));
  writeVarbytes(out, new Uint8Array(payload));
  return out;
}

function attestationKey(a: OtsAttestation): string {
  return serializeAttestation(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseAttestation(cur: Cursor): OtsAttestation {
  const tag = bytesToHex(cur.read(8));
  const payload = cur.readVarbytes();
  if (tag === TAG_PENDING) {
    const inner = new Cursor(payload);
    const uri = new TextDecoder().decode(inner.readVarbytes(1000));
    inner.assertEof();
    return { kind: "pending", uri };
  }
  if (tag === TAG_BITCOIN) {
    const inner = new Cursor(payload);
    const height = inner.readVaruint();
    inner.assertEof();
    return { kind: "bitcoin", height };
  }
  if (tag === TAG_LITECOIN) {
    const inner = new Cursor(payload);
    const height = inner.readVaruint();
    inner.assertEof();
    return { kind: "litecoin", height };
  }
  return { kind: "unknown", tag, payload };
}

// ── the Timestamp tree ───────────────────────────────────────────────

export interface OtsTimestamp {
  /** The message this node commits to (the op results are computed at
   *  parse time — the format never carries them). */
  msg: Uint8Array;
  attestations: OtsAttestation[];
  ops: Array<[OtsOp, OtsTimestamp]>;
}

/** A leaf timestamp carrying one pending attestation (the stamp-time
 *  shape; the stub calendar and single-calendar answers both build on
 *  it). */
export function pendingTimestamp(msg: Uint8Array, calendarUri: string): OtsTimestamp {
  return { msg, attestations: [{ kind: "pending", uri: calendarUri }], ops: [] };
}

export async function parseTimestamp(bytes: Uint8Array, initialMsg: Uint8Array): Promise<OtsTimestamp> {
  const cur = new Cursor(bytes);
  const ts = await parseTimestampFrom(cur, initialMsg, 0);
  cur.assertEof();
  return ts;
}

async function parseTimestampFrom(cur: Cursor, msg: Uint8Array, depth: number): Promise<OtsTimestamp> {
  if (depth > 256) throw new OtsFormatError("timestamp recursion limit reached");
  const ts: OtsTimestamp = { msg, attestations: [], ops: [] };

  const handle = async (tag: number): Promise<void> => {
    if (tag === 0x00) {
      ts.attestations.push(parseAttestation(cur));
      return;
    }
    let op: OtsOp;
    if (tag === OP_APPEND || tag === OP_PREPEND) {
      op = { tag, arg: cur.readVarbytes() };
    } else if (tag === OP_SHA256) {
      op = { tag };
    } else {
      throw new OtsFormatError(`unsupported op tag 0x${tag.toString(16)} in the timestamp chain`);
    }
    const sub = await parseTimestampFrom(cur, await applyOp(op, msg), depth + 1);
    ts.ops.push([op, sub]);
  };

  let tag = cur.readByte();
  while (tag === 0xff) {
    await handle(cur.readByte());
    tag = cur.readByte();
  }
  await handle(tag);
  return ts;
}

/** Deterministic serialization (the reference rule: attestations and
 *  ops sorted, every branch but the last 0xff-prefixed, the lone/last
 *  attestation 0x00-marked). */
export function serializeTimestamp(ts: OtsTimestamp): Uint8Array {
  const out: number[] = [];
  writeTimestamp(out, ts);
  return new Uint8Array(out);
}

function writeTimestamp(out: number[], ts: OtsTimestamp): void {
  if (ts.attestations.length === 0 && ts.ops.length === 0) {
    throw new OtsFormatError("an empty timestamp cannot be serialized");
  }
  const atts = [...ts.attestations].sort((a, b) => (attestationKey(a) < attestationKey(b) ? -1 : 1));
  for (const a of atts.slice(0, -1)) {
    out.push(0xff, 0x00, ...serializeAttestation(a));
  }
  const ops = [...ts.ops].sort(([a], [b]) => (opKey(a) < opKey(b) ? -1 : 1));
  if (ops.length === 0) {
    if (atts.length) out.push(0x00, ...serializeAttestation(atts[atts.length - 1]!));
    return;
  }
  if (atts.length) out.push(0xff, 0x00, ...serializeAttestation(atts[atts.length - 1]!));
  for (const [op, sub] of ops.slice(0, -1)) {
    out.push(0xff, ...serializeOp(op));
    writeTimestamp(out, sub);
  }
  const [lastOp, lastSub] = ops[ops.length - 1]!;
  out.push(...serializeOp(lastOp));
  writeTimestamp(out, lastSub);
}

/** Merge two timestamps committing to the SAME message (the
 *  multi-calendar stamp): attestation sets union, shared ops merge
 *  recursively. */
export function mergeTimestamps(a: OtsTimestamp, b: OtsTimestamp): OtsTimestamp {
  if (bytesToHex(a.msg) !== bytesToHex(b.msg)) {
    throw new OtsFormatError("cannot merge timestamps for different messages");
  }
  const out: OtsTimestamp = { msg: a.msg, attestations: [...a.attestations], ops: [...a.ops] };
  const seen = new Set(out.attestations.map(attestationKey));
  for (const att of b.attestations) {
    if (!seen.has(attestationKey(att))) {
      out.attestations.push(att);
      seen.add(attestationKey(att));
    }
  }
  for (const [bOp, bSub] of b.ops) {
    const found = out.ops.find(([op]) => opKey(op) === opKey(bOp));
    if (found) {
      found[1] = mergeTimestamps(found[1], bSub);
    } else {
      out.ops.push([bOp, bSub]);
    }
  }
  return out;
}

/** Every attestation in the tree, flattened (the verifier's view:
 *  what anchors this proof carries). */
export function collectAttestations(ts: OtsTimestamp): OtsAttestation[] {
  const out = [...ts.attestations];
  for (const [, sub] of ts.ops) out.push(...collectAttestations(sub));
  return out;
}

// ── the detached file envelope ───────────────────────────────────────

export const OTS_DETACHED_MAGIC = new Uint8Array([
  0x00, ...Array.from(new TextEncoder().encode("OpenTimestamps")),
  0x00, 0x00, ...Array.from(new TextEncoder().encode("Proof")),
  0x00, 0xbf, 0x89, 0xe2, 0xe8, 0x84, 0xe8, 0x92, 0x94,
]);

export function buildDetachedProof(digest: Uint8Array, ts: OtsTimestamp): Uint8Array {
  if (digest.length !== 32) throw new OtsFormatError("the detached proof commits to a SHA-256 digest (32 bytes)");
  const out: number[] = Array.from(OTS_DETACHED_MAGIC);
  out.push(0x01); // major version
  out.push(OP_SHA256); // the file-hash op
  for (const b of digest) out.push(b);
  for (const b of serializeTimestamp(ts)) out.push(b);
  return new Uint8Array(out);
}

export async function parseDetachedProof(bytes: Uint8Array): Promise<{ digest: Uint8Array; timestamp: OtsTimestamp }> {
  const cur = new Cursor(bytes);
  const magic = cur.read(OTS_DETACHED_MAGIC.length);
  if (bytesToHex(magic) !== bytesToHex(OTS_DETACHED_MAGIC)) {
    throw new OtsFormatError("not an OpenTimestamps detached proof (bad magic)");
  }
  const version = cur.readByte();
  if (version !== 1) throw new OtsFormatError(`unsupported detached-proof major version ${version}`);
  const hashOp = cur.readByte();
  if (hashOp !== OP_SHA256) throw new OtsFormatError(`unsupported file-hash op 0x${hashOp.toString(16)} (SHA-256 expected)`);
  const digest = cur.read(32);
  const timestamp = await parseTimestampFrom(cur, digest, 0);
  cur.assertEof();
  return { digest, timestamp };
}

/** SHA-256 over bytes (the one hash this codec applies). */
export async function sha256Bytes(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data.slice()));
}

export { bytesToHex, hexToBytes };
