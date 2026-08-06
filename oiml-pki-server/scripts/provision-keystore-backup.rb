#!/usr/bin/env ruby
# frozen_string_literal: true

# Provision a Shamir backup of an IA keystore passphrase (TODO.cnml/69).
#
# Two modes:
#
#   1. Split mode (default): reads a passphrase, splits it into N
#      shares threshold M, writes the shares + a manifest.
#
#   2. Reconstruct mode (--reconstruct): reads M shares, reconstructs
#      the passphrase, writes it to the output file.
#
# Usage (split):
#
#   ruby scripts/provision-keystore-backup.rb \
#     --threshold 2 --parties 3 \
#     --passphrase <passphrase> \
#     --output-shares out/
#
# Usage (reconstruct):
#
#   ruby scripts/provision-keystore-backup.rb --reconstruct \
#     --input-shares out/share-1.txt out/share-2.txt \
#     --output-passphrase recovered.txt

require "optparse"
require "json"
require "fileutils"
require "digest"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  threshold: 2,
  parties: 3,
  reconstruct: false,
  passphrase: nil,
  output_shares: nil,
  input_shares: [],
  output_passphrase: nil,
}

OptionParser.new do |opts|
  opts.banner = "Usage: provision-keystore-backup.rb [options]"
  opts.on("--threshold N", Integer, "Threshold M (default 2)") { |v| options[:threshold] = v }
  opts.on("--parties N", Integer, "Total shares N (default 3)") { |v| options[:parties] = v }
  opts.on("--reconstruct", "Reconstruct mode (default: split)") { options[:reconstruct] = true }
  opts.on("--passphrase STR", "Passphrase to split (split mode)") { |v| options[:passphrase] = v }
  opts.on("--output-shares DIR", "Output directory for shares (split mode)") { |v| options[:output_shares] = v }
  opts.on("--input-shares PATHS", Array, "Share files to reconstruct from (reconstruct mode)") { |v| options[:input_shares] = v }
  opts.on("--output-passphrase PATH", "Output path for recovered passphrase (reconstruct mode)") { |v| options[:output_passphrase] = v }
end.parse!

if options[:reconstruct]
  abort("--input-shares required for --reconstruct") if options[:input_shares].empty?
  abort("--output-passphrase required for --reconstruct") unless options[:output_passphrase]

  shares = options[:input_shares].map do |path|
    OimlPki::SecretSharing::Share.from_s(File.read(path).strip)
  end

  secret_int = OimlPki::SecretSharing.combine(shares)
  secret_bytes = OimlPki::SecretSharing.int_to_bytes(secret_int)

  File.binwrite(options[:output_passphrase], secret_bytes)
  puts "OK — reconstructed passphrase (#{secret_bytes.bytesize} bytes) → #{options[:output_passphrase]}"
else
  abort("--passphrase required for split mode") unless options[:passphrase]
  abort("--output-shares required for split mode") unless options[:output_shares]

  secret_bytes = options[:passphrase].dup.force_encoding("BINARY")
  shares = OimlPki::SecretSharing.split(secret_bytes, n: options[:parties], k: options[:threshold])

  FileUtils.mkdir_p(options[:output_shares])
  shares.each_with_index do |share, idx|
    File.write(File.join(options[:output_shares], "share-#{idx + 1}.txt"), "#{share}\n")
  end

  manifest = {
    threshold: options[:threshold],
    parties: options[:parties],
    secret_size_bytes: secret_bytes.bytesize,
    share_fingerprints: shares.map { |s| Digest::SHA256.hexdigest(s.to_s) },
    generated_at: Time.now.utc.iso8601,
  }
  manifest_path = File.join(options[:output_shares], "manifest.json")
  File.write(manifest_path, JSON.pretty_generate(manifest) + "\n")

  # Scrub the passphrase from memory.
  options[:passphrase] = "x" * options[:passphrase].length

  puts "OK — split passphrase into #{shares.length} shares (threshold #{options[:threshold]}):"
  puts "  shares: #{options[:output_shares]}/share-{1..#{shares.length}}.txt"
  puts "  manifest: #{manifest_path}"
  puts "Print each share on paper, seal in tamper-evident envelopes, distribute to IA officers."
end
