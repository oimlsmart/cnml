# Hardware-backed CA keys

How to use Yubikeys, smartcard HSMs, or enterprise HSMs to protect the
OIML Root CA and per-IA intermediate private keys.

## Why hardware keys matter

The root CA private key is the most valuable secret in the CNML
ecosystem. Compromise = forge certificates for any instrument
worldwide. Software keystore encryption (AES-256-GCM at rest) is
necessary but not sufficient:

- The key is in process memory during signing
- Malware on the CA host can steal the in-memory key
- An attacker with filesystem access + keystore passphrase can decrypt offline
- No defense against a misconfigured backup that leaks the keystore file

Hardware keys solve all of these by ensuring the private key **never
leaves the device**. The CA host sends signing requests via PKCS#11;
the device signs internally and returns only the signature bytes.

## Supported hardware

### Tier 1: Enterprise HSM (Thales Luna, Utimaco SecurityServer)

- **Cost**: $5,000 – $50,000+
- **Capacity**: millions of keys, FIPS 140-2 Level 3 / Level 4 certified
- **Use case**: OIML Root CA at BIML
- **PKCS#11 driver**: vendor-supplied (`libcryptoki.so`, `ctswclient.dll`)

### Tier 2: Yubikey 5 series / Nitrokey

- **Cost**: $50 – $75
- **Capacity**: 24 distinct PIV key slots, FIPS 140-2 Level 3 (Yubikey 5 FIPS)
- **Use case**: Per-IA intermediate CA
- **PKCS#11 driver**: `opensc-pkcs11.so` (Linux/macOS), `libykcs11.dylib` (Yubico)

### Tier 3: Browser IndexedDB (software)

- **Cost**: free
- **Capacity**: unlimited
- **Use case**: Per-cert signer keys in the browser
- **Security**: AES-256-GCM encrypted with PBKDF2-derived passphrase

## Provisioning a Yubikey for an IA intermediate CA

### Prerequisites

```bash
# macOS
brew install opensc yubico-piv-tool

# Linux (Debian/Ubuntu)
sudo apt install opensc yubico-piv-tool

# Verify Yubikey is detected
ykman list
# or
pkcs11-tool --module /opt/homebrew/lib/opensc-pkcs11.so -L
```

### Step 1: Set the user PIN

```bash
yubico-piv-tool -a change-pin -P 123456 -N "${OIML_PKCS11_PIN}"
```

The default Yubikey PIN is `123456`. Change it to something strong (6-8
digits) and store in a password manager or environment variable.

### Step 2: Generate the keypair ON THE DEVICE

```bash
export OIML_PKCS11_PIN="<your-pin>"
export OIML_PKCS11_MODULE=/opt/homebrew/lib/opensc-pkcs11.so

cd digital-certificates/oiml-pki-server
ruby scripts/provision-yubikey.rb \
  --module "$OIML_PKCS11_MODULE" \
  --slot 0 \
  --cert-id 01 \
  --algorithm ECDSA-P256 \
  --cn "NMi Certin B.V. OIML-CS CA" \
  --o "NMi Certin B.V." \
  --c NL \
  --validity 10
```

The script:
1. Opens a PKCS#11 session to the Yubikey
2. Generates a fresh ECDSA P-256 keypair IN THE YUBIKEY (private key
   is non-extractable, marked CKA_SENSITIVE)
3. Reads the public key off the device
4. Builds a self-signed intermediate cert using the device for signing
5. Stores the cert + PKCS#11 config (no private key!) in the keystore
6. Writes a `yubikey.provision` entry to the audit log

### Step 3: Verify

```bash
pkcs11-tool --module "$OIML_PKCS11_MODULE" -l -O
# Should list your cert in slot 0, ID 01

pkcs11-tool --module "$OIML_PKCS11_MODULE" -l --sign \
  --id 01 -m ECDSA --input-file /dev/null
# Prompts for PIN, requires Yubikey touch (if configured)
```

## Using the Yubikey in the CA server

Once provisioned, the keystore entry has no `privateKey` field —
instead it has `pkcs11` config:

```json
{
  "id": "yubikey-01-deadbeef",
  "alias": "NMi Certin B.V. OIML-CS CA",
  "certificate": "-----BEGIN CERTIFICATE-----...",
  "pkcs11": {
    "type": "pkcs11",
    "module": "/opt/homebrew/lib/opensc-pkcs11.so",
    "slot": 0,
    "cert_id": "01",
    "pin_env": "OIML_PKCS11_PIN"
  }
}
```

The CA server's `CertFactory.sign_csr` automatically dispatches to the
`KeyProvider::Pkcs11` backend when it sees this entry shape (via
`KeyProvider.for(entry)`). No code change in the route handler.

## Architecture

```
lib/oiml_pki/
  key_provider.rb              # namespace + factory (autoload)
    key_provider/
      base.rb                  # abstract interface
      software.rb              # OpenSSL::PKey (current default)
      pkcs11.rb                # Yubikey/HSM/TPM via PKCS#11
```

Each backend implements:

- `#sign(data, digest:)` — produce signature bytes
- `#public_key` — for cert embedding
- `#extractable?` — false for hardware, true for software
- `#label` — human-readable for logging
- `#to_h` — serializable config

The factory `KeyProvider.for(entry)` picks based on entry shape. Adding
a new backend (e.g., AWS KMS, HashiCorp Vault Transit) is additive —
implement Base, add a factory dispatch line, done.

## Backup and recovery

The Yubikey is single-point-of-failure. If lost, the IA cannot sign
new certs until they generate a new intermediate and re-establish
BIML's trust.

Mitigation options:
1. **Dual Yubikeys**: provision two devices with the same keypair
   (advanced — requires non-standard PKCS#11 key import)
2. **Backup Yubikey**: separately-provisioned second intermediate
   that's also signed by BIML; kept in a different physical safe
3. **Encrypted backup**: export the keypair ONCE during provisioning
   to a paper backup (QR-coded), store in physical safe (defeats the
   hardware benefit — only do for test environments)

For production: option 2 is recommended. Each IA keeps a primary
Yubikey in operational storage and a backup in a different physical
location. BIML signs both.

## PKCS#11 module locations

| Platform | Yubikey (OpenSC) | Yubikey (Yubico) |
|----------|------------------|------------------|
| macOS (Homebrew) | `/opt/homebrew/lib/opensc-pkcs11.so` | `/opt/homebrew/lib/libykcs11.dylib` |
| Linux (apt) | `/usr/lib/x86_64-linux-gnu/opensc-pkcs11.so` | `/usr/lib/libykcs11.so` |
| Linux (rpm) | `/usr/lib64/pkcs11/opensc-pkcs11.so` | `/usr/lib64/libykcs11.so` |
| Windows | `C:\Program Files\OpenSC Project\OpenSC\pkcs11\opensc-pkcs11.dll` | `C:\Program Files\Yubico\Yubico PIV Tool\bin\ykcs11.dll` |

## See also

- [Why CNML](/docs/why-cnml) — full sales pitch
- [Cryptography](/docs/cryptography) — algorithm choices
- [Trust model](/docs/trust-model) — who operates what
- `TODO.roadmap/01-hardware-backed-ca-keys.md` — full spec
