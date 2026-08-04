---
title: Hardware key tiers
description: The three-tier hardware model for CNML signing keys, covering enterprise HSMs at the BIML Root, personal hardware tokens at the IA intermediate, and browser IndexedDB at the signer tier, with PKCS#11 as the common interface.
---

# Hardware key tiers

CNML uses three hardware tiers for signing keys, matched to the sensitivity of the key at each level of the five-tier hierarchy. The enterprise HSM tier covers the BIML Root, where the signing key is the most valuable secret in the system and hardware extraction must be prevented. The personal hardware token tier covers the IA intermediate, where the signing key is held by IA officers who travel and convene. The browser software tier covers the per-cert signer, where the signing key is generated and used in the browser. PKCS#11 is the common interface at the hardware-backed tiers, so that the CA server's key provider dispatch is uniform across vendors.

The hardware listed in each tier is identified by vendor name as a factual reference. The listing does not constitute an endorsement. Devices that meet the stated certification level and expose a PKCS#11 interface are suitable for the tier.

## Tier 1: enterprise HSM at the BIML Root

The BIML Root signing key is held in an enterprise hardware security module. Devices in this class include the Thales Luna and the Utimaco SecurityServer. These devices provide FIPS 140-2 Level 3 or Level 4 certification and hold the signing key in tamper-resistant hardware that prevents extraction. The key is generated on the device, marked sensitive and non-extractable, and never leaves the device in plaintext.

The CA host communicates with the device through PKCS#11. The host sends a signing request through the PKCS#11 interface, the device performs the signing operation internally, and the device returns only the signature bytes. The private key never appears in the host's process memory or filesystem. This property defends against malware on the CA host: an attacker who compromises the host can submit signing requests but cannot extract the key.

The enterprise HSM tier is operated by BIML ceremony staff at the air-gapped CA facility described in [CNML architecture choices](/docs/architecture/cnml-architecture-choices). The device is provisioned during the root key generation ceremony, and the provisioning is recorded in the audit log. Backup of the root key, where performed, uses the threshold escrow pattern rather than key export: the key is shared among the directors through distributed key generation, and recovery requires a threshold of directors to participate.

## Tier 2: personal hardware token at the IA intermediate

The IA intermediate signing key is held in a personal hardware token. Devices in this class include the YubiKey 5 series and the Nitrokey. These devices provide FIPS 140-2 Level 3 certification in a personal form factor that an IA officer can carry and use at a workstation. The YubiKey 5 FIPS variant provides the certification level. The devices expose 24 distinct PIV key slots and a PKCS#11 interface through the OpenSC driver or the vendor-supplied driver.

The personal hardware token tier supports the threshold architecture at the IA level. Each of the three IA officers holds a share of the IA intermediate signing key on their own token. The threshold property means that compromise of a single officer's token cannot produce an IA-tier signature, and loss of a single token does not prevent the remaining officers from signing. The tokens are provisioned through the IA's distributed key generation ceremony, and each token is personally controlled by its officer.

PKCS#11 module locations vary by platform. On macOS, the OpenSC module is at `/opt/homebrew/lib/opensc-pkcs11.so` and the Yubico module is at `/opt/homebrew/lib/libykcs11.dylib`. On Linux, the modules are at `/usr/lib/x86_64-linux-gnu/opensc-pkcs11.so` (Debian and Ubuntu) or `/usr/lib64/pkcs11/opensc-pkcs11.so` (RPM distributions) for OpenSC, and the corresponding libykcs11 path for the Yubico driver. On Windows, the modules are in the installation directories of OpenSC and Yubico PIV Tool respectively.

## Tier 3: browser IndexedDB at the signer tier

The per-cert signer key is generated and held in the signer's browser. The signer (a person at the IA) generates an ECDSA P-256 keypair in the browser. The private key is encrypted with a passphrase-derived AES-GCM key (the passphrase is processed through PBKDF2 with a high iteration count) and stored in the browser's IndexedDB. The key never leaves the browser.

The browser tier does not provide the hardware extraction resistance of the HSM or the personal token tiers. The security model relies on the browser's same-origin policy, the AES-GCM encryption at rest, and the PBKDF2 key derivation from a strong passphrase. The tradeoff is operational simplicity: the signer does not need to carry or provision hardware, and the key is available wherever the signer's browser is available.

CNML recommends that signers export their signing keypair to a secure backup at provisioning time. The backup may be a PEM file stored in a password manager or a paper backup (a QR-coded representation of the encrypted key) stored in a physical safe. The backup prevents total key loss, which would require the IA to re-issue the signer's end-entity certificate and the signer to regenerate a keypair. Browser-side hardware token signing, which would combine the operational simplicity of the browser tier with the extraction resistance of the token tier, is on the roadmap.

## Provisioning a personal hardware token

Provisioning a personal hardware token for an IA intermediate certificate follows a standard sequence. The prerequisites are the OpenSC and yubico-piv-tool packages, installed through the platform package manager (Homebrew on macOS, apt on Debian and Ubuntu). The token is verified as detected through `ykman list` or `pkcs11-tool --module <path> -L`.

The provisioning sequence sets a strong user PIN (replacing the default), generates a fresh ECDSA P-256 keypair on the device (the private key is generated in hardware and marked sensitive and non-extractable), reads the public key from the device, builds a self-signed intermediate certificate using the device for signing, and stores the certificate and the PKCS#11 configuration in the keystore. The keystore entry contains the PKCS#11 configuration (module path, slot, certificate ID, PIN environment variable) and not the private key. The provisioning is recorded as a `yubikey.provision` entry in the audit log.

The CA server's key provider dispatch reads the keystore entry and selects the PKCS#11 backend when it detects the PKCS#11 configuration shape. No code change is required in the route handler. Adding a new backend (a cloud key management service, for example) is additive: the new backend implements the base key provider interface, an autoload entry is added, and a dispatch rule is added to the factory. The open-closed pattern is described in [CNML architecture choices](/docs/architecture/cnml-architecture-choices).

## Backup and recovery

The personal hardware token is a single point of failure for the officer who holds it. If the token is lost, the officer cannot participate in IA-tier signing until a new token is provisioned and a re-sharing ceremony restores the officer's share. The threshold property of the IA quorum means that the loss of one token does not prevent the remaining officers from signing.

CNML recommends that each IA maintain a backup token for each officer, provisioned with the same keypair during the original ceremony and stored in a different physical location. The dual-token approach means that the loss of the primary token does not require an emergency re-sharing. The backup is kept in a physical safe at a location separate from the primary, so that a single physical event (theft, fire) does not compromise both tokens.

The enterprise HSM tier and the browser tier have different backup models. The enterprise HSM uses threshold escrow, where the key is shared among the directors and recovery requires a threshold. The browser tier uses passphrase-derived encryption, where the backup is the exported PEM or paper backup and recovery requires the passphrase.

## See also

- [System architecture](/docs/architecture/system) describes the five-tier hierarchy that the hardware tiers support.
- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) describes the air-gapped CA and the threshold-signing architecture.
- [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml) provides the operational guidance for IA officers and BIML ceremony staff.
- [For developers](/docs/roles/for-developers) describes the key provider dispatch and the PKCS#11 backend interface.
