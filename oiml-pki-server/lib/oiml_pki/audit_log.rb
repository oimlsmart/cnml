# frozen_string_literal: true

# Append-only tamper-evident audit log of CA operations.
#
# Every state-changing route in app.rb appends one entry via {append}.
# Entries form a hash chain: each entry includes the SHA-256 of the
# previous entry's serialization. {verify_chain} walks the log and
# recomputes hashes; any tampering after the original write is detected.
#
# This is tamper-EVIDENT, not tamper-PROOF. An attacker with filesystem
# access can rewrite the log AND recompute the chain (we have no
# out-of-band anchor). For high-assurance deployments, mirror the log
# to a remote append-only service (AWS CloudWatch Logs with retention
# lock, or a blockchain anchor).
#
# Format: JSONL (one entry per line). Each line is a self-contained
# JSON object. The file is human-readable with `tail -f`.

module OimlPki
  module AuditLog
    DEFAULT_LOG_FILE  = File.join(OimlPki::KEYSTORE_DIR, "audit.log")
    DEFAULT_HEAD_FILE = File.join(OimlPki::KEYSTORE_DIR, "audit.log.head")

    class << self
      attr_accessor :log_file_override, :head_file_override
    end

    module_function

    def log_file
      @log_file_override || DEFAULT_LOG_FILE
    end

    def head_file
      @head_file_override || DEFAULT_HEAD_FILE
    end

    # Append an entry to the log. The entry's `previous_hash` field is
    # set automatically to the SHA-256 of the prior entry (or "genesis"
    # for the first entry). Returns the entry as written.
    #
    # @param action [String] e.g., "csr.sign", "root.create"
    # @param details [Hash] action-specific fields
    # @param actor [String] who performed the action (default: OS user)
    # @param result [String] "success" or "failure"
    # @return [Hash] the entry as written
    def append(action, details:, actor: current_actor, result: "success")
      entry = {
        timestamp:     Time.now.utc.iso8601,
        actor:         actor,
        action:        action,
        details:       details,
        result:        result,
        previous_hash: read_head,
      }
      # The lock file serializes concurrent appenders. The log file
      # is opened in append mode inside the block.
      OimlPki::FileLock.with_lock("#{log_file}.lock") do
        File.open(log_file, "a") do |f|
          f.puts(JSON.generate(entry))
        end
      end
      write_head(hash_of(entry))
      entry
    end

    # Walk the log and verify the hash chain. Returns a hash with
    # +valid+ (boolean) and +broken_at+ (line number of first
    # inconsistent entry, or nil if all valid).
    #
    # @return [Hash] { valid: bool, broken_at: int?, entries: int }
    def verify_chain
      return { valid: true, broken_at: nil, entries: 0 } unless File.exist?(log_file)

      prev_hash = "genesis"
      line_no = 0
      File.foreach(log_file).with_index(1) do |line, idx|
        line_no = idx
        line = line.strip
        next if line.empty?
        entry = JSON.parse(line)
        unless entry["previous_hash"] == prev_hash
          return { valid: false, broken_at: idx, entries: idx }
        end
        prev_hash = hash_of(entry)
      end

      { valid: true, broken_at: nil, entries: line_no }
    rescue JSON::ParserError => e
      { valid: false, broken_at: line_no, entries: line_no, error: e.message }
    end

    # Read all entries (most recent last). Returns empty array if log
    # doesn't exist yet.
    #
    # @return [Array<Hash>]
    def entries
      return [] unless File.exist?(log_file)
      File.readlines(log_file).map { |line| JSON.parse(line.strip) }
    rescue JSON::ParserError
      []
    end

    # ─── Internal ─────────────────────────────────────────────────────────

    def read_head
      return "genesis" unless File.exist?(head_file)
      File.read(head_file).strip
    end

    def write_head(hash)
      tmp = "#{head_file}.tmp.#{Process.pid}"
      File.write(tmp, hash)
      File.rename(tmp, head_file)
    end

    # Hash an entry by its canonical JSON form (sorted keys, no whitespace).
    def hash_of(entry)
      canonical = JSON.generate(entry, sort: true)
      "sha256:#{OpenSSL::Digest::SHA256.hexdigest(canonical)}"
    end

    def current_actor
      ENV["USER"] || ENV["USERNAME"] || "unknown"
    end

    # ─── Transparency-log anchoring (TODO.cnml/70) ───────────────────────
    #
    # The audit log is hash-chained, but the chain lives in a single
    # file the operator can rewrite. Anchoring the chain's head to the
    # transparency log (which is itself Bitcoin-anchored via
    # OpenTimestamps) inherits append-only-ness: rewriting any earlier
    # entry invalidates the Bitcoin-anchored head.
    #
    # The anchor is operator-driven (a script), not automatic, so the
    # cadence matches the IA's operational rhythm.

    # The current audit-log chain head. Suitable as a transparency-log
    # leaf value. Returns "genesis" for an empty log.
    def current_head
      read_head
    end

    # Anchor the current audit-log head to the transparency log.
    # Appends the head (as raw bytes) to the transparency log, then
    # records an `audit.anchor` audit-log entry pointing at the
    # transparency-log sequence number. Idempotent within the same
    # head: re-anchoring the same head is a no-op.
    #
    # Returns the transparency-log sequence number, or nil if the
    # transparency log is unavailable.
    def anchor_to_transparency_log!
      head = current_head
      return nil if head == "genesis"
      return nil unless defined?(OimlPki::TransparencyPublisher)

      head_bytes = head.dup.force_encoding("BINARY")
      # The transparency log expects a 32-byte leaf. SHA-256 the
      # head string to fit.
      leaf = OpenSSL::Digest::SHA256.digest(head_bytes)
      seq = OimlPki::TransparencyPublisher.record(leaf)

      # Record the anchor in the audit log itself. This entry's hash
      # becomes the new head; the next anchor will pin it.
      append("audit.anchor", details: {
        audit_head_anchored: head,
        transparency_log_sequence: seq,
      }, actor: current_actor, result: "success")

      seq
    rescue => e
      append("audit.anchor.failed", details: { error: e.message }, actor: current_actor, result: "failure")
      nil
    end
  end
end
