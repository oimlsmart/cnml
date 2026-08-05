<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const CA_SERVER = "http://localhost:4455";
const PASSPHRASE = "demo123";

const recommendations = ref<{ id: string; title: string }[]>([]);
const selectedRec = ref("");
const iaName = ref("");
const iaCountry = ref("");
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
      { id: "R46", title: "Active electrical energy meters" },
    ];
    selectedRec.value = "R60";
  }
});

const canIssue = computed(() => selectedRec.value && iaName.value.trim());

async function issueIa() {
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    const payload = JSON.stringify({
      type: "ia-intermediate-certificate",
      iaName: iaName.value,
      iaCountry: iaCountry.value || "not specified",
      scope: {
        extension: "oimlAuthorizedRecommendations",
        recommendations: [selectedRec.value],
      },
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
      certificateType: "ia-intermediate",
      iaName: iaName.value,
      scope: [selectedRec.value],
      payload,
      thresholdSignature: sig.signature_b64,
      attestation: sig.attestation,
      note: `IA intermediate scoped to ${selectedRec.value}. Threshold-signed via Confium CMP20 (5-of-7 BIML directors).`,
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
  a.download = `ia-intermediate-${selectedRec.value}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">{{ error }}</div>

    <div v-if="!result">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Issue an IA intermediate certificate scoped to a specific OIML Recommendation.
        The BIML director quorum (5-of-7 via Confium CMP20) threshold-signs the IA
        certificate with the scope extension binding the IA to the chosen Recommendation.
      </p>

      <div class="space-y-4 mb-6">
        <div>
          <label for="rec" class="cnml-label block mb-1">OIML Recommendation</label>
          <select id="rec" v-model="selectedRec" class="cnml-input max-w-md">
            <option v-for="r in recommendations" :key="r.id" :value="r.id">{{ r.id }} — {{ r.title }}</option>
          </select>
        </div>
        <div>
          <label for="ia-name" class="cnml-label block mb-1">Issuing Authority name</label>
          <input id="ia-name" v-model="iaName" class="cnml-input max-w-md" placeholder="e.g. National Metrology Institute" />
        </div>
        <div>
          <label for="ia-country" class="cnml-label block mb-1">Country (optional)</label>
          <input id="ia-country" v-model="iaCountry" class="cnml-input max-w-md" placeholder="e.g. Netherlands" />
        </div>
      </div>

      <button class="cnml-btn cnml-btn-primary" @click="issueIa" :disabled="busy || !canIssue">
        {{ busy ? 'Threshold signing...' : `Issue IA certificate via Confium CMP20` }}
      </button>
    </div>

    <div v-if="result">
      <div class="p-4 rounded-lg bg-[var(--paper-deep)] mb-4">
        <div class="text-sm font-semibold text-[var(--accent)] mb-2">Threshold attestation</div>
        <div class="text-sm text-[var(--ink-soft)] space-y-1">
          <div>Scheme: {{ result.attestation.provider }}</div>
          <div>Scope: {{ result.scope.join(', ') }}</div>
          <div>Signed at: {{ result.attestation.at }}</div>
        </div>
      </div>
      <div class="mb-4">
        <div class="text-sm font-semibold text-[var(--ink)] mb-1">Threshold signature</div>
        <pre class="p-3 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto">{{ result.thresholdSignature }}</pre>
      </div>
      <button class="cnml-btn cnml-btn-primary" @click="download">Download IA certificate</button>
    </div>
  </div>
</template>
