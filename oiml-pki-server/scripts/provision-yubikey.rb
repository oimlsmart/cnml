#!/usr/bin/env ruby
# frozen_string_literal: true

# Provision a Yubikey (or any PKCS#11 device) for use as an OIML CA
# key backend. Generates a fresh key on the device, self-signs a cert,
# and registers a keystore entry pointing to it.
#
# Prerequisites:
#   - Yubikey inserted (or other PKCS#11 device)
#   - PKCS#11 module installed:
#       macOS:  brew install opensc → /opt/homebrew/lib/opensc-pkcs11.so
#       Linux:  apt install opensc  → /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
#       Yubico: /usr/local/lib/libykcs11.dylib (from yubico-piv-tool)
#   - User PIN set on the device (yubico-piv-tool -a change-pin)
#   - OIML_PKCS11_PIN env var exported
#   - ruby-pkcs11 gem installed (gem install pkcs11)
#
# Usage:
#   export OIML_PKCS11_PIN=123456
#   ruby scripts/provision-yubikey.rb \
#     --module /opt/homebrew/lib/opensc-pkcs11.so \
#     --slot 0 \
#     --cn "NMi Intermediate CA" \
#     --o "NMi Certin B.V." \
#     --c NL \
#     --algorithm ECDSA-P256 \
#     --validity 10

require "optparse"
require "fileutils"

$LOAD_PATH.unshift(File.expand_path("../lib", __dir__))
require "oiml_pki"

options = {
  module: ENV["OIML_PKCS11_MODULE"] || "/opt/homebrew/lib/opensc-pkcs11.so",
  slot: 0,
  algorithm: "ECDSA-P256",
  validity: 10,
  cert_id: "01",
}
OptionParser.new do |opts|
  opts.banner = "Usage: provision-yubikey.rb [options]"
  opts.on("--module PATH", "PKCS#11 module path")    { |v| options[:module] = v }
  opts.on("--slot N", Integer, "PKCS#11 slot index") { |v| options[:slot] = v }
  opts.on("--cert-id HEX", "Hex CKA_ID for the new key (default 01)") { |v| options[:cert_id] = v }
  opts.on("--algorithm ALG", "ECDSA-P256 (default), ECDSA-P384, Ed25519, RSA-2048") { |v| options[:algorithm] = v }
  opts.on("--cn NAME", "Common Name (required)")     { |v| options[:cn] = v }
  opts.on("--o NAME", "Organization")                { |v| options[:o] = v }
  opts.on("--c CC", "Country (2 letters)")           { |v| options[:c] = v }
  opts.on("--validity YEARS", Integer, "Cert validity (default 10)") { |v| options[:validity] = v }
  opts.on("--keystore-passphrase P", "Keystore passphrase (or prompt)") { |v| options[:keystore_pass] = v }
end.parse!

unless options[:cn]
  abort "Error: --cn is required. See --help."
end
unless ENV["OIML_PKCS11_PIN"]
  abort "Error: OIML_PKCS11_PIN env var not set. Export it before running."
end

# ─── Generate the key on the device ────────────────────────────────────
# Uses the PKCS#11 module to drive key generation. The private key
# NEVER leaves the device.

require "pkcs11"

puts "→ Opening PKCS#11 session on #{options[:module]}..."
pkcs11 = PKCS11.open(options[:module])
slot = pkcs11.active_slots[options[:slot]]
unless slot
  abort "Error: slot #{options[:slot]} not found (device has #{pkcs11.active_slots.length} slots)"
end
session = slot.open
session.login(:user, ENV["OIML_PKCS11_PIN"])
puts "✓ Logged in to slot #{options[:slot]} (#{slot.info.description})"

# Generate the keypair on-device
mechanism = case options[:algorithm]
when "ECDSA-P256" then [CKM_EC_KEY_GEN_PAIR, nil]
when "ECDSA-P384" then [CKM_EC_KEY_GEN_PAIR, nil]
when "Ed25519"    then [CKM_EC_EDWARDS_KEY_GEN_PAIR, nil]
when "RSA-2048"   then [CKM_RSA_PKCS_KEY_PAIR_GEN, nil]
else abort "Unsupported algorithm: #{options[:algorithm]}"
end

id_bytes = [options[:cert_id]].pack("H*")
puts "→ Generating #{options[:algorithm]} keypair (id=#{options[:cert_id]})..."
pub, priv = session.generate_keypair(
  mechanism,
  public_template:  { CKA_ID => id_bytes, CKA_VERIFY => true },
  private_template: { CKA_ID => id_bytes, CKA_SIGN => true, CKA_SENSITIVE => true, CKA_EXTRACTABLE => false },
)
puts "✓ Keys generated. Private key is non-extractable."

# Read the public key DER off the device, build a self-signed cert.
pub_der = pub.value
pub_key = OpenSSL::PKey.read(pub_der)
puts "✓ Public key: #{pub_key.class.name.split('::').last} (#{pub_der.bytesize} bytes DER)"

# Build a self-signed cert via CertFactory (uses the device for signing)
# We construct manually since CertFactory.generate_root_ca uses software keys.
subject_dn = "CN=#{options[:cn]}"
subject_dn += ", O=#{options[:o]}" if options[:o]
subject_dn += ", C=#{options[:c]}" if options[:c]

cert = OpenSSL::X509::Certificate.new
cert.version = 2
cert.serial = SecureRandom.random_number(1 << 128)
cert.subject = OpenSSL::X509::Name.parse(subject_dn)
cert.issuer = cert.subject
cert.public_key = pub_key
cert.not_before = Time.now
cert.not_after = Time.now + options[:validity] * 365 * 86400

ef = OpenSSL::X509::ExtensionFactory.new
ef.subject_certificate = cert
ef.issuer_certificate = cert
cert.add_extension(ef.create_extension("basicConstraints", "CA:TRUE", true))
cert.add_extension(ef.create_extension("keyUsage", "keyCertSign, cRLSign", true))
cert.add_extension(ef.create_extension("subjectKeyIdentifier", "hash"))

# Sign via the device
provider = OimlPki::KeyProvider::Pkcs11.new(
  "module" => options[:module],
  "slot"   => options[:slot],
  "cert_id" => options[:cert_id],
)
signed_cert = OimlPki::CertFactory.send(:sign_cert_with_provider, cert, provider)
puts "✓ Cert signed on device: #{cert.subject}"

session.logout
session.close

# ─── Register in keystore ─────────────────────────────────────────────

passphrase = options[:keystore_pass] || begin
  print "Keystore passphrase: "
  STDIN.noecho(&:gets).chomp
end

entry = {
  "id"          => "yubikey-#{options[:cert_id]}-#{SecureRandom.hex(4)}",
  "alias"       => options[:cn],
  "role"        => "intermediate",
  "certificate" => signed_cert.to_pem,
  "fingerprint" => OpenSSL::Digest::SHA256.hexdigest(signed_cert.to_der),
  "createdAt"   => Time.now.iso8601,
  "notAfter"    => signed_cert.not_after.iso8601,
  "pkcs11"      => provider.to_h.merge("type" => "pkcs11"),
}
OimlPki::CaStore.add(entry, passphrase)

OimlPki::AuditLog.append("yubikey.provision", details: {
  subject: subject_dn,
  algorithm: options[:algorithm],
  module: options[:module],
  slot: options[:slot],
  cert_id: options[:cert_id],
  entry_id: entry["id"],
})

puts ""
puts "✓ Done."
puts "  Entry ID:       #{entry['id']}"
puts "  Subject:        #{signed_cert.subject}"
puts "  Fingerprint:    sha256:#{entry['fingerprint'][0,32]}…"
puts "  Validity:       #{signed_cert.not_before.iso8601} → #{signed_cert.not_after.iso8601}"
puts "  PKCS#11 module: #{options[:module]}"
puts "  Slot:           #{options[:slot]}"
puts "  Cert ID (hex):  #{options[:cert_id]}"
puts ""
puts "  The private key NEVER left the device. Verify via:"
puts "    pkcs11-tool --module #{options[:module]} -l -O"
