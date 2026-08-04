# frozen_string_literal: true

# Transparency log publisher + Merkle tree.
#
# Pure-Ruby RFC 6962 Merkle tree implementation. Independent of
# confium-ruby so the CA server can publish transparency proofs
# without requiring the FFI bindings (DRY: one Ruby implementation,
# usable in dev environments without confium installed).
#
# The browser verifier (packages/cnml-crypto/src/checks/transparency.ts)
# implements the same hashing scheme — proofs generated here verify
# in the browser.
#
# @see RFC 6962 (Certificate Transparency)
module OimlPki
  # Minimal RFC 6962-style Merkle tree. SHA-256 with byte 0x01 prefix
  # for leaf hashing, 0x02 prefix for internal node hashing.
  class MerkleTree
    Node = Struct.new(:hash, :left, :right) do
      def leaf?
        left.nil? && right.nil?
      end
    end

    ProofStep = Struct.new(:sibling, :side) do
      def to_h
        { "sibling" => sibling.unpack1("H*"), "side" => side }
      end
    end

    attr_reader :entries

    def initialize
      @entries = []
      @leaf_hashes = []
    end

    # Append a leaf hash. Returns the sequence number.
    # @param leaf_hash [String] 32-byte SHA-256 hash
    # @return [Integer] sequence number (0-indexed)
    def append(leaf_hash)
      raise ArgumentError, "leaf_hash must be 32 bytes" unless leaf_hash.bytesize == 32

      seq = @entries.length
      @entries << leaf_hash
      @leaf_hashes << hash_leaf(leaf_hash)
      seq
    end

    # Current root hash. Empty tree returns 32 zero bytes.
    # @return [String] 32-byte SHA-256 hash
    def root
      return ("\x00" * 32) if @leaf_hashes.empty?
      compute_root(@leaf_hashes.dup)
    end

    # Number of leaves.
    def length
      @entries.length
    end
    alias :size :length

    def empty?
      @entries.empty?
    end

    # Build an inclusion proof for the leaf at the given sequence number.
    # @param sequence [Integer] 0-indexed leaf sequence
    # @return [Array<ProofStep>] steps from leaf up to (but not including) root
    def inclusion_proof(sequence)
      raise ArgumentError, "sequence out of range" if sequence < 0 || sequence >= @entries.length

      steps = []
      level = @leaf_hashes.dup
      idx = sequence

      while level.length > 1
        if idx.even?
          sibling_idx = idx + 1
        else
          sibling_idx = idx - 1
        end

        if sibling_idx < level.length
          side = idx.even? ? :right : :left
          steps << ProofStep.new(level[sibling_idx], side)
        end

        next_level = []
        i = 0
        while i < level.length
          if i + 1 < level.length
            next_level << hash_internal(level[i], level[i + 1])
          else
            next_level << level[i]
          end
          i += 2
        end
        level = next_level
        idx /= 2
      end

      steps
    end

    # Verify an inclusion proof: walk leaf → root, compare to expected.
    # @param leaf_hash [String] 32-byte original leaf hash
    # @param proof [Array<ProofStep>] steps
    # @param expected_root [String] 32-byte expected root hash
    # @return [Boolean]
    def verify_inclusion(leaf_hash, proof, expected_root)
      current = hash_leaf(leaf_hash)
      proof.each do |step|
        current = if step.side == :left
                    hash_internal(step.sibling, current)
                  else
                    hash_internal(current, step.sibling)
                  end
      end
      constant_time_equal(current, expected_root)
    end

    private

    def hash_leaf(data)
      OpenSSL::Digest::SHA256.digest("\x01" + data)
    end

    def hash_internal(left, right)
      OpenSSL::Digest::SHA256.digest("\x02" + left + right)
    end

    def compute_root(level)
      while level.length > 1
        next_level = []
        i = 0
        while i < level.length
          if i + 1 < level.length
            next_level << hash_internal(level[i], level[i + 1])
          else
            next_level << level[i]
          end
          i += 2
        end
        level = next_level
      end
      level.first
    end

    def constant_time_equal(a, b)
      return false unless a.bytesize == b.bytesize
      diff = 0
      a.bytes.zip(b.bytes).each { |x, y| diff |= x ^ y }
      diff.zero?
    end
  end

  # Public proof structure, serializable for embedding in CNML XML.
  class TransparencyProof
    attr_reader :sequence, :leaf_hash, :inclusion_proof, :log_root,
                :log_operator, :tree_size, :bitcoin_height

    def initialize(sequence:, leaf_hash:, inclusion_proof:, log_root:,
                   log_operator:, tree_size:, bitcoin_height: nil)
      @sequence         = sequence
      @leaf_hash        = leaf_hash
      @inclusion_proof  = inclusion_proof
      @log_root         = log_root
      @log_operator     = log_operator
      @tree_size        = tree_size
      @bitcoin_height   = bitcoin_height
    end

    def to_h
      {
        "log_operator"    => @log_operator,
        "sequence"        => @sequence,
        "leaf_hash"       => @leaf_hash.unpack1("H*"),
        "log_root"        => @log_root.unpack1("H*"),
        "tree_size"       => @tree_size,
        "bitcoin_height"  => @bitcoin_height,
        "inclusion_proof" => @inclusion_proof.map(&:to_h),
      }
    end
  end

  # Records cert hashes to a Merkle tree and produces TransparencyProof
  # objects for embedding into CNML XML.
  module TransparencyPublisher
    class << self
      attr_accessor :log_file_override, :log_operator_override
    end

    module_function

    # Append a cert hash to the persistent log. The log file is a
    # binary blob: 4-byte big-endian sequence + 32-byte hash per entry.
    # Returns the sequence number assigned.
    def record(cert_hash, log_operator: default_log_operator)
      raise ArgumentError, "cert_hash must be 32 bytes" unless cert_hash.bytesize == 32

      with_persistent_log do |tree|
        seq = tree.append(cert_hash)
        seq
      end
    end

    # Build an inclusion proof for a leaf at the given sequence.
    def proof_for(sequence, log_operator: default_log_operator)
      with_persistent_log do |tree|
        raise ArgumentError, "sequence out of range" if sequence >= tree.length

        leaf_hash = tree.entries[sequence]
        steps     = tree.inclusion_proof(sequence)
        TransparencyProof.new(
          sequence:        sequence,
          leaf_hash:       leaf_hash,
          inclusion_proof: steps,
          log_root:        tree.root,
          log_operator:    log_operator,
          tree_size:       tree.length,
        )
      end
    end

    # Embed a <cnml:tlog_proof> element into CNML XML. Returns the
    # modified XML string.
    def embed_proof(cnml_xml, proof)
      # Parse, find root, insert proof element before </...:cnml> or root close.
      # Lightweight string insertion — full XML parse would require Nokogiri.
      proof_xml = render_proof_element(proof)
      # Insert before the closing root tag.
      cnml_xml.sub(%r{</[^>]+cnml[^>]*>\s*$}m) { "#{proof_xml}#{Regexp.last_match(0)}" }
    end

    def default_log_operator
      @log_operator_override || "BIML"
    end

    def log_file
      @log_file_override || File.join(OimlPki::KEYSTORE_DIR, "transparency.log")
    end

    # ─── Internal ───────────────────────────────────────────────────

    def with_persistent_log
      tree = MerkleTree.new
      load_log(tree) if File.exist?(log_file)
      result = yield tree
      save_log(tree)
      result
    end

    def load_log(tree)
      File.binread(log_file).scan(/.{36}/m).each do |entry|
        seq_bytes = entry[0, 4]
        hash      = entry[4, 32]
        # Skip the stored sequence number — MerkleTree.append assigns
        # monotonically, which matches what was stored.
        tree.append(hash)
      end
    end

    def save_log(tree)
      FileUtils.mkdir_p(File.dirname(log_file))
      tmp = "#{log_file}.tmp.#{Process.pid}"
      bin = tree.entries.each_with_index.map { |h, i| [i].pack("N") + h }.join
      File.binwrite(tmp, bin)
      File.rename(tmp, log_file)
    end

    def render_proof_element(proof)
      steps_xml = proof.inclusion_proof.map do |step|
        %(      <cnml:step index="0"><cnml:sibling>#{step.sibling.unpack1('H*')}</cnml:sibling><cnml:side>#{step.side}</cnml:side></cnml:step>)
      end.join("\n")

      %(  <cnml:tlog_proof algorithm="RFC6962">
    <cnml:log_operator>#{proof.log_operator}</cnml:log_operator>
    <cnml:sequence>#{proof.sequence}</cnml:sequence>
    <cnml:leaf_hash algorithm="SHA-256">#{proof.leaf_hash.unpack1('H*')}</cnml:leaf_hash>
    <cnml:log_root algorithm="SHA-256">#{proof.log_root.unpack1('H*')}</cnml:log_root>
    <cnml:tree_size>#{proof.tree_size}</cnml:tree_size>
    <cnml:inclusion_proof>
#{steps_xml}
    </cnml:inclusion_proof>
  </cnml:tlog_proof>
)
    end
  end
end
