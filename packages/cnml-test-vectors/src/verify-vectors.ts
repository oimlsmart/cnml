import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

globalThis.self = globalThis;
globalThis.window = globalThis;
import "./_node-polyfills.ts";
import { verifyCnmlXml } from "../../cnml-crypto/src/index.ts";

const dir = path.resolve(fileURLToPath(import.meta.url), "../vectors");
const files = readdirSync(dir).filter((f) => f.endsWith(".cnml.xml"));

let pass = 0, fail = 0;
for (const f of files.sort()) {
  const xml = readFileSync(path.join(dir, f), "utf8");
  const r = await verifyCnmlXml(xml);
  if (r.signatureValid) {
    console.log(`✓ ${f}: valid (chain: ${r.certificateChain.length} cert(s))`);
    pass++;
  } else {
    console.log(`✗ ${f}: ${r.reason}`);
    fail++;
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
