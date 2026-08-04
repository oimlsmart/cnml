#!/usr/bin/env ruby
# frozen_string_literal: true

# OIML PKI CA Server — air-gapped local web GUI for CA operators.
#
# Usage: ruby app.rb
# Then open Firefox → http://localhost:4455
#
# This is a thin Sinatra wrapper. All business logic lives in
# lib/oiml_pki/ (autoload'd from lib/oiml_pki.rb).

require "sinatra"
$LOAD_PATH.unshift(File.expand_path("lib", __dir__))
require "oiml_pki"   # one require at the entry point; everything else autoloads

set :port, 4455
set :bind, "127.0.0.1"
set :public_folder, File.expand_path("public", __dir__)
enable :sessions   # MUST be configured before any route uses session[]

# ─── Helpers ───────────────────────────────────────────────────────────

def require_passphrase!
  session[:passphrase] || halt(401, "Passphrase required. Open the dashboard first.")
end

def build_subject(params)
  parts = []
  parts << "CN=#{params[:common_name]}" if params[:common_name]
  parts << "O=#{params[:organization]}" if params[:organization]
  parts << "C=#{params[:country]}" if params[:country]
  parts.join(", ")
end

before do
  content_type :html
  response.headers["Cache-Control"] = "no-cache"
end

# ─── Routes ────────────────────────────────────────────────────────────

get "/" do
  passphrase = session[:passphrase]
  @entries = passphrase ? OimlPki::CaStore.all(passphrase) : []
  @roots          = @entries.select { |e| e["role"] == "root" }
  @intermediates  = @entries.select { |e| e["role"] == "intermediate" }
  @signers        = @entries.select { |e| e["role"] == "end-entity" }
  @output_files   = OimlPki::Publisher.output_files
  erb :dashboard
end

post "/unlock" do
  session[:passphrase] = params[:passphrase]
  begin
    OimlPki::CaStore.load(params[:passphrase])
    redirect "/"
  rescue => e
    @error = "Failed to unlock: #{e.message}"
    erb :dashboard
  end
end

get "/root/new" do
  erb :root_new
end

post "/root/create" do
  passphrase = require_passphrase!
  subject = build_subject(params)
  cert = OimlPki::CertFactory.generate_root_ca(subject, params[:validity].to_i, passphrase)
  OimlPki::AuditLog.append("root.create", details: {
    subject: subject,
    validity_years: params[:validity].to_i,
    fingerprint: OpenSSL::Digest::SHA256.hexdigest(cert.to_der),
  })
  @message = "Root CA created: #{cert.subject}"
  @cert_pem = cert.to_pem
  erb :success
end

get "/csr/sign" do
  passphrase = require_passphrase!
  @cas = OimlPki::CaStore.all(passphrase).select { |e| ["root", "intermediate"].include?(e["role"]) && e["privateKey"] }
  @recommendations = OimlPki::RecommendationReader.list
  erb :csr_sign
end

post "/csr/sign" do
  passphrase = require_passphrase!
  if params[:csr_file]
    csr_pem = params[:csr_file][:tempfile].read
  else
    halt(400, "No CSR file uploaded")
  end

  ca = OimlPki::CaStore.find(params[:ca_id], passphrase)
  halt(404, "CA not found") unless ca

  scope_params = params[:scope] || []
  scope = scope_params.is_a?(Array) ? scope_params : scope_params.values
  scope = scope.reject(&:empty?).map(&:upcase)
  if params[:role] == "end-entity" && ca["scope"] && !ca["scope"].empty?
    out_of_scope = scope - ca["scope"]
    halt(400, "End-entity scope exceeds CA scope: #{out_of_scope.join(', ')}") unless out_of_scope.empty?
  end

  cert = OimlPki::CertFactory.sign_csr(
    csr_pem, ca["privateKey"], ca["certificate"],
    params[:validity].to_i, params[:role], passphrase,
    scope: scope
  )
  OimlPki::AuditLog.append("csr.sign", details: {
    csr_subject: cert.subject.to_s,
    ca_id:       params[:ca_id],
    role:        params[:role],
    scope:       scope,
    validity_years: params[:validity].to_i,
    cert_serial: cert.serial.to_s(16),
  })
  scope_note = scope.empty? ? "" : " (scope: #{scope.join(', ')})"
  @message = "Certificate signed#{scope_note}: #{cert.subject}"
  @cert_pem = cert.to_pem
  erb :success
end

get "/crl" do
  passphrase = require_passphrase!
  @cas = OimlPki::CaStore.all(passphrase).select { |e| e["privateKey"] }
  erb :crl_manage
end

# ─── Machine enrollment (the app's CNML bridge) ─────────────────────
# The app's signing flow enrolls an officer key with the CA here: a
# CSR in, the CA-signed certificate + chain out, JSON. The ceremony UX
# above stays the human path; this is the machine path (the bridge
# carries the CA passphrase for the deployment's enrollment account —
# the dev posture; an API-key scheme replaces it with the CA leg's
# hardening).
post "/api/enroll" do
  content_type :json
  body = JSON.parse(request.body.read) rescue halt(400, { error: "invalid JSON" }.to_json)
  passphrase = body["passphrase"]
  halt(401, { error: "passphrase required" }.to_json) unless passphrase

  csr_pem = body["csr_pem"].to_s
  halt(400, { error: "csr_pem required" }.to_json) if csr_pem.empty?
  ca = begin
    OimlPki::CaStore.find(body["ca_id"], passphrase)
  rescue StandardError
    halt(401, { error: "the passphrase does not unlock the keystore" }.to_json)
  end
  halt(404, { error: "CA not found" }.to_json) unless ca

  scope = Array(body["scope"]).reject(&:empty?).map(&:upcase)
  role = body["role"] || "end-entity"
  if role == "end-entity" && ca["scope"] && !ca["scope"].empty?
    out_of_scope = scope - ca["scope"]
    halt(400, { error: "scope exceeds CA scope: #{out_of_scope.join(', ')}" }.to_json) unless out_of_scope.empty?
  end

  cert = OimlPki::CertFactory.sign_csr(
    csr_pem, ca["privateKey"], ca["certificate"],
    (body["validity_years"] || 1).to_i, role, passphrase,
    scope: scope
  )
  OimlPki::AuditLog.append("api.enroll", details: {
    csr_subject: cert.subject.to_s,
    ca_id: body["ca_id"],
    role: role,
    scope: scope,
    cert_serial: cert.serial.to_s(16),
  })
  {
    certificate_pem: cert.to_pem,
    chain_pem: [ca["certificate"]],
    serial: cert.serial.to_s(16),
  }.to_json
end

# ─── Revocation (the CRL end to end) ────────────────────────────────
# The app's lifecycle actions (suspend/withdraw) post the revoked
# serial here; the CA re-issues and publishes the CRL on every change
# (lift-suspension removes the serial). The revoked set persists on the
# CA's keystore entry — re-issued CRLs are cumulative, never a fresh
# list.
post "/api/crl/revoke" do
  content_type :json
  body = JSON.parse(request.body.read) rescue halt(400, { error: "invalid JSON" }.to_json)
  passphrase = body["passphrase"]
  halt(401, { error: "passphrase required" }.to_json) unless passphrase
  ca = begin
    OimlPki::CaStore.find(body["ca_id"], passphrase)
  rescue StandardError
    halt(401, { error: "the passphrase does not unlock the keystore" }.to_json)
  end
  halt(404, { error: "CA not found" }.to_json) unless ca

  revoked = ca["revoked"] ||= []
  serial = body["serial"].to_s
  halt(400, { error: "serial required" }.to_json) if serial.empty?
  if body["action"] == "reinstate"
    revoked.reject! { |r| r["serial"].to_s == serial }
  else
    unless revoked.any? { |r| r["serial"].to_s == serial }
      revoked << { "serial" => serial.to_i, "date" => body["date"] || Time.now.iso8601 }
    end
  end
  OimlPki::CaStore.add(ca, passphrase)

  crl = OimlPki::CertFactory.create_crl(ca["privateKey"], ca["certificate"], revoked)
  path = OimlPki::Publisher.publish_crl(crl, ca["alias"])
  OimlPki::AuditLog.append("api.crl.revoke", details: {
    ca_id: body["ca_id"],
    serial: serial,
    action: body["action"] || "revoke",
    revoked_count: revoked.length,
    path: path,
  })
  { revoked: revoked.map { |r| r["serial"] }, crl_url: crl_url_for(ca), revoked_count: revoked.length }.to_json
end

# ─── Threshold signing (the quorum at issuance) ───────────────────
# The quorum signs arbitrary bytes via the CA's threshold KeyProvider
# (FROST: no single party holds the key). The deployment registers its
# threshold config in the keystore (the "threshold" entry: local_shares
# for ceremonies/tests; the coordinator's endpoint+quorum_id for
# production). The answer carries the signature + the quorum attestation
# (the provider's label — scheme and N-of-M), which the issuer records
# into the certificate's provenance.
post "/api/sign" do
  content_type :json
  body = JSON.parse(request.body.read) rescue halt(400, { error: "invalid JSON" }.to_json)
  passphrase = body["passphrase"]
  halt(401, { error: "passphrase required" }.to_json) unless passphrase

  data_b64 = body["data_b64"].to_s
  halt(400, { error: "data_b64 required (base64 of the bytes to sign)" }.to_json) if data_b64.empty?
  begin
    data = Base64.decode64(data_b64)
  rescue ArgumentError
    halt(400, { error: "data_b64 is not valid base64" }.to_json)
  end

  entry = OimlPki::CaStore.find(body["threshold_id"] || "threshold", passphrase)
  halt(404, { error: "no threshold entry in the keystore (provision the quorum first — the 'threshold' entry)" }.to_json) unless entry
  halt(400, { error: "the entry is not a threshold provider (type #{entry['type'] || 'software'})" }.to_json) unless entry["type"] == "confium"

  provider = OimlPki::KeyProvider::Confium.new(entry["config"])
  signature = begin
    provider.sign(data)
  rescue LoadError, RuntimeError => e
    if e.message.include?("confium") && (e.message.include?("not available") || e.message.include?("Could not open library"))
      halt(503, { error: "the confium native binding is unavailable on this CA (build the confium-ruby native lib): #{e.message[0, 160]}" }.to_json)
    end
    halt(500, { error: "the threshold ceremony failed: #{e.message}" }.to_json)
  end

  OimlPki::AuditLog.append("api.sign.threshold", details: {
    threshold_id: body["threshold_id"] || "threshold",
    provider: provider.label,
    data_len: data.length,
  })
  {
    signature_b64: Base64.strict_encode64(signature),
    attestation: {
      provider: provider.label,
      quorum_id: entry.dig("config", "quorum_id"),
      threshold: entry.dig("config", "threshold"),
      num_parties: entry.dig("config", "local_shares")&.length,
      session: "api.sign.threshold",
      at: Time.now.iso8601,
    },
  }.to_json
end

get "/crl.pem" do
  ca_alias = params[:ca] || "OIML Root CA"
  fname = ca_alias.gsub(/[^A-Za-z0-9]/, "-").downcase
  path = File.join(OimlPki::OUTPUT_DIR, "crls", "#{fname}.crl")
  halt(404, { error: "no CRL issued for #{ca_alias} yet" }.to_json) unless File.exist?(path)
  content_type "application/pkcs7-crl"
  File.binread(path)
end

helpers do
  # The URL certs point at (the CRL DP extension) — the deployment's
  # public base for this CA (OIML_CRL_BASE_URL; the dev default).
  def crl_url_for(ca)
    base = ENV["OIML_CRL_BASE_URL"] || "http://localhost:4455"
    "#{base.gsub(/\/$/, '')}/crl.pem?ca=#{ERB::Util.url_encode(ca['alias'])}"
  end
end



post "/crl/create" do
  passphrase = require_passphrase!
  ca = OimlPki::CaStore.find(params[:ca_id], passphrase)
  halt(404, "CA not found") unless ca

  revoked = []
  if params[:revoke_serials] && params[:revoke_serials].strip != ""
    params[:revoke_serials].split("\n").each do |line|
      serial, date = line.strip.split(",")
      next unless serial
      revoked << { "serial" => serial.to_i, "date" => date || Time.now.iso8601 }
    end
  end

  crl = OimlPki::CertFactory.create_crl(ca["privateKey"], ca["certificate"], revoked)
  path = OimlPki::Publisher.publish_crl(crl, ca["alias"])
  OimlPki::AuditLog.append("crl.create", details: {
    ca_id: params[:ca_id],
    revoked_count: revoked.length,
    revoked_serials: revoked.map { |r| r["serial"].to_s },
    path: path,
  })
  @message = "CRL generated and published to #{path}"
  erb :success
end

get "/publish" do
  passphrase = require_passphrase!
  @entries = OimlPki::CaStore.all(passphrase)
  @output_files = OimlPki::Publisher.output_files
  erb :publish
end

post "/publish" do
  passphrase = require_passphrase!
  entries = OimlPki::CaStore.all(passphrase)
  published = OimlPki::Publisher.publish_certs(entries)
  OimlPki::AuditLog.append("publish.artifacts", details: {
    count: published.size,
    paths: published,
  })
  @message = "Published #{published.size} files to output directory"
  @output_files = OimlPki::Publisher.output_files
  erb :success
end

get "/csr/generate" do
  erb :csr_generate
end

post "/csr/generate" do
  passphrase = require_passphrase!
  subject = build_subject(params)
  key = OimlPki::CertFactory.generate_signing_key
  csr = OimlPki::CertFactory.create_csr(subject, key)
  entry = {
    "id"          => "ia-key-#{SecureRandom.hex(6)}",
    "alias"       => params[:common_name],
    "role"        => "intermediate",
    "privateKey"  => key.to_pem,
    "certificate" => nil,
    "fingerprint" => OpenSSL::Digest::SHA256.hexdigest(key.public_key.to_der),
    "algorithm"   => OimlPki::CertFactory.algorithm_for(key),
    "createdAt"   => Time.now.iso8601,
  }
  OimlPki::CaStore.add(entry, passphrase)
  @csr_pem = csr.to_pem
  @message = "CSR generated (#{entry['algorithm']}). Download and send to the parent CA."
  erb :success
end

get "/download/:type/:id" do
  passphrase = require_passphrase!
  entry = OimlPki::CaStore.find(params[:id], passphrase)
  halt(404) unless entry

  case params[:type]
  when "cert"
    content_type "application/x-pem-file"
    attachment "#{entry['alias'].gsub(/\s+/, '_')}.crt"
    entry["certificate"] || halt(404, "No certificate stored")
  when "key"
    content_type "application/x-pem-file"
    attachment "#{entry['alias'].gsub(/\s+/, '_')}.key"
    entry["privateKey"] || halt(404, "No private key stored")
  when "csr"
    content_type "application/x-pem-file"
    attachment "#{entry['alias'].gsub(/\s+/, '_')}.csr"
    entry["csr"] || halt(404, "No CSR stored")
  end
end

get "/audit" do
  require_passphrase!
  @entries = OimlPki::AuditLog.entries
  @chain_status = OimlPki::AuditLog.verify_chain
  erb :audit
end
