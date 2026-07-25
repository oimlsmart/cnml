# BIML Scope Governance

Who can sign which kind of OIML certificate — and how the CNML PKI enforces it.

## The question

In the real OIML system, **BIML** (Bureau International de Métrologie Légale) — via the DoMC (Declaration of Mutual Confidence) framework — scopes each Issuing Authority to specific Recommendations. PTB (DE1) may be authorized for R60 (load cells) and R76 (weighing instruments); NMi (NL1) for R117 (fuel dispensers) and R139 (CNG dispensers); etc. No IA is blanket-approved for all 22 Recommendations.

Without cryptographic enforcement, the CNML PKI cannot distinguish a legitimate IA signing within its scope from a compromised IA signing out-of-scope certificates. This document specifies how scope is encoded, written, and checked.

## Trust model recap

```
OIML Root CA  (operated by BIML)
     │
     │ signs intermediate with scope extension
     ▼
Issuing Authority Intermediate CA  (e.g., NL1, DE1, CH1)
     │
     │ signs end-entity cert (inherits scope from issuer)
     ▼
Per-cert Signer  (a person or HSM at the IA)
     │
     │ signs CNML XML
     ▼
CNML certificate  (carries <cnml:recommendation><cnml:id>R60</cnml:id>)
```

## Scope encoding

Scope lives in **two parallel locations** for defense in depth:

### 1. X.509 v3 extension (cryptographic)

Each IA intermediate cert includes a non-critical extension:

- **Name**: `oimlAuthorizedRecommendations`
- **OID**: `1.3.6.1.4.1.<OIML_PEN>.1.1` (OIML Private Enterprise Number — to be registered with IANA; placeholder `99999` for development)
- **Value**: ASN.1 `SEQUENCE OF UTF8String`, one R-id per element
- **Critical**: `false` — verifiers that don't understand it must still accept the cert (graceful degradation)

Ruby openssl example:

```ruby
ef = OpenSSL::X509::ExtensionFactory.new
ef.subject_certificate = cert
ef.issuer_certificate  = issuer_cert
value = OpenSSL::ASN1::Sequence.new(
  scope.map { |r| OpenSSL::ASN1::UTF8String.new(r) }
).to_der
cert.add_extension(OpenSSL::X509::Extension.new("oimlAuthorizedRecommendations", value, false))
```

### 2. trust-anchors.json manifest (JSON, easy to consume)

```json
{
  "intermediates": [
    {
      "fingerprint": "sha256:…",
      "subject":     "CN=NMi Certin B.V. OIML-CS CA, O=NMi, C=NL",
      "validFrom":   "2026-01-01T00:00:00Z",
      "validUntil":  "2031-01-01T00:00:00Z",
      "oimlIssuerId": "NL1",
      "scope":       ["R76", "R60", "R61", "R51", "R50", "R106", "R107", "R134", "R111"]
    }
  ]
}
```

Browsers without X.509 extension parsing can read this manifest directly. Both sources must agree (verifier should warn on mismatch).

## Enforcement layers

| Layer | Where | What it checks |
|-------|-------|----------------|
| 1. BIML → IA | Intermediate cert signing | BIML operator manually specifies scope based on DoMC recognition |
| 2. IA → Signer | End-entity cert signing | IA's CA server refuses to issue end-entity certs that would extend beyond the IA's own scope |
| 3. Signer → CNML | Browser sign flow | The signer's browser app reads scope from its own cert chain and refuses to sign a CNML whose `<cnml:recommendation><cnml:id>` is out of scope |
| 4. Verifier | Browser verify flow | Reads scope from intermediate cert (or trust-anchors.json) and rejects CNMLs whose recommendation isn't covered |

Layers 1 and 4 are mandatory and suffice for correctness. Layers 2 and 3 are defense in depth — they catch mistakes early (before a signer wastes time filling a form for a cert they can't issue).

## Verify flow

```
1. Validate cert chain: signer → intermediate → root (existing logic)
2. Extract recommendation ID from CNML: <cnml:recommendation><cnml:id>R60</cnml:id>
3. Extract scope from intermediate cert's oimlAuthorizedRecommendations extension
   - Fallback: read scope from trust-anchors.json entry matching the intermediate's fingerprint
4. If R-id is in scope: pass
   If not: FAIL with "Issuer <X> is not authorized to sign R<NN> certificates"
```

## Operational notes

- **Adding scope**: IA requests new Recommendation authorization via DoMC. BIML issues a new intermediate cert (same keypair, expanded scope). Old cert is revoked via CRL.
- **Removing scope**: BIML revokes the existing intermediate. IA's existing signed CNMLs remain valid (signed before revocation). New CNMLs must chain to the new (narrower) intermediate.
- **Retroactive scope**: A cert signed when the IA had broader scope remains valid even after scope narrows. The verifier checks scope at the **cert's `notBefore` timestamp**, not at verify time.
- **Wildcard scope**: Not supported. Each IA must declare the explicit list. (Debate: should we allow `"*"` for the OIML Root itself, in case BIML needs to sign test certs outside any IA's scope? Currently no — root is a CA-only cert, never signs CNMLs directly.)

## Implementation status

| Component | Status |
|-----------|--------|
| `oiml-pki-server` writes scope to trust-anchors.json | Done — `Publisher.publish_trust_anchors` |
| `oiml-pki-server` accepts scope at CSR sign time | Done — `/csr/sign` form |
| `oiml-pki-server` embeds X.509 extension in cert | Done — `CertFactory.sign_csr` |
| Browser verifier reads scope from manifest | TODO — `TODO.cnml-pki/11-integration-wiring.md` |
| Browser verifier reads scope from X.509 extension | TODO — depends on `pkijs` extension parsing |
| Browser signer checks own scope before signing | TODO — UX design needed |

## See also

- [Trust Model](/docs/trust-model)
- [Cryptography](/docs/cryptography)
- `TODO.cnml-pki/06-certificate-status.md` — certificate status pipeline
- `TODO.cnml-pki/11-integration-wiring.md` — browser-side wiring tasks
