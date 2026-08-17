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

    # RFC 6962 §2.1.4.1 consistency proof: the audit path connecting
    # tree heads at old_size and new_size. Returns [] when the sizes
    # are equal or old_size is 0. Node order follows the RFC recursion.
    # @param old_size [Integer] size of the earlier tree
    # @param new_size [Integer] size of the later tree (<= length)
    # @return [Array<String>] 32-byte node hashes
    def consistency_proof(old_size, new_size)
      raise ArgumentError, "old_size must be >= 0" if old_size.negative?
      raise ArgumentError, "old_size must be <= new_size" if old_size > new_size
      raise ArgumentError, "new_size out of range" if new_size > length

      return [] if old_size.zero? || old_size == new_size

      subproof(old_size, @leaf_hashes[0, new_size], true)
    end

    # Leafless consistency verification (SIGNATIF §transparency): a
    # verifier holding only the two signed tree heads and the audit
    # path recomputes both roots from the path alone, mirroring the
    # SUBPROOF recursion shape. No leaf data required.
    # @return [Boolean]
    def verify_consistency_heads(old_size, old_root, new_size, new_root, proof)
      return false if old_size.negative? || old_size > new_size

      if old_size.zero?
        return proof.empty?
      end
      if old_size == new_size
        return proof.empty? && constant_time_equal(old_root, new_root)
      end
      return false if proof.empty?

      path = proof.dup
      ok, old_hash, new_hash = heads_subverify(old_size, new_size, true, path, old_root)
      ok && path.empty? &&
        constant_time_equal(old_hash, old_root) &&
        constant_time_equal(new_hash, new_root)
    end

    # @return [Array(Boolean, String, String)] ok, old_hash, new_hash
    def heads_subverify(m, n, b, path, old_root)
      if m == n
        if b
          return [true, old_root, old_root]
        end
        return [false, nil, nil] if path.empty?
        node = path.shift
        [true, node, node]
      else
        k = largest_pow2_lt(n)
        if m <= k
          ok, old_hash, new_hash = heads_subverify(m, k, b, path, old_root)
          return [false, nil, nil] unless ok
          return [false, nil, nil] if path.empty?
          node = path.shift
          [true, old_hash, hash_internal(new_hash, node)]
        else
          ok, old_hash, new_hash = heads_subverify(m - k, n - k, false, path, old_root)
          return [false, nil, nil] unless ok
          return [false, nil, nil] if path.empty?
          node = path.shift
          [true, hash_internal(node, old_hash), hash_internal(node, new_hash)]
        end
      end
    end

    # RFC 6962 §2.1.4.2 consistency verification (leaves-known form):
    # recomputes the old and new tree heads from the leaf hashes and
    # the proof path, then compares against the claimed heads.
    # @return [Boolean]
    def verify_consistency(old_size, new_size, proof, old_root, new_root)
      return false if old_size.negative? || old_size > new_size || new_size > length

      if old_size.zero?
        return proof.empty?
      end
      if old_size == new_size
        return proof.empty? && constant_time_equal(old_root, new_root)
      end
      return false if proof.empty?

      ok, rest, old_hash, new_hash = subverify(old_size, @leaf_hashes[0, new_size], proof.dup, true)
      ok && rest.empty? &&
        constant_time_equal(old_hash, old_root) &&
        constant_time_equal(new_hash, new_root)
    end

    private

    # Largest power of two strictly smaller than n (n >= 2).
    def largest_pow2_lt(n)
      1 << (Math.log2(n - 1).floor)
    end

    # RFC 6962 SUBPROOF(m, D[n], b):
    #   m == n  → b ? [] : [MTH(D)]
    #   m < n   → k = largest power of 2 < n
    #     m <= k: SUBPROOF(m, D[0;k], b) : [MTH(D[k;n])]
    #     m >  k: SUBPROOF(m-k, D[k;n], false) : [MTH(D[0;k])]
    def subproof(m, leaves, b)
      n = leaves.length
      if m == n
        return b ? [] : [compute_root(leaves.dup)]
      end
      k = largest_pow2_lt(n)
      if m <= k
        subproof(m, leaves[0, k], b) + [compute_root(leaves[k..])]
      else
        subproof(m - k, leaves[k..], false) + [compute_root(leaves[0, k])]
      end
    end

    # Mirror of subproof for verification. Returns [ok, proof_rest,
    # old_hash, new_hash]. When b is true the subtree lies entirely
    # within the old tree and contributes its MTH to both chains.
    def subverify(m, leaves, proof, b)
      n = leaves.length
      if m == n
        h = compute_root(leaves.dup)
        if b
          [true, proof, h, h]
        else
          return [false, proof, nil, nil] if proof.empty? || !constant_time_equal(proof.first, h)
          [true, proof[1..], h, h]
        end
      else
        k = largest_pow2_lt(n)
        if m <= k
          ok, rest, old_hash, new_hash = subverify(m, leaves[0, k], proof, b)
          return [false, rest, nil, nil] unless ok
          return [false, rest, nil, nil] if rest.empty?
          right_hash = rest.first
          [true, rest[1..], old_hash, hash_internal(new_hash, right_hash)]
        else
          ok, rest, old_hash, new_hash = subverify(m - k, leaves[k..], proof, false)
          return [false, rest, nil, nil] unless ok
          return [false, rest, nil, nil] if rest.empty?
          left_hash = rest.first
          [true, rest[1..], hash_internal(left_hash, old_hash), hash_internal(left_hash, new_hash)]
        end
      end
    end

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
                :log_operator, :tree_size, :bitcoin_height,
                :head_signature, :head_timestamp

    def initialize(sequence:, leaf_hash:, inclusion_proof:, log_root:,
                   log_operator:, tree_size:, bitcoin_height: nil,
                   head_signature: nil, head_timestamp: nil)
      @sequence         = sequence
      @leaf_hash        = leaf_hash
      @inclusion_proof  = inclusion_proof
      @log_root         = log_root
      @log_operator     = log_operator
      @tree_size        = tree_size
      @bitcoin_height   = bitcoin_height
      @head_signature   = head_signature
      @head_timestamp   = head_timestamp
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
        "head_signature"  => @head_signature,
        "head_timestamp"  => @head_timestamp,
      }
    end
  end

  # Records cert hashes to a Merkle tree and produces TransparencyProof
  # objects for embedding into CNML XML.
  module TransparencyPublisher
    class << self
      attr_accessor :log_file_override, :log_operator_override,
                    :state_bindings_file_override
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

    # Log a CNML artifact by its CANONICAL PAYLOAD hash (XML-native:
    # the document minus Signature/coSignature/tlog_proof, exclusive
    # C14N). This is the leaf verifiers recompute from any formatting
    # of the same document.
    # @return [Integer] the assigned sequence number
    def record_artifact(cnml_xml)
      record(CanonicalPayload.hash(cnml_xml))
    end

    # Log an issued certificate by its DER hash (§mandatory-inclusion,
    # §path-transparency-inclusion, §scope-in-transparency: the scope
    # travels inside the logged certificate).
    # @param cert_der [String, OpenSSL::X509::Certificate] DER bytes
    # @return [Integer] the assigned sequence number
    def record_cert(cert_der)
      der = cert_der.is_a?(String) ? cert_der : cert_der.to_der
      record(OpenSSL::Digest::SHA256.digest(der))
    end

    # The cert-hash index: hex DER hash -> sequence. Built from the
    # leaf entries whose hashes correspond to logged certificates;
    # written to by-hash/<hex>.json at publication time.
    def cert_hash_index
      with_persistent_log do |tree|
        index = {}
        tree.entries.each_with_index do |hash, seq|
          index[hash.unpack1("H*")] = seq
        end
        index
      end
    end

    # Build an inclusion proof for a leaf at the given sequence.
    def proof_for(sequence, log_operator: default_log_operator, operator_key: nil)
      with_persistent_log do |tree|
        raise ArgumentError, "sequence out of range" if sequence >= tree.length

        entry     = tree.entries[sequence]
        # The leaf hash carried in proofs is the RFC 6962 leaf NODE
        # hash SHA-256(0x01 || entry), not the raw entry — matching
        # the audit-path convention verifiers walk from.
        leaf_hash = OpenSSL::Digest::SHA256.digest("\x01" + entry)
        steps     = tree.inclusion_proof(sequence)
        head_signature = nil
        head_timestamp = nil
        if operator_key
          head = signed_head(tree, operator_key, log_operator: log_operator)
          head_signature = head[:signature]
          head_timestamp = head[:timestamp]
        end
        TransparencyProof.new(
          sequence:        sequence,
          leaf_hash:       leaf_hash,
          inclusion_proof: steps,
          log_root:        tree.root,
          log_operator:    log_operator,
          tree_size:       tree.length,
          head_signature:  head_signature,
          head_timestamp:  head_timestamp,
        )
      end
    end

    # Embed a <cnml:tlog_proof> element into CNML XML. Returns the
    # modified XML string.
    def embed_proof(cnml_xml, proof)
      # XML-native insertion: parse, append the proof element as the
      # root's last child, serialize. Never string surgery.
      require "nokogiri"
      doc = Nokogiri::XML(cnml_xml) { |c| c.norecover.strict }
      raise ArgumentError, "not well-formed XML" unless doc.errors.empty? && doc.root

      proof_doc = Nokogiri::XML(render_proof_element(proof))
      proof_el = proof_doc.root
      proof_el = proof_doc.remove_namespaces! && proof_doc.root unless proof_el
      raise ArgumentError, "rendered proof is not an element" unless proof_el

      # Preserve the cnml prefix binding: adopt the node into the
      # document's namespace context.
      doc.root.add_child(proof_el)
      # AS_XML: no reformatting — the payload text nodes keep their
      # original bytes so the canonical payload is unchanged.
      doc.to_xml(save_with: Nokogiri::XML::Node::SaveOptions::AS_XML)
    end

    def default_log_operator
      @log_operator_override || "BIML"
    end

    # ─── Signed tree heads (SIGNATIF Phase 3) ─────────────────────
    #
    # The log operator signs each tree head so a verifier can trust an
    # inclusion or consistency proof against that head without trusting
    # the transport. The signed material is the canonical string:
    #
    #   CNML-TLOG-HEAD-v1|<operator>|<size>|<root-hex>|<timestamp>
    #
    # @param tree [MerkleTree] the tree to sign
    # @param operator_key [OpenSSL::PKey::EC] P-256 private key
    # @param log_operator [String]
    # @return [Hash] signed head fields (root, size, timestamp,
    #   operator, signature) — signature is P-1363 raw r||s, hex.
    def signed_head(tree, operator_key, log_operator: default_log_operator)
      head = {
        root: tree.root.unpack1("H*"),
        size: tree.length,
        timestamp: Time.now.utc.iso8601,
        operator: log_operator,
      }
      to_sign = head_string(head)
      raw = der_to_p1363(operator_key.sign(OpenSSL::Digest::SHA256.new, to_sign), 32)
      head.merge(signature: raw.unpack1("H*"))
    end

    # The canonical byte string covered by the tree-head signature.
    def head_string(head)
      "CNML-TLOG-HEAD-v1|#{head[:operator]}|#{head[:size]}|#{head[:root]}|#{head[:timestamp]}"
    end

    # Inverse of der_to_p1363: raw r||s -> DER ECDSA signature.
    def p1363_to_der(raw)
      bytes = raw.bytesize / 2
      r = OpenSSL::ASN1::Integer.new(OpenSSL::BN.new(raw[0, bytes], 2))
      s = OpenSSL::ASN1::Integer.new(OpenSSL::BN.new(raw[bytes, bytes], 2))
      OpenSSL::ASN1::Sequence.new([r, s]).to_der
    end

    # Convert a DER ECDSA signature to P-1363 raw r||s (each coordinate
    # left-padded to `bytes` bytes) — the form WebCrypto expects.
    def der_to_p1363(der, bytes)
      asn = OpenSSL::ASN1.decode(der)
      r = asn.value[0].value.to_s(2).rjust(bytes, "\x00")
      s = asn.value[1].value.to_s(2).rjust(bytes, "\x00")
      r + s
    rescue StandardError
      raise ArgumentError, "invalid DER ECDSA signature"
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

      signed_head_xml = if proof.head_signature
                          %(    <cnml:head_timestamp>#{proof.head_timestamp}</cnml:head_timestamp>
    <cnml:head_signature algorithm="ECDSA-P256-SHA256">#{proof.head_signature}</cnml:head_signature>)
                        end
      %(  <cnml:tlog_proof algorithm="RFC6962">
    <cnml:log_operator>#{proof.log_operator}</cnml:log_operator>
    <cnml:sequence>#{proof.sequence}</cnml:sequence>
    <cnml:leaf_hash algorithm="SHA-256">#{proof.leaf_hash.unpack1('H*')}</cnml:leaf_hash>
    <cnml:log_root algorithm="SHA-256">#{proof.log_root.unpack1('H*')}</cnml:log_root>
    <cnml:tree_size>#{proof.tree_size}</cnml:tree_size>
#{signed_head_xml}
    <cnml:inclusion_proof>
#{steps_xml}
    </cnml:inclusion_proof>
  </cnml:tlog_proof>
)
    end

    # ─── State binding index (SIGNATIF §revocation-hash-binding) ──
    #
    # The log operator records which authority states each logged
    # artifact is bound to. Revocation queries the index: a revoked
    # state hash maps to every artifact bound to it, so revocation
    # propagates to (and flags) each affected artifact.
    def record_state_bindings(sequence, hashes)
      require "json"
      require "fileutils"
      index = load_state_bindings
      index[sequence.to_s] = hashes.map(&:to_s)
      save_state_bindings(index)
      sequence
    end

    # The inverted index: bare-hex state hash → sorted sequences.
    def state_index
      index = {}
      load_state_bindings.each do |seq, hashes|
        hashes.each do |hash|
          key = hash.to_s.sub(/\Asha256:/, "").downcase
          (index[key] ||= []) << seq.to_i
        end
      end
      index.each_value(&:sort!)
      index
    end

    def load_state_bindings
      require "json"
      return {} unless File.exist?(state_bindings_file)
      JSON.parse(File.binread(state_bindings_file))
    rescue StandardError
      {}
    end

    def state_bindings_file
      @state_bindings_file_override ||
        File.join(OimlPki::KEYSTORE_DIR, "state-bindings.json")
    end

    def save_state_bindings(index)
      FileUtils.mkdir_p(File.dirname(state_bindings_file))
      File.binwrite(state_bindings_file, JSON.pretty_generate(index) + "\n")
    end

    # ─── Public publication (TODO.cnml/71) ────────────────────────
    #
    # Write the current log state as static files for CDN distribution.
    def publish_to_directory(dir, log_operator: default_log_operator, operator_key: nil)
      require "fileutils"
      require "json"
      FileUtils.mkdir_p(dir)
      FileUtils.mkdir_p(File.join(dir, "leaf"))
      FileUtils.mkdir_p(File.join(dir, "proof"))
      FileUtils.mkdir_p(File.join(dir, "consistency"))

      with_persistent_log do |tree|
        head = signed_head(tree, operator_key, log_operator: log_operator) if operator_key
        head ||= {
          root: tree.root.unpack1("H*"),
          size: tree.length,
          timestamp: Time.now.utc.iso8601,
          operator: log_operator,
        }
        if operator_key
          head[:public_key] = export_spki_pem(operator_key)
        end
        File.write(File.join(dir, "head.json"), JSON.pretty_generate(head) + "\n")

        bindings = load_state_bindings
        unless bindings.empty?
          File.write(File.join(dir, "state-index.json"), JSON.pretty_generate(state_index) + "\n")
        end

        # by-hash index: cert/artifact hash -> sequence, so verifiers
        # can confirm chain-certificate inclusion without scanning.
        FileUtils.mkdir_p(File.join(dir, "by-hash"))
        cert_hash_index.each do |hash_hex, seq|
          File.write(File.join(dir, "by-hash", "#{hash_hex}.json"),
                     JSON.pretty_generate({ "sequence" => seq }) + "\n")
        end

        # Consistency proofs from every prior size to the current head:
        # a verifier holding head(N) fetches consistency/<N>.json to
        # check head(M) is a pure extension.
        (0..tree.length).each do |prior|
          proof = tree.consistency_proof(prior, tree.length)
          doc = {
            old_size: prior,
            new_size: tree.length,
            nodes: proof.map { |h| h.unpack1("H*") },
          }
          File.write(File.join(dir, "consistency", "#{prior}.json"), JSON.pretty_generate(doc) + "\n")
        end

        tree.entries.each_with_index do |entry, seq|
          File.binwrite(File.join(dir, "leaf", seq.to_s), entry)

          steps = tree.inclusion_proof(seq)
          proof = {
            sequence: seq,
            # RFC 6962 leaf node hash: SHA-256(0x01 || entry) — the
            # form audit paths walk from.
            leaf_hash: OpenSSL::Digest::SHA256.digest("\x01" + entry).unpack1("H*"),
            log_root: tree.root.unpack1("H*"),
            tree_size: tree.length,
            inclusion_proof: steps.map { |s|
              { sibling: s.sibling.unpack1("H*"), side: s.side }
            },
          }
          File.write(File.join(dir, "proof", "#{seq}.json"), JSON.pretty_generate(proof) + "\n")
        end

        head
      end
    end

    # Export an EC public key as SPKI PEM (for embedding in head.json).
    def export_spki_pem(key)
      key.public_to_pem
    end
  end
end
