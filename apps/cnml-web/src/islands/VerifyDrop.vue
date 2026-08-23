<script setup lang="ts">
import { ref, computed } from "vue";
import { parseCnmlXml, type Certificate } from "@oiml/cnml-xml";
import {
  verifyCnmlXml, listTrustedKeys, cryptoKeyFromTrustedKey,
  type VerificationResult,
} from "@oiml/cnml-crypto";
import {
  verifyArtifact, CHECKS, runConfiumVerifyCheck,
  confirmChainInclusion, verifySignedHead,
  type CheckResult, type CheckContext,
  type CoverageReport, type ClassificationResult, type AcceptanceResult,
  type CertInclusionResult,
} from "@oiml/cnml-crypto/checks";
import ErrorCallout from "./widgets/ErrorCallout.vue";
import { useAsyncAction } from "../composables/useAsyncAction";

const file = ref<File | null>(null);
const xml  = ref("");
const cert = ref<Certificate | null>(null);
const verification = ref<VerificationResult | null>(null);
const { error, busy, run } = useAsyncAction();
const xmlWellFormed = ref(false);
const checkResults = ref<CheckResult[]>([]);
const coverage = ref<CoverageReport | null>(null);
const classification = ref<ClassificationResult | null>(null);
const acceptance = ref<AcceptanceResult | null>(null);

// Verifier configuration (the SIGNATIF acceptance policy + the
// transparency posture): the minimum label this verifier accepts, the
// log operator's public key for signed-head verification, and the log
// endpoint for chain-certificate inclusion. Persisted so a verifier
// configures once.
const CONFIG_KEY = "cnml-verifier-config";
type MinLabel = "A+" | "A" | "B" | "C";
const configLoaded = (() => {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();
const minLabel = ref<MinLabel>(configLoaded?.minLabel ?? "C");
const operatorKeyPem = ref<string>(configLoaded?.operatorKeyPem ?? "");
const logEndpoint = ref<string>(configLoaded?.logEndpoint ?? "");
function persistConfig() {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      minLabel: minLabel.value,
      operatorKeyPem: operatorKeyPem.value,
      logEndpoint: logEndpoint.value,
    }));
  } catch { /* storage unavailable: session-only config */ }
}

// Transparency posture from the configured log: the published head and
// per-certificate inclusion on the verification path.
const logHead = ref<{ size: number; root: string; signed: boolean; headOk: boolean } | null>(null);
const chainInclusion = ref<CertInclusionResult[] | null>(null);
// Optional Confium WASM enhanced verification status. Populated after
// the main pipeline completes. Silent on unavailability.
const confiumStatus = ref<"idle" | "available" | "skipped">("idle");
const confiumVersion = ref("");
const confiumDetail = ref("");

const allPass = computed(() => verification.value?.signatureValid && verification.value.digestValid);

async function handleUpload(uploadedFile: File) {
  file.value = uploadedFile;
  error.value = "";
  cert.value = null;
  verification.value = null;
  xmlWellFormed.value = false;
  checkResults.value = [];

  await run(async () => {
    xml.value = await uploadedFile.text();

    // Run the check pipeline — each check populates ctx for the next.
    // The pipeline short-circuits on hard failures (continueOnFail=false).
    const trustedEntries = await listTrustedKeys().catch(() => []);
    const trustedCryptoKeys = (await Promise.all(
      trustedEntries.map((t) => cryptoKeyFromTrustedKey(t).catch(() => null)),
    )).filter((k): k is CryptoKey => k !== null);

    const ctx: CheckContext = {
      trustedKeys: trustedCryptoKeys,
      ...(operatorKeyPem.value.trim()
        ? { logOperatorPublicKeyPem: operatorKeyPem.value.trim() }
        : {}),
    };
    const outcome = await verifyArtifact(xml.value, ctx, {
      acceptance: {
        minimum_label: minLabel.value,
        require_transparency: false,
        require_timestamp: false,
        freshness_window_ms: 0,
        required_dimensions: [],
      },
    });
    checkResults.value = outcome.results;
    coverage.value = outcome.coverage;
    classification.value = outcome.classification;
    acceptance.value = outcome.acceptance;

    // Transparency posture against the configured log: fetch the
    // published head, verify its signature when the operator key is
    // set, then confirm every embedded chain certificate's inclusion
    // via the by-hash index. Network failures are a posture, never a
    // verdict: the block reports what could and could not be checked.
    logHead.value = null;
    chainInclusion.value = null;
    const endpoint = logEndpoint.value.trim().replace(/\/+$/, "");
    if (endpoint) {
      try {
        const res = await fetch(`${endpoint}/head.json`);
        if (res.ok) {
          const head = await res.json();
          const headOk = head.signature
            ? await verifySignedHead({
                size: head.size,
                root: head.root,
                timestamp: head.timestamp,
                operator: head.operator ?? "unknown",
                signature: head.signature,
                public_key: head.public_key ?? (operatorKeyPem.value.trim() || undefined),
              })
            : true; // unsigned head: reported as such, not a failure
          logHead.value = { size: head.size, root: head.root, signed: Boolean(head.signature), headOk };
          const chain = ctx.trustedCerts ?? [];
          if (chain.length > 0) {
            chainInclusion.value = await confirmChainInclusion(chain, endpoint, head.root);
          }
        }
      } catch { /* unreachable log: posture only */ }
    }

    // Stash parsed cert for the cert-details panel (if check 2 got far enough).
    cert.value = (ctx.parsedCert as Certificate) ?? null;

    // For back-compat: still run the full XMLDSig verify to populate
    // `verification` (the digestValid / signatureValid booleans used
    // by the cert-details section).
    if (ctx.trustedCerts?.length || trustedCryptoKeys.length) {
      let result = await verifyCnmlXml(xml.value);
      if (!result.signatureValid && trustedCryptoKeys.length > 0) {
        for (const key of trustedCryptoKeys) {
          result = await verifyCnmlXml(xml.value, { trustedPublicKey: key });
          if (result.signatureValid) break;
        }
      }
      verification.value = result;
    }
  });

  // Optional enhanced verification: probe Confium WASM availability.
  // Silent on failure — this is informational, not a pipeline check.
  confiumStatus.value = "idle";
  confiumVersion.value = "";
  confiumDetail.value = "";
  try {
    const confiumResult = await runConfiumVerifyCheck({ xml: xml.value });
    if (confiumResult.status === "pass" && confiumResult.details &&
        typeof confiumResult.details === "object" && "version" in confiumResult.details) {
      confiumStatus.value = "available";
      confiumVersion.value = String((confiumResult.details as { version: string }).version);
      confiumDetail.value = confiumResult.reason ?? "";
    } else if (confiumResult.status === "skip") {
      confiumStatus.value = "skipped";
    }
  } catch {
    // Silent degradation — Confium WASM is optional.
    confiumStatus.value = "skipped";
  }
}

function onDrop(event: DragEvent) {
  const f = event.dataTransfer?.files?.[0];
  if (f) handleUpload(f);
}

function onFileInput(event: Event) {
  const f = (event.target as HTMLInputElement).files?.[0];
  if (f) handleUpload(f);
}

function reset() {
  file.value = null;
  cert.value = null;
  verification.value = null;
  xmlWellFormed.value = false;
  checkResults.value = [];
  coverage.value = null;
  classification.value = null;
  acceptance.value = null;
  logHead.value = null;
  chainInclusion.value = null;
  confiumStatus.value = "idle";
  confiumVersion.value = "";
  confiumDetail.value = "";
}

// Lookup label for a check ID (UI shows the friendly label).
function labelFor(id: string): string {
  return CHECKS.find((c) => c.id === id)?.label ?? id;
}

// Pick a tile color class for a given result status.
function tileClass(r: CheckResult): string {
  switch (r.status) {
    case "pass": return "cnml-tile--pass";
    case "fail": return "cnml-tile--fail";
    case "warn": return "cnml-tile--warn";
    case "pending": return "cnml-tile--warn";
    case "skip": return "cnml-tile--warn";
  }
}

function statusGlyph(r: CheckResult): string {
  switch (r.status) {
    case "pass": return "✓";
    case "fail": return "✗";
    case "warn": return "?";
    case "pending": return "◷";
    case "skip": return "—";
  }
}
</script>

<template>
  <div>
    <!-- Drop zone: a <label> is the single interactive container. It
         natively activates the hidden file input on click and on Enter
         (the input inside is focusable), so no role/tabindex/keydown is
         needed. The drag handlers stay on the label so drag-and-drop
         works alongside the click target. -->
    <label
      v-if="!file"
      @dragover.prevent
      @drop.prevent="onDrop"
      class="block p-12 border-2 border-dashed border-[var(--rule)] rounded-2xl text-center bg-[var(--paper-raised)] cursor-pointer hover:border-[var(--accent)] focus-within:border-[var(--accent)] focus-within:outline-2 focus-within:outline-offset-2"
    >
      <input type="file" accept=".xml" class="sr-only" @change="onFileInput" />
      <div class="text-5xl mb-4" aria-hidden="true">📄</div>
      <div class="font-medium mb-1">Drop a CNML file here</div>
      <div class="text-sm text-[var(--ink-muted)] mb-6">or click to browse — .cnml.xml, max 5 MB. Files never leave your browser.</div>
      <span class="cnml-btn cnml-btn-primary">Choose file</span>
    </label>

    <div v-if="busy" role="status" aria-live="polite" class="mt-4 text-sm text-[var(--ink-muted)]">Verifying…</div>

    <ErrorCallout :message="error" />

    <!-- Result (TODO.cnml/56: role=status aria-live=polite so
         screen readers announce check completions) -->
    <div v-if="file && checkResults.length > 0" role="status" aria-live="polite" aria-atomic="false">
      <h3 class="font-semibold mb-3">{{ file.name }}</h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div
          v-for="r in checkResults"
          :key="r.checkId"
          :class="['cnml-tile', tileClass(r)]"
          role="status"
        >
          <div class="text-xs text-[var(--ink-muted)]">{{ labelFor(r.checkId) }}</div>
          <div class="text-lg font-bold" aria-hidden="true">{{ statusGlyph(r) }}</div>
          <span class="sr-only">{{ r.status === 'pass' ? 'passed' : r.status === 'fail' ? 'failed' : r.status }}</span>
        </div>
      </div>

      <!-- SIGNATIF three-stage outcome: coverage (objective facts),
           classification (scheme policy), acceptance (verifier policy). -->
      <div v-if="coverage && classification && acceptance" class="cnml-card mb-6">
        <h4 class="font-semibold mb-3">Verification outcome</h4>
        <div class="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm mb-3">
          <div>
            <span class="text-[var(--ink-muted)]">Classification</span>
            <strong class="ml-2">{{ classification.label }}</strong>
          </div>
          <div>
            <span class="text-[var(--ink-muted)]">Acceptance</span>
            <strong class="ml-2" :class="acceptance.accepted ? 'text-[#0a6b2c]' : 'text-[#a00000]'">
              {{ acceptance.accepted ? 'accepted' : 'rejected' }}
            </strong>
          </div>
          <div v-if="coverage.algorithms.length" class="text-xs text-[var(--ink-muted)]">
            algorithm: {{ coverage.algorithms.map(a => a.id + ' (' + a.status + ')').join(', ') }}
          </div>
        </div>
        <div class="text-sm">
          <span class="text-[var(--ink-muted)]">Trust dimensions attested:</span>
          <span
            v-for="d in coverage.dimensions"
            :key="d.dimension"
            class="cnml-tile cnml-tile--pass inline-flex items-center gap-1 px-2 py-0.5 ml-2"
            :class="{ 'cnml-tile--fail': !d.verified }"
          >
            {{ d.dimension }} {{ d.verified ? '✓' : '✗' }}
          </span>
        </div>
        <div v-if="acceptance.reasons.length" class="text-sm text-[#a00000] mt-2">
          {{ acceptance.reasons.join('; ') }}
        </div>
        <div v-else-if="classification.reasons.length" class="text-sm text-[var(--ink-muted)] mt-2">
          {{ classification.reasons.join('; ') }}
        </div>

        <!-- Transparency posture against the configured log -->
        <div v-if="logHead || chainInclusion" class="border-t border-[var(--rule)] mt-3 pt-3 text-sm">
          <div class="cnml-label mb-1">Transparency log</div>
          <div v-if="logHead" class="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1">
            <span class="font-mono text-xs">head size {{ logHead.size }} · root {{ logHead.root.slice(0, 16) }}…</span>
            <span v-if="logHead.signed && logHead.headOk" class="text-[#0a6b2c]">signed head verified ✓</span>
            <span v-else-if="logHead.signed" class="text-[#a00000]">head signature FAILED</span>
            <span v-else class="text-[var(--ink-muted)]">head unsigned</span>
          </div>
          <ul v-if="chainInclusion" class="list-none p-0 m-0">
            <li v-for="(c, i) in chainInclusion" :key="i" class="font-mono text-xs">
              cert {{ c.certHash.slice(0, 16) }}… —
              <span v-if="c.status === 'included'" class="text-[#0a6b2c]">in the log (seq {{ c.sequence }}) ✓</span>
              <span v-else-if="c.status === 'not-found'" class="text-[#a00000]">NOT in the log</span>
              <span v-else-if="c.status === 'invalid-proof'" class="text-[#a00000]">inclusion proof invalid</span>
              <span v-else class="text-[var(--ink-muted)]">{{ c.status }} ({{ c.reason }})</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Reasons for non-pass checks -->
      <div v-for="r in checkResults.filter(r => r.reason && r.status !== 'pass')" :key="'reason-' + r.checkId" class="cnml-callout mb-2" :class="{
        'cnml-callout--error': r.status === 'fail',
        'cnml-callout--warning': r.status === 'warn' || r.status === 'skip' || r.status === 'pending',
      }">
        <strong>{{ labelFor(r.checkId) }}:</strong> {{ r.reason }}
      </div>

      <div v-if="cert" class="cnml-card">
        <h4 class="font-semibold mb-3">Certificate details</h4>
        <dl class="grid grid-cols-2 gap-y-2 text-sm">
          <dt class="text-[var(--ink-muted)]">Number</dt>
          <dd>{{ cert.certificate?.number }}</dd>
          <dt class="text-[var(--ink-muted)]">Recommendation</dt>
          <dd>{{ cert.certificate?.recommendation?.id }} (edition {{ cert.certificate?.recommendation?.edition }})</dd>
          <dt class="text-[var(--ink-muted)]">Issued</dt>
          <dd>{{ cert.certificate?.date_issued }}</dd>
          <dt class="text-[var(--ink-muted)]">Issuing authority</dt>
          <dd>{{ cert.issuing_authority?.name }}</dd>
          <dt class="text-[var(--ink-muted)]">Applicant</dt>
          <dd>{{ cert.applicants?.[0]?.name }}</dd>
          <dt class="text-[var(--ink-muted)]">Type designations</dt>
          <dd>{{ cert.certified_type?.type_designations?.join(", ") }}</dd>
        </dl>

        <details class="mt-4">
          <summary class="cursor-pointer text-sm font-medium">All characteristics ({{ Object.keys(cert.characteristics?.type_level ?? {}).length }} type_level)</summary>
          <pre class="cnml-code-pane mt-2">{{ JSON.stringify(cert.characteristics?.type_level, null, 2) }}</pre>
        </details>

        <button @click="reset" class="cnml-btn cnml-btn-ghost mt-4">← Verify another file</button>
      </div>

      <!-- Optional Confium WASM enhanced verification status.
           Silent when unavailable — informational only, not a pipeline check. -->
      <div v-if="confiumStatus === 'available'" class="cnml-callout cnml-callout--success mt-4" role="status">
        Confium WASM available: v{{ confiumVersion }}
        <span v-if="confiumDetail" class="block text-xs text-[var(--ink-muted)] mt-1">{{ confiumDetail }}</span>
      </div>
    </div>
  </div>
</template>
