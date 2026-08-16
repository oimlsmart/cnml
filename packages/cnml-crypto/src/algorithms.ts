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
  /** P-1363 raw r||s hex over registryString() — present when the
   *  scheme operator has signed the registry. */
  signature?: string;
  /** SPKI PEM of the signing key. */
  public_key?: string;
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

/**
 * The canonical string covered by a registry signature: version,
 * publication date, and each algorithm's id and status in order.
 */
export function registryString(registry: AlgorithmRegistry): string {
  const algos = registry.algorithms
    .map((a) => `${a.id}:${a.status}`)
    .join(";");
  return `CNML-ALG-REGISTRY-v1|${registry.version}|${registry.published}|${algos}`;
}

export interface RegistryVerification {
  signed: boolean;
  verified: boolean;
  reason?: string;
}

/**
 * Verify the registry's operator signature. An unsigned registry is
 * reported as such (verified: true only when signing is not required
 * by the caller); a signed registry must verify or it is rejected.
 */
export async function verifyAlgorithmRegistry(
  registry: AlgorithmRegistry,
  requireSigned = false,
): Promise<RegistryVerification> {
  if (!registry.signature) {
    return requireSigned
      ? { signed: false, verified: false, reason: "registry is not signed" }
      : { signed: false, verified: true };
  }
  if (!registry.public_key) {
    return { signed: true, verified: false, reason: "signature without a public key" };
  }
  const b64 = registry.public_key
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");
  const spki = new Uint8Array(atob(b64).split("").map((c) => c.charCodeAt(0)));
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "spki",
      spki,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"],
    );
  } catch (e) {
    return { signed: true, verified: false, reason: `bad public key: ${(e as Error).message}` };
  }
  const sig = new Uint8Array(registry.signature.match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? []);
  const ok = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    sig,
    new TextEncoder().encode(registryString(registry)),
  );
  return ok
    ? { signed: true, verified: true }
    : { signed: true, verified: false, reason: "signature mismatch" };
}

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
