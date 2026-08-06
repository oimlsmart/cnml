import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import yaml from '@rollup/plugin-yaml';
import { visualizer } from 'rollup-plugin-visualizer';

// Bundle analysis: emit dist/stats.html when ANALYZE=1.
// Default off so production builds stay clean for the link audit.
//   ANALYZE=1 pnpm build  →  see dist/stats.html
const ANALYZE = process.env.ANALYZE === '1';

export default defineConfig({
  // The CNML site deploys to www.oimlsmart.org/cnml/ (GitHub Pages path
  // under the OIML SMART org site). The base path is /cnml/ so all
  // internal links, QR code payloads, and passport URLs resolve under
  // that prefix. See TODO.cnml/01-design-system-adoption.md.
  site: 'https://www.oimlsmart.org',
  base: '/cnml/',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => {
        // Exclude interactive app pages: they are tools, not search targets.
        const excluded = [
          '/cnml/keys',
          '/cnml/csr',
          '/cnml/verify',
          '/cnml/create',
          '/cnml/issue/',
          '/cnml/passport/',
        ];
        return !excluded.some((p) => page.includes(p));
      },
    }),
  ],
  // Prefetch links on hover. The strategy is the right default for
  // a docs-heavy site: hovering a prev/next link or a nav entry
  // triggers the fetch, so the click is instant. The viewport
  // strategy would prefetch every link in the initial viewport,
  // which is wasteful for the docs nav (6+ entries).
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  // Disable the dev toolbar — it injects buttons + checkboxes that
  // interfere with e2e tests (Playwright picks them up instead of the
  // actual island UI).
  devToolbar: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
      yaml(),
      ANALYZE && visualizer({
        filename: 'dist/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
    ].filter(Boolean),
    // CRITICAL: Pre-bundle ONLY npm packages here. Workspace packages
    // that import .yaml (cnml-schemas) or .ts files must NOT be in this
    // list — esbuild (which handles optimizeDeps) can't process them,
    // and one failure silently drops the entire batch. That makes every
    // other entry (xmldsigjs, pkijs, asn1js) fail to pre-bundle, which
    // surfaces as "Importing a module script failed" in the browser.
    optimizeDeps: {
      include: [
        "vue",
        "marked",
        "xmldsigjs",
        "pkijs",
        "asn1js",
        "@xmldom/xmldom",
      ],
      // Workspace packages are excluded from esbuild pre-bundling — Vite
      // processes them through the regular plugin pipeline (YAML plugin
      // for cnml-schemas, TS transform for the rest).
      exclude: [
        "@oiml/cnml-schemas",
        "@oiml/cnml-xml",
        "@oiml/cnml-crypto",
        "@oiml/cnml-units",
        "@oiml/cnml-dcoc",
        "@oiml/ptb-dcc-compat",
      ],
      esbuildOptions: {
        target: "esnext",
      },
    },
    server: {
      preTransformRequests: true,
    },
    build: {
      target: "esnext",
      // @confium/confium-wasm is loaded lazily at runtime via dynamic
      // import() in packages/cnml-crypto/src/confium-wasm.ts. It is an
      // optional dependency (the verifier degrades silently when it is
      // absent). Mark it external so the build does not try to resolve
      // it at build time — the loader handles its own failure modes.
      rolldownOptions: {
        external: ["@confium/confium-wasm"],
      },
    },
  },
});
