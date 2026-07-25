# @cnml/cnml-test-vectors

Test corpus + roundtrip checks for CNML.

## Run

```bash
pnpm test
```

Tests:
- WebCrypto availability
- RSA-2048 keypair generation
- Sign + verify round-trip
- SHA-256 determinism
- Sample cert loading
- XSD file validity

## Test vectors (TODO 15 in full)

Once TODO 07 (signing) lands with `xmldsigjs`-based canonicalization, add:
- 1 sample CNML per Recommendation (22 files)
- Expected digest values (golden)
- Expected signature output (with fixed test key)
