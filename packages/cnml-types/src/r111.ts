// AUTO-GENERATED from R111.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

/**
 * OIML R111 "Weights of accuracy classes E1, E2, F1, F2, M1, M2, M3".
 * Standard mass pieces — cylindrical, sheet, or wire weights covering nominal
 * masses from 1 mg to 5 t per R111-1 §3.
 * 
 */
export interface Cert_R111 {
  "certificate": {
  "number": string;
  "scheme": "A" | "B";
  "project_number"?: string | number;
  "page_total"?: number;
  "member_state"?: string;
  "date_issued"?: string;
  "oiml_issuer_id": string;
};
  "issuing_authority"?: {
  "name": string;
  "address_lines"?: string[];
  "person_responsible"?: string;
  "person_title"?: string;
  "phone"?: string;
  "fax"?: string;
  "email"?: string;
  "website"?: string;
  "oiml_issuer_id"?: string;
};
  "applicants"?: {
  "name": string;
  "address_lines"?: string[];
}[];
  "manufacturers"?: {
  "name": string;
  "address_lines"?: string[];
}[];
  "certified_type": {
  "category": string;
  "type_designations": string[];
  "module_designation"?: (string | null);
  "description"?: (string | null);
};
  "characteristics": {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: ("E1" | "E2" | "F1" | "F2" | "M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  "accuracy_type"?: {
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
};
  "material"?: {
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
};
  "range_of_density"?: {
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
};
  "density"?: {
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
};
  "susceptibility"?: {
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
};
  "magnetism_class"?: {
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
};
  "surface_roughness"?: {
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
};
  "mass_range"?: {
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
};
  "nominal_mass"?: {
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
};
  "conventional_mass"?: {
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
};
  "maximum_permissible_error"?: {
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
};
  "construction"?: {
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
};
  "shape"?: {
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
};
  "marking"?: {
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
};
  "adjustment_cavity"?: {
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
};
  "temperature_range"?: {
  "value"?: unknown;
  "unit"?: unknown;
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
};
  "humidity_class"?: {
  "value"?: ("H1" | "H2" | "H3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  "mechanical_environment_class"?: {
  "value"?: ("M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  [key: string]: {
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
};
};
  "model_level"?: {
  "attribute": string;
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "model": string;
  "value": (("N/A" | number | boolean | string) | {
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
  "footnote_markers"?: string[];
}[];
}[];
  "config_level"?: {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "condition": string;
  "value": (("N/A" | number | boolean | string) | {
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
}[];
}[];
};
  "recommendation": {
  "id": "R111";
  "edition": 2004;
  "amendment"?: (string | number | null);
  "scheme": "A" | "B";
  "accuracy_classes"?: (string | number | {
  "value"?: ("E1" | "E2" | "F1" | "F2" | "M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
})[];
};
  "test_reports"?: {
  "id": string;
  "date"?: string;
  "pages"?: number;
  "role"?: ("type_evaluation_report" | "test_report" | "documentation_file" | "evaluation_report" | "pattern_evaluation_checklist" | "pattern_evaluation_report" | "N/A");
}[];
  "revision_history"?: {
  "revision": string;
  "date": string;
  "changes": string;
}[];
  "model_family"?: {
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
};
  "components"?: {
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
}[];
  "footnotes"?: {
  "marker": string;
  "text": string;
}[];
  "matrix_tables"?: {
  "name": string;
  "description"?: (string | null);
  "columns": string[];
  "rows": {

}[];
  "footnotes"?: string[];
}[];
  /**
   * Weights do not undergo D 11 environmental tests (passive mechanical artefacts).
   */
  "d011_tests_applicable"?: {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}[];
}

/**
 * OIML R111-1 §5 weight accuracy class.
 */
export type AccuracyClass = {
  "value"?: ("E1" | "E2" | "F1" | "F2" | "M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};

export interface CertifiedType {
  "category": string;
  "type_designations": string[];
  "module_designation"?: (string | null);
  "description"?: (string | null);
}

export interface Characteristics {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: ("E1" | "E2" | "F1" | "F2" | "M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  "accuracy_type"?: {
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
};
  "material"?: {
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
};
  "range_of_density"?: {
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
};
  "density"?: {
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
};
  "susceptibility"?: {
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
};
  "magnetism_class"?: {
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
};
  "surface_roughness"?: {
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
};
  "mass_range"?: {
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
};
  "nominal_mass"?: {
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
};
  "conventional_mass"?: {
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
};
  "maximum_permissible_error"?: {
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
};
  "construction"?: {
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
};
  "shape"?: {
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
};
  "marking"?: {
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
};
  "adjustment_cavity"?: {
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
};
  "temperature_range"?: {
  "value"?: unknown;
  "unit"?: unknown;
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
};
  "humidity_class"?: {
  "value"?: ("H1" | "H2" | "H3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  "mechanical_environment_class"?: {
  "value"?: ("M1" | "M2" | "M3");
  "unit"?: (unknown | unknown | (unknown | null));
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
};
  [key: string]: {
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
};
};
  "model_level"?: {
  "attribute": string;
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "model": string;
  "value": (("N/A" | number | boolean | string) | {
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
  "footnote_markers"?: string[];
}[];
}[];
  "config_level"?: {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "condition": string;
  "value": (("N/A" | number | boolean | string) | {
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
}[];
}[];
}

export interface ModelLevelEntry {
  "attribute": string;
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "model": string;
  "value": (("N/A" | number | boolean | string) | {
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
  "footnote_markers"?: string[];
}[];
}

export interface ConfigLevelEntry {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "values": {
  "condition": string;
  "value": (("N/A" | number | boolean | string) | {
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
}[];
}

/**
 * Preserved structured tables (e.g. per-mass MPE tables).
 */
export type MatrixTableList = {
  "name": string;
  "description"?: (string | null);
  "columns": string[];
  "rows": {

}[];
  "footnotes"?: string[];
}[];

/**
 * Reference to an OIML D 11:2013 performance test (unused for R111).
 */
export interface D011TestReference {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}
