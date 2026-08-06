#!/usr/bin/env ruby
# frozen_string_literal: true

# Publish the transparency log as static files for CDN distribution
# (TODO.cnml/77, wraps TransparencyPublisher.publish_to_directory).
#
# Writes head.json, leaf/*, and proof/*.json to the output directory.
# The operator uploads this directory to the public CDN after each
# signing ceremony (or weekly via cron).
#
# Usage:
#   ruby scripts/publish-transparency-log.rb [--output-dir DIR]

require "optparse"
require "oiml_pki"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))

options = { output_dir: File.join(OimlPki::OUTPUT_DIR, "transparency") }
OptionParser.new do |opts|
  opts.banner = "Usage: publish-transparency-log.rb [--output-dir DIR]"
  opts.on("--output-dir DIR", "Output directory (default: output/transparency)") { |v| options[:output_dir] = v }
end.parse!

head = OimlPki::TransparencyPublisher.publish_to_directory(options[:output_dir])
puts "OK — published transparency log to #{options[:output_dir]}"
puts "  root: #{head[:root]}"
puts "  size: #{head[:size]} leaves"
puts "  timestamp: #{head[:timestamp]}"
puts ""
puts "Upload this directory to the public CDN."
