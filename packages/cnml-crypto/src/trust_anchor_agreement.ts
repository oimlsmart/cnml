/**
 * Cross-channel trust anchor agreement (TODO 44).
 *
 * Defends against CDN compromise, DNS spoofing, or any single-channel
 * attack on trust anchor distribution. Fetches the anchor set from
 * multiple independent channels and requires 2-of-3 agreement before
 * accepting any anchor as trusted.
 *
 * Channels:
 *   1. Static asset (trust-anchors.json from the CNML web app CDN)
 *   2. Transparency log lookup (tlog.cnml.oiml.org)
 *   3. Independent mirror (NIST or PTB)
 *
 * Plus an optional 4th "print" channel that the user enters manually
 * from the BIML Annual Report (offline cross-check).
 *
 * @see TODO.roadmap/44-trust-anchor-bootstrap.md
 */

import {
  loadTrustAnchors,
  validateTrustAnchorSet,
  currentRoot,
  TrustAnchorError,
  type TrustAnchorSet,
} from "./trust_anchor.ts";

/** A single channel + its fetched anchor set (or error). */
export interface ChannelResult {
  readonly channel: ChannelId;
  readonly ok: boolean;
  readonly set?: TrustAnchorSet;
  readonly error?: string;
}

/** The four supported channels. */
export type ChannelId = "static-asset" | "transparency-log" | "mirror" | "print-manual";

/** Configuration for cross-channel agreement. */
export interface AgreementConfig {
  /** Required number of agreeing channels (default: 2). */
  readonly required?: number;
  /** Static asset URL (default: /trust-anchors.json). */
  readonly staticAssetUrl?: string;
  /** Transparency log URL (default: https://tlog.cnml.oiml.org/anchors/current.json). */
  readonly transparencyLogUrl?: string;
  /** Mirror URL (default: https://tlog.nist.gov/anchors/current.json). */
  readonly mirrorUrl?: string;
  /** Manual print fingerprint (from BIML Annual Report). */
  readonly printFingerprint?: string;
}

/** Result of an agreement check. */
export interface AgreementResult {
  readonly agreed: boolean;
  readonly agreedRootFingerprint: string | null;
  readonly channelResults: readonly ChannelResult[];
  readonly reason?: string;
}

const DEFAULT_TRANSPARENCY_LOG_URL = "https://tlog.cnml.oiml.org/anchors/current.json";
const DEFAULT_MIRROR_URL = "https://tlog.nist.gov/anchors/current.json";

/**
 * Fetch trust anchor sets from all configured channels in parallel,
 * then check whether the root fingerprints agree across at least
 * `required` channels.
 *
 * Network failures don't crash — they're recorded as failed channel
 * results. The agreement check proceeds on whatever channels succeeded.
 *
 * @returns AgreementResult with per-channel breakdown
 */
export async function checkCrossChannelAgreement(
  config: AgreementConfig = {},
): Promise<AgreementResult> {
  const required = config.required ?? 2;
  const channels: ChannelId[] = ["static-asset", "transparency-log", "mirror"];
  if (config.printFingerprint) channels.push("print-manual");

  const results = await Promise.all(
    channels.map(channel => fetchFromChannel(channel, config)),
  );

  // Collect successful root fingerprints
  const fingerprintsByChannel = new Map<ChannelId, string>();
  for (const r of results) {
    if (r.ok && r.set) {
      const root = currentRoot(r.set);
      if (root) fingerprintsByChannel.set(r.channel, root.fingerprintSha256);
    }
  }
  if (config.printFingerprint && !fingerprintsByChannel.has("print-manual")) {
    fingerprintsByChannel.set("print-manual", config.printFingerprint);
  }

  // Count agreement per fingerprint
  const countsByFingerprint = new Map<string, ChannelId[]>();
  for (const [channel, fp] of fingerprintsByChannel) {
    const arr = countsByFingerprint.get(fp) ?? [];
    arr.push(channel);
    countsByFingerprint.set(fp, arr);
  }

  // Find any fingerprint with at least `required` agreeing channels
  let agreedFp: string | null = null;
  let maxCount = 0;
  for (const [fp, channels_] of countsByFingerprint) {
    if (channels_.length > maxCount) {
      maxCount = channels_.length;
      if (channels_.length >= required) agreedFp = fp;
    }
  }

  if (!agreedFp) {
    return {
      agreed: false,
      agreedRootFingerprint: null,
      channelResults: results,
      reason: maxCount === 0
        ? "no channel returned a valid anchor set"
        : `channel disagreement: best fingerprint agreed by ${maxCount} channel(s), need ${required}`,
    };
  }

  return {
    agreed: true,
    agreedRootFingerprint: agreedFp,
    channelResults: results,
  };
}

async function fetchFromChannel(
  channel: ChannelId,
  config: AgreementConfig,
): Promise<ChannelResult> {
  switch (channel) {
    case "static-asset":
      return tryLoad(config.staticAssetUrl ?? "/trust-anchors.json", "static-asset");
    case "transparency-log":
      return tryLoad(config.transparencyLogUrl ?? DEFAULT_TRANSPARENCY_LOG_URL, "transparency-log");
    case "mirror":
      return tryLoad(config.mirrorUrl ?? DEFAULT_MIRROR_URL, "mirror");
    case "print-manual":
      if (!config.printFingerprint) {
        return { channel, ok: false, error: "no print fingerprint provided" };
      }
      return { channel, ok: true };  // print channel doesn't return a full set
  }
}

async function tryLoad(url: string, channel: ChannelId): Promise<ChannelResult> {
  try {
    const set = await loadTrustAnchors({ url });
    return { channel, ok: true, set };
  } catch (e) {
    return {
      channel,
      ok: false,
      error: e instanceof TrustAnchorError ? `${e.reason}: ${e.message}` : (e as Error).message,
    };
  }
}

/**
 * Manually verify a printed fingerprint against a fetched anchor set.
 * Used in air-gapped or paranoid deployments where the operator
 * has the BIML Annual Report (print) in front of them.
 */
export function verifyAgainstPrintFingerprint(
  set: TrustAnchorSet,
  printFingerprint: string,
): boolean {
  const root = currentRoot(set);
  if (!root) return false;
  return root.fingerprintSha256.toLowerCase() === printFingerprint.toLowerCase();
}
