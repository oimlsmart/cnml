<script setup lang="ts">
import { ref, computed } from "vue";
import { parseCnmlXml, type Certificate } from "@cnml/cnml-xml";
import {
  verifyCnmlXml, listTrustedKeys, cryptoKeyFromTrustedKey,
  type VerificationResult,
} from "@cnml/cnml-crypto";
import { runChecks, CHECKS, type CheckResult, type CheckContext } from "@cnml/cnml-crypto/checks";

const file = ref<File | null>(null);
const xml  = ref("");
const cert = ref<Certificate | null>(null);
const verification = ref<VerificationResult | null>(null);
const error = ref("");
const busy = ref(false);
const xmlWellFormed = ref(false);
const checkResults = ref<CheckResult[]>([]);

const allPass = computed(() => verification.value?.signatureValid && verification.value.digestValid);

async function handleUpload(uploadedFile: File) {
  file.value = uploadedFile;
  error.value = "";
  cert.value = null;
  verification.value = null;
  xmlWellFormed.value = false;
  checkResults.value = [];
  busy.value = true;
  try {
    xml.value = await uploadedFile.text();

    // Run the check pipeline — each check populates ctx for the next.
    // The pipeline short-circuits on hard failures (continueOnFail=false).
    const trustedEntries = await listTrustedKeys().catch(() => []);
    const trustedCryptoKeys = (await Promise.all(
      trustedEntries.map((t) => cryptoKeyFromTrustedKey(t).catch(() => null)),
    )).filter((k): k is CryptoKey => k !== null);

    const ctx: CheckContext = { trustedKeys: trustedCryptoKeys };
    const results = await runChecks(xml.value, ctx);
    checkResults.value = results;

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
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
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
    case "skip": return "cnml-tile--warn";
  }
}

function statusGlyph(r: CheckResult): string {
  switch (r.status) {
    case "pass": return "✓";
    case "fail": return "✗";
    case "warn": return "?";
    case "skip": return "—";
  }
}
</script>

<template>
  <div>
    <!-- Drop zone -->
    <div
      v-if="!file"
      @dragover.prevent
      @drop.prevent="onDrop"
      class="p-12 border-2 border-dashed border-[var(--rule)] rounded-2xl text-center bg-[var(--paper-raised)] cursor-pointer hover:border-[var(--accent)]"
    >
      <label class="block cursor-pointer">
        <input type="file" accept=".xml" class="hidden" @change="onFileInput" />
        <div class="text-5xl mb-4">📄</div>
        <div class="font-medium mb-1">Drop a CNML file here</div>
        <div class="text-sm text-[var(--ink-muted)] mb-6">or click to browse — .cnml.xml, max 5 MB. Files never leave your browser.</div>
        <span class="cnml-btn cnml-btn-primary">Choose file</span>
      </label>
    </div>

    <div v-if="busy" class="mt-4 text-sm text-[var(--ink-muted)]">Verifying…</div>

    <div v-if="error" class="cnml-callout cnml-callout--error mt-4">
      {{ error }}
    </div>

    <!-- Result -->
    <div v-if="file && checkResults.length > 0">
      <h3 class="font-semibold mb-3">{{ file.name }}</h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div
          v-for="r in checkResults"
          :key="r.checkId"
          :class="['cnml-tile', tileClass(r)]"
        >
          <div class="text-xs text-[var(--ink-muted)]">{{ labelFor(r.checkId) }}</div>
          <div class="text-lg font-bold">{{ statusGlyph(r) }}</div>
        </div>
      </div>

      <!-- Reasons for non-pass checks -->
      <div v-for="r in checkResults.filter(r => r.reason && r.status !== 'pass')" :key="'reason-' + r.checkId" class="cnml-callout mb-2" :class="{
        'cnml-callout--error': r.status === 'fail',
        'cnml-callout--warning': r.status === 'warn' || r.status === 'skip',
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
    </div>
  </div>
</template>
