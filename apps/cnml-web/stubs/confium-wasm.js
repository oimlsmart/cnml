/**
 * Stub for @confium/confium-wasm when the package is not installed.
 *
 * The real package is an optional dependency (not installed in the
 * public build). This stub is mapped via Vite's resolve.alias so that
 * the dynamic import in confium-wasm.ts resolves to an empty module.
 * The runtime catch in doLoad() surfaces "package-missing" to callers.
 *
 * When the real package IS installed (director ceremonies, IA signing),
 * the resolve.alias is overridden in the consuming app's Vite config.
 */

export default {};
