/**
 * TypeScript port of the confium deployment manifest.
 *
 * Pure-TypeScript parser + validator. The Ruby CA server uses
 * DeploymentManifest (lib/oiml_pki/deployment_manifest.rb) for the
 * same schema. Both ports accept the same TOML. Cross-implementation
 * agreement is exercised by the schema-evolution compat tests.
 */

/** T-of-N threshold. */
export interface Threshold {
  readonly t: number;
  readonly n: number;
}

/** One tier in the 5-tier hierarchy. */
export interface Tier {
  readonly name: string;
  readonly role: string;
  readonly signingAlgorithm?: string;
  readonly encryptionAlgorithm?: string;
  readonly threshold?: Threshold;
  readonly delegatedBy?: string;
  readonly delegationScope?: string;
  readonly ceremony?: { syncRequired?: boolean; frequency?: string };
  readonly attributes?: readonly string[];
}

/** Quorum registry entry. */
export interface Quorum {
  readonly name: string;
  readonly threshold: Threshold;
  readonly coordinator: string;
  readonly shareStorageBackend?: string;
}

/** Top-level deployment header. */
export interface DeploymentHeader {
  readonly name: string;
  readonly operator: string;
  readonly charterUrl?: string;
  readonly manifestVersion: number;
}

/** Transparency log config. */
export interface RecognizedLog {
  readonly name: string;
  readonly endpoint?: string;
  /** SPKI PEM of the log operator's signing key. */
  readonly publicKey?: string;
  readonly mirror?: boolean;
}

export interface MultiLogPolicy {
  readonly m: number;
  readonly k: number;
}

export interface TransparencyConfig {
  readonly logOperator?: string;
  readonly anchors?: readonly string[];
  readonly gossip?: boolean;
  readonly publicMirrorUrls?: readonly string[];
  /** Recognized logs and mirrors with endpoints and keys (§manifest-transparency). */
  readonly logs?: readonly RecognizedLog[];
  /** Multi-log attestation policy: at least m of k recognized logs. */
  readonly multiLog?: MultiLogPolicy;
}

/** Async signing defaults. */
export interface AsyncSigningConfig {
  readonly defaultUnlockWindowMinutes: number;
  readonly coordinatorOperator?: string;
}

/** Long-term archival config. */
export interface ArchivalConfig {
  readonly renewalPeriodYears: number;
  readonly reSignUnder?: string;
}

/** PQC migration trajectory. */
export interface PqcMigrationPlan {
  readonly current?: string;
  readonly target2027?: string;
  readonly target2029?: string;
}

/** Scheme-declared classification policy (SIGNATIF §classification). */
export interface ClassificationConfig {
  labels?: readonly string[];
  top_label?: {
    required_dimensions?: readonly string[];
    requires_transparency?: boolean;
    requires_timestamp?: boolean;
  };
  downgrades?: {
    soft_fail?: string;
    hard_warn?: string;
    missing_dimension?: string;
  };
}

/** Algorithm agility (SIGNATIF Phase 5). */
export interface AlgorithmsConfig {
  /** Migration phase: classical-only | composite | post-quantum-only. */
  readonly phase?: string;
  /** Registry ids accepted under the current phase. */
  readonly active?: readonly string[];
}

/** Deployment manifest (confium.toml). */
export interface Manifest {
  readonly deployment: DeploymentHeader;
  readonly mode: string;
  readonly tiers: readonly Tier[];
  readonly quorums: readonly Quorum[];
  readonly transparency?: TransparencyConfig;
  readonly asyncSigning?: AsyncSigningConfig;
  readonly archival?: ArchivalConfig;
  readonly pqcMigration?: PqcMigrationPlan;
  readonly algorithms?: AlgorithmsConfig;
  readonly classification?: ClassificationConfig;
}

/** Validation report — list of errors and warnings. */
export interface ValidationReport {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

/** Schema version this loader accepts. */
export const MANIFEST_VERSION = 1;

/**
 * Validate a parsed manifest object. Returns a structured report —
 * never throws on validation failures.
 */
export function validateManifest(parsed: unknown): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof parsed !== "object" || parsed === null) {
    return { valid: false, errors: ["manifest is not an object"], warnings };
  }
  const obj = parsed as Record<string, unknown>;
  const deployment = obj.deployment;

  if (typeof deployment !== "object" || deployment === null) {
    errors.push("manifest missing [deployment] section");
    return { valid: false, errors, warnings };
  }

  const dep = deployment as Record<string, unknown>;
  if (dep.manifest_version !== MANIFEST_VERSION) {
    errors.push(`unsupported manifest version ${dep.manifest_version} (expected ${MANIFEST_VERSION})`);
  }

  const mode = typeof obj.mode === "string" ? obj.mode : "certificate_pki";
  const tiers = Array.isArray(obj.tiers) ? obj.tiers : [];

  if (mode === "certificate_pki" && tiers.length === 0) {
    errors.push("certificate_pki mode requires at least one tier");
  }

  if (mode === "pkcs11_replacement") {
    if (!obj.pkcs11_server) errors.push("pkcs11_replacement mode requires [pkcs11_server] section");
    if (!Array.isArray(obj.quorums) || obj.quorums.length === 0) {
      errors.push("pkcs11_replacement mode requires at least one [[quorums]] entry");
    }
  }

  // Threshold validation
  for (const raw of tiers) {
    const tier = raw as Record<string, unknown>;
    const threshold = tier.threshold as Record<string, unknown> | undefined;
    if (!threshold) continue;
    const t = threshold.t as number | undefined;
    const n = threshold.n as number | undefined;
    if (t === undefined || n === undefined) {
      errors.push(`tier ${tier.name}: threshold missing t or n`);
      continue;
    }
    if (t === 0 || t > n) {
      errors.push(`tier ${tier.name}: invalid threshold t=${t} n=${n}`);
    }
  }

  // Tier chain validation
  const tierNames = new Set(tiers.map(t => (t as Record<string, unknown>).name as string));
  let hasRoot = false;
  for (const raw of tiers) {
    const tier = raw as Record<string, unknown>;
    const parent = tier.delegated_by ?? tier.delegatedBy;
    if (parent === undefined) {
      hasRoot = true;
    } else if (!tierNames.has(parent as string)) {
      errors.push(`tier ${tier.name}: delegates to unknown tier ${parent}`);
    }
  }
  if (!hasRoot && tiers.length > 0) {
    errors.push("tier chain has no root (no tier with delegated_by absent)");
  }

  // Quorum warning
  const quorums = Array.isArray(obj.quorums) ? obj.quorums : [];
  const hasThresholdTier = tiers.some(t => {
    const tier = t as Record<string, unknown>;
    const threshold = tier.threshold as Record<string, unknown> | undefined;
    return threshold && (threshold.t as number) > 1;
  });
  if (hasThresholdTier && quorums.length === 0) {
    warnings.push("threshold tier(s) defined but no [[quorums]] entries");
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Parse a manifest from a Hash (already-parsed). Validates; returns
 * structured Manifest object.
 *
 * @throws if validation fails
 */
export function parseManifestHash(parsed: unknown): Manifest {
  const report = validateManifest(parsed);
  if (!report.valid) {
    throw new Error(`manifest invalid: ${report.errors.join("; ")}`);
  }
  return coerceToManifest(parsed as Record<string, unknown>);
}

function coerceToManifest(obj: Record<string, unknown>): Manifest {
  const dep = obj.deployment as Record<string, unknown>;
  const tiers = (obj.tiers as readonly Record<string, unknown>[] | undefined) ?? [];
  const quorums = (obj.quorums as readonly Record<string, unknown>[] | undefined) ?? [];

  return {
    deployment: {
      name: dep.name as string,
      operator: dep.operator as string,
      charterUrl: dep.charter_url as string | undefined,
      manifestVersion: dep.manifest_version as number,
    },
    mode: (obj.mode as string) ?? "certificate_pki",
    tiers: tiers.map(t => ({
      name: t.name as string,
      role: t.role as string,
      signingAlgorithm: t.signing_algorithm as string | undefined,
      encryptionAlgorithm: t.encryption_algorithm as string | undefined,
      threshold: parseThreshold(t.threshold),
      delegatedBy: (t.delegated_by ?? t.delegatedBy) as string | undefined,
      delegationScope: (t.delegation_scope ?? t.delegationScope) as string | undefined,
      ceremony: parseCeremony(t.ceremony),
      attributes: t.attributes as readonly string[] | undefined,
    })),
    quorums: quorums.map(q => ({
      name: q.name as string,
      threshold: parseThreshold(q.threshold) ?? { t: 1, n: 1 },
      coordinator: q.coordinator as string,
      shareStorageBackend: (q.share_storage_backend ?? q.shareStorageBackend) as string | undefined,
    })),
    transparency: parseTransparency(obj.transparency),
    asyncSigning: parseAsyncSigning(obj.async_signing ?? obj.asyncSigning),
    archival: parseArchival(obj.archival),
    pqcMigration: parsePqcMigration(obj.pqc_migration ?? obj.pqcMigration),
    algorithms: parseAlgorithms(obj.algorithms),
    classification: parseClassificationConfig(obj.classification),
  };
}

function parseThreshold(raw: unknown): Threshold | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.t !== "number" || typeof obj.n !== "number") return undefined;
  return { t: obj.t, n: obj.n };
}

function parseCeremony(raw: unknown): { syncRequired?: boolean; frequency?: string } | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    syncRequired: (obj.sync_required ?? obj.syncRequired) as boolean | undefined,
    frequency: obj.frequency as string | undefined,
  };
}

function parseTransparency(raw: unknown): TransparencyConfig | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    logOperator: (obj.log_operator ?? obj.logOperator) as string | undefined,
    anchors: obj.anchors as readonly string[] | undefined,
    gossip: obj.gossip as boolean | undefined,
    publicMirrorUrls: (obj.public_mirror_urls ?? obj.publicMirrorUrls) as readonly string[] | undefined,
    logs: Array.isArray(obj.logs)
      ? (obj.logs as readonly Record<string, unknown>[]).map((l) => ({
          name: l.name as string,
          endpoint: (l.endpoint ?? l.url) as string | undefined,
          publicKey: (l.public_key ?? l.publicKey) as string | undefined,
          mirror: l.mirror as boolean | undefined,
        }))
      : undefined,
    multiLog: obj.multi_log && typeof obj.multi_log === "object"
      ? {
          m: (obj.multi_log as Record<string, unknown>).m as number,
          k: (obj.multi_log as Record<string, unknown>).k as number,
        }
      : undefined,
  };
}

function parseAsyncSigning(raw: unknown): AsyncSigningConfig | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    defaultUnlockWindowMinutes: typeof obj.default_unlock_window_minutes === "number"
      ? obj.default_unlock_window_minutes
      : 240,
    coordinatorOperator: (obj.coordinator_operator ?? obj.coordinatorOperator) as string | undefined,
  };
}

function parseArchival(raw: unknown): ArchivalConfig | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    renewalPeriodYears: typeof obj.renewal_period_years === "number" ? obj.renewal_period_years : 5,
    reSignUnder: (obj.re_sign_under ?? obj.reSignUnder) as string | undefined,
  };
}

function parseClassificationConfig(raw: unknown): ClassificationConfig | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  const top = obj.top_label ?? obj.topLabel;
  const down = obj.downgrades;
  return {
    labels: obj.labels as readonly string[] | undefined,
    top_label: typeof top === "object" && top !== null
      ? {
          required_dimensions: ((top as Record<string, unknown>).required_dimensions
            ?? (top as Record<string, unknown>).requiredDimensions) as readonly string[] | undefined,
          requires_transparency: (top as Record<string, unknown>).requires_transparency as boolean | undefined,
          requires_timestamp: (top as Record<string, unknown>).requires_timestamp as boolean | undefined,
        }
      : undefined,
    downgrades: typeof down === "object" && down !== null
      ? {
          soft_fail: (down as Record<string, unknown>).soft_fail as string | undefined,
          hard_warn: (down as Record<string, unknown>).hard_warn as string | undefined,
          missing_dimension: (down as Record<string, unknown>).missing_dimension as string | undefined,
        }
      : undefined,
  };
}

function parseAlgorithms(raw: unknown): AlgorithmsConfig | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    phase: obj.phase as string | undefined,
    active: obj.active as readonly string[] | undefined,
  };
}

function parsePqcMigration(raw: unknown): PqcMigrationPlan | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    current: obj.current as string | undefined,
    target2027: (obj.target_2027 ?? obj.target2027) as string | undefined,
    target2029: (obj.target_2029 ?? obj.target2029) as string | undefined,
  };
}

/** The manifest's [signature] section (§manifest-format). */
export interface ManifestSignature {
  algorithm: string;
  /** P-1363 raw r||s hex over manifestCanonicalString(). */
  value: string;
  /** SPKI PEM of the root authority's signing key. */
  public_key: string;
}

/** The canonical string covered by a manifest signature — deployment
 *  header, mode, tier structure (with thresholds and delegation),
 *  and quorum registry. Mirrors the Ruby ManifestSigning module. */
export function manifestCanonicalString(manifest: Manifest & { signature?: ManifestSignature }): string {
  const d = manifest.deployment;
  const tiers = manifest.tiers.map((t) => {
    const parts = [t.name, t.role];
    if (t.threshold) {
      parts.push(`t=${t.threshold.t}`);
      parts.push(`n=${t.threshold.n}`);
    }
    if (t.delegatedBy) parts.push(`by=${t.delegatedBy}`);
    return parts.join(":");
  });
  const quorums = manifest.quorums.map((q) => `${q.name}:${q.coordinator}`);
  return `CNML-MANIFEST-v1|${d.name}|${d.operator}|${manifest.mode}|${tiers.join(";")}|${quorums.join(";")}`;
}

/** Verify a manifest's root-authority signature (WebCrypto ECDSA). */
export async function verifyManifestSignature(
  manifest: Manifest & { signature?: ManifestSignature },
): Promise<boolean> {
  const sig = manifest.signature;
  if (!sig?.value || !sig.public_key) return false;
  const b64 = sig.public_key
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");
  const spki = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "spki",
      spki,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"],
    );
  } catch {
    return false;
  }
  const sigBytes = Uint8Array.from(
    sig.value.match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? [],
  );
  return crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    sigBytes,
    new TextEncoder().encode(manifestCanonicalString(manifest)),
  );
}

/** Find the first tier with the given role. */
export function tierForRole(manifest: Manifest, role: string): Tier | undefined {
  return manifest.tiers.find(t => t.role === role);
}

/** Find a tier by name. */
export function tierNamed(manifest: Manifest, name: string): Tier | undefined {
  return manifest.tiers.find(t => t.name === name);
}

/** Find the single root tier (no delegatedBy). Returns undefined if 0 or multiple. */
export function rootTier(manifest: Manifest): Tier | undefined {
  const roots = manifest.tiers.filter(t => t.delegatedBy === undefined);
  return roots.length === 1 ? roots[0] : undefined;
}

/** Walk the tier chain upward to the root. Returns [self, parent, ..., root]. */
export function chainFrom(manifest: Manifest, tierName: string): Tier[] {
  const chain: Tier[] = [];
  const seen = new Set<string>();
  let current = tierNamed(manifest, tierName);
  while (current && !seen.has(current.name)) {
    chain.push(current);
    seen.add(current.name);
    current = current.delegatedBy ? tierNamed(manifest, current.delegatedBy) : undefined;
  }
  return chain;
}
