<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";

const CA_SERVER = "http://localhost:4455";
const PASSPHRASE = "demo123";

const recommendations = ref<{ id: string; title: string }[]>([]);
const selectedRec = ref("");
const instrument = reactive({
  model: "",
  serial: "",
  manufacturer: "",
  accuracyClass: "",
});
const busy = ref(false);
const error = ref("");
const result = ref<any>(null);

onMounted(async () => {
  try {
    const mod = await import("@cnml/cnml-schemas");
    recommendations.value = (mod.RECOMMENDATIONS || []).map((r: any) => ({ id: r.id, title: r.shortTitle || r.id }));
    if (recommendations.value.length > 0) selectedRec.value = recommendations.value[0].id;
  } catch {
    recommendations.value = [
      { id: "R60", title: "Load cells" },
      { id: "R76", title: "Nonautomatic weighing instruments" },
      { id: "R117", title: "Dynamic measuring systems" },
    ];
    selectedRec.value = "R60";
  }
});

const canSign = computed(() =>
  selectedRec.value && instrument.model.trim() && instrument.serial.trim() && instrument.manufacturer.trim()
);

async function signCertificate() {
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    const payload = JSON.stringify({
      type: "cnml-certificate",
      format: "CNML",
      recommendation: selectedRec.value,
      instrument: {
        model: instrument.model,
        serial: instrument.serial,
        manufacturer: instrument.manufacturer,
        accuracyClass: instrument.accuracyClass || "not specified",
      },
      typeApproval: { status: "approved", validity: "10 years" },
      created: new Date().toISOString(),
    });

    const resp = await fetch(`${CA_SERVER}/api/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase: PASSPHRASE, data_b64: btoa(payload) }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || `Server returned ${resp.status}`);
    }

    const sig = await resp.json();
    result.value = {
      certificateType: "cnml-certificate",
      recommendation: selectedRec.value,
      instrument: { ...instrument },
      payload,
      thresholdSignature: sig.signature_b64,
      attestation: sig.attestation,
      note: "Per-Recommendation CNML certificate threshold-signed via Confium CMP20 (5-of-7).",
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
  a.download = `cnml-${selectedRec.value}-${instrument.serial || "cert"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">{{ error }}</div>

    <div v-if="!result">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Issue a per-Recommendation CNML certificate bound to a specific measuring instrument.
        The CA server's Confium CMP20 quorum threshold-signs the certificate payload.
      </p>

      <div class="space-y-4 mb-6">
        <div>
          <label for="rec" class="cnml-label block mb-1">OIML Recommendation</label>
          <select id="rec" v-model="selectedRec" class="cnml-input max-w-md">
            <option v-for="r in recommendations" :key="r.id" :value="r.id">{{ r.id }} — {{ r.title }}</option>
          </select>
        </div>
        <div>
          <label for="mfr" class="cnml-label block mb-1">Manufacturer *</label>
          <input id="mfr" v-model="instrument.manufacturer" class="cnml-input max-w-md" placeholder="e.g. Mettler-Toledo" />
        </div>
        <div>
          <label for="model" class="cnml-label block mb-1">Model *</label>
          <input id="model" v-model="instrument.model" class="cnml-input max-w-md" placeholder="e.g. PB3002-S" />
        </div>
        <div>
          <label for="serial" class="cnml-label block mb-1">Serial number *</label>
          <input id="serial" v-model="instrument.serial" class="cnml-input max-w-md" placeholder="e.g. SN-2026-0001" />
        </div>
        <div>
          <label for="class" class="cnml-label block mb-1">Accuracy class</label>
          <input id="class" v-model="instrument.accuracyClass" class="cnml-input max-w-md" placeholder="e.g. III" />
        </div>
      </div>

      <button class="cnml-btn cnml-btn-primary" @click="signCertificate" :disabled="busy || !canSign">
        {{ busy ? 'Threshold signing...' : 'Sign CNML via Confium CMP20' }}
      </button>
    </div>

    <div v-if="result">
      <div class="p-4 rounded-lg bg-[var(--paper-deep)] mb-4">
        <div class="text-sm font-semibold text-[var(--accent)] mb-2">Threshold attestation</div>
        <div class="text-sm text-[var(--ink-soft)] space-y-1">
          <div>Scheme: {{ result.attestation.provider }}</div>
          <div>Quorum: {{ result.attestation.threshold }}-of-{{ result.attestation.num_parties }}</div>
          <div>Recommendation: {{ result.recommendation }}</div>
          <div>Instrument: {{ result.instrument.manufacturer }} {{ result.instrument.model }} ({{ result.instrument.serial }})</div>
          <div>Signed at: {{ result.attestation.at }}</div>
        </div>
      </div>
      <div class="mb-4">
        <div class="text-sm font-semibold text-[var(--ink)] mb-1">Threshold signature</div>
        <pre class="p-3 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto">{{ result.thresholdSignature }}</pre>
      </div>
      <button class="cnml-btn cnml-btn-primary" @click="download">Download CNML certificate</button>
    </div>
  </div>
</template>
