// AUTO-GENERATED from _core.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

/**
 * Document-level metadata fields that appear in every certificate regardless
 * of Recommendation. Characteristics live in `_modules/<theme>.yaml`
 * (cross-cutting) or `R<NN>.yaml` (Recommendation-specific).
 * 
 * Conventions:
 * - Missing fields are ABSENT, never null. Use `required:` to enforce presence.
 * - Not-applicable values use the canonical sentinel `"N/A"`, never null.
 * - `additionalProperties: false` everywhere. No free-form slots.
 * 
 */
export type CoreCertificate = {

};

/**
 * Canonical sentinel for "not applicable" values. Stored as the literal string "N/A".
 */
export type NA = "N/A";

/**
 * A single scalar value — number, string, boolean, or the N/A sentinel.
 * Use this for fields that hold a single piece of data with no range.
 * 
 */
export type ScalarValue = ("N/A" | number | boolean | string);

/**
 * A min/max range with both bounds required (use N/A for open-ended).
 */
export interface RangeValue {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
}

/**
 * A list of scalar values (e.g. multi-accuracy-class instruments).
 */
export type ListValue = (number | string)[];

/**
 * A variant-keyed map of scalar values. Used when a value varies by
 * sub-variant, weight range, or configuration condition (e.g.
 * {lightweight_variant: 70, mid_range_variant: 50} or
 * {"20-50g": 31, "50-80g": 35}). Keys are arbitrary descriptive
 * labels; values are scalars, null, or nested ranges. Excludes min/max
 * keys (those are RangeValue).
 * 
 */
export interface MapValue {
  "min"?: unknown;
  "max"?: unknown;
  [key: string]: (number | string | boolean | (unknown | null) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
});
}

/**
 * The canonical value union. Every characteristic's `value` field is one of:
 * - A scalar (number, string, boolean)
 * - The N/A sentinel
 * - A min/max range
 * - A list of scalars (multi-value, e.g. multi-class accuracy)
 * - A variant-keyed map of scalars (e.g. per-weight-range values)
 * 
 */
export type Value = (("N/A" | number | boolean | string) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
} | (number | string)[] | {
  "min"?: unknown;
  "max"?: unknown;
  [key: string]: (number | string | boolean | (unknown | null) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
});
});

/**
 * Legacy alias for Value.
 */
export type ValueOrScalar = (("N/A" | number | boolean | string) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
} | (number | string)[] | {
  "min"?: unknown;
  "max"?: unknown;
  [key: string]: (number | string | boolean | (unknown | null) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
});
});

/**
 * Structured unit reference. The unit_id is the canonical unitsml identifier
 * (closed enum from _units.yaml). Prefix, current_type, and reference
 * qualify the unit when applicable (e.g. kV AC, bar(g)).
 * 
 */
export interface Unit {
  "unit_id"?: string;
  /**
   * Unitsml SI prefix (e.g. p:milli), or null.
   */
  "prefix"?: (string | null);
  /**
   * Electrical current qualifier (AC/DC).
   */
  "current_type"?: "AC" | "DC" | null;
  /**
   * Pressure reference qualifier (R117/R139/R137).
   */
  "reference"?: "gauge" | "absolute" | "differential" | null;
}

/**
 * Canonical characteristic value with separated value, unit, and footnote
 * markers. Every characteristic in every R schema is a StructuredValue.
 * 
 */
export interface StructuredValue {
  "value"?: (("N/A" | number | boolean | string) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
} | (number | string)[] | {
  "min"?: unknown;
  "max"?: unknown;
  [key: string]: (number | string | boolean | (unknown | null) | {
  "min": ("N/A" | number | string);
  "max": ("N/A" | number | string);
});
});
  "unit"?: ({
  "unit_id"?: string;
  /**
   * Unitsml SI prefix (e.g. p:milli), or null.
   */
  "prefix"?: (string | null);
  /**
   * Electrical current qualifier (AC/DC).
   */
  "current_type"?: "AC" | "DC" | null;
  /**
   * Pressure reference qualifier (R117/R139/R137).
   */
  "reference"?: "gauge" | "absolute" | "differential" | null;
} | "N/A" | (unknown | null));
  /**
   * Display surface form (round-trip fidelity only; canonical reference is `unit`).
   */
  "unit_symbol"?: (string | null);
  /**
   * Flat unitsml unit ID (legacy field; migrate to `unit.unit_id`).
   */
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  /**
   * Symmetric tolerance (e.g. 0.002 for 2.000±0.002).
   */
  "tolerance"?: number;
  "tolerance_type"?: "absolute" | "relative";
  /**
   * Classifier for non-SI units (e.g. "custom_count" for OIML-specific counts like divisions/digits).
   */
  "_unit_kind"?: string;
  /**
   * Reviewer note flagging suspected extraction errors or unusual values.
   */
  "_note"?: string;
  /**
   * Additional qualifier preserved from source unit (e.g. "optional", "square_wave", "for_greater_loads").
   */
  "_qualifier"?: string;
  /**
   * Electrical current qualifier extracted from unit_symbol (e.g. V AC square wave yields current_type=AC).
   */
  "current_type"?: "AC" | "DC" | "AC_DC";
}

/**
 * Certificate identification.
 */
export interface Certificate {
  "number": string;
  "scheme": "A" | "B";
  "project_number"?: string | number;
  "page_total"?: number;
  "member_state"?: string;
  "date_issued"?: string;
  "oiml_issuer_id": string;
}

/**
 * Body that issued the certificate.
 */
export interface IssuingAuthority {
  "name": string;
  "address_lines"?: string[];
  "person_responsible"?: string;
  "person_title"?: string;
  "phone"?: string;
  "fax"?: string;
  "email"?: string;
  "website"?: string;
  "oiml_issuer_id"?: string;
}

/**
 * Applicant or manufacturer.
 */
export interface Party {
  "name": string;
  "address_lines"?: string[];
}

export type PartyList = {
  "name": string;
  "address_lines"?: string[];
}[];

export interface TestReport {
  "id": string;
  "date"?: string;
  "pages"?: number;
  "role"?: ("type_evaluation_report" | "test_report" | "documentation_file" | "evaluation_report" | "pattern_evaluation_checklist" | "pattern_evaluation_report" | "N/A");
}

export type TestReportList = {
  "id": string;
  "date"?: string;
  "pages"?: number;
  "role"?: ("type_evaluation_report" | "test_report" | "documentation_file" | "evaluation_report" | "pattern_evaluation_checklist" | "pattern_evaluation_report" | "N/A");
}[];

export interface RevisionEntry {
  "revision": string;
  "date": string;
  "changes": string;
}

export type RevisionHistory = {
  "revision": string;
  "date": string;
  "changes": string;
}[];

export interface ModelVariant {
  "model_id": string;
  "label"?: (string | null);
  "attributes"?: {

};
}

export interface ModelFamily {
  "family_name"?: (string | null);
  /**
   * Model variants. Accepts null, an array of ModelVariant objects,
   * or an array of bare model ID strings (pre-normalization form).
   * 
   */
  "models"?: ((unknown | null) | {
  "model_id": string;
  "label"?: (string | null);
  "attributes"?: {

};
}[] | string[]);
}

/**
 * Software identification. Accepts multiple forms observed in cert data:
 * - Single version string ("V1.xxx")
 * - Structured object {version_number, checksum}
 * - Array of board entries [{board, firmware_version, hash_code}, ...]
 * - StructuredValue wrapping any of the above (with footnote_markers)
 * 
 */
export type SoftwareIdentification = (string | {
  "version_number"?: string;
  "checksum"?: string;
} | {
  "board"?: string;
  "firmware_version"?: string;
  "hash_code"?: string;
}[] | {
  "value"?: (string | {

} | unknown[]);
  "footnote_markers"?: string[];
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
});

export interface Component {
  "role": string;
  "type_designations"?: string[];
  "alternatives"?: "OR" | "AND";
  /**
   * Component-specific attributes. Accepts either:
   * - A map of {label: StructuredValue} (canonical form), or
   * - An array of {attribute, value, unit_symbol?} entries
   *   (extraction form — normalize to map for downstream consumers).
   * 
   */
  "characteristics"?: ({

} | {

}[]);
}

export interface Footnote {
  "marker": string;
  "text": string;
}

export type FootnoteList = {
  "marker": string;
  "text": string;
}[];

/**
 * Multi-dimensional table preserved from source PDF when it does not fit model_level.
 */
export interface MatrixTable {
  "name": string;
  "description"?: string;
  "columns": string[];
  "column_units"?: (string | null)[];
  "rows": {

}[];
  "footnotes"?: {
  "marker": string;
  "text": string;
}[];
}
