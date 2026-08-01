/**
 * Trust anchor loader + pinner for the browser verifier (TODO 44).
 *
 * Trust-on-first-use (TOFU) discipline:
 *   - First visit: fetch trust-anchors.json from canonical URL
 *   - Validate against transparency log + cross-channel
 *   - Pin the fingerprint_sha256 in localStorage
 *   - Subsequent visits: compare fetched fingerprint to pinned
 *   - Mismatch → hard fail (do not silently update)
 *
 * The Ruby CA server publishes `trust-anchors.json` + `.sig` via
 * TrustAnchorPublisher (lib/oiml_pki/trust_anchor.rb).
 *
 * @see TODO.roadmap/44-trust-anchor-bootstrap.md
 */

/** SHA-256 hex pattern. */
const HEX_SHA256 = /^[0-9a-f]{64}$/;

/** One trust anchor entry in the published JSON. */
export interface TrustAnchor {
  readonly id: string;
  readonly role: "root" | "issuing_authority" | "test_lab" | "manufacturer_model" | "manufacturer_instance";
  readonly publicKeyPem: string;
  readonly fingerprintSha256: string;
  readonly validFrom?: string;
  readonly validUntil?: string;
  readonly threshold?: { t: number; n: number };
  readonly transparencyLogUrl?: string;
}

/** Versioned collection of anchors. */
export interface TrustAnchorSet {
  readonly version: string;
  readonly schemaVersion: string;
  readonly publishedAt: string;
  readonly anchors: readonly TrustAnchor[];
  readonly previousVersion?: string;
  readonly previousVersionSignature?: string;
}

/** Structured error for trust anchor validation failures. */
export class TrustAnchorError extends Error {
  public readonly reason:
    | "fetch-failed"
    | "parse-failed"
    | "validation-failed"
    | "fingerprint-mismatch"
    | "expired"
    | "no-root";

  public readonly details: unknown;

  constructor(
    reason: TrustAnchorError["reason"],
    message: string,
    details: unknown = undefined,
  ) {
    super(message);
    this.name = "TrustAnchorError";
    this.reason = reason;
    this.details = details;
  }
}

/** LocalStorage key for pinned anchor fingerprint. */
const PIN_KEY = "cnml:pinned-trust-anchor-fingerprint";

/** Pluggable storage backend — defaults to localStorage in the browser.
 *  Tests inject an in-memory implementation (Node has no localStorage). */
export interface AnchorStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

let activeStorage: AnchorStorage | null = null;

function storage(): AnchorStorage {
  if (activeStorage) return activeStorage;
  // Default: localStorage (browser). In Node this reference is undefined.
  if (typeof globalThis !== "undefined" && (globalThis as { localStorage?: unknown }).localStorage) {
    activeStorage = (globalThis as unknown as { localStorage: AnchorStorage }).localStorage;
    return activeStorage;
  }
  throw new TrustAnchorError(
    "validation-failed",
    "no storage available — pass a storage backend to pin/verify functions",
  );
}

/** Set the storage backend (used by tests; not typically called in production). */
export function setAnchorStorage(backend: AnchorStorage): void {
  activeStorage = backend;
}

/** Reset to default (localStorage) backend. */
export function resetAnchorStorage(): void {
  activeStorage = null;
}

/** Default canonical URL for trust-anchors.json. Override via loadTrustAnchors({ url }). */
export const DEFAULT_TRUST_ANCHOR_URL = "/trust-anchors.json";

/**
 * Fetch + parse the trust anchor set from the given URL.
 *
 * @returns parsed set
 * @throws {TrustAnchorError} on fetch / parse / validation failure
 */
export async function loadTrustAnchors(
  opts: { url?: string; signal?: AbortSignal } = {},
): Promise<TrustAnchorSet> {
  const url = opts.url ?? DEFAULT_TRUST_ANCHOR_URL;
  let resp: Response;
  try {
    resp = await fetch(url, { signal: opts.signal });
  } catch (e) {
    throw new TrustAnchorError("fetch-failed", `network error: ${(e as Error).message}`, { url });
  }
  if (!resp.ok) {
    throw new TrustAnchorError("fetch-failed", `HTTP ${resp.status}`, { url, status: resp.status });
  }
  let json: unknown;
  try {
    json = await resp.json();
  } catch (e) {
    throw new TrustAnchorError("parse-failed", `JSON parse: ${(e as Error).message}`);
  }
  return validateTrustAnchorSet(json);
}

/**
 * Validate that a parsed JSON object matches the TrustAnchorSet schema.
 * Throws TrustAnchorError on any structural issue.
 */
export function validateTrustAnchorSet(parsed: unknown): TrustAnchorSet {
  if (typeof parsed !== "object" || parsed === null) {
    throw new TrustAnchorError("parse-failed", "not an object");
  }
  const obj = parsed as Record<string, unknown>;

  if (typeof obj.version !== "string") {
    throw new TrustAnchorError("validation-failed", "version missing or not a string");
  }
  const publishedAt = obj.publishedAt ?? obj.published_at;
  if (typeof publishedAt !== "string") {
    throw new TrustAnchorError("validation-failed", "publishedAt missing or not a string");
  }
  if (!Array.isArray(obj.anchors)) {
    throw new TrustAnchorError("validation-failed", "anchors not an array");
  }

  const anchors: TrustAnchor[] = [];
  for (let i = 0; i < obj.anchors.length; i++) {
    anchors.push(validateTrustAnchor(obj.anchors[i] as Record<string, unknown>, i));
  }

  const hasRoot = anchors.some(a => a.role === "root");
  if (!hasRoot) {
    throw new TrustAnchorError("no-root", "no anchor with role=root");
  }

  return {
    version: obj.version,
    schemaVersion: typeof obj.schemaVersion === "string"
      ? obj.schemaVersion
      : (typeof obj.schema_version === "string" ? obj.schema_version : "unknown"),
    publishedAt,
    anchors,
    previousVersion: typeof obj.previousVersion === "string"
      ? obj.previousVersion
      : (typeof obj.previous_version === "string" ? obj.previous_version : undefined),
    previousVersionSignature: typeof obj.previousVersionSignature === "string"
      ? obj.previousVersionSignature
      : (typeof obj.previous_version_signature === "string" ? obj.previous_version_signature : undefined),
  };
}

function validateTrustAnchor(raw: Record<string, unknown>, index: number): TrustAnchor {
  const validRoles = new Set([
    "root", "issuing_authority", "test_lab",
    "manufacturer_model", "manufacturer_instance",
  ]);

  const id = raw.id;
  const role = raw.role;
  const publicKeyPem = raw.public_key_pem ?? raw.publicKeyPem;
  const fingerprintSha256 = raw.fingerprint_sha256 ?? raw.fingerprintSha256;

  if (typeof id !== "string") {
    throw new TrustAnchorError("validation-failed", `anchor[${index}]: id missing`);
  }
  if (typeof role !== "string" || !validRoles.has(role)) {
    throw new TrustAnchorError("validation-failed", `anchor[${index}]: invalid role ${role}`);
  }
  if (typeof publicKeyPem !== "string") {
    throw new TrustAnchorError("validation-failed", `anchor[${index}]: publicKeyPem missing`);
  }
  if (typeof fingerprintSha256 !== "string" || !HEX_SHA256.test(fingerprintSha256)) {
    throw new TrustAnchorError("validation-failed", `anchor[${index}]: fingerprintSha256 invalid`);
  }

  return {
    id,
    role: role as TrustAnchor["role"],
    publicKeyPem,
    fingerprintSha256,
    validFrom: typeof raw.valid_from === "string" ? raw.valid_from : (raw.validFrom as string | undefined),
    validUntil: typeof raw.valid_until === "string" ? raw.valid_until : (raw.validUntil as string | undefined),
    threshold: parseThreshold(raw.threshold),
    transparencyLogUrl: typeof raw.transparency_log_url === "string"
      ? raw.transparency_log_url
      : (raw.transparencyLogUrl as string | undefined),
  };
}

function parseThreshold(raw: unknown): { t: number; n: number } | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.t !== "number" || typeof obj.n !== "number") return undefined;
  return { t: obj.t, n: obj.n };
}

/** Find an anchor by id. */
export function findAnchor(set: TrustAnchorSet, id: string): TrustAnchor | undefined {
  return set.anchors.find(a => a.id === id);
}

/** Find the (single) root anchor. */
export function currentRoot(set: TrustAnchorSet): TrustAnchor | undefined {
  return set.anchors.find(a => a.role === "root");
}

/**
 * Pin a fingerprint in storage. Subsequent calls to
 * verifyPinnedAnchor will compare against this.
 */
export function pinAnchor(fingerprint: string): void {
  if (!HEX_SHA256.test(fingerprint)) {
    throw new TrustAnchorError("validation-failed", `invalid fingerprint: ${fingerprint}`);
  }
  storage().setItem(PIN_KEY, fingerprint);
}

/** Remove the pinned fingerprint. */
export function clearPinnedAnchor(): void {
  storage().removeItem(PIN_KEY);
}

/** Get the pinned fingerprint, or undefined if none. */
export function getPinnedAnchor(): string | undefined {
  return storage().getItem(PIN_KEY) ?? undefined;
}

/**
 * Verify that the given set's root fingerprint matches the pinned value.
 * If no pin exists, pin it (TOFU). If pin exists and mismatches, throw.
 *
 * @returns the verified root anchor
 * @throws {TrustAnchorError} on fingerprint mismatch
 */
export function verifyPinnedAnchor(set: TrustAnchorSet): TrustAnchor {
  const root = currentRoot(set);
  if (!root) {
    throw new TrustAnchorError("no-root", "set has no root anchor");
  }
  const pinned = getPinnedAnchor();
  if (!pinned) {
    pinAnchor(root.fingerprintSha256);
    return root;
  }
  if (pinned !== root.fingerprintSha256) {
    throw new TrustAnchorError(
      "fingerprint-mismatch",
      `pinned ${pinned.slice(0, 16)}… but fetched ${root.fingerprintSha256.slice(0, 16)}…`,
      { pinned, fetched: root.fingerprintSha256 },
    );
  }
  return root;
}
