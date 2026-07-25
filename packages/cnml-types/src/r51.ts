// AUTO-GENERATED from R51.yaml. Do not edit by hand.
// Run `pnpm gen:types` to regenerate.

export interface Cert_R51 {
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
  /**
   * Instrument category per R51-1 §3.1. Free text because the GLM
   * extractor captures full descriptions (e.g. "Automatic catchweighing
   * instrument", "Weighing transmitter", "Checkweigher mounted on a
   * vehicle"). Schema does not constrain because real data uses 40+
   * phrasings.
   * 
   */
  "category": string;
  "type_designations": string[];
  /**
   * Load-cell technology description (e.g. "strain gauge load cell",
   * "electro-dynamic force compensation", "Not applicable"). Free text
   * because R51 does not have a closed load-cell-characterization enum
   * like R60.
   * 
   */
  "module_designation"?: (string | null);
  "description"?: (string | null);
};
  "characteristics": {
  /**
   * Per-type characteristics shared by all variants of the certified
   * type. R51 characteristics are heterogeneous across issuers and
   * editions (154 distinct labels observed in 100 certs); this schema
   * deliberately leaves type_level permissive.
   * Additional properties beyond the named ones below are accepted.
   * 
   */
  "type_level"?: {
  /**
   * Ambient operating temperature range (e.g. -10/40 deg C).
   */
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
  /**
   * D 11 §7.2 table 1 — climatic environment class for the installed
   * location. NOTE: real data sometimes carries pre-normalization
   * synonyms ("condensing", "non-condensing") in the `value` field —
   * see _modules/d011_environmental.yaml#/normalization_map. Those
   * synonyms are accepted here and SHOULD be migrated to canonical
   * H1/H2/H3 by a normalization pass.
   * 
   */
  "climatic_environment_class"?: {
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
};
  /**
   * D 11 §7.3 table 2 — mechanical environment class (vibration/shock at
   * the location). Real data carries pre-normalization free-text values
   * (e.g. "Vehicle mounted") that are NOT in the strict M1/M2/M3 enum;
   * these are accepted here and SHOULD be normalized by a migration pass.
   * 
   */
  "mechanical_environment_class"?: {
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
};
  /**
   * D 11 §7.4 table 3 — electromagnetic environment class. Real data
   * carries pre-normalization free-text values (e.g. "E1 and E2") that
   * are NOT in the strict E1/E2/E3 enum; these are accepted here and
   * SHOULD be normalized by a migration pass.
   * 
   */
  "electromagnetic_environment_class"?: {
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
};
  /**
   * D 11 §7.2 table 1 — humidity classification at the installed location.
   * NOTE: R51 uses D 11 H1/H2/H3 (instrument installed location), NOT the
   * R60 load-cell CH/NH/SH humidity marking (which is a property of the
   * load-cell classification symbol, not the instrument).
   * 
   * Real data carries pre-normalization synonyms ("non-condensing",
   * "condensing") in the `value` field — see
   * _modules/d011_environmental.yaml#/normalization_map. Those synonyms
   * are accepted here and SHOULD be migrated to canonical H1/H2/H3 by a
   * normalization pass. After normalization, the conditional rules under
   * `allOf` enforce that H1 implies t08 and H2/H3 implies t09.
   * 
   */
  "humidity_class"?: {
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
};
  "maximum_capacity"?: {
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
  "minimum_capacity"?: {
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
  "number_of_scale_intervals"?: {
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
  "maximum_speed"?: {
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
  "minimum_speed"?: {
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
  /**
   * Configuration axis (e.g. weighing_mode, model, number_of_sensor_rows).
   * R51 commonly uses weighing_mode for static vs dynamic columns. Real
   * data sometimes abuses `model` for what model_level is intended for.
   * 
   */
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
  /**
   * Recommendation identifier. R51 certs normally carry `R51`; the form
   * `R51-1` (referring to part 1 of the recommendation) also appears in
   * legacy data and is tolerated.
   * 
   */
  "id": "R51" | "R51-1";
  "edition": 2006;
  "amendment"?: (number | string | null);
  "scheme": "A" | "B";
  /**
   * Canonical R51 accuracy-class tokens. This is the single source of truth
   * for accuracy class —
   * type_level.accuracy_class is a deprecated duplicate and should be
   * empty. Each token is either a bare string (canonical form emitted by
   * the GLM extractor) or a StructuredValue-wrapped object (normalized form).
   * 
   * 3 of 100 certs currently emit an empty list (extraction failures);
   * the schema accepts both populated and empty arrays to allow those
   * certs to be flagged downstream rather than rejected outright.
   * 
   */
  "accuracy_classes"?: (("XII" | "XIII" | "XIIII" | "XII(x<1)" | "XIII(1)" | "XIII(x)" | "XIII(x≥2)" | "XIIII(x≥2)" | "Y(a)" | "Y(b)" | "Y(II)" | "IIII" | "III" | "XII(0,5)" | "XIII(0,5)" | "XIII(x ≥ 2)" | "XIIII(x ≥ 2)" | "Y (b)") | {
  /**
   * Canonical R51 accuracy-class token.
   */
  "value"?: ("XII" | "XIII" | "XIIII" | "XII(0.5)" | "XII(x<1)" | "XIII(1)" | "XIII(x)" | "XIII(x>=2)" | "XIII(0.5)" | "XIIII(x>=2)" | "Y(a)" | "Y(b)" | "Y(II)" | "IIII" | "III" | "XII(0,5)" | "XIII(0,5)" | "XIII(x ≥ 2)" | "XIIII(x ≥ 2)" | "Y (b)");
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
  /**
   * Tests mandated by R51-2 (Type evaluation report) §3.x and OIML D 11:2013.
   * Catchweighers are typically electronic instruments operating in industrial
   * environments; the default set mirrors the climatic + EM disturbance suite
   * applied at type evaluation. Mechanical vibration tests (t15/t16) apply to
   * belt-driven / motion-mode catchweighers.
   * 
   */
  "d011_tests_applicable"?: {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}[];
}

/**
 * Single R51 accuracy-class token. Accepts either:
 *   * a bare string (canonical — what the GLM extractor emits), or
 *   * a StructuredValue object whose `value` is the canonical token
 *     (normalized form for downstream consumers).
 * 
 * Tokens use the Unicode comparison operators as emitted by the source PDF
 * OCR (e.g. "x≥2", "x<1"). Decimal-comma ("0,5") and whitespace ("Y (b)",
 * "x ≥ 2") variants also appear and are tolerated pending normalization.
 * 
 */
export type AccuracyClassToken = (("XII" | "XIII" | "XIIII" | "XII(x<1)" | "XIII(1)" | "XIII(x)" | "XIII(x≥2)" | "XIIII(x≥2)" | "Y(a)" | "Y(b)" | "Y(II)" | "IIII" | "III" | "XII(0,5)" | "XIII(0,5)" | "XIII(x ≥ 2)" | "XIIII(x ≥ 2)" | "Y (b)") | {
  /**
   * Canonical R51 accuracy-class token.
   */
  "value"?: ("XII" | "XIII" | "XIIII" | "XII(0.5)" | "XII(x<1)" | "XIII(1)" | "XIII(x)" | "XIII(x>=2)" | "XIII(0.5)" | "XIIII(x>=2)" | "Y(a)" | "Y(b)" | "Y(II)" | "IIII" | "III" | "XII(0,5)" | "XIII(0,5)" | "XIII(x ≥ 2)" | "XIIII(x ≥ 2)" | "Y (b)");
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
});

/**
 * OIML R51-1:2006 §2.2.3 catchweigher accuracy class, wrapped in a
 * StructuredValue. R51 classes are X(i) and Y(i) variants where the
 * parenthesized qualifier distinguishes accuracy bands within the X family
 * (static weighing) and the Y family (lower precision). The Roman numeral
 * prefix denotes the precision grade; the parenthesized qualifier refines
 * it (e.g. `(1)`, `(x)`, `(x>=2)`, `(a)`, `(b)`, `(II)`, `(0.5)`).
 * 
 * Observed tokens in 100 certs include XII(i), XIII(1), XIII(x), XIII(x>=2),
 * XIIII(x>=2), Y(a), Y(b), Y(II). Decimal-comma and whitespace variants
 * (e.g. `XIII(0,5)`, `Y (b)`, `XIII(x >= 2)`) appear in source PDFs and
 * SHOULD be normalized to canonical form at extraction time.
 * 
 */
export type AccuracyClass = {
  /**
   * Canonical R51 accuracy-class token.
   */
  "value"?: ("XII" | "XIII" | "XIIII" | "XII(0.5)" | "XII(x<1)" | "XIII(1)" | "XIII(x)" | "XIII(x>=2)" | "XIII(0.5)" | "XIIII(x>=2)" | "Y(a)" | "Y(b)" | "Y(II)" | "IIII" | "III" | "XII(0,5)" | "XIII(0,5)" | "XIII(x ≥ 2)" | "XIIII(x ≥ 2)" | "Y (b)");
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
  /**
   * Instrument category per R51-1 §3.1. Free text because the GLM
   * extractor captures full descriptions (e.g. "Automatic catchweighing
   * instrument", "Weighing transmitter", "Checkweigher mounted on a
   * vehicle"). Schema does not constrain because real data uses 40+
   * phrasings.
   * 
   */
  "category": string;
  "type_designations": string[];
  /**
   * Load-cell technology description (e.g. "strain gauge load cell",
   * "electro-dynamic force compensation", "Not applicable"). Free text
   * because R51 does not have a closed load-cell-characterization enum
   * like R60.
   * 
   */
  "module_designation"?: (string | null);
  "description"?: (string | null);
}

export interface Characteristics {
  /**
   * Per-type characteristics shared by all variants of the certified
   * type. R51 characteristics are heterogeneous across issuers and
   * editions (154 distinct labels observed in 100 certs); this schema
   * deliberately leaves type_level permissive.
   * Additional properties beyond the named ones below are accepted.
   * 
   */
  "type_level"?: {
  /**
   * Ambient operating temperature range (e.g. -10/40 deg C).
   */
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
  /**
   * D 11 §7.2 table 1 — climatic environment class for the installed
   * location. NOTE: real data sometimes carries pre-normalization
   * synonyms ("condensing", "non-condensing") in the `value` field —
   * see _modules/d011_environmental.yaml#/normalization_map. Those
   * synonyms are accepted here and SHOULD be migrated to canonical
   * H1/H2/H3 by a normalization pass.
   * 
   */
  "climatic_environment_class"?: {
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
};
  /**
   * D 11 §7.3 table 2 — mechanical environment class (vibration/shock at
   * the location). Real data carries pre-normalization free-text values
   * (e.g. "Vehicle mounted") that are NOT in the strict M1/M2/M3 enum;
   * these are accepted here and SHOULD be normalized by a migration pass.
   * 
   */
  "mechanical_environment_class"?: {
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
};
  /**
   * D 11 §7.4 table 3 — electromagnetic environment class. Real data
   * carries pre-normalization free-text values (e.g. "E1 and E2") that
   * are NOT in the strict E1/E2/E3 enum; these are accepted here and
   * SHOULD be normalized by a migration pass.
   * 
   */
  "electromagnetic_environment_class"?: {
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
};
  /**
   * D 11 §7.2 table 1 — humidity classification at the installed location.
   * NOTE: R51 uses D 11 H1/H2/H3 (instrument installed location), NOT the
   * R60 load-cell CH/NH/SH humidity marking (which is a property of the
   * load-cell classification symbol, not the instrument).
   * 
   * Real data carries pre-normalization synonyms ("non-condensing",
   * "condensing") in the `value` field — see
   * _modules/d011_environmental.yaml#/normalization_map. Those synonyms
   * are accepted here and SHOULD be migrated to canonical H1/H2/H3 by a
   * normalization pass. After normalization, the conditional rules under
   * `allOf` enforce that H1 implies t08 and H2/H3 implies t09.
   * 
   */
  "humidity_class"?: {
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
};
  "maximum_capacity"?: {
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
  "minimum_capacity"?: {
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
  "number_of_scale_intervals"?: {
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
  "maximum_speed"?: {
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
  "minimum_speed"?: {
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
  /**
   * Configuration axis (e.g. weighing_mode, model, number_of_sensor_rows).
   * R51 commonly uses weighing_mode for static vs dynamic columns. Real
   * data sometimes abuses `model` for what model_level is intended for.
   * 
   */
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
  /**
   * Ambient operating temperature range (e.g. -10/40 deg C).
   */
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
  /**
   * D 11 §7.2 table 1 — climatic environment class for the installed
   * location. NOTE: real data sometimes carries pre-normalization
   * synonyms ("condensing", "non-condensing") in the `value` field —
   * see _modules/d011_environmental.yaml#/normalization_map. Those
   * synonyms are accepted here and SHOULD be migrated to canonical
   * H1/H2/H3 by a normalization pass.
   * 
   */
  "climatic_environment_class"?: {
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
};
  /**
   * D 11 §7.3 table 2 — mechanical environment class (vibration/shock at
   * the location). Real data carries pre-normalization free-text values
   * (e.g. "Vehicle mounted") that are NOT in the strict M1/M2/M3 enum;
   * these are accepted here and SHOULD be normalized by a migration pass.
   * 
   */
  "mechanical_environment_class"?: {
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
};
  /**
   * D 11 §7.4 table 3 — electromagnetic environment class. Real data
   * carries pre-normalization free-text values (e.g. "E1 and E2") that
   * are NOT in the strict E1/E2/E3 enum; these are accepted here and
   * SHOULD be normalized by a migration pass.
   * 
   */
  "electromagnetic_environment_class"?: {
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
};
  /**
   * D 11 §7.2 table 1 — humidity classification at the installed location.
   * NOTE: R51 uses D 11 H1/H2/H3 (instrument installed location), NOT the
   * R60 load-cell CH/NH/SH humidity marking (which is a property of the
   * load-cell classification symbol, not the instrument).
   * 
   * Real data carries pre-normalization synonyms ("non-condensing",
   * "condensing") in the `value` field — see
   * _modules/d011_environmental.yaml#/normalization_map. Those synonyms
   * are accepted here and SHOULD be migrated to canonical H1/H2/H3 by a
   * normalization pass. After normalization, the conditional rules under
   * `allOf` enforce that H1 implies t08 and H2/H3 implies t09.
   * 
   */
  "humidity_class"?: {
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
};
  "maximum_capacity"?: {
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
  "minimum_capacity"?: {
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
  "number_of_scale_intervals"?: {
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
  "maximum_speed"?: {
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
  "minimum_speed"?: {
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
}

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
  /**
   * Configuration axis (e.g. weighing_mode, model, number_of_sensor_rows).
   * R51 commonly uses weighing_mode for static vs dynamic columns. Real
   * data sometimes abuses `model` for what model_level is intended for.
   * 
   */
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
 * Reference to an OIML D 11:2013 performance test applied at type evaluation.
 */
export interface D011TestReference {
  "test_id": string;
  "test_level_index"?: number;
  "notes"?: string;
}
