#!/usr/bin/env ruby
# frozen_string_literal: true

# Query the audit log for entries matching a serial number, action,
# or time range. Used during incident response to enumerate affected
# artifacts.
#
# Usage:
#   ruby scripts/incident-query.rb --serial deadbeef
#   ruby scripts/incident-query.rb --action csr.sign
#   ruby scripts/incident-query.rb --since 2026-07-01
#   ruby scripts/incident-query.rb --serial deadbeef --action csr.sign

require "optparse"
require "json"
require "time"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  serial: nil,
  action: nil,
  since: nil,
  format: :text,
}
OptionParser.new do |opts|
  opts.banner = "Usage: incident-query.rb [options]"
  opts.on("--serial HEX", "Filter by cert serial (hex, case-insensitive)") { |v| options[:serial] = v.downcase }
  opts.on("--action NAME", "Filter by action name (e.g., csr.sign)") { |v| options[:action] = v }
  opts.on("--since DATE", "Filter entries since this date (ISO 8601)") { |v| options[:since] = Time.parse(v) }
  opts.on("--format FORMAT", [:text, :json], "Output format: text (default) or json") { |v| options[:format] = v }
end.parse!

entries = OimlPki::AuditLog.entries

# Apply filters
filtered = entries.select do |e|
  matches = true

  if options[:serial]
    details_json = JSON.generate(e["details"])
    # Match the serial anywhere in the details JSON (hex, case-insensitive)
    matches = false unless details_json.downcase.include?(options[:serial])
  end

  if matches && options[:action]
    matches = e["action"] == options[:action]
  end

  if matches && options[:since]
    entry_time = Time.parse(e["timestamp"])
    matches = entry_time >= options[:since]
  end

  matches
end

if filtered.empty?
  puts "No matching entries found."
  exit 0
end

case options[:format]
when :json
  puts JSON.pretty_generate(filtered)
when :text
  filtered.each do |e|
    puts "[#{e['timestamp']}] #{e['action']} (#{e['result']})"
    puts "  actor: #{e['actor']}"
    if e["details"]&.any?
      e["details"].each do |k, v|
        puts "  #{k}: #{v}"
      end
    end
    puts ""
  end
end

puts "Total: #{filtered.length} matching entries (of #{entries.length} total)"
