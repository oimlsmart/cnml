// ESLint flat config (TODO.cnml/50).
// Uses @eslint/js recommended + typescript-eslint recommended.
// Lenient initially: most rules warn, not error, so CI doesn't
// break on existing code. Tighten to error in a follow-up once
// the codebase is clean.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/*.config.{js,mjs,cjs}",
      "apps/cnml-web/dist/**",
      "packages/cnml-types/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      // TypeScript's own checker catches undefined identifiers;
      // no-undef false-positives on TS-specific syntax and DOM/node
      // globals in the mixed monorepo.
      "no-undef": "off",
    },
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        // The intentional-omit destructure idiom (rest-exclusion):
        // const { x: _omit, ...rest } = obj.
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // CLI tooling: console is the interface (build scripts, smoke
  // tests, generators, verifiers). Last so it wins over the
  // catch-all above.
  {
    files: ["scripts/**", "packages/cnml-test-vectors/src/generate-vectors.ts", "packages/cnml-test-vectors/src/verify-vectors.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
