/**
 * Style guide rule definitions and scanner.
 *
 * Separated from the entry-point script so the test suite can import
 * the rule set and the scanner without spawning a process. The script
 * at scripts/styleguide-lint.ts is a thin wrapper that calls
 * `styleguideLint` on every markdown file under content/ and exits
 * with the right code.
 */

export interface Rule {
  /** Stable identifier shown in the report. */
  id: string;
  /** Pattern to match. */
  pattern: RegExp;
  /** One-line reason, referencing the style-guide rule. */
  why: string;
  /**
   * Optional override: paths (relative to CONTENT_ROOT) where this
   * rule is suppressed. Use sparingly and document the reason in the
   * rule's `why` or in a comment.
   */
  except?: string[];
}

export const RULES: Rule[] = [
  {
    id: "em-dash",
    pattern: /—/u,
    why: "Style guide mandates a comma or colon, not an em-dash.",
  },
  {
    id: "en-dash-in-prose",
    pattern: /(?<!\d)\s–\s|\s–(?!\d)/u,
    why: "En-dashes are for numeric ranges only. Use a comma or colon in prose.",
  },
  {
    id: "cnml-as-successor",
    pattern: /CNML[^.\n]{0,80}\b(?:predecessor|succeeds|successor)\b/i,
    why: "The 'CNML succeeds the PDF' framing is forbidden — CNML is a new scheme.",
  },
  {
    id: "marketing-superlative",
    pattern: /\b(?:cutting-edge|world-class|best-in-class|revolutionary|game-changing|seamless|powerful|leverage|unlock|empower)\b/i,
    why: "Style guide bans the marketing register. Use concrete technical claims.",
  },
  {
    id: "ai-slop",
    pattern: /\b(?:delve|tapestry|navigate the|underscore|testament to|in the realm of|a testament to)\b/i,
    why: "Common AI-generated filler. Rewrite in plain language.",
  },
  {
    id: "curly-quotes",
    pattern: /[“”]/u,
    why: "Use straight ASCII quotes in source files. Renderers handle typography.",
  },
  {
    id: "cnml-as-dcc",
    pattern: /\bCNML[''']?s?\s+(?:Digital\s+Calibration\s+Certificate|DCC)\b/i,
    why: "CNML is not OIML's DCC. They operate at different tiers.",
  },
  {
    id: "named-hardware-vendor",
    pattern: /\b(?:YubiKey|Yubico|Nitrokey|Thales|Utimaco|Entrust)\b/u,
    why: "Never recommend hardware vendors. PKCS#11-compatible devices are equivalent.",
    except: [
      "docs/reference/glossary.md",
      "docs/architecture/hardware-tiers.md",
    ],
  },
];

export interface Finding {
  file: string;
  line: number;
  column: number;
  rule: string;
  snippet: string;
  why: string;
}

/**
 * Scan a single markdown body and return findings. The `file`
 * argument is the path relative to CONTENT_ROOT — used to honor
 * per-file `except` overrides.
 */
export function styleguideLint(text: string, file: string, rules: Rule[] = RULES): Finding[] {
  const lines = text.split("\n");
  const findings: Finding[] = [];

  for (const rule of rules) {
    if (rule.except?.includes(file)) continue;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (line.startsWith("---") && i < 5) continue;
      const flags = rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g";
      const re = new RegExp(rule.pattern.source, flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(line))) {
        const snippet = line.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).trim();
        findings.push({
          file,
          line: i + 1,
          column: m.index + 1,
          rule: rule.id,
          snippet,
          why: rule.why,
        });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
  }
  return findings;
}
