<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  listKeys, getKey, exportPublicKeyPem,
  type StoredKey,
} from "@oimlsmart/cnml-crypto";
import { fingerprintShort } from "./shared/display";
import { useAsyncAction } from "../composables/useAsyncAction";
import { downloadBlob } from "./shared/dom";

const keys = ref<StoredKey[]>([]);
const loading = ref(true);
const selectedKeyId = ref<string | null>(null);

// Astro BASE_URL ("/" in dev, "/cnml/" in prod) — used to prefix internal links.
const baseUrl = import.meta.env.BASE_URL as string;
const commonName = ref("");
const organization = ref("");
const country = ref("");
const oimlIssuerId = ref("");
const csrPem = ref("");
const { error, busy, run } = useAsyncAction();

onMounted(async () => {
  try { keys.value = await listKeys(); } catch { /* empty */ }
  loading.value = false;
});

const selectedKey = computed(() => keys.value.find((k) => k.id === selectedKeyId.value));

async function generateCsr() {
  if (!selectedKeyId.value) { error.value = "Select a key first."; return; }
  if (!commonName.value.trim()) { error.value = "Common Name required."; return; }
  error.value = "";
  await run(async () => {
    // CNML CSR format: JSON-in-PEM-wrapper. The Ruby CA server parses
    // this format (see oiml-pki-server/app.rb → /csr/sign). NOT PKCS#10.
    const stored = await getKey(selectedKeyId.value);
    if (!stored) throw new Error("Key not found");

    const pubPem = await exportPublicKeyPem(stored);
    const csrData = {
      version: 0,
      subject: {
        cn: commonName.value.trim(),
        o: organization.value.trim(),
        c: country.value.trim(),
        oimlId: oimlIssuerId.value.trim(),
      },
      publicKeyPem: pubPem,
      keyAlgorithm: stored.algorithm,
      fingerprint: stored.fingerprint,
    };

    const b64 = btoa(JSON.stringify(csrData, null, 2));
    const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
    csrPem.value = `-----BEGIN CNML CSR-----\n${lines}\n-----END CNML CSR-----\n`;
  });
}

function downloadCsr() {
  if (!csrPem.value) return;
  downloadBlob(csrPem.value, `${commonName.value.replace(/\s+/g, "_") || "cnml-signer"}.csr`, "application/x-pem-file");
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-[var(--ink-muted)] text-sm">Loading keys…</div>

    <div v-else-if="keys.length === 0" class="cnml-card cnml-card--raised text-center">
      <div class="text-4xl mb-3">🔑</div>
      <div class="font-medium mb-1">No signing keys found</div>
      <div class="text-sm text-[var(--ink-muted)] mb-4">Generate a key first on the Keys page.</div>
      <a :href="`${baseUrl}keys`" class="cnml-btn cnml-btn-primary">Go to Keys</a>
    </div>

    <template v-else>
      <!-- Key selection -->
      <div class="cnml-card">
        <h3 class="cnml-section-title">Select Key</h3>
        <ul class="space-y-2">
          <li v-for="k in keys" :key="k.id">
            <label
              :class="[
                'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors',
                selectedKeyId === k.id
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--rule)] hover:border-[var(--accent)]',
              ]"
            >
              <input type="radio" :value="k.id" v-model="selectedKeyId" class="accent-[var(--accent)]" />
              <div class="flex-1">
                <div class="font-medium text-sm">{{ k.alias }}</div>
                <div class="text-xs text-[var(--ink-muted)] font-mono">{{ k.algorithm }} · {{ fingerprintShort(k.fingerprint) }}</div>
              </div>
            </label>
          </li>
        </ul>
      </div>

      <!-- Identity form -->
      <div class="cnml-card">
        <h3 class="cnml-section-title">Identity</h3>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="cnml-label">Common Name (your name)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
            <input v-model="commonName" autocomplete="organization title" required placeholder="M.Ph.D. Schmidt" class="cnml-input" />
          </label>
          <label class="block">
            <span class="cnml-label">Organization</span>
            <input v-model="organization" autocomplete="organization" placeholder="NMi Certin B.V." class="cnml-input" />
          </label>
          <label class="block">
            <span class="cnml-label">OIML Issuer ID</span>
            <input v-model="oimlIssuerId" autocomplete="off" placeholder="NL1" class="cnml-input" />
          </label>
          <label class="block">
            <span class="cnml-label">Country (2 letters)</span>
            <input v-model="country" autocomplete="country-name" placeholder="NL" maxlength="2" class="cnml-input" />
          </label>
        </div>
      </div>

      <!-- Generate + download -->
      <div class="flex items-center gap-3">
        <button @click="generateCsr" :disabled="busy || !selectedKeyId" class="cnml-btn cnml-btn-primary">
          {{ busy ? "Generating…" : "Generate CSR" }}
        </button>
        <button v-if="csrPem" @click="downloadCsr" class="cnml-btn cnml-btn-secondary">Download .csr</button>
        <div v-if="error" role="alert" class="text-sm cnml-text-danger">{{ error }}</div>
      </div>

      <!-- CSR preview -->
      <details v-if="csrPem" class="cnml-card">
        <summary class="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] cursor-pointer">
          CSR Preview
        </summary>
        <pre class="cnml-code-pane mt-2">{{ csrPem }}</pre>
      </details>

      <!-- Instructions -->
      <div class="cnml-card cnml-card--raised">
        <h3 class="cnml-section-title">Next Steps</h3>
        <ol class="list-decimal list-inside space-y-1 text-sm text-[var(--ink-soft)]">
          <li>Download the <code>.csr</code> file</li>
          <li>Send it to your Issuing Authority's CA operator</li>
          <li>Wait for them to sign it and return a <code>.crt</code> file</li>
          <li>Go to <a :href="`${baseUrl}keys`" class="text-[var(--accent)] underline">Keys</a> → Import certificate</li>
          <li>Once imported, you can sign CNMLs with a certified key</li>
        </ol>
      </div>
    </template>
  </div>
</template>
