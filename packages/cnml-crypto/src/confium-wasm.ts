/**
 * Lazy loader for the @confium/confium-wasm browser package.
 *
 * Wraps `import("@confium/confium-wasm")` with memoization so the
 * 5-10 MB bundle is fetched + instantiated at most once per page load.
 * Provides feature detection (WASM + Web Crypto API presence) and
 * structured error reporting so callers can render meaningful UI.
 *
 * The browser uses this loader for:
 *   - Director signing ceremonies (DirectorSignPanel)
 *   - Threshold KEM decryption
 *   - CMS envelope parsing
 *   - Director identity operations
 *
 * The verify pipeline NEVER calls this — pure-TS crypto is sufficient
 * for verification. Keeping WASM out of the initial bundle is the
 * whole point (initial page load stays under 200 KB).
 */

/** Structured description of the loaded WASM module. */
export interface ConfiumWasmBundle {
  /** The loaded WASM module — opaque to this loader; consumers know the API. */
  readonly module: ConfiumWasmModule;
  /** Gem version reported by the loaded module. */
  readonly version: string;
  /** Rust core version reported by the loaded module. */
  readonly rustCoreVersion: string;
  /** Threshold schemes the WASM module exposes. */
  readonly availableSchemes: readonly string[];
  /** Coordinator protocol versions the WASM module supports. */
  readonly coordinatorProtocols: readonly string[];
  /** Bundle size in bytes (best-effort; read from Content-Length). */
  readonly bundleSizeBytes: number;
}

/** Opaque interface for the WASM module (concrete shape owned by consumers). */
export interface ConfiumWasmModule {
  readonly VERSION: string;
  readonly RUST_CORE_VERSION: string;
  availableSchemes(): readonly string[];
  coordinatorProtocols(): readonly string[];
  // Actual consumer APIs (TC::Session, CMS parser, etc.) are defined
  // by @confium/confium-wasm; this interface only declares what the
  // loader itself needs.
  readonly [key: string]: unknown;
}

/** Structured error produced by {@link loadConfiumWasm}. */
export class ConfiumWasmUnavailableError extends Error {
  public readonly reason:
    | "package-missing"
    | "wasm-not-supported"
    | "webcrypto-missing"
    | "instantiation-failed"
    | "version-mismatch";

  public readonly details: unknown;

  constructor(
    reason: ConfiumWasmUnavailableError["reason"],
    details: unknown = undefined,
  ) {
    const messages: Record<ConfiumWasmUnavailableError["reason"], string> = {
      "package-missing":       "@confium/confium-wasm is not installed in this build",
      "wasm-not-supported":    "WebAssembly is not supported in this browser",
      "webcrypto-missing":     "Web Crypto API (window.crypto.subtle) is not available",
      "instantiation-failed":  "WASM instantiation failed",
      "version-mismatch":      "Loaded WASM version is below the required minimum",
    };
    super(messages[reason]);
    this.name = "ConfiumWasmUnavailableError";
    this.reason = reason;
    this.details = details;
  }
}

/** Minimum @confium/confium-wasm version this loader accepts. */
export const MIN_WASM_VERSION = "0.3.0";

let cachedPromise: Promise<ConfiumWasmBundle> | null = null;

/**
 * Lazily load + instantiate @confium/confium-wasm. Returns a memoized
 * promise so subsequent callers share the same load. Rejection clears
 * the cache so a retry attempt can succeed after a transient failure.
 *
 * @returns the loaded bundle
 * @throws {ConfiumWasmUnavailableError} on any failure
 */
export async function loadConfiumWasm(): Promise<ConfiumWasmBundle> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = doLoad().catch((err) => {
    cachedPromise = null;
    throw err;
  });
  return cachedPromise;
}

/** Release the cached module. Rarely needed in production (useful for tests). */
export function unloadConfiumWasm(): void {
  cachedPromise = null;
}

/** Has the loader cached a promise? Used by UI to show "already loaded" state. */
export function isConfiumWasmLoaded(): boolean {
  return cachedPromise !== null;
}

/** Synchronously check whether WASM is likely to be available (no fetch). */
export function detectWasmSupport(): { supported: boolean; reason?: string } {
  if (typeof WebAssembly === "undefined") {
    return { supported: false, reason: "WebAssembly is not supported" };
  }
  if (typeof crypto === "undefined" || typeof crypto.subtle === "undefined") {
    return { supported: false, reason: "Web Crypto API is not available" };
  }
  return { supported: true };
}

/** Compare semver-like versions. Returns true if actual < required. */
function versionLessThan(actual: string, required: string): boolean {
  const parse = (v: string) => v.split(".").map(n => parseInt(n, 10) || 0);
  const a = parse(actual);
  const r = parse(required);
  for (let i = 0; i < Math.max(a.length, r.length); i++) {
    const ai = a[i] ?? 0;
    const ri = r[i] ?? 0;
    if (ai < ri) return true;
    if (ai > ri) return false;
  }
  return false;
}

/** Inner load — performs the actual fetch + instantiation. */
async function doLoad(): Promise<ConfiumWasmBundle> {
  const support = detectWasmSupport();
  if (!support.supported) {
    throw new ConfiumWasmUnavailableError(
      support.reason?.includes("WebAssembly") ? "wasm-not-supported" : "webcrypto-missing",
      support.reason,
    );
  }

  let mod: ConfiumWasmModule;
  try {
    // The package is resolved via a Vite resolve.alias to a stub when
    // not installed (see apps/cnml-web/astro.config.mjs). The runtime
    // catch below surfaces "package-missing" if the stub or real module
    // is absent.
    const imported = await import("@confium/confium-wasm");
    // Default export is the WASM instantiate promise for some bundlers.
    if (imported.default && typeof imported.default.then === "function") {
      await imported.default;
    } else if (imported.default) {
      mod = imported.default as ConfiumWasmModule;
    }
    mod = (mod ?? imported) as ConfiumWasmModule;
  } catch (e) {
    throw new ConfiumWasmUnavailableError("package-missing", (e as Error).message);
  }

  if (!mod.VERSION || versionLessThan(mod.VERSION, MIN_WASM_VERSION)) {
    throw new ConfiumWasmUnavailableError(
      "version-mismatch",
      { actual: mod.VERSION ?? "unknown", required: MIN_WASM_VERSION },
    );
  }

  let bundleSizeBytes = 0;
  try {
    const resp = await fetch(resolveWasmUrl(), { method: "HEAD" });
    bundleSizeBytes = Number(resp.headers.get("Content-Length") ?? 0);
  } catch {
    // Best-effort; bundle size is informational.
  }

  return Object.freeze({
    module: mod,
    version: mod.VERSION,
    rustCoreVersion: mod.RUST_CORE_VERSION ?? mod.VERSION,
    availableSchemes: callSafely(() => mod.availableSchemes?.() ?? []) ?? [],
    coordinatorProtocols: callSafely(() => mod.coordinatorProtocols?.() ?? ["v1"]) ?? ["v1"],
    bundleSizeBytes,
  });
}

/** Resolve the WASM URL for the HEAD size probe. */
function resolveWasmUrl(): string {
  // The bundler rewrites the dynamic import() to a content-addressed URL.
  // We probe a conventional location; if it doesn't resolve, the size is
  // simply unknown.
  return "/wasm/confium.wasm";
}

/** Call a function; return undefined on any error (defensive against partial WASM APIs). */
function callSafely<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}
