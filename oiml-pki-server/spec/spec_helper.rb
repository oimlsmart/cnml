# frozen_string_literal: true

require "oiml_pki"
require "tmpdir"

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.filter_run_when_matching :focus
  config.disable_monkey_patching!
  config.warnings = true
  config.default_formatter = "doc" if config.files_to_run.one?
  config.profile_examples = 10
  config.order = :random
  Kernel.srand config.seed
end

# Each spec that touches the keystore / audit log gets a fresh tmpdir
# via this shared helper. Uses the public attr accessors (NOT
# remove_const/const_set, which would need private #send).
module TestKeystore
  def with_test_keystore(passphrase: "test-passphrase-123")
    Dir.mktmpdir do |dir|
      OimlPki::CaStore.store_file_override = File.join(dir, "keystore.json")
      OimlPki::CaStore.salt_file_override  = File.join(dir, "salt.bin")
      OimlPki::AuditLog.log_file_override  = File.join(dir, "audit.log")
      OimlPki::AuditLog.head_file_override = File.join(dir, "audit.log.head")
      yield dir, passphrase
    end
  ensure
    OimlPki::CaStore.store_file_override = nil
    OimlPki::CaStore.salt_file_override  = nil
    OimlPki::AuditLog.log_file_override  = nil
    OimlPki::AuditLog.head_file_override = nil
  end
end

RSpec.configure do |c|
  c.include TestKeystore
end
