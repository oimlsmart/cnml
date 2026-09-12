<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { listKeys, getKey, loadCryptoKey } from "@oimlsmart/cnml-crypto";
import { runCredentialExchange, webCryptoHolder, ExchangeError } from "@oimlsmart/cnml-crypto";

const endpoint = ref("http://localhost:4455");
const identifier = ref("");
const passphrase = ref("");
const keys = ref<Array<{ id: string; alias: string }>>([]);
const selectedKeyId = ref("");
const busy = ref(false);
const collectedJson = ref("");
const errorMessage = ref("");
const failureKind = ref("");

const formValid = computed(
  () =>
    identifier.value.trim().length > 0 &&
    selectedKeyId.value.length > 0 &&
    passphrase.value.length >= 8 &&
    /^https?:\/\//.test(endpoint.value.trim()),
);

onMounted(async () => {
  try {
    const stored = await listKeys();
    keys.value = stored.map((k) => ({ id: k.id, alias: k.alias }));
    if (keys.value.length > 0) selectedKeyId.value = keys.value[0]!.id;
  } catch {
    keys.value = [];
  }
});

async function collect(): Promise<void> {
  busy.value = true;
  errorMessage.value = "";
  failureKind.value = "";
  collectedJson.value = "";
  try {
    const stored = await getKey(selectedKeyId.value);
    if (!stored) throw new Error("The selected key is no longer in the store.");
    const privateKey = await loadCryptoKey(stored, passphrase.value);
    const credential = await runCredentialExchange(
      endpoint.value.trim().replace(/\/+$/, ""),
      webCryptoHolder(identifier.value.trim(), privateKey),
    );
    collectedJson.value = JSON.stringify(credential, null, 2);
  } catch (e) {
    if (e instanceof ExchangeError) {
      failureKind.value = e.failure.kind;
      errorMessage.value = e.message;
    } else {
      errorMessage.value = (e as Error).message;
    }
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="cnml-card">
      <h2 class="cnml-section-title">Collect a staged credential</h2>
      <p class="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
        The two-turn holder-initiated exchange: the holder asks the coordinator for
        the credential staged for its identifier, answers the identifier-control
        challenge by signing the fresh nonce with the key behind that identifier,
        and collects. The coordinator holds the certificate out-of-band; no key
        material is transmitted.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="cnml-label">Coordinator endpoint<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="endpoint" autocomplete="off" placeholder="http://localhost:4455" class="cnml-input font-mono text-xs" />
        </label>
        <label class="block">
          <span class="cnml-label">Holder identifier (the certificate's CN)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="identifier" autocomplete="off" placeholder="Example Instruments" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Signing key<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <select v-model="selectedKeyId" class="cnml-input">
            <option v-if="keys.length === 0" value="" disabled>No keys in this browser yet</option>
            <option v-for="k in keys" :key="k.id" :value="k.id">{{ k.alias }}</option>
          </select>
        </label>
        <label class="block">
          <span class="cnml-label">Key passphrase (8 characters minimum)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="passphrase" type="password" autocomplete="current-password" class="cnml-input" />
        </label>
      </div>

      <div class="flex items-center gap-3 mt-6">
        <button @click="collect" :disabled="!formValid || busy" class="cnml-btn cnml-btn-primary">
          {{ busy ? "Collecting..." : "Collect credential" }}
        </button>
        <span v-if="keys.length === 0" class="text-sm text-[var(--ink-muted)]">
          Generate a key first (Keys page).
        </span>
      </div>

      <div v-if="errorMessage" role="alert" class="mt-4 cnml-alert cnml-alert-error">
        <p class="font-semibold">Exchange failed{{ failureKind ? ` (${failureKind})` : "" }}</p>
        <p class="text-sm">{{ errorMessage }}</p>
      </div>
    </div>

    <div v-if="collectedJson" class="cnml-card">
      <h2 class="cnml-section-title">Collected credential</h2>
      <pre class="cnml-pre">{{ collectedJson }}</pre>
    </div>
  </div>
</template>
