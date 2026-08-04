import type { Check, CheckResult } from "./types.ts";

/** The digest contract (TODO.ops/15): sha256 over the ER entity's
 *  canonical JSON, hex-encoded, algorithm-prefixed. The same pattern the
 *  per-rec schemas pin on EvaluationReportRef.digest. */
const DIGEST_PATTERN = /^sha256:[0-9a-f]{64}$/;

interface EvaluationReportRefLike {
  id?: unknown;
  date?: unknown;
  digest?: unknown;
}

/** Check 6: the evaluation-report binding (TODO.ops/15).
 *
 * The certificate cryptographically binds its Evaluation Report — the
 * digest lives INSIDE the signed payload, so a verified signature covers
 * it. This check asserts the binding's presence and well-formedness:
 *   binding present + well-formed → pass (the ER id + digest named)
 *   binding present + malformed   → fail (a broken binding is a defect,
 *                                     never a skip)
 *   binding absent                → skip (pre-leg certificate — the
 *                                     honest migration posture, never a
 *                                     fake pass)
 * The semantic half — "does this digest match MY Evaluation Report" — is
 * the verifier's own recompute over the ER entity it holds; this check
 * proves the document carries a well-formed commitment to recompute
 * against.
 *
 * Reads ctx.parsedCert when the schema check already parsed (the
 * pipeline path); parses the XML itself standalone. */
export const erBindingCheck: Check = {
  id: "er-binding",
  label: "6. Evaluation report bound",
  continueOnFail: true,
  run: async (xml, ctx): Promise<CheckResult> => {
    let er: EvaluationReportRefLike | undefined;
    if (ctx.parsedCert && typeof ctx.parsedCert === "object") {
      er = (ctx.parsedCert as { evaluation_report?: EvaluationReportRefLike }).evaluation_report;
    } else {
      try {
        const { parseCnmlXml } = await import("@cnml/cnml-xml");
        er = parseCnmlXml(xml).evaluation_report;
      } catch (e) {
        return {
          checkId: "er-binding",
          status: "warn",
          reason: `could not parse the document to look for the ER binding: ${(e as Error).message}`,
        };
      }
    }

    if (er === undefined || er === null) {
      return {
        checkId: "er-binding",
        status: "skip",
        reason: "no ER binding — a pre-leg certificate issued before the evaluation-report digest entered the signed payload (TODO.ops/15); the ER chain of custody is asserted out of band",
      };
    }

    if (typeof er.id !== "string" || er.id.length === 0) {
      return {
        checkId: "er-binding",
        status: "fail",
        reason: "the ER binding carries no evaluation-report id — a broken binding is a defect, never a skip",
      };
    }
    if (typeof er.digest !== "string" || !DIGEST_PATTERN.test(er.digest)) {
      return {
        checkId: "er-binding",
        status: "fail",
        reason: `the ER binding's digest is malformed (expected sha256:<64 hex>, got ${JSON.stringify(er.digest ?? null)}) — a broken binding is a defect, never a skip`,
      };
    }
    return {
      checkId: "er-binding",
      status: "pass",
      reason: `evaluation report ${er.id} bound at ${er.digest} — recompute over the held ER to confirm the chain of custody`,
    };
  },
};
