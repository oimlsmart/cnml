import type { Check, CheckResult } from "./types.ts";

/** Check 2: CNML schema validity. Parses via parseCnmlXml and runs
 *  ajv validation against the per-R schema (looked up by recommendation
 *  id from the parsed cert). Sets ctx.parsedCert and ctx.recommendationId
 *  for downstream checks.
 *
 *  Falls back to "parseable only" if ajv isn't loaded or the schema
 *  can't be resolved. */
export const schemaValidCheck: Check = {
  id: "schema-valid",
  label: "2. CNML schema valid",
  run: async (xml, ctx): Promise<CheckResult> => {
    const { parseCnmlXml } = await import("@cnml/cnml-xml");
    let parsed: unknown;
    try {
      parsed = parseCnmlXml(xml);
    } catch (e) {
      return {
        checkId: "schema-valid",
        status: "fail",
        reason: `Not a CNML document: ${(e as Error).message}`,
      };
    }
    ctx.parsedCert = parsed;
    const rId = (parsed as any)?.recommendation?.id;
    ctx.recommendationId = rId;

    // Schema validation requires the per-R schema + ajv. Both are
    // loaded lazily so the verify page works even if ajv isn't bundled.
    if (!rId) {
      return {
        checkId: "schema-valid",
        status: "warn",
        reason: "Parsed CNML but found no <recommendation><id> — cannot select schema",
      };
    }
    try {
      const { getRecommendation } = await import("@cnml/cnml-schemas");
      const { validateAgainstSchema } = await import("@cnml/cnml-xml/validate");
      const rec = getRecommendation(rId);
      if (!rec?.schema) {
        return {
          checkId: "schema-valid",
          status: "warn",
          reason: `No schema registered for ${rId}`,
        };
      }
      const result = validateAgainstSchema(parsed, rec.schema);
      if (result.valid) {
        return { checkId: "schema-valid", status: "pass" };
      }
      const firstError = result.errors[0];
      return {
        checkId: "schema-valid",
        status: "fail",
        reason: `${result.errors.length} schema error(s); first: ${firstError?.path ?? ""} ${firstError?.message ?? ""}`,
        details: result.errors,
      };
    } catch (e) {
      // ajv not yet wired or schema bundle missing — degrade gracefully.
      return {
        checkId: "schema-valid",
        status: "warn",
        reason: `Schema validation unavailable (${(e as Error).message}); CNML parsed OK`,
      };
    }
  },
};
