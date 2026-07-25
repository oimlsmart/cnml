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
      # Atomic append — Ruby's File.open with "a" mode is atomic for
      # single writes under POSIX on local filesystems.
      File.open(log_file, "a") do |f|
        f.flock(File::LOCK_EX)
        f.puts(JSON.generate(entry))
        f.flock(File::LOCK_UN)
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
  end
end
