/**
 * Type definitions for the check pipeline.
 *
 * A Check is a named, ordered verification step. Its `run` function
 * receives the raw XML, a shared context, and the results of prior
 * checks (so it can short-circuit or read parsed data).
 */

export type CheckStatus = "pass" | "fail" | "warn" | "skip" | "pending";

export interface CheckResult {
  /** ID of the check that produced this result. */
  checkId: string;
  status: CheckStatus;
  /** Human-readable explanation; shown in the UI. */
  reason?: string;
  /** Optional structured data for advanced UI rendering. */
  details?: unknown;
}

/**
 * Shared context passed to every check. Built once per verify call.
 * Checks can populate fields as they run (e.g., the XML-well-formed
 * check sets `ctx.parsedCert`; later checks read it).
 */
export interface CheckContext {
  /** Trusted public keys for signature verification (browser trust store). */
  trustedKeys?: CryptoKey[];
  /** Trusted cert PEMs (alternative to trustedKeys). */
  trustedCerts?: string[];
  /** An explicit CRL distribution point (tests, deployments whose cert
   *  predates the CRL DP extension). */
  crlUrl?: string;
  /** Recommendation id parsed from the CNML (set by schema_valid check). */
  recommendationId?: string;
  /** Parsed certificate object (set by schema_valid check). */
  parsedCert?: unknown;
  /** Scope read from the issuer's intermediate cert (set by signature check). */
  issuerScope?: string[] | null;
  /** Whether the timestamp check found an embedded OTS proof. */
  hasTimestamp?: boolean;
  /** The timestamp leg's posture (CNML: time attestation is REQUIRED):
   *  "required" (the default) fails a proof-less document; "legacy" —
   *  for a record signed before the mandate — marks it as the honest
   *  legacy state instead. */
  timestampPosture?: "required" | "legacy";
  /** The timestamp relay's verify endpoint (the smart instance's
   *  /api/cnml/timestamp/verify): the pending leg's upgrade query + the
   *  attested leg's block-time resolution run through it. Undeclared,
   *  the leg classifies locally (a pending proof stays pending; an
   *  attested proof passes with the block height, the block time left
   *  to a networked verifier). */
  otsVerifyUrl?: string;
  /** The fetch implementation for the check pipeline's network seams
   *  (tests stub it; the default is globalThis.fetch). */
  fetchImpl?: typeof fetch;
  /** Whether the transparency check found an embedded tlog proof. */
  hasTransparencyProof?: boolean;
  /** SHA-256 fingerprint (hex) of the signer's cert, set by the signature check. */
  signerFingerprint?: string;
  /** Length of the embedded certificate chain, set by the signature check. */
  chainLength?: number;
  /** Fingerprint of the chain's top (root-side) cert, set by the signature check. */
  rootAnchorFingerprint?: string;
  /** Co-signature dimension entries, set by the dimensions check (Phase 2). */
  dimensions?: import("./coverage.ts").DimensionCoverage[];
  /** Signature algorithms observed with registry status (Phase 5). */
  algorithmStatuses?: { id: string; status: string }[];
  /** Override the algorithm registry (default: the published registry). */
  algorithmRegistry?: import("../algorithms.ts").AlgorithmRegistry;
  /** Revoked authority-state hashes; artifacts bound to one fail check 5 (Phase 4). */
  revokedStateHashes?: string[];
  /** Explicit values for scope-condition evaluation (Phase 6); merged
   *  over the values extracted from the artifact itself. */
  scopeConditionValues?: Record<string, unknown>;
  /** Offline CRL grace period in ms (spec §revocation-offline): a
   *  stale CRL within the window downgrades; beyond it, check 6 fails. */
  crlGracePeriodMs?: number;
  /** Multi-log quorum status, set when a policy applies (§coverage-report). */
  multiLogStatus?: { met: boolean; count: number; m: number; k: number };
  /** The log operator public key (SPKI PEM) for embedded tree-head
   *  signature verification (spec §inclusion-proof). */
  logOperatorPublicKeyPem?: string;
}

export interface Check {
  /** Stable identifier (e.g., "xml-well-formed"). */
  id: string;
  /** UI label (e.g., "1. XML well-formed"). */
  label: string;
  /** If true, pipeline continues even when this check fails. */
  continueOnFail?: boolean;
  /**
   * Run the check. Receives:
   *   - xml: the raw CNML XML string
   *   - ctx: shared mutable context
   *   - prior: results of checks that ran before this one
   *
   * May throw — the pipeline catches and converts to a fail result.
   */
  run: (xml: string, ctx: CheckContext, prior: CheckResult[]) => Promise<CheckResult>;
}
