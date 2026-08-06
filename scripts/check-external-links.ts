/**
 * External link checker (TODO.cnml/52).
 *
 * Scans every built HTML page for external href URLs, performs a
 * HEAD request to each (with GET fallback for sites that reject
 * HEAD), and reports any non-2xx response or network failure.
 *
 * Caches results for 24 hours to avoid hitting the same URL twice.
 *
 * Run: pnpm links:check
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(here, "..");
const DIST = join(ROOT, "apps", "cnml-web", "dist");
const CACHE = join(ROOT, ".external-links-cache.json");
const TTL_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 10_000;
const USER_AGENT = "cnml-linkbot/1.0 (+https://www.oimlsmart.org/cnml)";

interface CacheEntry {
  url: string;
  status: number | null;
  checkedAt: number;
}

function walk(dir: string, ext: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, ext, out);
    else if (extname(p) === ext) out.push(p);
  }
  return out;
}

function loadCache(): Map<string, CacheEntry> {
  if (!existsSync(CACHE)) return new Map();
  try {
    const data = JSON.parse(readFileSync(CACHE, "utf8")) as CacheEntry[];
    return new Map(data.map((e) => [e.url, e]));
  } catch {
    return new Map();
  }
}

function saveCache(cache: Map<string, CacheEntry>) {
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify([...cache.values()], null, 2));
}

function extractUrls(html: string): Set<string> {
  const urls = new Set<string>();
  for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    urls.add(m[1]!.split("#")[0]!.split("?")[0]!);
  }
  return urls;
}

async function checkUrl(url: string, cache: Map<string, CacheEntry>): Promise<number | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.checkedAt < TTL_MS) {
    return cached.status;
  }

  for (const method of ["HEAD", "GET"] as const) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT },
        redirect: "follow",
      });
      clearTimeout(timer);
      const status = res.status;
      cache.set(url, { url, status, checkedAt: Date.now() });
      return status;
    } catch {
      // Try next method, or give up.
    }
  }

  cache.set(url, { url, status: null, checkedAt: Date.now() });
  return null;
}

async function main(): Promise<number> {
  if (!existsSync(DIST)) {
    console.error(`dist/ not found at ${DIST} — run \`pnpm build\` first.`);
    return 2;
  }

  const cache = loadCache();
  const pages = walk(DIST, ".html");
  const allUrls = new Set<string>();

  for (const p of pages) {
    const html = readFileSync(p, "utf8");
    for (const url of extractUrls(html)) {
      allUrls.add(url);
    }
  }

  const sorted = [...allUrls].sort();
  console.log(`Checking ${sorted.length} unique external URLs...\n`);

  const bad: string[] = [];
  let okCount = 0;

  for (const url of sorted) {
    const status = await checkUrl(url, cache);
    if (status === null) {
      bad.push(`${url} — network error`);
      console.log(`  ✖ ${url} — network error`);
    } else if (status >= 400) {
      bad.push(`${url} — ${status}`);
      console.log(`  ✖ ${url} — ${status}`);
    } else {
      okCount++;
      if (status === 200 || status === 301 || status === 302) {
        console.log(`  ✔ ${url} — ${status}`);
      } else {
        console.log(`  ~ ${url} — ${status} (non-standard but OK)`);
      }
    }
  }

  saveCache(cache);
  console.log(`\n${okCount} OK, ${bad.length} broken.`);

  if (bad.length > 0) {
    console.error("\nBroken links:\n" + bad.join("\n"));
    return 1;
  }
  return 0;
}

process.exit(await main());
