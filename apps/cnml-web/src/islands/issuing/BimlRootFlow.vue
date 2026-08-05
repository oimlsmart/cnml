<script setup lang="ts">
import { ref, reactive } from "vue";

const CA_SERVER = "http://localhost:4455";
const PASSPHRASE = "demo123";

const rootSubject = ref("CN=BIML Root CA, O=BIML, C=FR");
const validity = ref(10);
const busy = ref(false);
const error = ref("");
const result = ref<any>(null);

async function issueRoot() {
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    const payload = JSON.stringify({
      type: "biml-root-certificate",
      subject: rootSubject.value,
      validityYears: validity.value,
      created: new Date().toISOString(),
    });

    const resp = await fetch(`${CA_SERVER}/api/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passphrase: PASSPHRASE,
        data_b64: btoa(payload),
      }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || `Server returned ${resp.status}`);
    }

    const sig = await resp.json();
    result.value = {
      certificateType: "biml-root",
      subject: rootSubject.value,
      validityYears: validity.value,
      payload,
      thresholdSignature: sig.signature_b64,
      attestation: sig.attestation,
      note: "Threshold-signed via Confium CMP20 on the CA server. The 5-of-7 director quorum signed this root certificate payload in-process.",
    };
  } catch (e: any) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}

function download() {
  const blob = new Blob([JSON.stringify(result.value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "biml-root-certificate.json";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">
      {{ error }}
    </div>

    <div v-if="!result">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Issue a sample BIML Root certificate. The CA server's Confium CMP20 quorum
        (5-of-7 directors) signs the root payload via threshold signing. The signature
        is produced by real Confium threshold cryptography, not a simulation.
      </p>

      <div class="space-y-4 mb-6">
        <div>
          <label for="subject" class="cnml-label block mb-1">Root subject (Distinguished Name)</label>
          <input id="subject" v-model="rootSubject" class="cnml-input max-w-lg" />
        </div>
        <div>
          <label for="validity" class="cnml-label block mb-1">Validity (years)</label>
          <input id="validity" type="number" v-model.number="validity" class="cnml-input w-32" />
        </div>
      </div>

      <button class="cnml-btn cnml-btn-primary" @click="issueRoot" :disabled="busy || !rootSubject.trim()">
        {{ busy ? 'Threshold signing...' : 'Issue root via Confium CMP20 (5-of-7)' }}
      </button>
      <p class="text-xs text-[var(--ink-muted)] mt-2">Requires the CA server running at {{ CA_SERVER }} with the 5-of-7 quorum provisioned.</p>
    </div>

    <div v-if="result">
      <div class="p-4 rounded-lg bg-[var(--paper-deep)] mb-4">
        <div class="text-sm font-semibold text-[var(--accent)] mb-2">Threshold attestation</div>
        <div class="text-sm text-[var(--ink-soft)] space-y-1">
          <div>Scheme: {{ result.attestation.provider }}</div>
          <div>Quorum: {{ result.attestation.threshold }}-of-{{ result.attestation.num_parties }} directors</div>
          <div>Signed at: {{ result.attestation.at }}</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="text-sm font-semibold text-[var(--ink)] mb-1">Threshold signature</div>
        <pre class="p-3 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto">{{ result.thresholdSignature }}</pre>
      </div>

      <div class="mb-4">
        <div class="text-sm font-semibold text-[var(--ink)] mb-1">Certificate payload</div>
        <pre class="p-3 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto max-h-48">{{ result.payload }}</pre>
      </div>

      <button class="cnml-btn cnml-btn-primary" @click="download">Download certificate</button>
    </div>
  </div>
</template>
