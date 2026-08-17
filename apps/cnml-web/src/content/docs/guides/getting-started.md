---
title: Getting started
coord: GUIDE / 01
---

# Getting started

This guide walks through the fastest path to understanding CNML:
install the packages, generate a sample certificate, and verify it.

## Install the packages

CNML ships as npm packages under the `@oiml` scope. Install the ones
you need:

```bash
npm install @oiml/cnml-crypto    # the verification pipeline
npm install @oiml/cnml-schemas   # per-Recommendation JSON Schemas
npm install @oiml/cnml-xml       # CNML XML parser and serializer
```

Or clone the repository for the full experience (web app, CA server,
test vectors):

```bash
git clone https://github.com/oimlsmart/cnml.git
cd cnml
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321/cnml/`.

## Try the web app

The web app at `/cnml/app` provides browser-based tools for
evaluation:

1. **Generate a signing key** at `/keys`. The key is generated in
   your browser using WebCrypto, encrypted with a passphrase you
   choose, and stored in IndexedDB. It never leaves your machine.

2. **Create a certificate** at `/create`. Pick an OIML Recommendation
   (R60 for load cells, R76 for weighing instruments, etc.), fill in
   the evaluation results, and sign the CNML XML.

3. **Verify a certificate** at `/verify`. Drop a `.cnml.xml` file
   onto the verifier. The nine-check pipeline runs entirely in your
   browser.

## Run the test vectors

The repository ships with 22 pre-signed test vectors (one per
Recommendation). These exercise the full sign + verify pipeline:

```bash
pnpm vectors:gen      # regenerate the vectors
pnpm vectors:verify   # verify all 22 round-trip
```

## Next steps


The framework-level conformance documents orient deeper work: the
[CNML profile of SIGNATIF](/docs/specifications/signatif-profile)
(the claimed classes), the
[conformance test mapping](/docs/specifications/signatif-test-mapping)
(which suite exercises which requirement), and the
[verification pipeline](/docs/implementation/verification-pipeline).

- [Signing a certificate](/docs/guides/signing-a-certificate) for the
  issuance flow.
- [Verifying a certificate](/docs/guides/verifying-a-certificate) for
  the check pipeline.
- [Schema-driven design](/docs/implementation/schema-driven-design) for
  how the per-Recommendation forms work.
