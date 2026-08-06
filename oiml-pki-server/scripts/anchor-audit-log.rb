#!/usr/bin/env ruby
# frozen_string_literal: true

# Anchor the audit log's hash-chain head to the transparency log
# (TODO.cnml/70).
#
# The audit log is hash-chained, but the chain lives in a single
# file the operator can rewrite. Anchoring the head to the
# transparency log (itself Bitcoin-anchored via OpenTimestamps)
# inherits append-only-ness: rewriting any earlier audit-log
# entry invalidates the Bitcoin-anchored head.
#
# Idempotent within the same head: re-anchoring the same head is
# a no-op. The IA's runbook recommends running this script weekly
# or after every ceremony.
#
# Usage:
#   ruby scripts/anchor-audit-log.rb
#
# Outputs the transparency-log sequence number, or "noop" if the
# head was already anchored.

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

seq = OimlPki::AuditLog.anchor_to_transparency_log!
if seq.nil?
  puts "noop — head was already anchored or the transparency log is unavailable"
else
  puts "OK — anchored audit-log head as transparency-log leaf ##{seq}"
end
