import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Vitest config (TODO 35). Uses the plain Vite Vue plugin (not
// @astrojs/vue, which has Astro-specific behavior). happy-dom
// provides the DOM, fake-indexeddb is wired in vitest.setup.ts.
//
// Vitest only runs files matching `src/**/*.vitest.ts`. The
// existing `src/lib/*.test.ts` files use node:test (they need
// `import.meta.env` and friends that are awkward to set up under
// Vitest), and are excluded via the `exclude` glob.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.vitest.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
