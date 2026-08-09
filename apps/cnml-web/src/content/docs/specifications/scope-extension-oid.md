---
title: Scope extension OID
coord: SPEC / 03
---

# Scope extension OID

This document specifies the X.509 v3 extension that binds an Issuing
Authority to its OIML-CS scope.

## Purpose

The OIML-CS framework delegates type-approval authority to Issuing
Authorities under the Declaration of Mutual Confidence (DoMC). Each
IA is authorized for specific OIML Recommendations. The scope
extension cryptographically enforces this delegation: an IA cert that
does not carry the scope extension for R60 cannot sign a valid R60
CNML certificate.

## Extension structure

The extension is a non-critical X.509 v3 extension with the OID
(configurable via `OIML_SCOPE_OID`):

```
1.3.6.1.4.1.99999.1.1  (placeholder; replace with OIML's IANA PEN)
```

The extension value is an ASN.1 SEQUENCE OF UTF8String, one
Recommendation ID per element:

```asn1
OimlAuthorizedRecommendations ::= SEQUENCE OF UTF8String
  -- e.g., "R60", "R76", "R117"
```

## Four-layer enforcement

The scope is enforced at four layers:

1. **CA signing**: The CA server checks the requesting IA's scope
   before signing a CNML certificate. Out-of-scope requests are
   rejected.

2. **Cert embedding**: The scope is embedded in the IA's intermediate
   certificate as the X.509 extension. Any party can read the scope
   from the cert.

3. **Verification pipeline**: Check 4 (scope valid) in the verify
   pipeline reads the extension from the signer's cert and compares
   it to the Recommendation on the CNML document. Mismatch fails.

4. **Transparency log**: The transparency log entry records the
   scope. Auditors can detect scope violations by comparing log
   entries to the DoMC.

## Placeholder OID

The default OID (`1.3.6.1.4.1.99999.1.1`) is a placeholder IANA
Private Enterprise Number. Production deployments set `OIML_SCOPE_OID`
to OIML's registered PEN. The placeholder produces a warning on CA
server startup.

## References

- RFC 5280 (X.509 PKI)
- OIML-CS DoMC (Declaration of Mutual Confidence)
- IANA Private Enterprise Numbers
