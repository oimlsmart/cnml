// AUTO-GENERATED from R117.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

/**
 * OIML R117:2019 — Dynamic measuring systems for liquids other than water.
 * Covers fuel dispensers, LPG/LNG dispensers, Coriolis mass-flow measurement
 * transducers, and complete measuring assemblies for liquid products other
 * than water.
 * 
 */
export interface Cert_R117 {
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
  /**
   * Module classification for the certified type. R117 distinguishes
   * complete measuring systems from individual measurement transducers.
   * 
   */
  "module_designation"?: (string | null);
  "description"?: (string | null);
};
  "characteristics": {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: (("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A") | ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A")[]);
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_type"?: ("M" | "V" | "D");
  "maximum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "transitional_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "min_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mmq"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ratio_max_min_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_ratio"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "cyclic_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_principle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "instrument_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_system_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurand"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_paths"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_path"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "path_angle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "sound_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_reynolds_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "straight_pipe_length_requirements"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_characteristics"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_direction"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_def"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_urea"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "product_pressure_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "vapour_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_o"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_x"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_q"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_psi"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "max_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "line_reference_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "environmental_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "electrical_disturbance_class"?: {
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
  "ambient_temperature_range_electronics"?: {
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
  "ambient_temperature_range_local_display"?: {
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
  "ambient_temperature_limits"?: {
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
  "condensing_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environment_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environments_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mechanic_class"?: {
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
  "ambient_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ambient_temperature_range_lngxsb_zshxsb"?: {
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
  "ambient_temperature_range_cdwxsb"?: {
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
  "ambient_temperature_limits_def_windshield_lpg"?: {
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
  "ambient_temperature_limits_igem_printer"?: {
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
  "liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_the_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_liquid_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_application"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_measuring"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variables"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variable"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_inputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_outputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_input"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_output"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversion_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversions_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mixture_conditions"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "product_temperature_range"?: {
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
  "liquid_temperature_range"?: {
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
  "product_temperature_range_fuel"?: {
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
  "product_temperature_range_adblue"?: {
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
  "temperature_range_liquid_for_mass_measurement"?: {
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
  "temperature_range_liquid_for_density_and_volume_measurement"?: {
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
  "temperature_range_liquid_mass"?: {
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
  "temperature_range_liquid_density"?: {
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
  "temperature_range_liquid_mass_1_5"?: {
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
  "temperature_range_liquid_density_1_5"?: {
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
  "temperature_range_liquid_mass_o"?: {
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
  "temperature_range_liquid_density_o"?: {
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
  "temperature_range_liquid_mass_o_1_5"?: {
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
  "temperature_range_liquid_density_o_1_5"?: {
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
  "temperature_range_liquid_mass_x"?: {
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
  "temperature_range_liquid_density_x"?: {
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
  "temperature_range_liquid_mass_x_1_5"?: {
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
  "temperature_range_liquid_density_x_1_5"?: {
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
  "temperature_range_liquid_mass_q"?: {
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
  "temperature_range_liquid_density_q"?: {
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
  "temperature_range_liquid_mass_q_1_5"?: {
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
  "temperature_range_liquid_density_q_1_5"?: {
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
  "density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_mass_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_piston"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_lobe"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density_water"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "shrinkage_factor"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "viscosity_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_viscosity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_unit"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_of_the_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_volume_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_unit_price"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_price_to_pay"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles_connected_to_each_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles_per_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "pos_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "communication_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "daily_report_time"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_voltage"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_description"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_vehicle_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_calculator"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_of_dispenser"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "emc_measures"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "software_checksum"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "wm_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "w_m_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_sigma3"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client_hmi_207ce"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_firmware_version"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_code_version_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_sensor_in_vapour_return_line"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "line_reference_temperature"?: {
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
  "pattern_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_s_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
};
  "model_level"?: {
  "attribute": string;
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "model": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
  "footnote_markers"?: string[];
}[];
}[];
  "config_level"?: {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "condition": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
}[];
}[];
};
  "recommendation": {
  "id": "R117";
  "edition": 2019 | 2007 | 1;
  "amendment"?: (number | string | null);
  "scheme": "A" | "B";
  /**
   * Accuracy class(es) declared at the certificate/recommendation level.
   * R117:2019 §2.1.10 defines classes 0.3, 0.5, 1, and 1.5 for the
   * maximum permissible error of a measuring system. Multiple classes
   * may apply when the certificate covers different liquid types or
   * measurement modes.
   * 
   */
  "accuracy_classes"?: ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A")[];
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
  /**
   * Sub-assemblies that comprise a measuring system. R117 dispensers and
   * measuring assemblies typically have 4+ components: measuring/measurement
   * sensor (meter), calculating/indicating device (calculator), gas separator
   * / gas elimination device, pulser/transducer, pump, hose, nozzle.
   * 
   */
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
  /**
   * D 11 performance tests mandated by R117:2019 for type evaluation of
   * electronic measuring systems. The default set covers climatic, mains
   * disturbance, and EMC tests applicable to powered fuel dispensers and
   * electronic transducers.
   * 
   */
  "d011_tests_applicable"?: {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}[];
}

/**
 * OIML R117:2019 §2.1.10 / Table B.1 accuracy class for maximum
 * permissible error (MPE) of the measuring system, expressed as a
 * percentage. Decimal notation uses the point (not European comma):
 * e.g. "0,5" in source documents normalises to "0.5".
 * 
 */
export type AccuracyClassValue = ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A");

/**
 * R117-local structured characteristic value. Extends the core
 * StructuredValue shape by allowing `value` to also hold arrays (e.g.
 * multi-class accuracy lists, multi-value MMQ) and compound objects
 * (e.g. decomposed environmental classes `{mechanical, electromagnetic,
 * humidity}`), which occur throughout R117 extraction data. All other
 * sub-fields (unit_symbol, unit_id, footnote_markers, tolerance) match
 * the core definition. Provenance markers (_decomposed, _raw,
 * _extracted_from, _note) pass through via additionalProperties.
 * 
 */
export interface StructuredValue {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
}

/**
 * Structured accuracy class. Value is either a single class token or a
 * list of class tokens when multiple classes apply (e.g. different
 * liquid types or measurement modes under one certificate).
 * 
 */
export type AccuracyClass = {
  "value"?: (("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A") | ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A")[]);
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};

/**
 * Pressure reference qualifier for gauge / absolute / differential
 * pressure values. R117 dispensers and Coriolis transducers commonly
 * express maximum working pressure as gauge pressure (bar(g)).
 * 
 */
export type PressureReference = ("gauge" | "absolute" | "differential");

/**
 * Structured pressure value with optional pressure_reference qualifier
 * (gauge / absolute / differential). R117 dispensers typically express
 * maximum working pressure as gauge pressure.
 * 
 */
export type PressureValue = {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};

/**
 * Compound D 11 environmental classification. R117 measuring systems
 * declare mechanical (M1/M2/M3), electromagnetic (E1/E2/E3), and
 * optionally climatic/humidity (H1/H2/H3) classes. These are D 11
 * installed-location classes, not the R60 load-cell humidity marking.
 * Value may be a decomposed object {mechanical, electromagnetic,
 * humidity} or a flat string like "M1/E1/H3" (pre-decomposition).
 * 
 */
export type EnvironmentalClasses = {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};

/**
 * R117:2019 §2.1.5 measurement type — the physical quantity the system
 * measures. Mass (M), volume (V), or density-based conversion (D).
 * 
 */
export type MeasurementType = ("M" | "V" | "D");

/**
 * R117 certified type category. R117 covers fuel dispensers, LPG/LNG
 * dispensers, measuring systems, and measurement transducers (sensors).
 * 
 */
export interface CertifiedType {
  "category": string;
  "type_designations": string[];
  /**
   * Module classification for the certified type. R117 distinguishes
   * complete measuring systems from individual measurement transducers.
   * 
   */
  "module_designation"?: (string | null);
  "description"?: (string | null);
}

/**
 * R117 characteristics organised by layer: type-level (applies to the
 * whole family), model-level (per-model variant table), and config-level
 * (conditional on liquid type, configuration, or duty type).
 * 
 */
export interface Characteristics {
  "type_level"?: {
  "accuracy_class"?: {
  "value"?: (("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A") | ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A")[]);
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_type"?: ("M" | "V" | "D");
  "maximum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "transitional_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "min_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mmq"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ratio_max_min_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_ratio"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "cyclic_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_principle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "instrument_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_system_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurand"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_paths"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_path"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "path_angle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "sound_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_reynolds_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "straight_pipe_length_requirements"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_characteristics"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_direction"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_def"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_urea"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "product_pressure_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "vapour_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_o"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_x"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_q"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_psi"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "max_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "line_reference_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "environmental_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "electrical_disturbance_class"?: {
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
  "ambient_temperature_range_electronics"?: {
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
  "ambient_temperature_range_local_display"?: {
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
  "ambient_temperature_limits"?: {
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
  "condensing_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environment_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environments_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mechanic_class"?: {
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
  "ambient_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ambient_temperature_range_lngxsb_zshxsb"?: {
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
  "ambient_temperature_range_cdwxsb"?: {
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
  "ambient_temperature_limits_def_windshield_lpg"?: {
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
  "ambient_temperature_limits_igem_printer"?: {
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
  "liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_the_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_liquid_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_application"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_measuring"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variables"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variable"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_inputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_outputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_input"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_output"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversion_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversions_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mixture_conditions"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "product_temperature_range"?: {
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
  "liquid_temperature_range"?: {
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
  "product_temperature_range_fuel"?: {
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
  "product_temperature_range_adblue"?: {
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
  "temperature_range_liquid_for_mass_measurement"?: {
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
  "temperature_range_liquid_for_density_and_volume_measurement"?: {
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
  "temperature_range_liquid_mass"?: {
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
  "temperature_range_liquid_density"?: {
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
  "temperature_range_liquid_mass_1_5"?: {
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
  "temperature_range_liquid_density_1_5"?: {
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
  "temperature_range_liquid_mass_o"?: {
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
  "temperature_range_liquid_density_o"?: {
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
  "temperature_range_liquid_mass_o_1_5"?: {
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
  "temperature_range_liquid_density_o_1_5"?: {
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
  "temperature_range_liquid_mass_x"?: {
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
  "temperature_range_liquid_density_x"?: {
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
  "temperature_range_liquid_mass_x_1_5"?: {
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
  "temperature_range_liquid_density_x_1_5"?: {
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
  "temperature_range_liquid_mass_q"?: {
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
  "temperature_range_liquid_density_q"?: {
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
  "temperature_range_liquid_mass_q_1_5"?: {
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
  "temperature_range_liquid_density_q_1_5"?: {
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
  "density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_mass_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_piston"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_lobe"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density_water"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "shrinkage_factor"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "viscosity_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_viscosity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_unit"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_of_the_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_volume_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_unit_price"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_price_to_pay"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles_connected_to_each_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles_per_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "pos_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "communication_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "daily_report_time"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_voltage"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_description"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_vehicle_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_calculator"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_of_dispenser"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "emc_measures"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "software_checksum"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "wm_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "w_m_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_sigma3"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client_hmi_207ce"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_firmware_version"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_code_version_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_sensor_in_vapour_return_line"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "line_reference_temperature"?: {
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
  "pattern_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_s_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
};
  "model_level"?: {
  "attribute": string;
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "model": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
  "footnote_markers"?: string[];
}[];
}[];
  "config_level"?: {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "condition": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
}[];
}[];
}

/**
 * Type-level characteristics applying to the entire certified family.
 * R117 measuring systems carry flow rate ranges, minimum measured
 * quantity (MMQ), pressure limits, accuracy class, environmental
 * classification, temperature ranges, liquid/approved-product scope,
 * and software identification.
 * 
 */
export interface TypeLevel {
  "accuracy_class"?: {
  "value"?: (("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A") | ("0.3" | "0.5" | "1" | "1.0" | "1.5" | "2.5" | "N/A")[]);
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_type"?: ("M" | "V" | "D");
  "maximum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "transitional_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "min_measured_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mmq"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ratio_max_min_flow_rate"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_rate_ratio"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "cyclic_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_principle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "instrument_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_system_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurand"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measuring_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_paths"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "number_of_sound_path"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "path_angle"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "sound_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "minimum_reynolds_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "straight_pipe_length_requirements"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_characteristics"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "flow_direction"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_def"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "volume_sensor_flow_rate_range_urea"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "minimum_working_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "product_pressure_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "vapour_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_o"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_x"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_q"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "maximum_pressure_psi"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "max_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "line_reference_pressure"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
  "pressure_reference"?: ("gauge" | "absolute" | "differential");
};
  "environmental_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "electrical_disturbance_class"?: {
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
  "ambient_temperature_range_electronics"?: {
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
  "ambient_temperature_range_local_display"?: {
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
  "ambient_temperature_limits"?: {
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
  "condensing_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environment_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "environments_classes"?: {
  "value"?: (string | {
  "mechanical"?: "M1" | "M2" | "M3";
  "electromagnetic"?: "E1" | "E2" | "E3";
  "humidity"?: "H1" | "H2" | "H3";
});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mechanic_class"?: {
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
  "ambient_humidity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "ambient_temperature_range_lngxsb_zshxsb"?: {
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
  "ambient_temperature_range_cdwxsb"?: {
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
  "ambient_temperature_limits_def_windshield_lpg"?: {
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
  "ambient_temperature_limits_igem_printer"?: {
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
  "liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_the_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement_of"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_fuel"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "intended_for_adblue"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_liquid_products"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_application"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_for_measuring"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_quantity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variables"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_variable"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_inputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_outputs"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_input"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_output"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversion_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_conversions_methods"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_liquids"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "mixture_conditions"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "product_temperature_range"?: {
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
  "liquid_temperature_range"?: {
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
  "product_temperature_range_fuel"?: {
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
  "product_temperature_range_adblue"?: {
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
  "temperature_range_liquid_for_mass_measurement"?: {
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
  "temperature_range_liquid_for_density_and_volume_measurement"?: {
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
  "temperature_range_liquid_mass"?: {
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
  "temperature_range_liquid_density"?: {
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
  "temperature_range_liquid_mass_1_5"?: {
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
  "temperature_range_liquid_density_1_5"?: {
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
  "temperature_range_liquid_mass_o"?: {
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
  "temperature_range_liquid_density_o"?: {
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
  "temperature_range_liquid_mass_o_1_5"?: {
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
  "temperature_range_liquid_density_o_1_5"?: {
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
  "temperature_range_liquid_mass_x"?: {
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
  "temperature_range_liquid_density_x"?: {
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
  "temperature_range_liquid_mass_x_1_5"?: {
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
  "temperature_range_liquid_density_x_1_5"?: {
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
  "temperature_range_liquid_mass_q"?: {
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
  "temperature_range_liquid_density_q"?: {
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
  "temperature_range_liquid_mass_q_1_5"?: {
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
  "temperature_range_liquid_density_q_1_5"?: {
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
  "density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_density_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_mass_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume_measurement"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_piston"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "density_range_lobe"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "reference_density_water"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "shrinkage_factor"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "viscosity_range"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_viscosity"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_unit"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_of_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_of_the_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "scale_interval_volume_display"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume_indication"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_volume"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_unit_price"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_price_to_pay"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "maximum_number_of_nozzles_connected_to_each_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_main_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "max_nozzles_per_indicating_device"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "pos_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "communication_interface"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "daily_report_time"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_voltage"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_frequency"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_type"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_description"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "power_supply_vehicle_battery"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_calculator"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "electrical_power_of_dispenser"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "emc_measures"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
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
  "software_checksum"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "wm_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "w_m_checksum_crc"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_sigma3"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_for_hmi_client_hmi_207ce"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_firmware_version"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "software_identification_code_version_number"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "measurement_sensor_in_vapour_return_line"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "line_reference_temperature"?: {
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
  "pattern_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "type_designation"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "manufacturer_s_trademark"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "approved_essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
  "essential_parts"?: {
  /**
   * The numeric/string/range/array/compound-object value. Supports
   * all shapes seen in R117 extraction output.
   * 
   */
  "value"?: (number | string | boolean | (unknown | null) | unknown[] | {

});
  "unit_symbol"?: (string | null);
  "unit_id"?: (string | null);
  "footnote_markers"?: string[];
  "tolerance"?: (number | null);
  "tolerance_type"?: "absolute" | "relative" | null;
};
}

/**
 * Permissive value type for model-level and config-level entries. R117
 * extraction data places arrays (e.g. multi-class accuracy, environmental
 * class lists), {min, max} ranges, and full StructuredValue objects as
 * the `value` field in these entries. This type accepts all of those
 * shapes plus scalar values.
 * 
 */
export type PermissiveValue = (number | string | boolean | (unknown | null) | unknown[] | {

});

/**
 * Model-level characteristic table. R117 uses model-level extensively
 * for per-sensor-size flow rate, MMQ, and pressure tables (e.g. Coriolis
 * transducers with DN8/DN15/DN25... variants).
 * 
 */
export interface ModelLevelEntry {
  "attribute": string;
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "model": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
  "footnote_markers"?: string[];
}[];
}

/**
 * Config-level characteristic with conditional values. R117 uses
 * config-level for accuracy class and measurement type conditioned on
 * liquid type (e.g. oil vs LPG vs cryogenic LNG), and for flow rate
 * ranges conditioned on dispenser configuration.
 * 
 */
export interface ConfigLevelEntry {
  "attribute": string;
  "axis": (string | (unknown | null));
  "unit"?: {
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
};
  "unit_symbol"?: (string | null);
  "values": {
  "condition": string;
  "value": (number | string | boolean | (unknown | null) | unknown[] | {

});
}[];
}

/**
 * Reference to an OIML D 11:2013 performance test.
 */
export interface D011TestReference {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}
