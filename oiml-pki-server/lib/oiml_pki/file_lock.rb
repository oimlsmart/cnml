# frozen_string_literal: true

# Shared file-locking helper for modules that mutate persistent state.
#
# CaStore uses it to guard load-modify-save sequences on the keystore.
# AuditLog uses it to guard concurrent appends to the audit log. The
# lock is advisory (flock), not mandatory — it prevents concurrent
# writers within the same process tree but does not stop an external
# process that ignores flock.
#
# The lock file is separate from the data file: flock(LOCK_EX) on the
# lock file serializes callers, while the data file is opened and
# closed normally inside the block. This is the correct pattern for
# read-modify-write cycles (locking the data file itself would
# interfere with concurrent readers).

require "fileutils"

module OimlPki
  module FileLock
    module_function

    # Acquire an exclusive lock on `lock_path`, yield to the block,
    # and release on block exit (even on exception). Creates the lock
    # file and its parent directory if they do not exist.
    #
    # @param lock_path [String] path to the lock file
    # @yield the critical section
    def with_lock(lock_path)
      FileUtils.mkdir_p(File.dirname(lock_path))
      File.open(lock_path, File::CREAT | File::RDWR, 0o600) do |f|
        f.flock(File::LOCK_EX)
        yield
      end
    end
  end
end
