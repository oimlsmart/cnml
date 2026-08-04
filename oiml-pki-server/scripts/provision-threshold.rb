#!/usr/bin/env ruby
# frozen_string_literal: true

# Provision a threshold quorum into the CA keystore (TODO.ops/14): run
# the ceremony's keygen (CMP20 in-process) and store the shares
# (base64) + the group's public key as the "threshold" entry, ready for
# POST /api/sign.
#
#   CONFIUM_KEYSTORE=<path> CONFIUM_PASSPHRASE=<pw> \
#     ruby scripts/provision-threshold.rb [threshold] [parties]
#
# Defaults: 2-of-3. Idempotent (the entry replaces by id).

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
# The magnus native binding (confium_native.bundle) builds into the
# confium-ruby checkout — CONFIUM_RUBY_LIB overrides the default.
confium_native_dir = ENV["CONFIUM_RUBY_LIB"] || File.expand_path("~/src/confium/confium-ruby/lib/confium_native")
$LOAD_PATH.unshift(confium_native_dir) if File.directory?(confium_native_dir)

require "oiml_pki"
require "confium_native"
require "base64"

threshold = (ARGV[0] || 2).to_i
parties = (ARGV[1] || 3).to_i
passphrase = ENV["CONFIUM_PASSPHRASE"] || abort("CONFIUM_PASSPHRASE required")

if ENV["CONFIUM_KEYSTORE"]
  OimlPki::CaStore.store_file_override = File.join(ENV["CONFIUM_KEYSTORE"], "keystore.json")
  OimlPki::CaStore.salt_file_override = File.join(ENV["CONFIUM_KEYSTORE"], "salt.bin")
  OimlPki::CaStore.lock_file_override = File.join(ENV["CONFIUM_KEYSTORE"], "keystore.lock")
end

kg = Confium::TC::Cmp20.keygen(threshold, parties)
entry = {
  "id" => "threshold",
  "type" => "confium",
  "alias" => "IA officer quorum (#{threshold}-of-#{parties})",
  "config" => {
    "scheme" => "CMP20-ECDSA-P256",
    "threshold" => threshold,
    "local_shares" => kg["shares"].map { |s| Base64.strict_encode64(s) },
    "public_key" => Base64.strict_encode64(kg["public_key"]),
  },
}
OimlPki::CaStore.add(entry, passphrase)
puts "threshold quorum provisioned: #{threshold}-of-#{parties} (public key #{kg['public_key'].bytesize} bytes)"
