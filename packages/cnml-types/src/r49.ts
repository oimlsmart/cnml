// AUTO-GENERATED from R49.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

/**
 * OIML R49 "Water meters intended for the metering of cold potable water and hot water".
 * Covers multi-jet, single-jet, volumetric, Woltman and ultrasonic water meters in
 * accuracy classes 1, 2 and 3 per R49-1 §3.2.4.
 * 
 */
export interface Cert_R49 {
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
  "value"?: ("1" | "2" | "3");
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
  "temperature_class"?: {
  "value"?: ("T0" | "T30" | "T50" | "T70" | "T90");
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
  "water_pressure_class"?: {
  "value"?: (string | null);
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
  "pressure_loss_class"?: {
  "value"?: ("ΔP10" | "ΔP16" | "ΔP25" | "ΔP40" | "ΔP63" | "ΔP100");
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
  "flow_profile_sensitivity_class"?: {
  "value"?: (string | null);
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
  "maximum_admissible_temperature"?: {
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
  "maximum_admissible_pressure"?: {
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
  "orientation_limitation"?: {
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
  "orientation"?: {
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
  "mounting"?: {
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
  "reverse_flow"?: {
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
  "resolution_of_indicating_device"?: {
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
  "resolution_of_the_indicating_device"?: {
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
  "indicating_range"?: {
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
  "measuring_principle"?: {
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
  "flow_conditioner"?: {
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
  "minimum_straight_length_inlet_pipe"?: {
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
  "minimum_straight_length_outlet_pipe"?: {
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
  "minimum_straight_length_of_inlet_pipe"?: {
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
  "minimum_straight_length_of_outlet_pipe"?: {
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
  "data_output_options"?: {
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
  "mechanical_environment_class"?: {
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
  "electromagnetic_environment_class"?: {
  "value"?: ("E1" | "E2" | "E3");
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
  "software_identification"?: (string | {
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
  "values": ({
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
} | {
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
})[];
}[];
};
  "recommendation": {
  "id": "R49";
  "edition": 2001 | 2006 | 2013 | 2024;
  "amendment"?: (string | number | null);
  "scheme": "A" | "B";
  "accuracy_classes"?: (string | number | {
  "value"?: ("1" | "2" | "3");
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
   * Tests mandated by R49-3 type evaluation.
   */
  "d011_tests_applicable"?: {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}[];
}

/**
 * OIML R49-1 §3.2.4 water meter accuracy class.
 */
export type AccuracyClass = {
  "value"?: ("1" | "2" | "3");
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

/**
 * R49-1 §4.1.7 temperature class. T0..T90 defines admissible water temperature range.
 * 
 */
export type TemperatureClass = {
  "value"?: ("T0" | "T30" | "T50" | "T70" | "T90");
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

/**
 * R49-1 §4.1.8 pressure loss class.
 */
export type PressureLossClass = {
  "value"?: ("ΔP10" | "ΔP16" | "ΔP25" | "ΔP40" | "ΔP63" | "ΔP100");
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

/**
 * R49-1 §4.1.9 admissible working pressure class (MAP rating).
 */
export type WaterPressureClass = {
  "value"?: (string | null);
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

/**
 * R49-1 §4.1.5 flow disturbance sensitivity classes — upstream (U0..U10)
 * and downstream (D0..D10) classes per ISO 4064 / OIML R49.
 * 
 */
export type FlowProfileSensitivityClass = {
  "value"?: (string | null);
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
  "value"?: ("1" | "2" | "3");
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
  "temperature_class"?: {
  "value"?: ("T0" | "T30" | "T50" | "T70" | "T90");
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
  "water_pressure_class"?: {
  "value"?: (string | null);
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
  "pressure_loss_class"?: {
  "value"?: ("ΔP10" | "ΔP16" | "ΔP25" | "ΔP40" | "ΔP63" | "ΔP100");
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
  "flow_profile_sensitivity_class"?: {
  "value"?: (string | null);
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
  "maximum_admissible_temperature"?: {
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
  "maximum_admissible_pressure"?: {
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
  "orientation_limitation"?: {
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
  "orientation"?: {
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
  "mounting"?: {
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
  "reverse_flow"?: {
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
  "resolution_of_indicating_device"?: {
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
  "resolution_of_the_indicating_device"?: {
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
  "indicating_range"?: {
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
  "measuring_principle"?: {
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
  "flow_conditioner"?: {
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
  "minimum_straight_length_inlet_pipe"?: {
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
  "minimum_straight_length_outlet_pipe"?: {
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
  "minimum_straight_length_of_inlet_pipe"?: {
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
  "minimum_straight_length_of_outlet_pipe"?: {
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
  "data_output_options"?: {
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
  "mechanical_environment_class"?: {
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
  "electromagnetic_environment_class"?: {
  "value"?: ("E1" | "E2" | "E3");
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
  "software_identification"?: (string | {
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
  "values": ({
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
} | {
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
})[];
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
  "values": ({
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
} | {
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
})[];
}

/**
 * Multi-axis tables preserved from the source PDF (e.g. q-value matrices).
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
 * Reference to an OIML D 11:2013 performance test.
 */
export interface D011TestReference {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}
