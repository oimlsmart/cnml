# frozen_string_literal: true

# OIML PKI — air-gapped CA server library.
#
# This file is the namespace entry point. It defines autoload entries
# for every public module; the actual implementations live in
# lib/oiml_pki/<name>.rb and are loaded on first reference.
#
# Internal library code MUST use autoload (never require_relative or
# string-form require for files inside lib/oiml_pki/). External gems
# are required normally with `require`.

require "openssl"
require "json"
require "securerandom"
require "base64"
require "fileutils"
require "time"

module OimlPki
  VERSION = "0.1.0"

  # Air-gapped root keystore dir. Created on first access.
  KEYSTORE_DIR = File.expand_path("~/.oiml-pki")
  OUTPUT_DIR   = File.expand_path("output", File.join(File.dirname(__FILE__), "..", ".."))

  FileUtils.mkdir_p(KEYSTORE_DIR)
  FileUtils.mkdir_p(OUTPUT_DIR)

  # X.509 OID for the OIML scope extension. Placeholder PEN (99999) —
  # replace with OIML's IANA-registered Private Enterprise Number.
  OIML_SCOPE_OID = "1.3.6.1.4.1.99999.1.1"

  # Autoload entries — one per public module. Adding a new module is
  # a one-line change here, plus the implementation file under
  # lib/oiml_pki/.
  autoload :CaStore,              "oiml_pki/ca_store"
  autoload :CertFactory,          "oiml_pki/cert_factory"
  autoload :Publisher,            "oiml_pki/publisher"
  autoload :RecommendationReader, "oiml_pki/recommendation_reader"
  autoload :KeyProvider,          "oiml_pki/key_provider"
  autoload :AuditLog,             "oiml_pki/audit_log"
  autoload :SecretSharing,        "oiml_pki/secret_sharing"
end
