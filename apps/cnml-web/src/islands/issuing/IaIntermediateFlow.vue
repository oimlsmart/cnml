<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Officer {
  id: number;
  alias: string;
  publicKey: string;
  selected: boolean;
  cryptoKey: CryptoKey;
}

const OFFICER_COUNT = 3;
const THRESHOLD = 2;

const officers = ref<Officer[]>([]);
const recommendations = ref<{ id: string; title: string }[]>([]);
const selectedRec = ref<string>("");
const iaName = ref("");
const iaCountry = ref("");
const payload = ref("");
const signatures = ref<{ officerId: number; signature: string; algorithm: string }[]>([]);
const output = ref("");
const phase = ref<"idle" | "generated" | "signed">("idle");
const busy = ref(false);
const error = ref("");

onMounted(async () => {
  try {
    const mod = await import("@cnml/cnml-schemas");
    recommendations.value = (mod.RECOMMENDATIONS || []).map((r: any) => ({
      id: r.id,
      title: r.shortTitle || r.id,
    }));
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

const selectedCount = computed(() => officers.value.filter(o => o.selected).length);
const canSign = computed(() =>
  selectedCount.value >= THRESHOLD &&
  phase.value === "generated" &&
  selectedRec.value &&
  iaName.value.trim()
);

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateOfficers() {
  busy.value = true;
  error.value = "";
  try {
    const items: Officer[] = [];
    for (let i = 1; i <= OFFICER_COUNT; i++) {
      const kp = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"],
      );
      const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
      const fp = await crypto.subtle.digest("SHA-256", spki);
      items.push({
        id: i,
        alias: `IA Officer ${i}`,
        publicKey: Array.from(new Uint8Array(fp)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32),
        selected: i <= THRESHOLD,
        cryptoKey: kp.privateKey,
      });
    }
    officers.value = items;
    payload.value = JSON.stringify({
      type: "ia-intermediate",
      id: `ia-${selectedRec.value.toLowerCase()}-${randomHex(6)}`,
      created: new Date().toISOString(),
      iaName: iaName.value,
      iaCountry: iaCountry.value,
      scope: {
        extension: "oimlAuthorizedRecommendations",
        recommendations: [selectedRec.value],
      },
      threshold: `${THRESHOLD}-of-${OFFICER_COUNT}`,
      publicKeySet: items.map(o => o.publicKey),
    }, null, 2);
    phase.value = "generated";
  } catch (e: any) {
    error.value = e.message || String(e);
  } finally {
    busy.value = false;
  }
}

function toggleOfficer(o: Officer) {
  o.selected = !o.selected;
}

async function signIa() {
  busy.value = true;
  error.value = "";
  signatures.value = [];
  try {
    const selected = officers.value.filter(o => o.selected);
    const sigs: { officerId: number; signature: string; algorithm: string }[] = [];
    for (const o of selected) {
      const data = new TextEncoder().encode(payload.value);
      const sig = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        o.cryptoKey,
        data,
      );
      sigs.push({ officerId: o.id, signature: btoa(String.fromCharCode(...new Uint8Array(sig))), algorithm: "ECDSA-P256-SHA256" });
    }
    signatures.value = sigs;
    output.value = JSON.stringify({
      certificateType: "ia-intermediate",
      certificateId: JSON.parse(payload.value).id,
      created: new Date().toISOString(),
      scope: [selectedRec.value],
      payload: payload.value,
      participants: selected.map(o => ({ officerId: o.id, publicKey: o.publicKey })),
      signatures: sigs,
      note: "IA intermediate certificate scoped to " + selectedRec.value + ". Multi-signature ECDSA P-256.",
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
  a.download = `ia-intermediate-${selectedRec.value}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-8">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">{{ error }}</div>

    <div v-if="phase === 'idle'">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Issue an IA intermediate certificate scoped to a specific OIML Recommendation.
        Pick the Recommendation, name the Issuing Authority, then generate the officer
        quorum and sign.
      </p>

      <div class="space-y-4 mb-6">
        <div>
          <label for="ia-rec" class="cnml-label block mb-1">OIML Recommendation</label>
          <select id="ia-rec" v-model="selectedRec" class="cnml-input max-w-md">
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

      <button class="cnml-btn cnml-btn-primary" @click="generateOfficers" :disabled="busy || !selectedRec || !iaName.trim()">
        Generate {{ OFFICER_COUNT }} officer keys
      </button>
    </div>

    <div v-if="phase === 'generated' || phase === 'signed'">
      <div class="mb-4 p-3 rounded-lg bg-[var(--paper-deep)] text-sm">
        <span class="text-[var(--ink-muted)]">Scope:</span>
        <span class="font-mono font-semibold text-[var(--accent)] ml-2">{{ selectedRec }}</span>
        <span class="text-[var(--ink-muted)] ml-4">IA:</span>
        <span class="text-[var(--ink)] ml-2">{{ iaName }}</span>
      </div>

      <h3 class="font-sans font-semibold text-[var(--ink)] mb-3">Officer quorum ({{ selectedCount }} of {{ OFFICER_COUNT }} selected, {{ THRESHOLD }} required)</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          v-for="o in officers"
          :key="o.id"
          @click="toggleOfficer(o)"
          class="text-left p-4 rounded-lg border transition-colors"
          :class="o.selected ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--rule)] hover:border-[var(--accent)]'"
        >
          <div class="font-mono text-sm font-semibold text-[var(--accent)] mb-1">Officer {{ o.id }}</div>
          <div class="text-xs text-[var(--ink-muted)] font-mono truncate">{{ o.publicKey }}…</div>
        </button>
      </div>

      <div class="mb-6">
        <h3 class="font-sans font-semibold text-[var(--ink)] mb-2">Certificate payload</h3>
        <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)]">{{ payload }}</pre>
      </div>

      <button v-if="phase === 'generated'" class="cnml-btn cnml-btn-primary" @click="signIa" :disabled="busy || !canSign">
        Sign with {{ selectedCount }} officers
      </button>
    </div>

    <div v-if="phase === 'signed'">
      <h3 class="font-sans font-semibold text-[var(--ink)] mb-3">Signed IA certificate ({{ signatures.length }} signatures)</h3>
      <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)] mb-4 max-h-96">{{ output }}</pre>
      <button class="cnml-btn cnml-btn-primary" @click="download">Download IA certificate</button>
    </div>
  </div>
</template>
