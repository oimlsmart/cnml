# frozen_string_literal: true

# Confium deployment manifest (`confium.toml`) loader, validator,
# and generator.
#
# The manifest is the single source of truth for a CNML deployment:
# the five-tier hierarchy (BIML Root → IA → TL → Manufacturer Model →
# Instance), quorum definitions, transparency log endpoints, async
# signing defaults, archival cadence, and PQC migration trajectory.
#
# Mirrors the schema in `confium/crates/confium-deployment/src/manifest.rs`.
# Both this Ruby loader and the Rust one accept the same TOML. The
# Ruby implementation is for the CA server (it generates the manifest
# from the keystore); the TypeScript port is for the
# browser verifier.
#
module OimlPki
  module DeploymentManifest
    # Manifest schema version. Bumped on incompatible changes.
    MANIFEST_VERSION = 1

    class Error < StandardError; end
    class ParseError < Error; end
    class ValidationError < Error; end

    class << self
      # Path overrides for testing (same pattern as CaStore / AuditLog).
      attr_accessor :fixture_dir_override
    end

    module_function

    # Load a manifest from a TOML string, file path, or parsed Hash.
    # Always validates; raises ValidationError if invalid.
    #
    # @param source [String, Hash] TOML string, file path, or pre-parsed Hash
    # @return [Manifest] validated manifest object
    def load(source)
      parsed = coerce_to_hash(source)
      report = validate(parsed)
      raise ValidationError, "manifest invalid: #{report.errors.join('; ')}" unless report.valid?

      Manifest.new(parsed)
    end

    # Validate a parsed manifest Hash. Returns a report — never raises
    # on validation failures (only on parse failures).
    #
    # @param parsed [Hash] manifest as a Hash (TOML keys → Ruby values)
    # @return [ValidationReport]
    def validate(parsed)
      report = ValidationReport.new

      deployment = parsed["deployment"]
      if deployment.nil?
        report.add_error("manifest missing [deployment] section")
        return report
      end

      if deployment["manifest_version"] != MANIFEST_VERSION
        report.add_error("unsupported manifest version #{deployment['manifest_version']} (expected #{MANIFEST_VERSION})")
      end

      mode = parsed["mode"] || "certificate_pki"
      tiers = parsed["tiers"] || []

      case mode
      when "certificate_pki"
        validate_certificate_pki(tiers, report)
      when "pkcs11_replacement"
        validate_pkcs11_replacement(parsed, report)
      when "peer_to_peer"
        # Minimal requirements
      else
        report.add_error("unknown deployment mode: #{mode}")
      end

      validate_thresholds(tiers, report)
      validate_tier_chain(tiers, report)
      validate_quorum_references(tiers, parsed["quorums"] || [], report)

      report
    end

    # Generate a manifest Hash from CA keystore entries.
    # The output is suitable for `Tomlrb.dump` to produce `confium.toml`.
    #
    # @param entries [Array<Hash>] CA keystore entries
    # @param deployment_name [String] e.g., "OIML CNML Production"
    # @param operator [String] e.g., "BIML"
    # @param options [Hash] additional manifest fields (:transparency, :async_signing, :archival, :pqc_migration
    # @return [Hash] manifest as Hash
    def generate_from_keystore(entries, deployment_name:, operator:, **options)
      tiers = entries.map { |e| tier_from_keystore_entry(e) }
      quorums = entries.each_with_object([]) do |e, acc|
        confium_cfg = e["confium"]
        next unless confium_cfg && confium_cfg["quorum_id"]

        existing = acc.find { |q| q["name"] == confium_cfg["quorum_id"] }
        next if existing

        acc << {
          "name" => confium_cfg["quorum_id"],
          "threshold" => { "t" => confium_cfg.fetch("threshold", 1),
                           "n" => confium_cfg.fetch("num_parties", confium_cfg.fetch("threshold", 1)) },
          "coordinator" => confium_cfg.fetch("coordinator_endpoint", ""),
          "share_storage_backend" => confium_cfg["share_storage_backend"],
        }.compact
      end

      {
        "deployment" => {
          "name" => deployment_name,
          "operator" => operator,
          "manifest_version" => MANIFEST_VERSION,
        },
        "mode" => "certificate_pki",
        "tiers" => tiers,
        "quorums" => quorums,
      }.merge(extras_from_options(options))
    end

    # ─── Internal ───────────────────────────────────────────────────────

    def coerce_to_hash(source)
      case source
      when Hash then source
      when String
        source = File.read(source) if File.exist?(source)
        parse_toml(source)
      else
        raise ParseError, "unsupported source type: #{source.class}"
      end
    end

    def parse_toml(toml_string)
      gem("toml-rb")
      require "toml-rb"
      TomlRB.parse(toml_string)
    rescue Gem::MissingSpecError, LoadError
      raise ParseError, "toml-rb gem not available. Install with: gem install toml-rb"
    rescue => e
      raise ParseError, "TOML parse error: #{e.message}"
    end

    def tier_from_keystore_entry(entry)
      confium_cfg = entry["confium"]
      threshold = if confium_cfg
                    t = confium_cfg.fetch("threshold", 1)
                    n = confium_cfg.fetch("num_parties", t)
                    { "t" => t, "n" => n }
                  else
                    { "t" => 1, "n" => 1 }
                  end

      {
        "name" => entry.fetch("id"),
        "role" => entry.fetch("role", "unknown"),
        "signing_algorithm" => infer_signing_algorithm(entry),
        "threshold" => threshold,
      }.compact
    end

    def infer_signing_algorithm(entry)
      return "FROST-P256" if entry["confium"] && entry["confium"].fetch("scheme", "FROST-P256").start_with?("FROST")
      return "ECDSA-P256" if entry["privateKey"] || entry["pkcs11"]
      "ECDSA-P256"
    end

    def extras_from_options(options)
      extras = {}
      extras["transparency"] = options[:transparency] if options[:transparency]
      extras["async_signing"] = options[:async_signing] if options[:async_signing]
      extras["archival"] = options[:archival] if options[:archival]
      extras["pqc_migration"] = options[:pqc_migration] if options[:pqc_migration]
      extras
    end

    def validate_certificate_pki(tiers, report)
      if tiers.empty?
        report.add_error("certificate_pki mode requires at least one tier")
      end
    end

    def validate_pkcs11_replacement(parsed, report)
      if parsed["pkcs11_server"].nil?
        report.add_error("pkcs11_replacement mode requires [pkcs11_server] section")
      end
      if (parsed["quorums"] || []).empty?
        report.add_error("pkcs11_replacement mode requires at least one [[quorums]] entry")
      end
    end

    def validate_thresholds(tiers, report)
      tiers.each do |tier|
        threshold = tier["threshold"]
        next unless threshold

        t = threshold["t"]
        n = threshold["n"]
        if t.nil? || n.nil?
          report.add_error("tier #{tier['name']} threshold missing t or n")
          next
        end
        if t == 0 || t > n
          report.add_error("tier #{tier['name']} has invalid threshold t=#{t} n=#{n}")
        end
      end
    end

    def validate_tier_chain(tiers, report)
      names = tiers.map { |t| t["name"] }.to_set

      has_root = false
      tiers.each do |tier|
        parent = tier["delegated_by"]
        if parent.nil?
          has_root = true
        elsif !names.include?(parent)
          report.add_error("tier #{tier['name']} delegates to unknown tier #{parent}")
        end
      end

      unless has_root
        report.add_error("tier chain has no root (no tier with delegated_by absent)")
      end
    end

    def validate_quorum_references(tiers, quorums, report)
      quorum_names = quorums.map { |q| q["name"] }.to_set

      tiers.each do |tier|
        next unless tier["name"] && tier["threshold"]
        threshold = tier["threshold"]
        next unless threshold["t"] && threshold["t"] > 1

        # Threshold tiers should reference a quorum by name (via delegation or convention)
        # We don't enforce this strictly — only warn if NO quorums are defined
        if quorums.empty?
          report.add_warning("threshold tier #{tier['name']} (t=#{threshold['t']}) but no [[quorums]] defined")
          break
        end
      end
    end
  end

  require "set"

  # Public manifest representation. Returned by DeploymentManifest.load.
  # Provides typed accessors for navigation without exposing the raw Hash.
  class Manifest
    attr_reader :deployment, :mode, :tiers, :quorums, :transparency,
                :async_signing, :archival, :pqc_migration, :pkcs11_server

    def initialize(parsed)
      @deployment   = DeploymentHeader.new(parsed.fetch("deployment", {}))
      @mode         = parsed["mode"] || "certificate_pki"
      @tiers        = (parsed["tiers"] || []).map { |t| Tier.new(t) }
      @quorums      = (parsed["quorums"] || []).map { |q| Quorum.new(q) }
      @transparency = parsed["transparency"] && TransparencyConfig.new(parsed["transparency"])
      @async_signing = parsed["async_signing"] && AsyncSigningConfig.new(parsed["async_signing"])
      @archival     = parsed["archival"] && ArchivalConfig.new(parsed["archival"])
      @pqc_migration = parsed["pqc_migration"] && PqcMigrationPlan.new(parsed["pqc_migration"])
      @pkcs11_server = parsed["pkcs11_server"] && Pkcs11ServerConfig.new(parsed["pkcs11_server"])
    end

    # Find the first tier matching a role (e.g., "root", "issuing_authority").
    # @param role [String] role to match
    # @return [Tier, nil]
    def tier_for_role(role)
      @tiers.find { |t| t.role == role }
    end

    # Find a tier by name.
    # @param name [String] tier name (e.g., "biml_root")
    # @return [Tier, nil]
    def tier_named(name)
      @tiers.find { |t| t.name == name }
    end

    # Find the root tier (no delegated_by). Returns nil if multiple or none.
    # @return [Tier, nil]
    def root_tier
      roots = @tiers.select { |t| t.delegated_by.nil? }
      roots.length == 1 ? roots.first : nil
    end

    # Find the quorum with the given name.
    # @param name [String] quorum name
    # @return [Quorum, nil]
    def quorum_named(name)
      @quorums.find { |q| q.name == name }
    end

    # Find the quorum backing a tier. Convention: a tier's quorum is
    # referenced by its threshold. This lookup is heuristic — the
    # canonical reference is via the keystore entry's `confium.quorum_id`.
    # @param tier_name [String] tier name
    # @return [Quorum, nil]
    def quorum_for_tier(tier_name)
      tier = tier_named(tier_name)
      return nil unless tier

      # Match by threshold (t, n) — the most reliable heuristic without
      # an explicit quorum_id field on tiers in the manifest schema.
      @quorums.find do |q|
        q.threshold.t == tier.threshold.t && q.threshold.n == tier.threshold.n
      end
    end

    # Walk the tier chain upward from the given tier to the root.
    # Returns the chain in order: [self, parent, grandparent, ..., root]
    # @param tier_name [String] starting tier
    # @return [Array<Tier>] chain (empty if tier not found)
    def chain_from(tier_name)
      chain = []
      current = tier_named(tier_name)
      seen = Set.new

      while current && !seen.include?(current.name)
        chain << current
        seen << current.name
        current = current.delegated_by ? tier_named(current.delegated_by) : nil
      end
      chain
    end

    # All tiers transitively descended from the given tier.
    # @param tier_name [String] ancestor tier name
    # @return [Array<Tier>] descendant tiers
    def descendants_of(tier_name)
      @tiers.select do |t|
        next if t.name == tier_name
        chain_from(t.name).any? { |c| c.name == tier_name }
      end
    end
  end

  # Top-level deployment header.
  class DeploymentHeader
    attr_reader :name, :operator, :charter_url, :manifest_version

    def initialize(hash)
      @name             = hash["name"]
      @operator         = hash["operator"]
      @charter_url      = hash["charter_url"]
      @manifest_version = hash["manifest_version"]
    end
  end

  # A tier in the deployment hierarchy.
  class Tier
    attr_reader :name, :role, :signing_algorithm, :encryption_algorithm,
                :threshold, :delegated_by, :delegation_scope, :ceremony,
                :attributes

    def initialize(hash)
      @name                = hash["name"]
      @role                = hash["role"]
      @signing_algorithm   = hash["signing_algorithm"]
      @encryption_algorithm = hash["encryption_algorithm"]
      @threshold           = hash["threshold"] && Threshold.new(hash["threshold"])
      @delegated_by        = hash["delegated_by"]
      @delegation_scope    = hash["delegation_scope"]
      @ceremony            = hash["ceremony"] && Ceremony.new(hash["ceremony"])
      @attributes          = hash["attributes"] || []
    end

    def root?
      delegated_by.nil?
    end

    def threshold?
      threshold && threshold.t > 1
    end
  end

  # T-of-N threshold.
  class Threshold
    attr_reader :t, :n

    def initialize(hash)
      @t = hash["t"]
      @n = hash["n"]
    end

    def to_s
      "#{t}-of-#{n}"
    end
  end

  # Signing ceremony descriptor.
  class Ceremony
    attr_reader :sync_required, :frequency

    def initialize(hash)
      @sync_required = hash["sync_required"]
      @frequency     = hash["frequency"]
    end
  end

  # Quorum — named threshold group with coordinator endpoint.
  class Quorum
    attr_reader :name, :threshold, :coordinator, :share_storage_backend

    def initialize(hash)
      @name                   = hash["name"]
      @threshold              = hash["threshold"] && Threshold.new(hash["threshold"])
      @coordinator            = hash["coordinator"]
      @share_storage_backend  = hash["share_storage_backend"]
    end
  end

  # Transparency log configuration.
  class TransparencyConfig
    attr_reader :log_operator, :anchors, :gossip, :public_mirror_urls

    def initialize(hash)
      @log_operator      = hash["log_operator"]
      @anchors           = hash["anchors"] || []
      @gossip            = hash["gossip"]
      @public_mirror_urls = hash["public_mirror_urls"] || []
    end
  end

  # Async signing configuration.
  class AsyncSigningConfig
    DEFAULT_UNLOCK_MINUTES = 240

    attr_reader :default_unlock_window_minutes, :coordinator_operator

    def initialize(hash)
      @default_unlock_window_minutes = hash["default_unlock_window_minutes"] || DEFAULT_UNLOCK_MINUTES
      @coordinator_operator          = hash["coordinator_operator"]
    end
  end

  # Long-term archival configuration.
  class ArchivalConfig
    DEFAULT_RENEWAL_YEARS = 5

    attr_reader :renewal_period_years, :re_sign_under

    def initialize(hash)
      @renewal_period_years = hash["renewal_period_years"] || DEFAULT_RENEWAL_YEARS
      @re_sign_under        = hash["re_sign_under"]
    end
  end

  # PQC migration trajectory.
  class PqcMigrationPlan
    attr_reader :current, :target_2027, :target_2029

    def initialize(hash)
      @current     = hash["current"]
      @target_2027 = hash["target_2027"]
      @target_2029 = hash["target_2029"]
    end
  end

  # PKCS#11 server configuration (Mode 2 deployments).
  class Pkcs11ServerConfig
    attr_reader :slot_count, :default_signing_algorithm, :default_threshold,
                :share_storage, :hsm_module

    def initialize(hash)
      @slot_count                = hash["slot_count"]
      @default_signing_algorithm = hash["default_signing_algorithm"]
      @default_threshold         = hash["default_threshold"] && Threshold.new(hash["default_threshold"])
      @share_storage             = hash["share_storage"]
      @hsm_module                = hash["hsm_module"]
    end
  end

  # Validation report — list of errors and warnings from validate().
  class ValidationReport
    attr_reader :errors, :warnings

    def initialize
      @errors   = []
      @warnings = []
    end

    def valid?
      @errors.empty?
    end

    def add_error(message)
      @errors << message
    end

    def add_warning(message)
      @warnings << message
    end
  end
end
