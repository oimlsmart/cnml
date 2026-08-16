/**
 * Check: dimensional co-signatures (SIGNATIF Phase 2).
 *
 * Enumerates <cnml:coSignature dimension="..."> wrappers, verifies
 * each inner ds:Signature against the same canonical payload as the
 * primary signature, and records one DimensionCoverage entry per
 * verified co-signer into ctx.dimensions for the coverage report.
 *
 * Soft-check semantics: a co-signature is an INDEPENDENT attestation.
 * A broken one does not invalidate the primary data dimension, but
 * it is strong evidence of tampering and downgrades the label to C.
 * Absent co-signatures skip (dimensions are optional coverage).
 */

import * as xmldsig from "xmldsigjs";
import type { Check, CheckResult } from "./types.ts";
import type { DimensionCoverage } from "./coverage.ts";
import { sha256Hex } from "../hash.ts";
import { base64ToBytes } from "../shared/base64.ts";
import { ensureXmldsigEngine } from "../xml/engine.ts";
import { CNML_NS } from "../xml/cosign.ts";
import { readScopeFromCert, isRecommendationInScope } from "../scope.ts";

const DS_NS = "http://www.w3.org/2000/09/xmldsig#";

/** Wrap a base64 DER cert (KeyInfo form) as PEM for scope reading. */
function base64DerToPem(b64: string): string {
  const lines = b64.replace(/\s+/g, "").match(/.{1,64}/g) ?? [];
  return `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----`;
}

export const dimensionsCheck: Check = {
  id: "dimensions",
  label: "6. Dimensional co-signatures",
  run: async (xml, ctx): Promise<CheckResult> => {
    ensureXmldsigEngine();
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const wrappers = Array.from(doc.getElementsByTagNameNS(CNML_NS, "coSignature"));

    if (wrappers.length === 0) {
      return {
        checkId: "dimensions",
        status: "skip",
        reason: "No co-signatures present (single-dimension artifact)",
      };
    }

    ctx.dimensions = ctx.dimensions ?? [];
    const failures: string[] = [];

    for (let i = 0; i < wrappers.length; i++) {
      const dimension = wrappers[i].getAttribute("dimension") ?? "unknown";
      const sigEl = wrappers[i].getElementsByTagNameNS(DS_NS, "Signature")[0];
      if (!sigEl) {
        failures.push(`${dimension}: wrapper has no ds:Signature`);
        continue;
      }

      // Fresh parse per wrapper: the XPath transform strips signature
      // nodes from the tree while computing the digest.
      const freshDoc = new DOMParser().parseFromString(xml, "application/xml");
      const freshSig = freshDoc.getElementsByTagNameNS(CNML_NS, "coSignature")[i]
        .getElementsByTagNameNS(DS_NS, "Signature")[0];

      let valid = false;
      try {
        const signed = new xmldsig.SignedXml(freshDoc);
        signed.LoadXml(freshSig);
        valid = await signed.Verify();
      } catch (e) {
        failures.push(`${dimension}: ${(e as Error).message}`);
        continue;
      }

      if (!valid) {
        failures.push(`${dimension}: co-signature invalid`);
        continue;
      }

      const certEl = freshSig.getElementsByTagNameNS(DS_NS, "X509Certificate")[0];
      let fingerprint = "";
      if (certEl?.textContent) {
        try {
          fingerprint = await sha256Hex(base64ToBytes(certEl.textContent));
        } catch {
          fingerprint = "";
        }

        // The person dimension is a certified tester credential: the
        // tester's scope extension must cover the artifact's
        // Recommendation. A credential without the extension is a
        // legacy credential (consistent with check 4's legacy path).
        if (dimension === "person" && ctx.recommendationId) {
          const scope = await readScopeFromCert(base64DerToPem(certEl.textContent));
          if (scope !== null && !isRecommendationInScope(ctx.recommendationId, scope)) {
            failures.push(
              `person: tester not certified for ${ctx.recommendationId} (certified: ${scope.join(", ")})`,
            );
            continue;
          }
        }
      }

      const entry: DimensionCoverage = {
        dimension,
        source_fingerprint: fingerprint,
        verified: true,
      };
      ctx.dimensions.push(entry);
    }

    if (failures.length > 0) {
      return {
        checkId: "dimensions",
        status: "fail",
        reason: failures.join("; "),
      };
    }

    return {
      checkId: "dimensions",
      status: "pass",
      reason: `${ctx.dimensions.length} co-signature(s) verified: ${
        ctx.dimensions.map((d) => d.dimension).join(", ")
      }`,
    };
  },
};
