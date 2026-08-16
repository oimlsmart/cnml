/**
 * Algorithm agility registry (SIGNATIF Phase 5).
 *
 * A signed, versioned registry of the algorithms CNML recognizes,
 * each with a status: active, deprecated, or retired. Verifiers
 * enforce it — active accepts normally, deprecated downgrades the
 * classification one label, retired hard-fails — so post-quantum
 * migration proceeds on a governed timeline rather than a flag day.
 *
 * The canonical registry is published at the well-known URL
 * (/.well-known/cnml/algorithms.json) and mirrored in the deployment
 * manifest's [algorithms] section, which also declares the scheme's
 * migration phase (classical-only → composite → post-quantum-only).
 */

export type AlgorithmStatus = "active" | "deprecated" | "retired";
export type AlgorithmFamily = "classical" | "post-quantum" | "composite" | "hash";

export interface AlgorithmEntry {
  id: string;
  family: AlgorithmFamily;
  status: AlgorithmStatus;
  reference?: string;
  /** XMLDSig SignatureMethod URIs that map to this algorithm. */
  signatureMethodUris?: readonly string[];
  /** When set: the scheduled deprecation / retirement date (ISO-8601). */
  deprecationDate?: string;
  retirementDate?: string;
}

export interface AlgorithmRegistry {
  version: number;
  published: string;
  algorithms: readonly AlgorithmEntry[];
}

export const ALGORITHMS_WELL_KNOWN_URL = "/.well-known/cnml/algorithms.json";

export const DEFAULT_ALGORITHM_REGISTRY: AlgorithmRegistry = {
  version: 1,
  published: "2026-08-16",
  algorithms: [
    {
      id: "ecdsa-p256",
      family: "classical",
      status: "active",
      reference: "FIPS 186-4",
      signatureMethodUris: [
        "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256",
      ],
    },
    {
      id: "ed25519",
      family: "classical",
      status: "active",
      reference: "RFC 8032",
      signatureMethodUris: [
        "http://www.w3.org/2021/04/xmldsig#ed25519",
        "urn:ietf:params:xml:ns:cite:ed25519",
      ],
    },
    {
      id: "ml-dsa-65",
      family: "post-quantum",
      status: "active",
      reference: "FIPS 204",
      signatureMethodUris: [
        "http://www.w3.org/2007/05/xmldsig-more#ml-dsa-65",
      ],
    },
    {
      id: "composite-ed25519-ml-dsa-65",
      family: "composite",
      status: "active",
      reference: "IETF LAMPS composite signatures (draft)",
    },
    {
      id: "sha256",
      family: "hash",
      status: "active",
      reference: "FIPS 180-4",
    },
  ],
};

/** Look up an algorithm's registry status. Unknown → undefined. */
export function statusForAlgorithm(
  registry: AlgorithmRegistry,
  algorithmId: string,
): AlgorithmStatus | undefined {
  return registry.algorithms.find((a) => a.id === algorithmId)?.status;
}

/** Map an XMLDSig SignatureMethod URI to a registry algorithm id. */
export function algorithmIdForSignatureMethod(
  registry: AlgorithmRegistry,
  uri: string,
): string | undefined {
  return registry.algorithms.find(
    (a) => a.signatureMethodUris?.includes(uri),
  )?.id;
}

/** Fetch a published registry from its well-known URL. */
export async function loadAlgorithmRegistry(url: string): Promise<AlgorithmRegistry> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`algorithm registry at ${url} answered ${res.status}`);
  const registry = (await res.json()) as AlgorithmRegistry;
  if (typeof registry.version !== "number" || !Array.isArray(registry.algorithms)) {
    throw new Error(`algorithm registry at ${url} is malformed`);
  }
  return registry;
}

/**
 * Migration phases (manifest [algorithms].phase):
 *   classical-only — only classical signatures accepted
 *   composite      — composite (AND) signatures required at root/IA
 *   post-quantum-only — classical signatures retired
 */
export type MigrationPhase = "classical-only" | "composite" | "post-quantum-only";

export function isMigrationPhase(value: string): value is MigrationPhase {
  return value === "classical-only" || value === "composite" || value === "post-quantum-only";
}
