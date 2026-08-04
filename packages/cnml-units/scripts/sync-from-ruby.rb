#!/usr/bin/env ruby
# Sync unitsdb symbol→id maps from the Ruby project to TS-friendly JSON.
#
# Usage:
#   UNITSDB_PATH=/path/to/unitsdb OUT_DIR=./src ruby scripts/sync-from-ruby.rb
require "json"
require "yaml"

UNITSDB_PATH = ENV.fetch("UNITSDB_PATH")
OUT_DIR      = ENV.fetch("OUT_DIR", File.expand_path("../src", __dir__))

# Read unitsdb YAML directly
units    = YAML.load_file("#{UNITSDB_PATH}/units.yaml")["units"]
prefixes = YAML.load_file("#{UNITSDB_PATH}/prefixes.yaml")["prefixes"]

units_json = units.flat_map do |u|
  uid = u["identifiers"]&.find { |i| i["type"] == "unitsml" }&.dig("id")
  next [] unless uid
  entries = []
  entries << { symbol: u["short"], unit_id: uid } if u["short"]
  (u["symbols"] || []).each do |sym|
    %w[unicode ascii id].each do |k|
      v = sym[k]
      entries << { symbol: v, unit_id: uid } if v && !v.empty?
    end
  end
  entries
end.uniq

prefixes_json = prefixes.flat_map do |p|
  pid = p["identifiers"]&.find { |i| i["type"] == "unitsml" }&.dig("id")
  next [] unless pid
  next [] if p["short"] == "none"
  entries = []
  (p["symbols"] || []).each do |sym|
    %w[unicode ascii].each do |k|
      v = sym[k]
      entries << { symbol: v, unit_id: pid } if v && v != "1"
    end
  end
  entries
end.uniq

# OIML overrides (from the normalizer.rb UNIT_OVERRIDES constant)
overrides = {
  "t"       => "u:metric_ton",
  "°C"      => "u:degree_Celsius",
  "℃"       => "u:degree_Celsius",
  "Ω"       => "u:ohm",
  "ohm"     => "u:ohm",
  "Ohm"     => "u:ohm",
  "kWh"     => "u:kilowatt_hour",
  "Wh"      => "u:watt_hour",
  "km/hr"   => "u:kilometer_per_hour",
  "psi"     => "u:pound_force_per_square_inch",
  "PSI"     => "u:pound_force_per_square_inch",
  "Bar"     => "u:bar",
  "bars"    => "u:bar",
  "minutes" => "u:minute",
  "months"  => "u:month",
  "meters"  => "u:meter",
  "A)"      => "u:ampere",
  # OIML compounds (from _units_local.yaml)
  "m/min"        => "u:meter_per_minute",
  "L/min"        => "u:liter_per_minute",
  "l/min"        => "u:liter_per_minute",
  "lpm"          => "u:liter_per_minute",
  "mg/L"         => "u:milligram_per_liter",
  "mg/l"         => "u:milligram_per_liter",
  "g/L"          => "u:gram_per_liter",
  "Sm³"          => "u:standard_cubic_meter",
  "Sm3"          => "u:standard_cubic_meter",
  "kg/Sm³"       => "u:kilogram_per_standard_cubic_meter",
  "kg/Sm3"       => "u:kilogram_per_standard_cubic_meter",
  "cm³/g"        => "u:cubic_centimeter_per_gram",
  "m/mm²"        => "u:meter_per_square_millimeter",
  "m/mm2"        => "u:meter_per_square_millimeter",
  "m³/h"         => "u:cubic_meter_per_hour",
  "m3/h"         => "u:cubic_meter_per_hour",
  "imp/kWh"      => "u:impulse_per_kilowatt_hour",
  "imp./kWh"     => "u:impulse_per_kilowatt_hour",
  "imp/m³"       => "u:impulse_per_cubic_meter",
  "impulses/m³"  => "u:impulse_per_cubic_meter",
  "pulses/m³"    => "u:impulse_per_cubic_meter",
  "P/m3"         => "u:impulse_per_cubic_meter",
  "imp/km"       => "u:impulse_per_kilometer",
  "pulses/km"    => "u:impulse_per_kilometer",
  "μV/e"         => "u:microvolt_per_verification_interval",
  "µV/e"         => "u:microvolt_per_verification_interval",
  "μV/div"       => "u:microvolt_per_division",
  "µV/div"       => "u:microvolt_per_division",
  "μA/div"       => "u:microampere_per_division",
  "%RH"          => "u:relative_humidity_percent",
  "%Max"         => "u:percent_of_maximum_capacity",
  "/degC"        => "u:per_degree_Celsius",
  "CU/h"         => "u:customary_unit_per_hour",
  "CU/km"        => "u:customary_unit_per_kilometer",
  "CU"           => "u:customary_unit",
}

File.write("#{OUT_DIR}/unitsdb-units.json",    JSON.pretty_generate(units_json))
File.write("#{OUT_DIR}/unitsdb-prefixes.json", JSON.pretty_generate(prefixes_json))
File.write("#{OUT_DIR}/overrides.json",        JSON.pretty_generate(overrides))

puts "Synced:"
puts "  unitsdb-units.json    (#{units_json.size} entries)"
puts "  unitsdb-prefixes.json (#{prefixes_json.size} entries)"
puts "  overrides.json        (#{overrides.size} entries)"
