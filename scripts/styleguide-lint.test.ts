/**
 * Style guide linter — unit tests.
 *
 * Each fixture is a small prose sample that exercises one rule. The
 * test asserts that the linter produces the expected findings on the
 * fixture and zero findings on a clean passage.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {styleguideLint} from "./styleguide-lint-rules.ts";

describe("styleguide-lint — fixture posture", () => {
  test("clean prose produces zero findings", () => {
    const clean = [
      "## Why CNML",
      "",
      "CNML is a digital certificate format for OIML type approvals.",
      "It uses X.509 v3 certificates and threshold cryptography.",
    ].join("\n");
    const findings = styleguideLint(clean, "test/clean.md");
    assert.equal(findings.length, 0);
  });

  test("em-dash rule fires on —", () => {
    const bad = "This is a sentence — with an em-dash.";
    const findings = styleguideLint(bad, "test/em.md");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]!.rule, "em-dash");
  });

  test("cnml-as-successor rule fires on CNML + successor co-occurrence", () => {
    const bad = "CNML is the direct successor to the existing OIML-CS.";
    const findings = styleguideLint(bad, "test/successor.md");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]!.rule, "cnml-as-successor");
  });

  test("cnml-as-successor rule does not fire on standalone FIPS successor mention", () => {
    const ok = "FIPS 140-3 is the successor standard to FIPS 140-2.";
    const findings = styleguideLint(ok, "test/fips.md");
    assert.equal(findings.length, 0);
  });

  test("cnml-as-successor rule does not fire on DCC field name 'predecessor-certificate'", () => {
    const ok = "The DCC schema defines a predecessor-certificate link element.";
    const findings = styleguideLint(ok, "test/dcc.md");
    assert.equal(findings.length, 0);
  });

  test("marketing-superlative rule fires on 'cutting-edge'", () => {
    const bad = "CNML uses cutting-edge cryptography.";
    const findings = styleguideLint(bad, "test/superlative.md");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]!.rule, "marketing-superlative");
  });

  test("named-hardware-vendor rule fires on YubiKey mention", () => {
    const bad = "The officer holds a YubiKey or equivalent device.";
    const findings = styleguideLint(bad, "test/vendor.md");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]!.rule, "named-hardware-vendor");
  });

  test("named-hardware-vendor rule is suppressed on except paths", () => {
    const bad = "A YubiKey is a personal hardware token.";
    const findings = styleguideLint(bad, "docs/reference/glossary.md");
    assert.equal(findings.length, 0);
  });

  test("curly-quotes rule fires on typographic quotes", () => {
    // Uses actual U+201C and U+201D (curly quotes), not ASCII straight quotes.
    const bad = "He said “hello” with curly quotes.";
    const findings = styleguideLint(bad, "test/quotes.md");
    assert.equal(findings.length, 2);
    assert.equal(findings[0]!.rule, "curly-quotes");
  });

  test("cnml-as-dcc rule fires when CNML is called OIML's DCC", () => {
    const bad = "CNML's Digital Calibration Certificate covers calibration tier.";
    const findings = styleguideLint(bad, "test/dcc-ascription.md");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]!.rule, "cnml-as-dcc");
  });
});
