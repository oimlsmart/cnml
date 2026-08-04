---
title: Confium integration architecture
description: How the CNML stack (Ruby + TypeScript) talks to the Rust confium core — three binding paths (FFI, WASM, TCP), capability matrix, and version contract.
---

# Confium integration architecture

CNML's threshold cryptography — five-tier hierarchy, async director
signing, transparency log, threshold encryption — is built on the
open-source **[confium](https://github.com/confium/confium)** Rust
framework (43 crates, 725+ tests). This page documents how the Ruby
CA server and TypeScript browser verifier actually invoke confium.

## Three binding paths

![Confium integration points](/diagrams/confium-integration-points.svg)

| Path | Used by | Wire format | Latency |
|------|---------|-------------|---------|
| **Ruby FFI** (`confium-ruby` gem) | CA server (Ruby) | C ABI over `libconfium.{so,dylib,dll}` | µs |
| **WebAssembly** (`@confium/confium-wasm`) | Browser verifier + Director app | WASM imports/exports | µs (in-process) |
| **Network protocol** (`confium-net`) | Any client → coordinator | Length-prefixed CBOR over TCP/QUIC | ms (network) |

### Principle: smallest blast radius

Each integration uses the **smallest binding that works**:

- **CA server operations** (in-process, latency-critical, secret-bearing)
  → Ruby FFI. Secrets stay on the air-gapped machine.
- **Browser operations** (in-process, no secrets at rest, user-driven)
  → WASM. Loaded lazily; initial bundle stays under 200 KB.
- **Cross-machine operations** (director participation, ceremony
  coordination) → TCP/WSS protocol.

Never ship a secret-bearing operation to WASM if it can stay on the
CA server. Never round-trip to a remote service if the operation is
local.

## Capability matrix

Which Rust crate, which binding:

| Rust crate | Used from | Binding | Purpose |
|------------|-----------|---------|---------|
| `confium-tc-frost-p256` | CA server (LOCAL), Director app (COORDINATOR) | FFI + WASM | Threshold ECDSA-P256 signing |
| `confium-tc-frost-ed25519` | CA server (root tier ceremony) | FFI | Threshold Ed25519 signing |
| `confium-tc-elgamal-p256` | Director app (decap) | WASM | Threshold encryption decapsulation |
| `confium-tc-ml-kem` | Director app (decap), TL encrypt UI | WASM + FFI | Threshold ML-KEM-768 |
| `confium-tc-coordinator` | Coordinator service (BIML-operated) | Rust service + TCP protocol | Async session aggregation |
| `confium-pki::cms` | CA server (CMS export), Browser (CMS parse) | FFI + WASM | RFC 5652 SignedData |
| `confium-pki::delegation` | CA server, Browser verifier | FFI + WASM | Scoped delegation templates |
| `confium-pki::xmldsig` | CA server (signing) | FFI | CNML XML signing + c14n |
| `confium-deployment` | CA server, Browser | FFI + pure-TS port | Manifest validate |
| `confium-transparency` | CA server (publish), Browser (verify) | FFI + pure-TS port | Merkle log |
| `confium-patterns::escrow` | CA server | FFI | Threshold key escrow |
| `confium-patterns::revocation` | CA server | FFI | Threshold CRL signing |
| `confium-store-openpgp-card` | CA server (YubiKey) | FFI | OpenPGP card / YubiKey backend |
| `confium-test-harness` | Threshold crypto bench | Rust binary | Performance + conformance |

## Versioning contract

Each binding has its own version, but they all wrap the SAME Rust core.

| Binding | Package | Version pin | Source |
|---------|---------|-------------|--------|
| Ruby FFI | `confium-ruby` | `~> 0.3` | [github.com/confium/confium-ruby](https://github.com/confium/confium-ruby) (RubyGems) |
| Browser WASM | `@confium/confium-wasm` | `^0.3.0` | npm |
| Network protocol | `confium-net` | protocol `v1` | bundled in Rust crates |
| Rust core | `confium` workspace | per Cargo.lock | [github.com/confium/confium](https://github.com/confium/confium) |

The CNML `confium.toml` deployment manifest (TODO 34) carries a
`required_confium_version` field. Each runtime checks its binding's
version against this on startup. Mismatches produce a structured
error with the required and actual versions, not a silent fallback.

## Capability detection (Ruby)

```ruby
report = OimlPki::ConfiumIntegration.capability_report
# => {
#   gem_loaded: true,
#   gem_version: "0.3.1",
#   rust_core_version: "0.4.0",
#   available_schemes: ["FROST-P256", "FROST-Ed25519", "ElGamal-P256", "ML-KEM-768"],
#   available_storage_backends: ["openpgp-card", "pkcs11"],
#   coordinator_protocol_version: "v1",
#   missing: [],
# }
```

```ruby
# Preflight check — raises RequirementError if manifest requirements unmet
OimlPki::ConfiumIntegration.preflight!(manifest)
```

The CA server calls `preflight!` on startup with the loaded
deployment manifest. It refuses to start if requirements are unmet
(unless `OIML_PKI_SKIP_PREFLIGHT=1` is set for development).

## Capability detection (TypeScript)

```typescript
import { loadConfiumWasm } from "@cnml/cnml-crypto";

// First call triggers fetch + instantiate (~50-200 ms).
// Subsequent calls return the cached promise.
const bundle = await loadConfiumWasm();
// => {
//   module: ConfiumWasmModule,
//   version: "0.3.1",
//   rustCoreVersion: "0.4.0",
//   availableSchemes: ["FROST-P256", "ML-KEM-768"],
//   bundleSizeBytes: 5_243_892,
// }
```

The verify pipeline **never** calls this — pure-TS crypto is
sufficient for verification. WASM loads only when:

- A director opens DirectorSignPanel
- A test lab encrypts a confidential section
- An IA initiates threshold decryption
- A CMS envelope needs parsing

## Coordinator client

The coordinator is a separate Rust service (`confium-tc-coordinator`)
operated by BIML. CNML clients connect to it via two transports:

- **Ruby CA server**: TCP via `confium-net-tcp` (FFI bindings)
- **Browser director app**: WebSocket via `confium-net-ws` (WASM bindings)

Both speak the same protocol (`v1`, length-prefixed CBOR). The
coordinator handles session lifecycle, threshold aggregation, and
audit-log integration.

## Reading order

1. **[Why CNML](/docs/why-cnml)** — pitch + 5-tier overview
2. **[CNML vs typical PKI](/docs/cnml-vs-typical-pki)** — what makes CNML different
3. **This page** — how confium is integrated
4. **[Hardware keys](/docs/hardware-keys)** — YubiKey operational guide
5. **[Trust model](/docs/trust-model)** — who trusts whom

## See also

- TODO.roadmap/30 — Confium threshold PKI integration (umbrella)
- TODO.roadmap/34 — Deployment manifest (`confium.toml`)
- TODO.roadmap/40 — Integration architecture (this doc's authoritative spec)
- TODO.roadmap/42 — Browser WASM lazy-loading
- [github.com/confium/confium](https://github.com/confium/confium) — Rust core
- [github.com/confium/confium-ruby](https://github.com/confium/confium-ruby) — Ruby FFI bindings
