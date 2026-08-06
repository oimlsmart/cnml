#!/usr/bin/env ruby
# frozen_string_literal: true

# Provision a Shamir backup of the OIML Root private key (TODO.cnml/68).
#
# Two modes:
#
#   1. Split mode (default): reads the root private key, splits it
#      into N shares threshold M, writes the shares + a manifest.
#
#   2. Reconstruct mode (--reconstruct): reads M shares, reconstructs
#      the private key, writes it to the output file.
#
# Usage (split):
#
#   ruby scripts/provision-root-backup.rb \
#     --threshold 5 --parties 7 \
#     --input-root-key root-key.dat \
#     --output-shares out/
#
# Usage (reconstruct):
#
#   ruby scripts/provision-root-backup.rb --reconstruct \
#     --input-shares out/share-1.txt out/share-2.txt out/share-3.txt \
#                    out/share-4.txt out/share-5.txt \
#     --output-root-key recovered.dat

require "optparse"
require "json"
require "fileutils"
require "securerandom"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  threshold: 5,
  parties: 7,
  reconstruct: false,
  input_root_key: nil,
  output_shares: nil,
  input_shares: [],
  output_root_key: nil,
}

OptionParser.new do |opts|
  opts.banner = "Usage: provision-root-backup.rb [options]"
  opts.on("--threshold N", Integer, "Threshold M (default 5)") { |v| options[:threshold] = v }
  opts.on("--parties N", Integer, "Total shares N (default 7)") { |v| options[:parties] = v }
  opts.on("--reconstruct", "Reconstruct mode (default: split)") { options[:reconstruct] = true }
  opts.on("--input-root-key PATH", "Path to the root private key (split mode)") { |v| options[:input_root_key] = v }
  opts.on("--output-shares DIR", "Output directory for shares (split mode)") { |v| options[:output_shares] = v }
  opts.on("--input-shares PATHS", Array, "Share files to reconstruct from (reconstruct mode)") { |v| options[:input_shares] = v }
  opts.on("--output-root-key PATH", "Output path for reconstructed key (reconstruct mode)") { |v| options[:output_root_key] = v }
end.parse!

if options[:reconstruct]
  abort("--input-shares required for --reconstruct") if options[:input_shares].empty?
  abort("--output-root-key required for --reconstruct") unless options[:output_root_key]

  shares = options[:input_shares].map do |path|
    OimlPki::SecretSharing::Share.from_s(File.read(path).strip)
  end

  secret_int = OimlPki::SecretSharing.combine(shares)
  secret_bytes = OimlPki::SecretSharing.int_to_bytes(secret_int)

  File.binwrite(options[:output_root_key], secret_bytes)
  puts "OK — reconstructed root key (#{secret_bytes.bytesize} bytes) → #{options[:output_root_key]}"
  puts "Verify: the recovered public key must match the manifest's public_key."
else
  abort("--input-root-key required for split mode") unless options[:input_root_key]
  abort("--output-shares required for split mode") unless options[:output_shares]

  secret_bytes = File.binread(options[:input_root_key])
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
  require "digest"
  manifest_path = File.join(options[:output_shares], "manifest.json")
  File.write(manifest_path, JSON.pretty_generate(manifest) + "\n")

  puts "OK — split into #{shares.length} shares (threshold #{options[:threshold]}):"
  puts "  shares: #{options[:output_shares]}/share-{1..#{shares.length}}.txt"
  puts "  manifest: #{manifest_path}"
  puts "Print each share on paper, seal in tamper-evident envelopes, distribute to CIML directors."
end
