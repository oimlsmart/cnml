// AUTO-GENERATED from R137.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

export interface Cert_R137 {
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
  "category": (string | null);
  "type_designations": string[];
  "meter_technology"?: ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");
  /**
   * Free-text description of the meter type (e.g. "An ultrasonic
   * gas meter Type: UIM-4F", "Not applicable"). In cert data this
   * appears as either a string OR as an object whose `description`
   * key carries the text — both forms are accepted.
   * 
   */
  "module_designation"?: ((string | null) | {
  "description"?: (string | null);
});
  "description"?: (string | null);
};
  "characteristics": {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5" | "N/A" | (unknown | null));
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
  "meter_technology"?: ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");
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
  "gas_temperature_range"?: {
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
  "ambient_temperature_range"?: {
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
  "working_temperature_range_tw"?: {
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
  "storage_temperature"?: {
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
  "environmental_classes"?: {
  "value"?: ({
  "mechanical"?: "M1" | "M2" | "M3" | "M1/M2" | "M2/M3" | "Not applicable" | null;
  "electromagnetic"?: "E1" | "E2" | "E3" | "E1/E2" | "E2/E3" | "Not applicable" | null;
} | (string | number | boolean | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "climatic_environment_class"?: {
  "value"?: ("H1" | "H2" | "H3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "electromagnetic_environment_class"?: {
  "value"?: ("E1" | "E2" | "E3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "mechanical_environment_class"?: {
  "value"?: ("M1" | "M2" | "M3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "maximum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure_pmax"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure_range"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_standard_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_isolated_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "base_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_flow_rate"?: {
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
  "minimum_flow_rate"?: {
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
  "transitional_flow_rate"?: {
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
  "overload_flow_rate_qr"?: {
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
  "cyclic_volume"?: {
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
  "scale_interval"?: {
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
  "counting_scale"?: {
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
  "resolution"?: {
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
  "connection_threads_size"?: {
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
  "distance_between_connections"?: {
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
  "flow_direction"?: {
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
  "pulse_weight"?: {
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
  "density_range"?: {
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
  "path_angle"?: {
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
  "path_configuration"?: {
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
  "transducers"?: {
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
  "power_supply_voltage"?: {
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
  "power_supply_frequency"?: {
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
  "power_supply_type"?: {
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
  "power_supply_battery"?: {
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
  "electrical_power"?: {
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
  "designed_for"?: {
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
  "designed_for_humidity_conditions"?: {
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
  "destined_for"?: {
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
  "destined_for_measurement_of"?: {
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
  "ancillary_devices"?: {
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
  "lubrication"?: {
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
  "indicating_device"?: {
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
  "axis"?: (string | null);
  "unit_symbol"?: (string | null);
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
  "id": "R137";
  "edition": 2012;
  "amendment"?: (number | null);
  "scheme": "A" | "B";
  "accuracy_classes"?: (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5")[];
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
  "column_units"?: (string[] | null);
  "rows": {

}[];
  "footnotes"?: {
  "marker": string;
  "text": string;
}[];
}[];
  /**
   * Tests mandated by R137 §3.2 type evaluation (referencing OIML D 11:2013).
   * Gas meters are typically electronic-instrument family devices and
   * inherit D 11 climatic, mechanical, and electromagnetic test
   * applicability per the meter's classification.
   * 
   */
  "d011_tests_applicable"?: {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}[];
}

/**
 * OIML R137-1 §3.3 gas meter accuracy class. Decimal values per
 * R137-1 table 1 — maximum permissible error (MPE) expressed as
 * a percentage. Lower number = tighter accuracy. The `value` may
 * be null when the cert declares accuracy only at
 * `recommendation.accuracy_classes` (data extraction noise per
 * the R137 architecture analysis, G1).
 * 
 */
export type AccuracyClass = {
  "value"?: (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5" | "N/A" | (unknown | null));
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
 * Flat-string form of OIML R137-1 §3.3 accuracy class as it appears
 * at `recommendation.accuracy_classes`. Accepts both numeric and
 * string spellings (e.g. `1.0` and `"1.0"`) since the extractor
 * emits both.
 * 
 */
export type AccuracyClassToken = (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5");

/**
 * R137-1 §3.1 meter technology family. Canonical tokens derived from
 * the metering principle. Free-text `certified_type.category` values
 * (e.g. "Diaphragm gas meter", "Ultrasonic Gas Meter") should be
 * normalized to these tokens.
 * 
 */
export type MeterTechnology = ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");

/**
 * R137-1 §4.1.2 pressure reference qualifier. Gas meter pressure
 * specifications may be expressed relative to atmospheric pressure
 * (gauge) or against vacuum (absolute), or as a difference between
 * two measurement points (differential). This is an R137-specific
 * aspect — distinct from the D 11 environmental classes and not
 * part of the D 11 module.
 * 
 */
export type PressureReference = ("gauge" | "absolute" | "differential");

/**
 * StructuredValue extended with a pressure reference qualifier
 * (gauge/absolute/differential). This is the R137-specific way to
 * represent pressure measurements where the reference frame is
 * metrologically significant.
 * 
 */
export type PressureValue = {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};

export interface CertifiedType {
  "category": (string | null);
  "type_designations": string[];
  "meter_technology"?: ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");
  /**
   * Free-text description of the meter type (e.g. "An ultrasonic
   * gas meter Type: UIM-4F", "Not applicable"). In cert data this
   * appears as either a string OR as an object whose `description`
   * key carries the text — both forms are accepted.
   * 
   */
  "module_designation"?: ((string | null) | {
  "description"?: (string | null);
});
  "description"?: (string | null);
}

export interface Characteristics {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5" | "N/A" | (unknown | null));
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
  "meter_technology"?: ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");
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
  "gas_temperature_range"?: {
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
  "ambient_temperature_range"?: {
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
  "working_temperature_range_tw"?: {
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
  "storage_temperature"?: {
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
  "environmental_classes"?: {
  "value"?: ({
  "mechanical"?: "M1" | "M2" | "M3" | "M1/M2" | "M2/M3" | "Not applicable" | null;
  "electromagnetic"?: "E1" | "E2" | "E3" | "E1/E2" | "E2/E3" | "Not applicable" | null;
} | (string | number | boolean | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "climatic_environment_class"?: {
  "value"?: ("H1" | "H2" | "H3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "electromagnetic_environment_class"?: {
  "value"?: ("E1" | "E2" | "E3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "mechanical_environment_class"?: {
  "value"?: ("M1" | "M2" | "M3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "maximum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure_pmax"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure_range"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_standard_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_isolated_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "base_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_flow_rate"?: {
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
  "minimum_flow_rate"?: {
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
  "transitional_flow_rate"?: {
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
  "overload_flow_rate_qr"?: {
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
  "cyclic_volume"?: {
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
  "scale_interval"?: {
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
  "counting_scale"?: {
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
  "resolution"?: {
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
  "connection_threads_size"?: {
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
  "distance_between_connections"?: {
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
  "flow_direction"?: {
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
  "pulse_weight"?: {
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
  "density_range"?: {
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
  "path_angle"?: {
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
  "path_configuration"?: {
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
  "transducers"?: {
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
  "power_supply_voltage"?: {
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
  "power_supply_frequency"?: {
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
  "power_supply_type"?: {
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
  "power_supply_battery"?: {
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
  "electrical_power"?: {
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
  "designed_for"?: {
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
  "designed_for_humidity_conditions"?: {
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
  "destined_for"?: {
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
  "destined_for_measurement_of"?: {
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
  "ancillary_devices"?: {
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
  "lubrication"?: {
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
  "indicating_device"?: {
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
  "axis"?: (string | null);
  "unit_symbol"?: (string | null);
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

export interface TypeLevel {
  "accuracy_class"?: {
  "value"?: (0.5 | "0.5" | 1 | "1.0" | "1" | 1.5 | "1.5" | 2 | "2.0" | "2" | 2.5 | "2.5" | "N/A" | (unknown | null));
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
  "meter_technology"?: ("diaphragm" | "rotary" | "turbine" | "ultrasonic" | "thermal_mass" | "coriolis");
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
  "gas_temperature_range"?: {
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
  "ambient_temperature_range"?: {
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
  "working_temperature_range_tw"?: {
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
  "storage_temperature"?: {
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
  "environmental_classes"?: {
  "value"?: ({
  "mechanical"?: "M1" | "M2" | "M3" | "M1/M2" | "M2/M3" | "Not applicable" | null;
  "electromagnetic"?: "E1" | "E2" | "E3" | "E1/E2" | "E2/E3" | "Not applicable" | null;
} | (string | number | boolean | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "climatic_environment_class"?: {
  "value"?: ("H1" | "H2" | "H3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "electromagnetic_environment_class"?: {
  "value"?: ("E1" | "E2" | "E3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "mechanical_environment_class"?: {
  "value"?: ("M1" | "M2" | "M3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
};
  "maximum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure_pmax"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "working_pressure_range"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_standard_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "operating_pressure_range_isolated_mounts"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "base_pressure"?: {
  "value"?: unknown;
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
  "reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_flow_rate"?: {
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
  "minimum_flow_rate"?: {
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
  "transitional_flow_rate"?: {
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
  "overload_flow_rate_qr"?: {
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
  "cyclic_volume"?: {
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
  "scale_interval"?: {
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
  "counting_scale"?: {
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
  "resolution"?: {
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
  "connection_threads_size"?: {
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
  "distance_between_connections"?: {
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
  "flow_direction"?: {
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
  "pulse_weight"?: {
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
  "density_range"?: {
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
  "path_angle"?: {
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
  "path_configuration"?: {
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
  "transducers"?: {
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
  "power_supply_voltage"?: {
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
  "power_supply_frequency"?: {
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
  "power_supply_type"?: {
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
  "power_supply_battery"?: {
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
  "electrical_power"?: {
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
  "designed_for"?: {
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
  "designed_for_humidity_conditions"?: {
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
  "destined_for"?: {
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
  "destined_for_measurement_of"?: {
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
  "ancillary_devices"?: {
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
  "lubrication"?: {
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
  "indicating_device"?: {
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
}

/**
 * Composite D 11 environmental classification as seen in cert data.
 * Decomposed into mechanical (M1-M3) and electromagnetic (E1-E3)
 * sub-classes per OIML D 11:2013 §7. When a StructuredValue wraps
 * the classification, the inner `value` carries the decomposition;
 * the unit fields (`unit_symbol`, `unit_id`) remain null.
 * 
 * In practice, the inner `mechanical` / `electromagnetic` keys carry
 * bare enum tokens (e.g. "M1", "E2") rather than full StructuredValue
 * objects, so both forms are accepted here.
 * 
 */
export interface EnvironmentalClasses {
  "value"?: ({
  "mechanical"?: "M1" | "M2" | "M3" | "M1/M2" | "M2/M3" | "Not applicable" | null;
  "electromagnetic"?: "E1" | "E2" | "E3" | "E1/E2" | "E2/E3" | "Not applicable" | null;
} | (string | number | boolean | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
}

/**
 * D 11 §7.2 climatic class wrapped to allow null values, which appear
 * in cert data when the characteristic is declared but the extractor
 * could not assign a class. Defined standalone (not via allOf with
 * the d011 ClimaticClass) because JSON Schema allOf does not allow
 * overriding a sibling subschema's `value` constraints.
 * 
 */
export interface NullableClimaticClass {
  "value"?: ("H1" | "H2" | "H3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
}

/**
 * D 11 §7.4 electromagnetic class wrapped to allow null values, which
 * appear in cert data when the meter has no electronics ("Not
 * applicable") but the characteristic cell is still present.
 * 
 */
export interface NullableEMClass {
  "value"?: ("E1" | "E2" | "E3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
}

/**
 * D 11 §7.3 mechanical class wrapped to allow null values for the
 * same reason as NullableEMClass.
 * 
 */
export interface NullableMechanicalClass {
  "value"?: ("M1" | "M2" | "M3" | "N/A" | "Not applicable" | (unknown | null));
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
}

export interface ModelLevelEntry {
  "attribute": string;
  "unit_symbol"?: (string | null);
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
  "axis"?: (string | null);
  "unit_symbol"?: (string | null);
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
 * Tabular characteristic data (e.g. size x flow-rate tables common in
 * R137 gas meter family certificates). R137-1 §4.3 declares the
 * canonical flow characteristic table columns.
 * 
 */
export interface MatrixTable {
  "name": string;
  "description"?: (string | null);
  "columns": string[];
  "column_units"?: (string[] | null);
  "rows": {

}[];
  "footnotes"?: {
  "marker": string;
  "text": string;
}[];
}

export type MatrixTableList = {
  "name": string;
  "description"?: (string | null);
  "columns": string[];
  "column_units"?: (string[] | null);
  "rows": {

}[];
  "footnotes"?: {
  "marker": string;
  "text": string;
}[];
}[];

/**
 * Reference to an OIML D 11:2013 performance test.
 */
export interface D011TestReference {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}
