/**
 * Revocation propagation (SIGNATIF Phase 4).
 *
 * Revocation reaches measurements. When an authority state (a
 * calibration, an evaluation, a compliance finding) is revoked:
 *
 *   1. identify the revoked state by hash;
 *   2. query the transparency-log state index for artifacts whose
 *      state binding includes that hash;
 *   3. flag each affected artifact as bound-to-revoked;
 *   4. propagate through co-signatures: if any co-signer's state is
 *      revoked, the artifact is flagged.
 *
 * The state index maps state hashes to the log sequences of the
 * artifacts that bound them. The log operator (or a mirror) builds
 * it from the bound states recorded in each logged artifact.
 */

import { bareHash } from "./xml/state-binding.ts";

export interface StateIndexEntry {
  /** Transparency-log sequence of the artifact. */
  sequence: number;
  /** State hashes the artifact bound (any "sha256:" prefix tolerated). */
  bindings: string[];
}

export interface PropagationHit {
  sequence: number;
  /** The revoked state hash that matched this artifact's binding. */
  matched: string;
}

export type StateIndex = Map<string, number[]>;

/** Build the state hash → sequences index from log entries. */
export function buildStateIndex(entries: StateIndexEntry[]): StateIndex {
  const index: StateIndex = new Map();
  for (const entry of entries) {
    for (const binding of entry.bindings) {
      const key = bareHash(binding);
      const seqs = index.get(key) ?? [];
      if (!seqs.includes(entry.sequence)) seqs.push(entry.sequence);
      index.set(key, seqs);
    }
  }
  return index;
}

/**
 * Propagate revocation: every artifact bound to a revoked state hash
 * is returned with the hash it matched.
 */
export function propagate(revokedStateHashes: string[], index: StateIndex): PropagationHit[] {
  const hits: PropagationHit[] = [];
  const seen = new Set<string>();
  for (const revoked of revokedStateHashes) {
    for (const sequence of index.get(bareHash(revoked)) ?? []) {
      const key = `${sequence}:${bareHash(revoked)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ sequence, matched: revoked });
    }
  }
  return hits;
}

/** Whether an artifact's bindings intersect the revoked set. */
export function isBoundToRevoked(
  bindings: { hash: string }[],
  revokedStateHashes: string[],
): { bound: boolean; matched?: string } {
  const revoked = new Set(revokedStateHashes.map(bareHash));
  for (const b of bindings) {
    if (revoked.has(bareHash(b.hash))) {
      return { bound: true, matched: b.hash };
    }
  }
  return { bound: false };
}
