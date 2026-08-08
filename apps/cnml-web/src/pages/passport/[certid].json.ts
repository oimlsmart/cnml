import type { APIRoute } from "astro";
import {
  passportDocumentFor,
  PASSPORT_CONTEXT,
  PASSPORT_TYPE,
} from "../../lib/passport";
import { DEFAULT_DEMO_CERT_ID, demoStaticPaths } from "../../lib/demo-instances";

export const prerender = true;

export { demoStaticPaths as getStaticPaths };

export const GET: APIRoute = ({ params }) => {
  const certId = (params.certid as string | undefined) ?? DEFAULT_DEMO_CERT_ID;
  const doc = passportDocumentFor(certId, new Date().toISOString());
  return new Response(JSON.stringify(doc, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      // Cross-origin reads so market-surveillance apps and SMART
      // instrument twins can fetch the document from a browser.
      "Access-Control-Allow-Origin": "*",
      // Help clients confirm the shape without parsing first.
      "X-Passport-Context": PASSPORT_CONTEXT,
      "X-Passport-Type": PASSPORT_TYPE,
    },
  });
};
