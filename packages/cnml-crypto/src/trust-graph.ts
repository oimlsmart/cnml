/**
 * Trust graph path enumeration (SIGNATIF Phase 8).
 *
 * Generalizes the certificate chain to a DAG: when cross-recognition
 * or federation admits multiple valid paths from an artifact to the
 * root anchors, the coverage report records all of them, the root
 * diversity, and the strongest path per dimension.
 *
 * The CNML hierarchy is a strict tree today, where linear chain
 * walking is conforming; this module is the path-finding
 * infrastructure for when the graph admits multiple paths.
 */

import type { VerificationPath } from "./checks/coverage.ts";

/** One delegation link: a signer and who it delegates from. */
export interface SignatureChainLink {
  /** Fingerprint of this signer's key/cert. */
  subjectFingerprint: string;
  /** Fingerprint this link claims to delegate from. */
  issuerFingerprint: string;
  /** Trust dimension this link validates (data for primaries). */
  dimension?: string;
  /** Known parents of the issuer (trust-graph edges). */
  issuerParents: string[];
}

export interface TrustAnchor {
  fingerprint: string;
}

export interface TrustAnchorBundle {
  anchors: TrustAnchor[];
  /** Trust-graph edges: fingerprint → its possible parents. In a
   *  full deployment this is the delegation index built from the
   *  transparency log. */
  edges: Map<string, string[]>;
  findByFingerprint(fingerprint: string): TrustAnchor | undefined;
}

export interface TrustedArtifact {
  signatures: SignatureChainLink[];
}

export function anchorBundle(
  anchorFingerprints: string[],
  edges: Record<string, string[]> = {},
): TrustAnchorBundle {
  const anchors = anchorFingerprints.map((fingerprint) => ({ fingerprint }));
  const edgeMap = new Map(Object.entries(edges));
  return {
    anchors,
    edges: edgeMap,
    findByFingerprint(fingerprint: string) {
      return anchors.find((a) => a.fingerprint === fingerprint);
    },
  };
}

/**
 * Enumerate every valid verification path from the artifact's
 * signatures to a root anchor.
 *
 * A path extends while each link's issuer resolves either to a trust
 * anchor (terminal) or to a known parent in the graph edges. An
 * issuer that is an anchor may still continue upward — in federated
 * graphs a fingerprint can be both an anchor and a delegated signer.
 * Cycles are impossible: a parent already on the current path is
 * skipped.
 *
 * @param validateLink optional link validation (e.g., verify the
 *        delegation signature between link and parent); defaults to
 *        structural validity — the parent must be a known parent.
 */
export function findAllPaths(
  artifact: TrustedArtifact,
  bundle: TrustAnchorBundle,
  validateLink?: (link: SignatureChainLink, parentFingerprint: string) => boolean,
): VerificationPath[] {
  const paths: VerificationPath[] = [];
  const valid = validateLink ?? ((link, parent) => link.issuerParents.includes(parent));
  for (const sig of artifact.signatures) {
    extendPath([sig], paths, bundle, valid);
  }
  return paths;
}

function extendPath(
  path: SignatureChainLink[],
  paths: VerificationPath[],
  bundle: TrustAnchorBundle,
  validateLink: (link: SignatureChainLink, parentFingerprint: string) => boolean,
): void {
  const tail = path[path.length - 1];

  const pushPath = (rootAnchor: string) => {
    paths.push({
      root_anchor_fingerprint: rootAnchor,
      path_length: path.length,
      dimensions: [...new Set(path.map((l) => l.dimension).filter(Boolean))] as string[],
    });
  };

  const anchor = bundle.findByFingerprint(tail.issuerFingerprint);
  if (anchor) {
    pushPath(anchor.fingerprint);
  }

  for (const parent of tail.issuerParents) {
    if (path.some((l) => l.subjectFingerprint === parent)) continue;
    if (!validateLink(tail, parent)) continue;

    if (bundle.findByFingerprint(parent)) {
      // The delegation link to this parent terminates at an anchor.
      // Skip when the tail's claimed issuer already recorded it.
      if (parent === tail.issuerFingerprint && anchor) continue;
      path.push({ subjectFingerprint: parent, issuerFingerprint: parent, issuerParents: [] });
      pushPath(parent);
      path.pop();
      continue;
    }

    const parents = bundle.edges.get(parent) ?? [];
    extendPath(
      [...path, { subjectFingerprint: parent, issuerFingerprint: parents[0] ?? "", issuerParents: parents }],
      paths,
      bundle,
      validateLink,
    );
  }
}

/** Root diversity: the count of distinct anchors across paths. */
export function rootDiversity(paths: VerificationPath[]): number {
  return new Set(paths.map((p) => p.root_anchor_fingerprint)).size;
}

/** The strongest (longest) path attesting a given dimension. */
export function strongestPathFor(
  paths: VerificationPath[],
  dimension: string,
): VerificationPath | undefined {
  const candidates = paths.filter((p) => p.dimensions.includes(dimension));
  return candidates.sort((a, b) => b.path_length - a.path_length)[0];
}
