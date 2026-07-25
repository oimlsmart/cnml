# frozen_string_literal: true

# Reads the list of OIML Recommendations from the sibling TS schemas
# directory. Used by the CA server UI to populate the scope multi-select
# — never a hardcoded R-list.

require "yaml"

module OimlPki
  module RecommendationReader
    SCHEMAS_DIR = File.expand_path(
      "../../digital-certificates/packages/cnml-schemas/src/schemas",
      File.join(File.dirname(__FILE__), "..", "..")
    )

    module_function

    # Returns array of {id, shortTitle, category} hashes, sorted by R number.
    def list(schemas_dir: SCHEMAS_DIR)
      return [] unless Dir.exist?(schemas_dir)
      Dir.children(schemas_dir)
        .select { |f| f =~ /^R\d+\.yaml$/ }
        .sort_by { |f| f.sub(/^R(\d+)\.yaml$/, '\1').to_i }
        .map do |f|
          data = YAML.safe_load(File.read(File.join(schemas_dir, f)))
          {
            "id"          => f.sub(/\.yaml$/, ""),
            "shortTitle"  => data&.dig("x-oiml-short-title") || data&.dig("title") || f,
            "category"    => data&.dig("x-oiml-category") || "Uncategorised",
          }
        end
    rescue StandardError => e
      warn "Could not load recommendations from #{schemas_dir}: #{e.message}"
      []
    end
  end
end
