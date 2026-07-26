# frozen_string_literal: true

# Namespace for key-storage backends. Each backend implements the same
# interface ({Base}): it can sign bytes with a private key and expose
# the matching public key for cert embedding.
#
# Adding a new backend (e.g., netHSM, ksp, PIV tool subprocess) is
# an additive change: define a new file under key_provider/, autoload
# it here, implement Base. No edits to existing backends required
# (open/closed principle).
#
# Auto-discovery: the {for} factory picks a backend based on the
# keystore entry's shape. Entries with `privateKey` use Software;
# entries with `pkcs11` use Pkcs11; future entries will dispatch
# the same way.

module OimlPki
  module KeyProvider
    autoload :Base,     "oiml_pki/key_provider/base"
    autoload :Software, "oiml_pki/key_provider/software"
    autoload :Pkcs11,   "oiml_pki/key_provider/pkcs11"
    autoload :Confium,  "oiml_pki/key_provider/confium"

    module_function

    # Pick a backend based on the keystore entry's shape. Priority:
    # confium (threshold) > pkcs11 (hardware) > software (PEM).
    def for(entry)
      return Confium.new(entry["confium"]) if entry["confium"]
      return Pkcs11.new(entry["pkcs11"])   if entry["pkcs11"]
      return Software.new(entry)           if entry["privateKey"]
      raise ArgumentError, "Entry has no key provider config: #{entry['id']}"
    end
  end
end
