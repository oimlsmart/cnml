// AUTO-GENERATED from _units.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

export type Units = unknown;

/**
 * Structured unit reference. Composed of a unitsml unit_id (closed enum
 * from unitsdb/units.yaml), an optional SI prefix (closed enum from
 * unitsdb/prefixes.yaml), and optional application qualifiers
 * (current_type, pressure_reference) that are not unitsdb concepts.
 * 
 */
export interface Unit {
  /**
   * Canonical unitsml unit identifier (e.g. u:meter, u:volt).
   */
  "unit_id"?: ;
  /**
   * SI prefix from unitsdb/prefixes.yaml (e.g. p:milli). Null if none.
   */
  "prefix"?: (string | null);
  /**
   * Electrical current qualifier — for AC vs DC of voltage/ampere units.
   */
  "current_type"?: "AC" | "DC" | null;
  /**
   * Pressure reference qualifier — gauge / absolute / differential.
   */
  "pressure_reference"?: "gauge" | "absolute" | "differential" | null;
}

/**
 * Physical quantity from unitsdb/quantities.yaml.
 */
export interface Quantity {
  /**
   * Canonical unitsml quantity identifier (e.g. q:length).
   */
  "quantity_id"?: string;
  /**
   * Reference to a unitsml dimension (e.g. NISTd1).
   */
  "dimension_id"?: string;
}
