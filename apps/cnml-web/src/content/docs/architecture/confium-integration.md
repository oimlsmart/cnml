---
title: Confium integration
description: How the Ruby CA server and the TypeScript verifier invoke the Confium Rust threshold-cryptography framework, covering the three binding paths (Ruby FFI, WebAssembly, and TCP), the capability matrix, and the version contract.
---

# Confium integration

CNML's threshold cryptography, transparency log, and threshold encryption are built on the open-source Confium Rust framework. This document describes how the Ruby CA server and the TypeScript browser verifier invoke Confium. The implementation of CNML is developed by Ribose, and the threshold-cryptography substrate is provided by Confium.

![Confium integration points](/diagrams/confium-integration-points.svg)

## The three binding paths

Confium is a Rust framework. CNML integrates with it through three binding paths, each matched to the constraints of the calling environment. The principle behind the three paths is that each integration uses the smallest binding that satisfies its requirements. A secret-bearing operation that can run on the air-gapped CA server does not run in the browser. A local operation that can run in-process does not round-trip to a remote service.

The Ruby FFI path is used by the CA server. The CA server is a Ruby application running on the air-gapped CA machine. It links to Confium through the `confium-ruby` gem, which wraps the Rust core through a C ABI over `libconfium`. The FFI path is in-process, latency-critical, and secret-bearing. Secrets stay on the CA machine. The binding is the Ruby FFI gem at version 0.3 or later.

The WebAssembly path is used by the browser. The browser verifier and the director signing panel load Confium through the `@confium/confium-wasm` npm package, which wraps the Rust core through WASM imports and exports. The WASM path is in-process, has no secrets at rest, and is user-driven. The WASM bundle is loaded lazily on first use, so the initial page load bundle stays small. The binding is the WASM package at version 0.3.0 or later.

The network protocol path is used for cross-machine operations. Directors participating in a signing session from their own locations, and clients connecting to the coordinator service, use the `confium-net` network protocol. The protocol carries length-prefixed CBOR messages over TCP, WebSocket, or QUIC. The network path is used when the operation must cross a machine boundary. The binding is the network protocol at version 1.

## Capability matrix

The Confium Rust workspace provides multiple crates, each addressing a specific concern. The following matrix identifies which crate is used by which binding path and for what purpose.

| Rust crate | Used from | Binding | Purpose |
|---|---|---|---|
| `confium-tc-frost-p256` | CA server, director app | FFI and WASM | Threshold ECDSA P-256 signing |
| `confium-tc-frost-ed25519` | CA server (root tier) | FFI | Threshold Ed25519 signing |
| `confium-tc-elgamal-p256` | Director app (decapsulation) | WASM | Threshold encryption decapsulation |
| `confium-tc-ml-kem` | Director app, encryption UI | WASM and FFI | Threshold ML-KEM-768 |
| `confium-tc-coordinator` | Coordinator service | Rust service and TCP | Asynchronous session aggregation |
| `confium-pki::cms` | CA server, browser | FFI and WASM | RFC 5652 SignedData |
| `confium-pki::delegation` | CA server, browser verifier | FFI and WASM | Scoped delegation templates |
| `confium-pki::xmldsig` | CA server | FFI | CNML XML signing and canonicalization |
| `confium-deployment` | CA server, browser | FFI and pure-TS port | Manifest validation |
| `confium-transparency` | CA server, browser | FFI and pure-TS port | Merkle log |
| `confium-patterns::escrow` | CA server | FFI | Threshold key escrow |
| `confium-patterns::revocation` | CA server | FFI | Threshold CRL signing |
| `confium-store-openpgp-card` | CA server (OpenPGP card) | FFI | OpenPGP card HSM backend |
| `confium-test-harness` | Threshold cryptography bench | Rust binary | Performance and conformance |

The matrix shows that the FFI path covers the full capability set, because the CA server is the most capable consumer of Confium. The WASM path covers the subset of capabilities that the browser needs (threshold signing participation, threshold encryption, CMS parsing, transparency verification). The pure-TypeScript ports of the deployment manifest validator and the transparency log verifier mean that the browser verifier does not load WASM for verification alone. WASM loads only when the browser needs to participate in a threshold operation or parse a CMS envelope.

## Capability detection

The CA server performs a capability check at startup. The `ConfiumIntegration.capability_report` method returns a structured report indicating whether the `confium-ruby` gem is loaded, the gem version, the Rust core version, the available threshold schemes, the available storage backends, and the coordinator protocol version. The CA server's preflight check compares this report against the requirements in the deployment manifest and refuses to start if any requirement is unmet. The preflight produces a structured error identifying the missing capability, not a silent fallback.

The browser performs a similar capability check when WASM is first loaded. The `loadConfiumWasm` function fetches and instantiates the WASM module, returns the module version, the Rust core version, the available schemes, and the bundle size. The check is lazy: it runs only when a threshold operation is requested. The verification pipeline does not call it, because pure-TypeScript cryptography is sufficient for verification.

## Coordinator client

The coordinator is a separate Rust service (`confium-tc-coordinator`) operated by BIML. The coordinator handles session lifecycle, threshold aggregation, and audit-log integration. CNML clients connect to it through two transports. The Ruby CA server connects through TCP via the `confium-net-tcp` FFI bindings. The browser director app connects through WebSocket via the `confium-net-ws` WASM bindings. Both transports speak the same protocol (version 1, length-prefixed CBOR).

The coordinator is honest-but-curious. It can observe encrypted protocol messages and can log their existence, but it cannot reconstruct the signing key (the threshold property prevents this), cannot forge a director commitment (the director identity-key signatures prevent this), and cannot tamper with the audit log (the hash chain and the transparency-log anchoring prevent this). The coordinator's role is session management and aggregation, described in [Distributed management](/docs/architecture/distributed-management).

## Version contract

Each binding has its own version, but all bindings wrap the same Rust core. The Ruby FFI binding is the `confium-ruby` gem at version 0.3 or later, sourced from RubyGems. The browser WASM binding is the `@confium/confium-wasm` package at version 0.3.0 or later, sourced from npm. The network protocol is `confium-net` at protocol version 1, bundled in the Rust crates. The Rust core is the Confium workspace, versioned per the Cargo.lock of the deployment.

The CNML deployment manifest carries a `required_confium_version` field. Each runtime checks its binding's version against this field at startup. A mismatch produces a structured error identifying the required and actual versions, not a silent fallback. This contract ensures that a deployment that depends on a specific Confium capability fails loudly if the capability is absent, rather than producing a subtly incorrect result.

## See also

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) introduces the threshold-signature substrate that Confium provides.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous signing flow that the coordinator mediates.
- [For developers](/docs/roles/for-developers) describes the CA server's key provider dispatch and the browser's WASM loading pattern from an implementation perspective.
