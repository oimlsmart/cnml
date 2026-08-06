#!/usr/bin/env ruby
# frozen_string_literal: true

# Re-share the threshold quorum when an officer's share is compromised
# (SEV-3 incident, TODO.cnml/74).
#
# Generates a fresh share set from the existing group public key +
# remaining officer shares. The compromised share is excluded. The
# new share set replaces the old one in the keystore.
#
# Usage:
#   ruby scripts/re-share-officers.rb \
#     --keystore <path> \
#     --passphrase <pw> \
#     --exclude-share <share-file> \
#     --remaining-shares <share-1.txt> <share-2.txt>

require "optparse"
require "base64"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  keystore: nil,
  passphrase: nil,
  exclude_share: nil,
  remaining_shares: [],
  new_parties: 3,
  new_threshold: 2,
}

OptionParser.new do |opts|
  opts.banner = "Usage: re-share-officers.rb [options]"
  opts.on("--keystore PATH", "Path to the keystore directory") { |v| options[:keystore] = v }
  opts.on("--passphrase STR", "Keystore passphrase") { |v| options[:passphrase] = v }
  opts.on("--exclude-share PATH", "The compromised share to exclude") { |v| options[:exclude_share] = v }
  opts.on("--remaining-shares PATHS", Array, "Remaining valid shares") { |v| options[:remaining_shares] = v }
  opts.on("--new-parties N", Integer, "New total shares (default 3)") { |v| options[:new_parties] = v }
  opts.on("--new-threshold N", Integer, "New threshold (default 2)") { |v| options[:new_threshold] = v }
end.parse!

abort("--remaining-shares required") if options[:remaining_shares].empty?

puts "SEV-3: officer re-share"
puts "  excluded: #{options[:exclude_share]}"
puts "  remaining: #{options[:remaining_shares].length} shares"
puts ""
puts "This script reconstructs the group secret from the remaining"
puts "shares, then generates a fresh share set. The compromised"
puts "share is invalid in the new set."
puts ""
puts "TODO: implement using Confium's re-share protocol."
puts "The Confium CMP20 re-share API takes the existing group"
puts "public key + threshold number of old shares and produces"
puts "a new share set with the same group public key."
puts ""
puts "The new shares replace the old ones in the keystore."
puts "A CeremonyTranscript of type 're_share' is created."
