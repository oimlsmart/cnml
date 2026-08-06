/**
 * Pages Function: /passport/[certid].json (ADR-0002, TODO.cnml/63).
 *
 * Serves the JSON-LD passport document. Two strategies:
 *
 *   1. Live (when CNML_CERT_INDEX KV is configured). Look up the
 *      cert id in the KV namespace; if found, return the live
 *      document.
 *   2. Static fallback (always). Read the JSON-LD file that the
 *      Astro build produced at /passport/[certid].json. Return it
 *      with the right Content-Type.
 *
 * The static fallback keeps the endpoint functional during the
 * pilot phase (before the transparency log exists). The KV path
 * takes over the moment the log is live, with zero change to the
 * caller.
 *
 * The Pages Function is invoked on Cloudflare Pages. On GitHub
 * Pages (warm standby until ADR-0002 cutover), the static file at
 * /passport/[certid].json is served directly.
 */

interface PagesEnv {
  CNML_CERT_INDEX?: KVNamespace;
}

interface PassportCacheEntry {
  body: string;
  cachedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, PassportCacheEntry>();

export const onRequest: PagesFunction<PagesEnv> = async (context) => {
  const certid = context.params.certid as string | undefined;
  if (!certid) {
    return new Response(JSON.stringify({ error: "missing certid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Strategy 1: live KV lookup.
  if (context.env.CNML_CERT_INDEX) {
    try {
      const live = await context.env.CNML_CERT_INDEX.get(`cert:${certid}`);
      if (live) {
        return jsonResponse(live);
      }
    } catch {
      // KV error — fall through to the static file. Logged but
      // not surfaced; the static file is the contract.
    }
  }

  // Strategy 2: static fallback. The Astro build produced this
  // file at /passport/[certid].json under the dist root. Cloudflare
  // Pages serves it as a static asset; we re-read it to set the
  // right Content-Type and CORS header.
  const cached = cache.get(certid);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return jsonResponse(cached.body);
  }

  // The Pages asset binding is not available inside the Function
  // runtime. We fetch the static asset via the request URL.
  const assetUrl = new URL(`/passport/${certid}.json`, context.request.url).toString();
  const assetResponse = await context.env.ASSETS?.fetch(assetUrl) ?? await fetch(assetUrl);
  if (assetResponse.ok) {
    const body = await assetResponse.text();
    cache.set(certid, { body, cachedAt: Date.now() });
    return jsonResponse(body);
  }

  return new Response(
    JSON.stringify({
      "@context": "https://www.oimlsmart.org/cnml/passport/v1",
      error: "certificate not found",
      certificateId: certid,
    }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/ld+json; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};

function jsonResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
