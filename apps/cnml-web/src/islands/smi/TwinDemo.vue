<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { TwinClient, type Indication, type TwinState, type Provenance, type ConnectionStatus } from "@oiml/cnml-crypto/smi/twin-client";
import ErrorCallout from "../widgets/ErrorCallout.vue";
import { useAsyncAction } from "../../composables/useAsyncAction";

const endpoint = ref("http://localhost:8787/twin");
const status = ref<ConnectionStatus>("disconnected");
const indication = ref<Indication | null>(null);
const state = ref<TwinState | null>(null);
const provenance = ref<Provenance | null>(null);
const { error, run } = useAsyncAction();
let client: TwinClient | null = null;
let unsub: (() => void) | null = null;

async function connect() {
  error.value = "";
  client = new TwinClient(endpoint.value);
  status.value = await client.connect();
  if (status.value === "connected") {
    await run(async () => {
      indication.value = await client!.getIndication();
      state.value = await client!.getState();
      provenance.value = await client!.getProvenance();
      unsub = client!.watchState((s) => { state.value = s; });
    });
  } else {
    error.value = `Could not connect to ${endpoint.value}. Is the SST simulator or SMART instrument running?`;
  }
}

function disconnect() {
  unsub?.();
  client?.disconnect();
  status.value = "disconnected";
  indication.value = null;
  state.value = null;
  provenance.value = null;
}

onUnmounted(disconnect);
</script>

<template>
  <div>
    <div class="flex gap-2 mb-6 items-center">
      <input
        v-model="endpoint"
        type="url"
        placeholder="Twin GraphQL endpoint URL"
        class="flex-1 cnml-input"
        :disabled="status === 'connected'"
      />
      <button
        v-if="status !== 'connected'"
        @click="connect"
        class="cnml-btn cnml-btn-primary"
      >Connect</button>
      <button
        v-else
        @click="disconnect"
        class="cnml-btn cnml-btn-secondary"
      >Disconnect</button>
    </div>

    <ErrorCallout :message="error" />

    <div v-if="status === 'connected' && indication" class="space-y-4">
      <div class="cnml-card">
        <h3 class="cnml-section-title">Live indication</h3>
        <div class="text-3xl font-mono font-bold text-[var(--accent)]">
          {{ indication.value }} {{ indication.unit }}
        </div>
        <div class="text-xs text-[var(--ink-muted)] mt-1">
          Quality: {{ indication.quality }}
        </div>
      </div>

      <div v-if="state" class="cnml-card">
        <h3 class="cnml-section-title">State</h3>
        <div class="font-mono">{{ state.status }}</div>
        <div class="text-xs text-[var(--ink-muted)]">Since {{ state.lastChangedAt }}</div>
      </div>

      <div v-if="provenance" class="cnml-card">
        <h3 class="cnml-section-title">CNML provenance</h3>
        <dl class="text-sm space-y-1">
          <div><dt class="inline text-[var(--ink-muted)]">Certificate:</dt>
               <dd class="inline ml-2 font-mono">{{ provenance.cnmlCertificateId }}</dd></div>
          <div><dt class="inline text-[var(--ink-muted)]">Manufacturer:</dt>
               <dd class="inline ml-2">{{ provenance.manufacturer }}</dd></div>
          <div><dt class="inline text-[var(--ink-muted)]">Model:</dt>
               <dd class="inline ml-2">{{ provenance.model }}</dd></div>
          <div><a :href="provenance.passportUrl" target="_blank" class="text-[var(--accent)] underline">
               View passport &rarr;</a></div>
        </dl>
      </div>
    </div>

    <p v-else-if="status === 'disconnected'" class="text-sm text-[var(--ink-muted)]">
      Enter the twin endpoint URL and click Connect. For local development,
      run the SST simulator on port 8787.
    </p>
  </div>
</template>
