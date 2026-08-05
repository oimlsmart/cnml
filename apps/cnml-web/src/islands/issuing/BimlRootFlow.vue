<script setup lang="ts">
import { ref, computed, reactive } from "vue";

interface Director {
  id: number;
  alias: string;
  publicKey: string;
  secretKey: string;
  selected: boolean;
}

const DIRECTOR_COUNT = 7;
const THRESHOLD = 5;

const directors = ref<Director[]>([]);
const payload = ref<string>("");
const signatures = ref<{ directorId: number; signature: string; algorithm: string }[]>([]);
const output = ref<string>("");
const phase = ref<"idle" | "generated" | "signed">("idle");
const busy = ref(false);
const error = ref("");

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateDirectors() {
  busy.value = true;
  error.value = "";
  try {
    const items: Director[] = [];
    for (let i = 1; i <= DIRECTOR_COUNT; i++) {
      const kp = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"],
      );
      const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
      const pkcs8 = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
      const fp = await crypto.subtle.digest("SHA-256", spki);
      items.push({
        id: i,
        alias: `BIML Director ${i}`,
        publicKey: Array.from(new Uint8Array(fp)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32),
        secretKey: btoa(String.fromCharCode(...new Uint8Array(pkcs8))),
        selected: i <= THRESHOLD,
      });
      // store the CryptoKey on the director object for signing
      (items[i - 1] as any).cryptoKey = kp.privateKey;
    }
    directors.value = items;
    payload.value = JSON.stringify({
      type: "biml-root",
      id: `biml-root-${randomHex(8)}`,
      created: new Date().toISOString(),
      threshold: `${THRESHOLD}-of-${DIRECTOR_COUNT}`,
      publicKeySet: items.map(d => d.publicKey),
    }, null, 2);
    phase.value = "generated";
  } catch (e: any) {
    error.value = e.message || String(e);
  } finally {
    busy.value = false;
  }
}

const selectedCount = computed(() => directors.value.filter(d => d.selected).length);
const canSign = computed(() => selectedCount.value >= THRESHOLD && phase.value === "generated");

function toggleDirector(d: Director) {
  d.selected = !d.selected;
}

async function signRoot() {
  busy.value = true;
  error.value = "";
  signatures.value = [];
  try {
    const selected = directors.value.filter(d => d.selected);
    let documentToSign = payload.value;
    const sigs: { directorId: number; signature: string; algorithm: string }[] = [];
    for (const d of selected) {
      const data = new TextEncoder().encode(documentToSign);
      const sig = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        (d as any).cryptoKey,
        data,
      );
      const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
      sigs.push({ directorId: d.id, signature: sigB64, algorithm: "ECDSA-P256-SHA256" });
    }
    signatures.value = sigs;
    const result = {
      certificateType: "biml-root",
      certificateId: JSON.parse(payload.value).id,
      created: new Date().toISOString(),
      threshold: `${THRESHOLD}-of-${DIRECTOR_COUNT}`,
      payload: payload.value,
      participants: selected.map(d => ({ directorId: d.id, publicKey: d.publicKey })),
      signatures: sigs,
      note: "Sample BIML Root certificate. Multi-signature ECDSA P-256. Production threshold signing uses FROST via Confium WASM.",
    };
    output.value = JSON.stringify(result, null, 2);
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
  a.download = "biml-root-certificate.json";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-8">
    <div v-if="error" class="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800" role="alert">
      {{ error }}
    </div>

    <div v-if="phase === 'idle'">
      <p class="text-[var(--ink-soft)] leading-relaxed mb-6">
        Generate a sample BIML Root certificate. The page creates {{ DIRECTOR_COUNT }} director
        keypairs. You select {{ THRESHOLD }} of {{ DIRECTOR_COUNT }} to participate. Each
        selected director signs the root certificate payload. The result is a downloadable
        bundle with the certificate, the participant list, and the individual signatures.
      </p>
      <button class="cnml-btn cnml-btn-primary" @click="generateDirectors" :disabled="busy">
        Generate {{ DIRECTOR_COUNT }} director keys
      </button>
    </div>

    <div v-if="phase === 'generated' || phase === 'signed'">
      <h3 class="font-sans font-semibold text-[var(--ink)] mb-3">Director quorum ({{ selectedCount }} of {{ DIRECTOR_COUNT }} selected, {{ THRESHOLD }} required)</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <button
          v-for="d in directors"
          :key="d.id"
          @click="toggleDirector(d)"
          class="text-left p-4 rounded-lg border transition-colors"
          :class="d.selected
            ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
            : 'border-[var(--rule)] bg-[var(--paper-soft)] hover:border-[var(--accent)]'"
        >
          <div class="flex items-center gap-2 mb-1">
            <span class="font-mono text-sm font-semibold text-[var(--accent)]">{{ String(d.id).padStart(2, '0') }}</span>
            <span class="text-sm text-[var(--ink)]">{{ d.alias }}</span>
          </div>
          <div class="text-xs text-[var(--ink-muted)] font-mono truncate">{{ d.publicKey }}…</div>
        </button>
      </div>

      <div class="mb-6">
        <h3 class="font-sans font-semibold text-[var(--ink)] mb-2">Certificate payload</h3>
        <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)]">{{ payload }}</pre>
      </div>

      <button
        v-if="phase === 'generated'"
        class="cnml-btn cnml-btn-primary"
        @click="signRoot"
        :disabled="busy || !canSign"
      >
        Sign with {{ selectedCount }} directors
      </button>
    </div>

    <div v-if="phase === 'signed'">
      <h3 class="font-sans font-semibold text-[var(--ink)] mb-3">Signed certificate ({{ signatures.length }} signatures)</h3>
      <div class="space-y-2 mb-4">
        <div v-for="sig in signatures" :key="sig.directorId" class="flex items-center gap-3 text-sm">
          <span class="font-mono text-[var(--accent)]">Director {{ sig.directorId }}</span>
          <span class="font-mono text-xs text-[var(--ink-muted)] truncate">{{ sig.signature.slice(0, 40) }}…</span>
          <span class="text-xs text-[var(--ink-muted)]">{{ sig.algorithm }}</span>
        </div>
      </div>
      <pre class="p-4 rounded-lg bg-[var(--paper-deep)] text-xs font-mono overflow-x-auto text-[var(--ink-soft)] mb-4 max-h-96">{{ output }}</pre>
      <button class="cnml-btn cnml-btn-primary" @click="download">Download certificate bundle</button>
    </div>
  </div>
</template>
