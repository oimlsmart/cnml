// AUTO-GENERATED from _units_local.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

/**
 * Compound and count units used in OIML certificates that are NOT in the
 * upstream unitsdb. Each entry follows unitsdb's schema pattern (root_units
 * composition with prefix_reference/unit_reference/power) so it can be
 * upstreamed verbatim when stable.
 * 
 * Per-Recommendation schemas (R<NN>.yaml) reference these via the `unit:`
 * field on StructuredValue. The unit_id values here are namespaced as
 * `u:<name>` to match unitsdb convention.
 * 
 * Loaded via the `unitsdb` Ruby gem at runtime, so the gem's full API
 * (Database.from_db, find_by_symbol, root_units composition) works for
 * these local entries too.
 * 
 */
export type UnitsLocal = unknown;
