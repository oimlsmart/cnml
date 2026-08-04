#!/usr/bin/env ruby
# frozen_string_literal: true

# Rotate a signer key in response to a compromise (SEV-2 incident).
#
# What this does:
#   1. Adds the compromised signer's cert serial to a new CRL signed by
#      the specified intermediate CA.
#   2. Generates a new signer keypair.
#   3. Produces a CSR for the new key, ready to be sent to BIML
#      (or self-signed by the IA's intermediate if the IA self-issues
#      signer certs).
#   4. Logs all operations to the audit log.

require "optparse"
require "readline"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  revoked_serials: [],
  ca_id: nil,
  new_cn: nil,
  new_o: nil,
  new_c: nil,
  validity: 2,
  self_sign: false,
}
OptionParser.new do |opts|
  opts.banner = "Usage: rotate-signer-key.rb [options]"
  opts.on("--ca-id ID", "Keystore entry id of the signing CA") { |v| options[:ca_id] = v }
  opts.on("--revoke SERIAL[,SERIAL...]", "Comma-separated list of serials to revoke") do |v|
    options[:revoked_serials] = v.split(",").map { |s| s.strip.to_i(16) }
  end
  opts.on("--new-cn NAME", "Common Name for the new signer") { |v| options[:new_cn] = v }
  opts.on("--new-o NAME", "Organization")                     { |v| options[:new_o] = v }
  opts.on("--new-c CC", "Country (2 letters)")                { |v| options[:new_c] = v }
  opts.on("--validity YEARS", Integer, "New signer validity (default 2)") { |v| options[:validity] = v }
  opts.on("--[no-]self-sign", "If set, immediately sign the new CSR with the CA") do |v|
    options[:self_sign] = v
  end
end.parse!

unless options[:ca_id]
  abort "Error: --ca-id is required. See --help."
end
unless options[:revoked_serials].any?
  abort "Error: --revoke is required (list the compromised serials). See --help."
end
unless options[:new_cn]
  abort "Error: --new-cn is required. See --help."
end

# ─── Passphrase ────────────────────────────────────────────────────────

print "Keystore passphrase: "
keystore_pass = STDIN.noecho(&:gets).chomp
puts

# ─── Find the CA entry ────────────────────────────────────────────────

ca_entry = OimlPki::CaStore.find(options[:ca_id], keystore_pass)
abort "Error: CA '#{options[:ca_id]}' not found in keystore." unless ca_entry

puts "→ Found CA: #{ca_entry['alias']} (#{ca_entry['role']})"

# ─── Step 1: generate a new CRL with the revoked serials ──────────────

puts "→ Generating new CRL with #{options[:revoked_serials].length} revoked serials…"
revoked_entries = options[:revoked_serials].map do |serial|
  { "serial" => serial, "date" => Time.now.utc.iso8601 }
end
crl = OimlPki::CertFactory.create_crl(ca_entry["privateKey"], ca_entry["certificate"], revoked_entries)
crl_path = OimlPki::Publisher.publish_crl(crl, ca_entry["alias"])
puts "✓ CRL published: #{crl_path}"

OimlPki::AuditLog.append("incident.rotate.crl", details: {
  severity: "SEV-2",
  ca_id: options[:ca_id],
  revoked_serials: options[:revoked_serials].map { |s| s.to_s(16) },
  crl_path: crl_path,
})

# ─── Step 2: generate the new signer keypair + CSR ────────────────────

puts "→ Generating new signer keypair…"
new_key = OimlPki::CertFactory.generate_signing_key
subject_parts = ["CN=#{options[:new_cn]}"]
subject_parts << "O=#{options[:new_o]}" if options[:new_o]
subject_parts << "C=#{options[:new_c]}" if options[:new_c]
subject = subject_parts.join(", ")

new_csr = OimlPki::CertFactory.create_csr(subject, new_key)
puts "✓ New CSR:"
puts new_csr.to_pem

OimlPki::AuditLog.append("incident.rotate.csr_generated", details: {
  severity: "SEV-2",
  new_subject: subject,
  new_algorithm: OimlPki::CertFactory.algorithm_for(new_key),
  replacement_for: options[:revoked_serials].map { |s| s.to_s(16) },
})

# ─── Step 3 (optional): self-sign the new CSR ─────────────────────────

if options[:self_sign]
  puts "→ Self-signing the new CSR with #{ca_entry['alias']}…"
  inherited_scope = ca_entry["scope"] || []
  if inherited_scope.empty?
    puts "⚠ CA has no scope — new signer will be unrestricted. Continuing."
  end
  new_cert = OimlPki::CertFactory.sign_csr(
    new_csr.to_pem, ca_entry["privateKey"], ca_entry["certificate"],
    options[:validity], "end-entity", keystore_pass,
    scope: inherited_scope,
  )

  new_entry_id = "signed-#{new_cert.serial.to_s(16)}"
  OimlPki::CaStore.add({
    "id"          => new_entry_id,
    "alias"       => options[:new_cn],
    "role"        => "end-entity",
    "certificate" => new_cert.to_pem,
    "privateKey"  => new_key.to_pem,
    "fingerprint" => OpenSSL::Digest::SHA256.hexdigest(new_cert.to_der),
    "createdAt"   => Time.now.iso8601,
    "notAfter"    => new_cert.not_after.iso8601,
    "scope"       => inherited_scope,
  }, keystore_pass)

  puts "✓ New signer cert:"
  puts new_cert.to_pem
  puts "✓ Added to keystore as '#{new_entry_id}' (scope: #{inherited_scope.join(', ')})"

  OimlPki::AuditLog.append("incident.rotate.cert_issued", details: {
    severity: "SEV-2",
    new_entry_id: new_entry_id,
    new_cert_serial: new_cert.serial.to_s(16),
    new_cert_subject: subject,
    new_validity_years: options[:validity],
    inherited_scope: inherited_scope,
  })
else
  puts ""
  puts "Next step: send the new CSR to the CA operator for signing."
  puts "(Or re-run with --self-sign to sign it locally with #{ca_entry['alias']}.)"
end

# ─── Summary ──────────────────────────────────────────────────────────

puts ""
puts "✓ Rotation complete."
puts "  Revoked: #{options[:revoked_serials].length} serial(s)"
puts "  CRL: #{crl_path}"
puts "  Audit log: appended 2 entries"
puts ""
puts "Operator next steps:"
puts "  1. USB-transfer the CRL to the pki-artifacts repo"
puts "  2. Notify all verifiers to refresh their CRL cache"
puts "  3. Distribute the new signer cert to the affected signer"
puts "  4. Re-sign affected CNMLs (audit log can enumerate them via incident-query.rb)"
