---
title: Hardware key tiers
description: How PKCS#11-compatible hardware devices map onto the CNML signing tiers. The technical interface is uniform; capacity and certification regime are the only meaningful differentiators between devices.
---

# Hardware key tiers

CNML uses PKCS#11-compatible hardware devices to hold signing keys at every tier of the five-tier hierarchy. The technical interface is uniform across all devices and all tiers: the device exposes PKCS#11, the CA server's KeyProvider dispatch calls through PKCS#11, and the private key is generated on the device and never leaves the device in plaintext. The choice of device at each tier is a deployment policy driven by capacity and certification requirements, not a software constraint.

The marketing distinction between enterprise hardware security modules and personal hardware tokens is cosmetic from a technical standpoint. Both device classes speak PKCS#11, both generate keys on the device, both refuse to export private key material, and both can serve at any tier in the CNML hierarchy. The only differentiator that matters operationally is capacity: how many private keys the device can hold simultaneously.

## Capacity drives the tier mapping

The three signing tiers differ in the number of keys they hold.

The BIML Root tier holds a small number of high-value signing keys. The root signing key is the most valuable secret in the system. Where the deployment operates a threshold quorum at the root tier, the root share for each director is held on a separate device. A device with capacity for one to a handful of root-tier shares is sufficient.

The IA intermediate tier holds one device per IA officer, with each device carrying that officer's threshold share of the IA intermediate signing key. A typical IA configuration uses three officers per IA, so the deployment uses three devices per IA, each carrying one share.

The signer tier holds one device per signer, with each device carrying that signer's end-entity key. Signer-tier deployments may involve many signers per IA, so the deployment uses many devices.

## What the device does at every tier

Regardless of which tier the device serves, the device performs the same role.

The CA host communicates with the device through PKCS#11. The host sends a signing request through the PKCS#11 interface, the device performs the signing operation internally, and the device returns only the signature bytes. The private key never appears in the host's process memory or filesystem. This property defends against malware on the CA host: an attacker who compromises the host can submit signing requests but cannot extract the key.

The device is provisioned through the CA server's KeyProvider dispatch. The dispatch identifies the device by its PKCS#11 module path and slot identifier, opens a session, and submits signing requests as needed. Multiple devices can coexist on the same host, each in its own slot. The CA server's configuration selects the device by slot.

## Certification regimes

Where the deployment operates under a regulatory framework that requires validated cryptographic modules, the device's certification regime becomes a deployment constraint. FIPS 140-2 validation is the United States national regime. FIPS 140-3 is the successor standard, currently in transition under the NIST Cryptographic Module Validation Program modernization. Common Criteria and national certification regimes apply in other jurisdictions.

CNML does not require any specific certification regime. The CA server treats every PKCS#11-compatible device identically. Where a deployment requires FIPS-validated devices, the deployment selects devices validated under the appropriate regime. Where FIPS validation is not required, any PKCS#11-compatible device is suitable.

## Compatible devices

The devices listed below are factual references to PKCS#11-compatible hardware that CNML's KeyProvider dispatch can drive. The list is not exhaustive: any PKCS#11-compatible device that exposes the standard PIV or generic key slot interface works. Inclusion in this list does not constitute an endorsement. Vendors are listed alphabetically.

| Vendor | Device family | Capacity (typical) | Notable certification regime | PKCS#11 driver |
|--------|---------------|--------------------|------------------------------|----------------|
| CryptoTrust | CardOS HSM | tens of keys | Common Criteria EAL 5+ | vendor-supplied |
| Entrust | nShield HSM family | thousands of keys | FIPS 140-2 Level 3, FIPS 140-3 in transition | vendor-supplied (`pkcs11` library) |
| Futurex | Vectera Plus, Excipher SSP | thousands of keys | FIPS 140-2 Level 3 | vendor-supplied |
| Hydrogen | HSM products | varies by model | FIPS 140-2 Level 3 | vendor-supplied |
| Kryptus | kNET HSM | thousands of keys | FIPS 140-2 Level 3 | vendor-supplied |
| Marvell | LiquidSecurity HSM adapter | thousands of keys | FIPS 140-2 Level 3 | vendor-supplied |
| Nitrokey | Nitrokey 3, Nitrokey HSM 2 | 24 to 50 keys per applet | Common Criteria, BSI (German federal) | OpenSC (`opensc-pkcs11.so`) |
| PrimusTrust | Primus HSM family | thousands of keys | FIPS 140-2 Level 3 | vendor-supplied |
| Securosys | Primus HSM family | thousands of keys | FIPS 140-2 Level 3, Common Criteria EAL 4+ | vendor-supplied |
| SoloKeys | Solo 2 | tens of keys | FIDO2, OpenPGP card v3 | OpenSC |
| Thales | Luna HSM family | thousands of keys | FIPS 140-2 Level 3, FIPS 140-3 in transition | vendor-supplied (`Cryptoki` library) |
| Trusted Objects | SafeHSM | thousands of keys | Common Criteria | vendor-supplied |
| Utimaco | SecurityServer HSM family | thousands of keys | FIPS 140-2 Level 3, BSI, Common Criteria | vendor-supplied (`PKCS11` library) |
| Yubico | YubiKey 5 series, YubiKey 5 FIPS series | 24 PIV key slots per device | YubiKey 5 FIPS validated under FIPS 140-2; YubiKey 5 FIPS series in transition to FIPS 140-3 | OpenSC (`opensc-pkcs11.so`) or Yubico's `ykcs11` driver |
| Yubico | YubiHSM 2 | hundreds of keys | FIPS 140-2 Level 3 | vendor-supplied (`yubihsm_pkcs11` library) |

The Yubico store at https://www.yubico.com/store/ lists current YubiKey variants and certification documentation. Other vendors publish equivalent material on their own sites.

## Software-only fallback at the signer tier

For development, low-assurance deployments, or signers who do not have access to hardware, browser IndexedDB provides a software-only signer path. The signer generates an ECDSA P-256 keypair in the browser. The private key is encrypted with a passphrase-derived AES-GCM key (the passphrase is processed through PBKDF2 with a high iteration count) and stored in the browser's IndexedDB. The key never leaves the browser.

The browser tier does not provide the hardware extraction resistance of the PKCS#11 device tiers. The security model relies on the browser's same-origin policy, the AES-GCM encryption at rest, and the PBKDF2 key derivation from a strong passphrase. The tradeoff is operational simplicity: the signer does not need to carry or provision hardware, and the key is available wherever the signer's browser is available.

CNML recommends that signers export their signing keypair to a secure backup at provisioning time. The backup may be a PEM file stored in a password manager or a paper backup stored in a physical safe. The backup prevents total key loss, which would require the IA to re-issue the signer's end-entity certificate and the signer to regenerate a keypair.

## Provisioning workflow

The provisioning workflow is uniform across vendors.

The operator runs the CA server's provisioning script with the device's PKCS#11 module path, the slot identifier, and the operator's PIN. The script initializes the slot if it is uninitialized, generates the signing key on the device, exports the public key, and stores the public key plus the device descriptor in the CA server's keystore. The private key never appears in the keystore.

The operator verifies that the key was generated correctly by submitting a test signature through the PKCS#11 interface. The CA server logs the provisioning event in the audit log.

For deployments that use threshold signing, the provisioning workflow includes the distributed key generation protocol. Each device contributes to the key generation, and the resulting shares never appear in plaintext outside their respective devices. The aggregate public key is recorded in the keystore and signed by the parent CA.

## See also

- [CNML architecture choices](/docs/architecture/cnml-architecture-choices) develops the air-gapped CA model that the hardware tiers serve.
- [System architecture](/docs/architecture/system) describes where each tier sits in the five-tier hierarchy.
- [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml) describes the operational role of each tier.
