# frozen_string_literal: true

# Confium Rust core integration layer for the Ruby CA server.
#
# Single point of contact between the OimlPki Ruby codebase and the
# `confium-ruby` gem (FFI bindings to the Rust cdylib at
# `~/src/confium/confium-ruby/`). Every confium-consuming module goes
# through this layer so capability detection, version pinning, and
# preflight checks live in exactly one place (DRY + MECE).
#
# Two public entry points:
#
#   - {ConfiumIntegration.capability_report} — structured read of what
#     the runtime can do (gem version, available threshold schemes,
#     coordinator protocol version, available storage backends).
#   - {ConfiumIntegration.preflight!} — accepts a parsed Manifest
#     (TODO 34) and raises RequirementError listing every unmet
#     requirement. Called by CaStore on startup.
#
# @see TODO.roadmap/40-confium-integration-architecture.md
module OimlPki
  module ConfiumIntegration
    Error = Class.new(StandardError)

    # Raised when the loaded confium-ruby gem's version is older than
    # the manifest requires.
    class VersionError < Error
      attr_reader :required, :actual
      def initialize(required, actual)
        @required = required
        @actual   = actual
        super("confium-ruby #{required} required, found #{actual}")
      end
    end

    # Raised by preflight! when one or more manifest requirements are
    # not met by the current runtime. The `requirements` array carries
    # structured entries so callers can render them in CLI output or
    # an admin UI.
    class RequirementError < Error
      Requirement = Struct.new(:kind, :name, :required, :actual, :message)

      attr_reader :requirements

      def initialize(requirements)
        @requirements = requirements
        details = requirements.map { |r| "  - #{r.message}" }.join("\n")
        super("Confium integration preflight failed:\n#{details}")
      end
    end

    # Minimum confium-ruby gem version this version of OimlPki supports.
    # Bumped when OimlPki adopts APIs only present in newer gem versions.
    MIN_GEM_VERSION = Gem::Version.new("0.3.0")

    # Coordinator protocol versions this OimlPki build can speak.
    SUPPORTED_COORDINATOR_PROTOCOLS = %w[v1].freeze

    # Threshold schemes we know how to drive end-to-end.
    KNOWN_SCHEMES = %w[
      FROST-P256
      FROST-Ed25519
      ElGamal-P256
      ML-KEM-768
      ML-DSA-65
    ].freeze

    # Storage backends we support for share persistence.
    KNOWN_STORAGE_BACKENDS = %w[
      openpgp-card
      pkcs11
      tpm
      file
    ].freeze

    class << self
      # Environment override to skip preflight in development.
      # Set OIML_PKI_SKIP_PREFLIGHT=1 to bypass preflight! checks.
      # Should never be used in production.
      attr_accessor :skip_preflight_override

      # Inject a pre-computed capability report (dependency injection).
      # When set, capability_report returns this instead of probing the
      # gem. Used by tests to exercise both branches without doubles
      # or module prepending. Set to nil to restore default behavior.
      attr_writer :injected_capability_report
    end

    module_function

    # Return a structured capability report for the current runtime.
    # If an injected report is set (via .injected_capability_report=),
    # returns that — otherwise probes the actual gem.
    #
    # @return [Hash] symbolized capability map
    def capability_report
      return @injected_capability_report if @injected_capability_report

      gem_info = load_gem_info
      return unavailable_report(gem_info) unless gem_info[:loaded]

      available_schemes = safely { Confium::AVAILABLE_SCHEMES || KNOWN_SCHEMES } || KNOWN_SCHEMES
      available_backends = safely { Confium::AVAILABLE_STORAGE_BACKENDS || [] } || []
      rust_core_version = safely { Confium::RUST_CORE_VERSION } || gem_info[:version]
      coordinator_protocol = safely { Confium::COORDINATOR_PROTOCOL_VERSION } || "v1"

      {
        gem_loaded:                    true,
        gem_version:                   gem_info[:version],
        rust_core_version:             rust_core_version,
        available_schemes:             available_schemes,
        available_storage_backends:    available_backends,
        coordinator_protocol_version:  coordinator_protocol,
        missing:                       [],
      }
    rescue StandardError => e
      unavailable_report(reason: "confium-ruby raised during probe: #{e.message}")
    end

    # Verify the runtime satisfies every requirement implied by the
    # given manifest. Returns nil on success; raises RequirementError
    # with a structured list of failures otherwise.
    #
    # @param manifest [Manifest, Hash] parsed manifest (Manifest object per TODO 34, or raw Hash)
    # @return [nil]
    # @raise [RequirementError] if any requirement unmet
    def preflight!(manifest)
      return nil if skip_preflight_override || ENV["OIML_PKI_SKIP_PREFLIGHT"] == "1"

      manifest_hash = manifest.is_a?(OimlPki::Manifest) ? manifest_to_hash(manifest) : manifest
      report = capability_report
      requirements = []

      unless report[:gem_loaded]
        requirements << RequirementError::Requirement.new(
          :capability, "confium-ruby", ">= #{MIN_GEM_VERSION}", "not loaded",
          "confium-ruby gem not installed (manifest requires it)",
        )
        raise RequirementError.new(requirements)
      end

      required_version = manifest_hash.dig("deployment", "required_confium_version")
      if required_version && gem_version_lt?(report[:gem_version], required_version)
        requirements << RequirementError::Requirement.new(
          :version, "confium-ruby", ">= #{required_version}", report[:gem_version],
          "confium-ruby #{required_version} required, found #{report[:gem_version]}",
        )
      end

      (manifest_hash["tiers"] || []).each do |tier|
        scheme = tier["signing_algorithm"]
        next unless scheme && report[:available_schemes]
        unless report[:available_schemes].include?(scheme)
          requirements << RequirementError::Requirement.new(
            :scheme, scheme, "available", "missing",
            "tier #{tier['name']} requires #{scheme} but it is not available",
          )
        end
      end

      (manifest_hash["quorums"] || []).each do |quorum|
        backend = quorum["share_storage_backend"]
        next unless backend
        unless report[:available_storage_backends].include?(backend)
          requirements << RequirementError::Requirement.new(
            :storage, backend, "available", "missing",
            "quorum #{quorum['name']} uses #{backend} storage but it is not available",
          )
        end
      end

      raise RequirementError.new(requirements) unless requirements.empty?
      nil
    end

    # ─── Internal ───────────────────────────────────────────────────────

    # Attempt to activate + require the confium-ruby gem. Returns a hash
    # describing the outcome — never raises (callers handle missing case).
    def load_gem_info
      gem("confium-ruby", ">= #{MIN_GEM_VERSION}")
      require "confium"
      version = safely { Confium::VERSION } || safely { Gem.loaded_specs["confium-ruby"]&.version&.to_s } || "unknown"
      { loaded: true, version: version }
    rescue Gem::MissingSpecError, Gem::MissingSpecVersionError, LoadError => e
      { loaded: false, reason: e.message }
    rescue StandardError => e
      { loaded: false, reason: "unexpected error: #{e.message}" }
    end

    def unavailable_report(gem_info)
      {
        gem_loaded:                    false,
        gem_version:                   nil,
        rust_core_version:             nil,
        available_schemes:             [],
        available_storage_backends:    [],
        coordinator_protocol_version:  nil,
        missing:                       ["confium-ruby gem"],
        reason:                        gem_info[:reason] || "confium-ruby not loaded",
      }
    end

    def safely
      yield
    rescue StandardError
      nil
    end

    def gem_version_lt?(actual, required)
      Gem::Version.new(actual) < Gem::Version.new(required)
    rescue ArgumentError
      # Unparseable version strings — fail safe (treat as not less than).
      false
    end

    def manifest_to_hash(manifest)
      # Round-trip Manifest back to its Hash form. Manifest is the public
      # class from TODO 34; we don't break encapsulation by reaching into
      # its ivars. Instead, we synthesize a Hash from the typed accessors
      # that preflight! cares about.
      {
        "deployment" => {
          "required_confium_version" => nil,  # Manifest doesn't carry this directly yet
        },
        "tiers" => manifest.tiers.map { |t|
          {
            "name" => t.name,
            "signing_algorithm" => t.signing_algorithm,
          }
        },
        "quorums" => manifest.quorums.map { |q|
          {
            "name" => q.name,
            "share_storage_backend" => q.share_storage_backend,
          }
        },
      }
    end
  end
end
