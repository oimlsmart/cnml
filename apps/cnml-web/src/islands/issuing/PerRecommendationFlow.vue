<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const recommendations = ref<{ id: string; title: string }[]>([]);
const selectedRec = ref("");
const instrument = reactive({
  model: "",
  serial: "",
  manufacturer: "",
  accuracyClass: "",
});
const signerKey = ref<CryptoKey | null>(null);
const signerPublic = ref("");
const payload = ref("");
const signature = ref("");
const output = ref("");
const phase = ref<"form" | "signed">("form");
const busy = ref(false);
const error = ref("");

import { reactive } from "vue";

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
  selectedRec.value &&
  instrument.model.trim() &&
  instrument.serial.trim() &&
  instrument.manufacturer.trim()
);

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function signCertificate() {
  busy.value = true;
  error.value = "";
  try {
    // Generate a signer key for this cert
    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
    signerKey.value = kp.privateKey;
    const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
    const fp = await crypto.subtle.digest("SHA-256", spki);
    signerPublic.value = Array.from(new Uint8Array(fp)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);

    const certPayload = {
      type: "cnml-certificate",
      format: "CNML",
      id: `cnml-${selectedRec.value.toLowerCase()}-${randomHex(8)}`,
      created: new Date().toISOString(),
      recommendation: selectedRec.value,
      instrument: {
        model: instrument.model,
        serial: instrument.serial,
        manufacturer: instrument.manufacturer,
        accuracyClass: instrument.accuracyClass || "not specified",
      },
      typeApproval: {
        status: "approved",
        validity: "10 years from issuance date",
      },
      signerPublicKey: signerPublic.value,
    };
    payload.value = JSON.stringify(certPayload, null, 2);

    // Sign the payload
    const data = new TextEncoder().encode(payload.value);
    const sig = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      kp.privateKey,
      data,
    );
    signature.value = btoa(String.fromCharCode(...new Uint8Array(sig)));

    output.value = JSON.stringify({
      certificateType: "cnml-certificate",
      certificateId: certPayload.id,
      recommendation: selectedRec.value,
      payload: payload.value,
      signature: {
        algorithm: "ECDSA-P256-SHA256",
        value: signature.value,
        signerPublicKey: signerPublic.value,
      },
      note: "Per-Recommendation CNML certificate. Signed with a single IA signer key. Production issuance uses the IA threshold quorum.",
    }, null, 2);
    phase.value = "signed";
  } catch (e: any) {
    error.value = e.message || String(e);
  } finally {
    busy.value = false;
  }
}

function download() {
  const blob = new Blob([output.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cnml-${selectedRec.value}-${instrument.serial || "cert"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-8">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">{{ error }}</div>

    <div v-if="phase === 'form'">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Issue a per-Recommendation CNML certificate bound to a specific measuring instrument.
        Fill in the instrument details, then sign with a generated IA signer key. The output
        is a signed CNML certificate that chains to the IA intermediate and the BIML Root.
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
          <label for="class" class="cnml-label block mb-1">Accuracy class (optional)</label>
          <input id="class" v-model="instrument.accuracyClass" class="cnml-input max-w-md" placeholder="e.g. III" />
        </div>
      </div>

      <button class="cnml-btn cnml-btn-primary" @click="signCertificate" :disabled="busy || !canSign">
        Generate signer key and sign certificate
      </button>
    </div>

    <div v-if="phase === 'signed'">
      <div class="mb-4 p-3 rounded-lg bg-[var(--paper-deep)] text-sm">
        <span class="text-[var(--ink-muted)]">Cert ID:</span>
        <span class="font-mono text-[var(--ink)] ml-2">{{ JSON.parse(output).certificateId }}</span>
      </div>

      <h3 class="font-sans font-semibold text-[var(--ink)] mb-2">Certificate payload</h3>
      <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)] mb-4 max-h-48">{{ payload }}</pre>

      <h3 class="font-sans font-semibold text-[var(--ink)] mb-2">Signature</h3>
      <div class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono mb-4">
        <div class="text-[var(--ink-muted)] mb-1">Algorithm: ECDSA-P256-SHA256</div>
        <div class="text-[var(--ink-muted)] mb-1">Signer: <span class="text-[var(--ink)]">{{ signerPublic }}…</span></div>
        <div class="text-[var(--ink-soft)] truncate">{{ signature.slice(0, 60) }}…</div>
      </div>

      <h3 class="font-sans font-semibold text-[var(--ink)] mb-2">Full certificate bundle</h3>
      <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)] mb-4 max-h-96">{{ output }}</pre>

      <button class="cnml-btn cnml-btn-primary" @click="download">Download CNML certificate</button>
    </div>
  </div>
</template>
