/**
 * State binding: hash-binding artifacts to the authority states they
 * depend on (SIGNATIF Phase 4).
 *
 * An artifact binds the states it was produced under — the
 * calibration state of the instrument, the evaluation report state,
 * the compliance state of the model — by hash. The binding is part
 * of the canonical payload: every signer (primary and co-signers)
 * attests the bound states.
 *
 * When a state is revoked, revocation propagates: every artifact
 * whose binding includes that hash is flagged bound-to-revoked, and
 * every measurement produced under such an artifact inherits the
 * flag (revocation.ts).
 */

import { sha256Hex } from "../hash.ts";

export const CNML_NS = "https://oimlsmart.org/schemas/cnml/1.0";

/** A state referenced by an artifact: its type and SHA-256 hash. */
export interface BoundState {
  type: string;
  /** "sha256:<hex>" form as carried in the XML. */
  hash: string;
}

/** Input to embedding: the state's type and its raw content. */
export interface StateInput {
  type: string;
  data: Uint8Array | string;
}

/**
 * Insert <cnml:stateBinding> into the CNML root as the last child.
 *
 * Call BEFORE signing: the binding is part of the canonical payload,
 * so every signature covers it.
 */
export async function embedStateBinding(xml: string, states: StateInput[]): Promise<string> {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;

  const binding = doc.createElementNS(CNML_NS, "cnml:stateBinding");
  for (const state of states) {
    const bytes = typeof state.data === "string" ? new TextEncoder().encode(state.data) : state.data;
    const el = doc.createElementNS(CNML_NS, "cnml:boundState");
    el.setAttribute("type", state.type);
    el.setAttribute("hash", `sha256:${await sha256Hex(bytes)}`);
    binding.appendChild(el);
  }
  root.appendChild(binding);

  return new XMLSerializer().serializeToString(doc);
}

/** Extract the artifact's bound states from its XML. */
export function extractStateBindings(xml: string): BoundState[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const wrappers = Array.from(doc.getElementsByTagNameNS(CNML_NS, "stateBinding"));
  const states: BoundState[] = [];
  for (const wrapper of wrappers) {
    for (const el of Array.from(wrapper.getElementsByTagNameNS(CNML_NS, "boundState"))) {
      const type = el.getAttribute("type");
      const hash = el.getAttribute("hash");
      if (type && hash) states.push({ type, hash });
    }
  }
  return states;
}

/** Normalize a state hash to its bare hex form for index lookups. */
export function bareHash(hash: string): string {
  return hash.replace(/^sha256:/, "").toLowerCase();
}
