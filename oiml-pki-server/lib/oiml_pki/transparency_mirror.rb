# frozen_string_literal: true

require "json"
require "fileutils"
require "time"

module OimlPki
  # Transparency log mirror (SIGNATIF §security-considerations,
  # "A mirror shall validate the consistency proof between each
  # consecutive pair of tree heads and shall reject any tree head
  # that fails the consistency check").
  #
  # A mirror replicates the operator's published tree: it rebuilds the
  # tree from the published leaves, confirms the operator's head is
  # the tree's root, validates the consistency proof between the
  # mirror's previously observed head and the new head, and only then
  # republishes. A failed check rejects the head — the mirror keeps
  # serving its last good state and reports the fork.
  module TransparencyMirror
    module_function

    # Sync the mirror from an operator's published directory.
    #
    # @param operator_dir [String] directory with head.json, leaf/,
    #   proof/, consistency/ (as written by TransparencyPublisher)
    # @param mirror_dir [String] the mirror's own publication root
    # @param mirror_name [String] this mirror's identity
    # @return [Hash] report: accepted head + observation statement
    # @raise [MirrorRejected] when a consistency check fails
    def sync(operator_dir, mirror_dir, mirror_name: "mirror-1")
      head = JSON.parse(File.read(File.join(operator_dir, "head.json")))

      # Rebuild the tree from the published leaves and confirm the
      # operator's claimed root is the tree's actual root.
      tree = MerkleTree.new
      Dir[File.join(operator_dir, "leaf", "*")].sort_by { |f| File.basename(f).to_i }.each do |leaf|
        tree.append(File.binread(leaf))
      end
      unless tree.length == head["size"] && tree.root.unpack1("H*") == head["root"]
        raise MirrorRejected,
              "operator head (size #{head['size']}) does not match the published leaves"
      end

      # Validate the consistency proof between the mirror's previously
      # observed head and the new head. First sync accepts from empty.
      prior = prior_head(mirror_dir)
      if prior
        proof_file = File.join(operator_dir, "consistency", "#{prior['size']}.json")
        proof = JSON.parse(File.read(proof_file))
        nodes = proof["nodes"].map { |h| [h].pack("H*") }
        ok = tree.verify_consistency_heads(
          prior["size"], [prior["root"]].pack("H*"),
          head["size"], tree.root, nodes
        )
        unless ok
          raise MirrorRejected,
                "consistency proof failed between size #{prior['size']} and #{head['size']} — fork suspected"
        end
      end

      # Republish the verified state.
      FileUtils.mkdir_p(mirror_dir)
      %w[leaf proof consistency].each do |sub|
        src = File.join(operator_dir, sub)
        next unless File.directory?(src)
        FileUtils.rm_rf(File.join(mirror_dir, sub))
        FileUtils.cp_r(src, File.join(mirror_dir, sub))
      end
      File.write(File.join(mirror_dir, "head.json"), JSON.pretty_generate(head) + "\n")

      observation = {
        "mirror"    => mirror_name,
        "operator"  => head["operator"],
        "size"      => head["size"],
        "root"      => head["root"],
        "observed"  => Time.now.utc.iso8601,
        "prior_size" => prior && prior["size"],
      }
      File.write(File.join(mirror_dir, "mirror.json"), JSON.pretty_generate(observation) + "\n")
      observation
    end

    def prior_head(mirror_dir)
      path = File.join(mirror_dir, "head.json")
      return nil unless File.exist?(path)
      JSON.parse(File.read(path))
    end

    # Raised when the operator's state fails verification; the mirror
    # must not republish and should raise the fork to its operators.
    class MirrorRejected < StandardError; end
  end
end
