// ESLint flat config (TODO.cnml/50).
// Uses @eslint/js recommended + typescript-eslint recommended.
// Lenient initially: most rules warn, not error, so CI doesn't
// break on existing code. Tighten to error in a follow-up once
// the codebase is clean.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

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
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
