<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  listKeys, deleteKey, generateKey, getKey, storeKey,
  exportPublicKeyPem, exportPrivateKeyPem, importPrivateKeyFromPem,
  listTrustedKeys, deleteTrustedKey, importPublicKeyFromPem, storeTrustedKey,
  type StoredKey, type TrustedPublicKey,
} from "@oiml/cnml-crypto";
import { useAsyncAction } from "./shared/useAsyncAction";
import { fingerprintShort } from "./shared/display";

// ─── Cert import state ─────────────────────────────────────────────
const showImportCert = ref(false);
const importCertText = ref("");
const importCertKeyId = ref<string | null>(null);
const certImportError = ref("");

// ─── Expiry helpers ────────────────────────────────────────────────
function daysToExpiry(k: StoredKey): number | null {
  if (!k.certificateExpiry) return null;
  return Math.floor((k.certificateExpiry - Date.now()) / 86400000);
}

function expiryBadge(k: StoredKey): { class: string; text: string } | null {
  const days = daysToExpiry(k);
  if (days === null) return null;
  if (days < 0) return { class: "badge-expired", text: "Expired" };
  if (days < 30) return { class: "badge-urgent", text: `Expires in ${days}d` };
  if (days < 60) return { class: "badge-warning", text: `Expires in ${days}d` };
  if (days < 90) return { class: "badge-info", text: `Expires in ${days}d` };
  return null;
}

function isCertified(k: StoredKey): boolean {
  return !!k.certificatePem;
}

// ─── Cert import flow ──────────────────────────────────────────────
async function importCertificate() {
  certImportError.value = "";
  if (!importCertText.value.trim()) { certImportError.value = "Paste a certificate PEM"; return; }
  if (!importCertKeyId.value) { certImportError.value = "Select a key"; return; }
  try {
    // Parse the PEM and extract expiry
    const pem = importCertText.value.trim();
    const b64 = pem.replace(/-----BEGIN [A-Z ]+-----/g, "").replace(/-----END [A-Z ]+-----/g, "").replace(/\s+/g, "");
    const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    // Extract expiry from X.509 cert using pkijs (lazy import)
    let expiry = Date.now() + 730 * 86400000; // default 2 years if parsing fails
    try {
      const { Certificate } = await import("pkijs");
      const asn1 = await import("asn1js");
      const parsed = asn1.fromBER(der.buffer);
      const cert = new Certificate({ schema: parsed });
      if (cert.notAfter?.value) expiry = cert.notAfter.value.getTime();
    } catch { /* use default */ }

    // Store cert with the key
    const stored = await getKey(importCertKeyId.value);
    if (!stored) throw new Error("Key not found");
    stored.certificatePem = pem;
    stored.certificateExpiry = expiry;
    stored.certificateStatus = "certified";
    await storeKey(stored);

    importCertText.value = "";
    importCertKeyId.value = null;
    showImportCert.value = false;
    await refresh();
  } catch (e) {
    certImportError.value = (e as Error).message;
  }
}

function triggerCertUpload(k: StoredKey) {
  importCertKeyId.value = k.id;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".crt,.pem";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    importCertText.value = await file.text();
    showImportCert.value = true;
  };
  input.click();
}
const keys = ref<StoredKey[]>([]);
const loading = ref(true);
const showGenerate = ref(false);
const showImport = ref(false);
const newAlias = ref("");
const newPassphrase = ref("");
const importAlias = ref("");
const importPassphrase = ref("");
const importPemText = ref("");
const { error, busy, run } = useAsyncAction();

// ─── Trust store state (public keys only) ─────────────────────────
const trustedKeys = ref<TrustedPublicKey[]>([]);
const showAddTrusted = ref(false);
const trustedAlias = ref("");
const trustedPemText = ref("");

async function refresh() {
  loading.value = true;
  try {
    const [priv, pub] = await Promise.all([
      listKeys().catch(() => [] as StoredKey[]),
      listTrustedKeys().catch(() => [] as TrustedPublicKey[]),
    ]);
    keys.value = priv;
    trustedKeys.value = pub;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
onMounted(refresh);

async function generate() {
  error.value = "";
  if (!newAlias.value.trim()) { error.value = "Alias required"; return; }
  if (newPassphrase.value.length < 8) { error.value = "Passphrase must be at least 8 characters"; return; }
  await run(async () => {
    await generateKey({ alias: newAlias.value.trim(), algorithm: "ECDSA", passphrase: newPassphrase.value });
    newAlias.value = "";
    newPassphrase.value = "";
    showGenerate.value = false;
    await refresh();
  });
}

async function remove(id: string) {
  if (!confirm("Delete this key? Cannot be undone.")) return;
  await deleteKey(id);
  await refresh();
}

function downloadPem(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/x-pem-file" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPublic(k: StoredKey) {
  const pem = await exportPublicKeyPem(k);
  downloadPem(pem, `${k.alias.replace(/\s+/g, "_")}.pub.pem`);
}

async function downloadPrivate(k: StoredKey) {
  const pass = prompt(`Enter the passphrase for "${k.alias}" to unlock the private key for export.\n\nWARNING: the exported file will contain an UNENCRYPTED private key. Store it securely.`);
  if (!pass) return;
  try {
    const pem = await exportPrivateKeyPem(k, pass);
    downloadPem(pem, `${k.alias.replace(/\s+/g, "_")}.private.pem`);
  } catch (e) {
    error.value = `Export failed: ${(e as Error).message}`;
  }
}

async function importKey() {
  error.value = "";
  if (!importPemText.value.trim()) { error.value = "Paste a private key PEM"; return; }
  if (!importAlias.value.trim()) { error.value = "Alias required"; return; }
  if (importPassphrase.value.length < 8) { error.value = "Storage passphrase must be ≥ 8 characters"; return; }
  await run(async () => {
    const stored = await importPrivateKeyFromPem(importPemText.value, importAlias.value.trim(), importPassphrase.value);
    await storeKey(stored);
    importPemText.value = "";
    importAlias.value = "";
    importPassphrase.value = "";
    showImport.value = false;
    await refresh();
  });
}

function triggerPrivateKeyUpload() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pem,.key,.txt";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    importPemText.value = await file.text();
    showImport.value = true;
  };
  input.click();
}

// ─── Trust store actions ──────────────────────────────────────────

async function addTrustedKey() {
  error.value = "";
  if (!trustedPemText.value.trim()) { error.value = "Paste a public key PEM"; return; }
  if (!trustedAlias.value.trim()) { error.value = "Alias required"; return; }
  await run(async () => {
    const trusted = await importPublicKeyFromPem(trustedPemText.value, trustedAlias.value.trim());
    await storeTrustedKey(trusted);
    trustedPemText.value = "";
    trustedAlias.value = "";
    showAddTrusted.value = false;
    await refresh();
  });
}

function triggerTrustedKeyUpload() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pem,.key,.txt";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    trustedPemText.value = await file.text();
    showAddTrusted.value = true;
  };
  input.click();
}

async function removeTrusted(id: string) {
  if (!confirm("Remove this trusted public key?")) return;
  await deleteTrustedKey(id);
  await refresh();
}
</script>

<template>
  <div class="space-y-8">
    <!-- ─── Private keys ─────────────────────────────────────── -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="cnml-section-title cnml-section-title--sm">Signing keys (private)</h2>
        <div class="flex gap-2">
          <button @click="showGenerate = !showGenerate" :aria-expanded="showGenerate" class="cnml-btn cnml-btn-primary">
            {{ showGenerate ? "Cancel" : (keys.length === 0 ? "Generate keypair" : "+ New key") }}
          </button>
          <button @click="triggerPrivateKeyUpload" aria-label="Import a private key PEM file" class="cnml-btn cnml-btn-secondary">Import PEM ↑</button>
        </div>
      </div>

      <!-- Generate form -->
      <div v-if="showGenerate" class="cnml-card cnml-card--raised mb-4 space-y-3">
        <label class="block">
          <span class="cnml-label">Alias<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="newAlias" autocomplete="off" required placeholder="My authority signing key" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Passphrase (min 8 chars · encrypts the key at rest)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="newPassphrase" type="password" autocomplete="new-password" minlength="8" required placeholder="≥ 8 characters" class="cnml-input" />
        </label>
        <button @click="generate" :disabled="busy" class="cnml-btn cnml-btn-primary">
          {{ busy ? "Generating…" : "Generate ECDSA P-256" }}
        </button>
        <div v-if="error" role="alert" class="text-sm cnml-text-danger">{{ error }}</div>
      </div>

      <!-- Import form (file upload triggers this) -->
      <div v-if="showImport" class="cnml-card cnml-card--raised mb-4 space-y-3">
        <div class="cnml-label">Import private key from PEM</div>
        <label class="block">
          <span class="cnml-label">Private key (PEM)</span>
          <textarea v-model="importPemText" rows="5" placeholder="-----BEGIN PRIVATE KEY-----" class="cnml-input font-mono text-xs"></textarea>
        </label>
        <label class="block">
          <span class="cnml-label">Alias<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="importAlias" autocomplete="off" required placeholder="Imported key" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Storage passphrase (min 8 chars · encrypts at rest)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="importPassphrase" type="password" autocomplete="new-password" minlength="8" required placeholder="≥ 8 characters" class="cnml-input" />
        </label>
        <button @click="importKey" :disabled="busy" class="cnml-btn cnml-btn-primary">
          {{ busy ? "Importing…" : "Import key" }}
        </button>
        <button @click="showImport = false" class="cnml-btn cnml-btn-secondary">Cancel</button>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && keys.length === 0 && !showGenerate" class="cnml-card cnml-card--raised text-center">
        <div class="text-4xl mb-3">🔐</div>
        <div class="font-medium mb-1">No signing keys yet</div>
        <div class="text-sm text-[var(--ink-muted)] mb-4">Click "Generate keypair" to create one, or import an existing PEM.</div>
      </div>

      <!-- Cert import modal -->
      <div v-if="showImportCert" class="cnml-card cnml-card--raised mb-4 space-y-3">
        <div class="cnml-label">Import Signed Certificate</div>
        <p class="text-xs text-[var(--ink-muted)]">Paste the .crt file received from your CA operator.</p>
        <label class="block">
          <span class="cnml-label">Certificate PEM<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <textarea v-model="importCertText" rows="5" required placeholder="-----BEGIN CERTIFICATE-----" class="cnml-input font-mono text-xs"></textarea>
        </label>
        <div v-if="certImportError" role="alert" class="text-sm cnml-text-danger">{{ certImportError }}</div>
        <div class="flex gap-2">
          <button @click="importCertificate" class="cnml-btn cnml-btn-primary">Import cert</button>
          <button @click="showImportCert = false" class="cnml-btn cnml-btn-secondary">Cancel</button>
        </div>
      </div>

      <!-- Key list -->
      <ul v-if="keys.length > 0" class="space-y-3">
        <li v-for="k in keys" :key="k.id" class="cnml-card">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ k.alias }}</span>
                <span v-if="isCertified(k)" class="cnml-tag cnml-badge-success">Certified</span>
                <span v-else class="cnml-tag cnml-badge-warning">Uncertified</span>
                <span v-if="expiryBadge(k)" :class="['cnml-tag', expiryBadge(k)?.class]">{{ expiryBadge(k)?.text }}</span>
              </div>
              <div class="text-xs text-[var(--ink-muted)] font-mono mt-1">{{ k.algorithm }} · {{ fingerprintShort(k.fingerprint) }}</div>
              <div class="text-xs text-[var(--ink-muted)] mt-1">Created {{ new Date(k.created).toLocaleString() }}</div>
            </div>
            <div class="flex gap-1 flex-wrap justify-end">
              <button @click="downloadPublic(k)" :aria-label="`Download public key for ${k.alias}`" class="cnml-btn cnml-btn-secondary">Public ↓</button>
              <button @click="downloadPrivate(k)" :aria-label="`Download private key for ${k.alias}`" class="cnml-btn cnml-btn-secondary">Private ↓</button>
              <button v-if="!isCertified(k)" @click="triggerCertUpload(k)" :aria-label="`Import certificate for ${k.alias}`" class="cnml-btn cnml-btn-secondary">Import cert ↑</button>
              <a v-if="expiryBadge(k)" :href="'/csr'" class="cnml-btn cnml-btn-primary">Renew</a>
              <button @click="remove(k.id)" :aria-label="`Delete key ${k.alias}`" class="cnml-btn cnml-btn-ghost cnml-text-danger">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ─── Trusted public keys ──────────────────────────────── -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="cnml-section-title cnml-section-title--sm">Trusted public keys</h2>
        <div class="flex gap-2">
          <button @click="triggerTrustedKeyUpload" aria-label="Upload a trusted public key PEM file" class="cnml-btn cnml-btn-secondary">Upload .pub.pem ↑</button>
          <button @click="showAddTrusted = !showAddTrusted" :aria-expanded="showAddTrusted" class="cnml-btn cnml-btn-secondary">{{ showAddTrusted ? "Cancel" : "+ Paste PEM" }}</button>
        </div>
      </div>

      <div v-if="showAddTrusted" class="cnml-card cnml-card--raised mb-4 space-y-3">
        <label class="block">
          <span class="cnml-label">Public key (PEM)</span>
          <textarea v-model="trustedPemText" rows="5" placeholder="-----BEGIN PUBLIC KEY-----" class="cnml-input font-mono text-xs"></textarea>
        </label>
        <label class="block">
          <span class="cnml-label">Alias (issuer name)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="trustedAlias" autocomplete="off" required placeholder="NMi Certin B.V. (NL1)" class="cnml-input" />
        </label>
        <button @click="addTrustedKey" class="cnml-btn cnml-btn-primary">Add to trust store</button>
        <div v-if="error" role="alert" class="text-sm cnml-text-danger">{{ error }}</div>
      </div>

      <div v-if="trustedKeys.length === 0" class="cnml-card cnml-card--raised text-center">
        <div class="text-4xl mb-3">🔑</div>
        <div class="font-medium mb-1">No trusted public keys yet</div>
        <div class="text-sm text-[var(--ink-muted)] mb-4">Upload an issuer's .pub.pem to verify CNMLs against their key directly.</div>
      </div>

      <ul v-if="trustedKeys.length > 0" class="space-y-3">
        <li v-for="t in trustedKeys" :key="t.id" class="cnml-card">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold">{{ t.alias }}</div>
              <div class="text-xs text-[var(--ink-muted)] font-mono mt-1">{{ fingerprintShort(t.fingerprint) }}</div>
              <div class="text-xs text-[var(--ink-muted)] mt-1">Added {{ new Date(t.created).toLocaleString() }}</div>
            </div>
            <div class="flex gap-2">
              <button @click="removeTrusted(t.id)" :aria-label="`Remove trusted key ${t.alias}`" class="cnml-btn cnml-btn-ghost cnml-text-danger">Remove</button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
