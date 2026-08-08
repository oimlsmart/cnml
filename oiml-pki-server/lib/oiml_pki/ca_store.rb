# frozen_string_literal: true

# Encrypted CA keystore. AES-256-GCM envelope with PBKDF2-derived key.
# Atomic writes via temp-file-then-rename to prevent corruption if the
# process is interrupted mid-write. Exclusive file lock (flock) around
# load-modify-save to prevent concurrent-write race conditions.

module OimlPki
  module CaStore
    DEFAULT_STORE_FILE = File.join(KEYSTORE_DIR, "keystore.json")
    DEFAULT_SALT_FILE  = File.join(KEYSTORE_DIR, "salt.bin")
    DEFAULT_LOCK_FILE  = File.join(KEYSTORE_DIR, "keystore.lock")

    class << self
      # Path overrides for testing. In production these stay nil and the
      # DEFAULT_* constants are used. Avoids `remove_const`/`const_set`
      # gymnastics in tests (which would require private #send).
      attr_accessor :store_file_override, :salt_file_override, :lock_file_override
    end

    module_function

    def store_file
      @store_file_override || DEFAULT_STORE_FILE
    end

    def salt_file
      @salt_file_override || DEFAULT_SALT_FILE
    end

    def lock_file
      @lock_file_override || DEFAULT_LOCK_FILE
    end

    # Exclusive lock around the entire load-modify-save sequence.
    # Delegates to OimlPki::FileLock — the shared file-locking helper.
    def with_lock
      OimlPki::FileLock.with_lock(lock_file) { yield }
    end

    def load(passphrase)
      return [] unless File.exist?(store_file)
      raw = File.binread(store_file)
      decipher = OpenSSL::Cipher.new("aes-256-gcm")
      decipher.decrypt
      decipher.key = derive_key(passphrase)
      decipher.iv = raw[0..11]
      decipher.auth_tag = raw[-16..]
      decrypted = decipher.update(raw[12..-17]) + decipher.final
      JSON.parse(decrypted)
    end

    def save(entries, passphrase)
      json = JSON.pretty_generate(entries)
      cipher = OpenSSL::Cipher.new("aes-256-gcm")
      cipher.encrypt
      cipher.key = derive_key(passphrase)
      iv = cipher.random_iv
      encrypted = cipher.update(json) + cipher.final
      auth_tag = cipher.auth_tag
      blob = iv + encrypted + auth_tag
      # Atomic write: temp file in same dir, then rename.
      tmp = "#{store_file}.tmp.#{Process.pid}"
      File.binwrite(tmp, blob)
      File.rename(tmp, store_file)
    end

    def add(entry, passphrase)
      with_lock do
        entries = load(passphrase)
        entries = entries.reject { |e| e["id"] == entry["id"] }
        entries << entry
        save(entries, passphrase)
      end
    end

    def find(id, passphrase)
      load(passphrase).find { |e| e["id"] == id }
    end

    def all(passphrase)
      load(passphrase)
    end

    # ─── Internal ──────────────────────────────────────────────────────────

    def derive_key(passphrase)
      unless File.exist?(salt_file)
        File.binwrite(salt_file, OpenSSL::Random.random_bytes(16))
      end
      salt = File.binread(salt_file)
      # OpenSSL gem 3.x+ wants the digest name as a string, not a Digest instance.
      OpenSSL::PKCS5.pbkdf2_hmac(passphrase, salt, 100_000, 32, "SHA256")
    end
  end
end
