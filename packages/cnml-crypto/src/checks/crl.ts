import type { Check, CheckResult } from "./types.ts";
import { isSerialRevoked, isCrlStale, parseCrl, type Crl } from "../crl.ts";
import { toHex } from "../shared/hex.ts";
import { base64ToBytes } from "../shared/base64.ts";
import { extractStateBindings } from "../xml/state-binding.ts";
import { isBoundToRevoked } from "../revocation.ts";

/** Check 5: CRL revocation status + state-binding propagation.
 *
 * The signing cert (the KeyInfo's first, fed through ctx.trustedCerts
 * by the signature check) names its CRL distribution point as an X.509
 * extension; the check fetches the current CRL there and looks up the
 * cert's serial. Honest postures, never silent:
 *   no CRL DP on the cert  → skip (leg-1/self-signed certs carry none)
 *   CRL fetch fails        → warn (distinct from revoked — a network
 *                            posture, never a verdict)
 *   serial in the CRL      → fail (revoked, with the date + reason)
 *   CRL past nextUpdate    → warn (stale — refresh recommended)
 *   serial absent          → pass
 * `ctx.crlUrl` overrides the DP (tests, an explicit distribution
 * point for deployments whose cert predates the extension).
 *
 * Revocation also propagates through state bindings (SIGNATIF Phase 4):
 * if the artifact's <cnml:stateBinding> includes a hash listed in
 * ctx.revokedStateHashes, the artifact is bound-to-revoked — a hard
 * fail, independent of the cert's own CRL status. */
export const crlCheck: Check = {
  id: "crl",
  label: "5. Not revoked",
  continueOnFail: true,
  run: async (xml, ctx): Promise<CheckResult> => {
    const binding = stateBindingResult(xml, ctx);
    if (binding) return binding;

    const certPem = ctx.trustedCerts?.[0];
    if (!certPem) {
      return {
        checkId: "crl",
        status: "skip",
        reason: "No issuer cert in CNML <ds:KeyInfo> — no CRL to check against",
      };
    }

    let serial: string;
    let crlUrl: string | null = ctx.crlUrl ?? null;
    try {
      const parsed = await readCrlFieldsFromCert(certPem);
      serial = parsed.serial;
      crlUrl = crlUrl ?? parsed.crlUrl;
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `could not read the issuer cert's CRL fields: ${(e as Error).message}`,
      };
    }

    if (!crlUrl) {
      return {
        checkId: "crl",
        status: "skip",
        reason: "the issuer cert names no CRL distribution point (leg-1/self-signed) — revocation is not yet asserted for this chain",
      };
    }

    let crlDer: ArrayBuffer;
    try {
      const res = await fetch(crlUrl);
      if (!res.ok) {
        return {
          checkId: "crl",
          status: "warn",
          reason: `the CRL at ${crlUrl} answered ${res.status} — revocation state unverified (never a verdict)`,
        };
      }
      crlDer = await res.arrayBuffer();
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `the CRL at ${crlUrl} is unreachable: ${(e as Error).message} — revocation state unverified`,
      };
    }

    let crl: Crl;
    try {
      crl = await parseCrl(crlDer);
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `the CRL at ${crlUrl} does not parse: ${(e as Error).message}`,
      };
    }

    const revoked = isSerialRevoked(serial, crl);
    if (revoked) {
      return {
        checkId: "crl",
        status: "fail",
        reason: `certificate revoked on ${revoked.revocationDate.toISOString()} (${revoked.reason ?? "unspecified"})`,
      };
    }
    if (isCrlStale(crl)) {
      // Offline grace period (spec §revocation-offline): a stale CRL
      // within the configured grace window downgrades the label; beyond
      // it, revocation state cannot be asserted and the check fails.
      const graceMs = ctx.crlGracePeriodMs ?? 0;
      const expiredFor = crl.nextUpdate ? Date.now() - crl.nextUpdate.getTime() : 0;
      if (expiredFor > graceMs) {
        return {
          checkId: "crl",
          status: "fail",
          reason: `CRL expired ${(expiredFor / 86_400_000).toFixed(1)} days ago, beyond the ${graceMs / 86_400_000}-day grace period — revocation state cannot be asserted`,
        };
      }
      return {
        checkId: "crl",
        status: "warn",
        reason: "CRL is past its nextUpdate but within the offline grace period — accepted at a downgraded label",
      };
    }
    return { checkId: "crl", status: "pass" };
  },
};

/** Bound-to-revoked when any bound state hash is revoked (hard fail). */
function stateBindingResult(
  xml: string,
  ctx: { revokedStateHashes?: string[] },
): CheckResult | null {
  if (!ctx.revokedStateHashes?.length) return null;
  const states = extractStateBindings(xml);
  if (states.length === 0) return null;
  const { bound, matched } = isBoundToRevoked(states, ctx.revokedStateHashes);
  if (!bound) return null;
  const state = states.find((s) => s.hash === matched);
  return {
    checkId: "crl",
    status: "fail",
    reason: `artifact is bound to revoked state ${state?.type ?? "unknown"} (${matched})`,
  };
}

/** The serial + CRL distribution point off a PEM cert (pkijs). The
 *  serial is the uppercase-hex form isSerialRevoked expects (padded to
 *  even length — bigIntToHex's own discipline). */
export async function readCrlFieldsFromCert(certPem: string): Promise<{ serial: string; crlUrl: string | null }> {
  const asn1js = await import("asn1js");
  const pkijs = await import("pkijs");
  const b64 = certPem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
  const der = base64ToBytes(b64).buffer;
  const parsed = asn1js.fromBER(der);
  if (parsed.offset === -1 || !parsed.result) {
    throw new Error(`the issuer cert is not a well-formed X.509 (DER parse failed at byte ${-parsed.offset})`);
  }
  const cert = new pkijs.Certificate({ schema: parsed.result });

  const serialBytes: Uint8Array | undefined = cert.serialNumber.valueBlock.valueHexView;
  const rawBytes = serialBytes && serialBytes.length > 1 && serialBytes[0] === 0 ? serialBytes.slice(1) : serialBytes ?? new Uint8Array();
  const raw = toHex(rawBytes).toUpperCase();
  const serial = raw.length % 2 === 0 ? raw : "0" + raw;

  let crlUrl: string | null = null;
  for (const ext of cert.extensions?.extensions ?? []) {
    if (ext.extnID !== "2.5.29.31") continue; // cRLDistributionPoints
    // The extension value contains URIs; read them out of the raw
    // bytes (the DP form the CA's factory writes: "URI:<url>").
    const text = new TextDecoder().decode(ext.extnValue.valueBlock.valueHexView ?? new Uint8Array());
    const match = /URI:([^\s,]+)/.exec(text) ?? /(https?:\/\/[^\s,]+)/.exec(text);
    if (match) crlUrl = match[1]!;
  }
  return { serial, crlUrl };
}
