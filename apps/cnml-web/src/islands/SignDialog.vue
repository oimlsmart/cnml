<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { certToCnmlXml } from "@cnml/cnml-xml";
import {
  generateKey, encryptPrivateKey, storeKey, listKeys, getKey,
  loadCryptoKey, signCnmlXml, pemToDer, sha256Hex,
  importPublic, issueSelfSignedCert,
  timestampCnml, embedTimestampInXml,
  type StoredKey, type KeyAlgorithm,
} from "@cnml/cnml-crypto";

const props = defineProps<{ cert: any; open: boolean }>();
const emit = defineEmits<{ close: []; signed: [xml: string] }>();

const dialogRef = ref<HTMLDivElement | null>(null);
let lastFocused: HTMLElement | null = null;

function onKey(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") {
    e.preventDefault();
    emit("close");
    return;
  }
  if (e.key === "Tab" && dialogRef.value) {
    const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

// Focus management: steal focus on open, restore on close
watch(() => props.open, (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement;
    nextTick(() => {
      const first = dialogRef.value?.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea'
      );
      first?.focus();
    });
  } else {
    nextTick(() => lastFocused?.focus());
  }
});

// ─── State ──────────────────────────────────────────────────────────
const mode = ref<"select" | "generate" | "import">("select");
const existingKeys = ref<StoredKey[]>([]);
const selectedKeyId = ref<string | null>(null);

// Step 1: key generation / import fields
const newAlias = ref("");
const newPassphrase = ref("");
const newPassphraseConfirm = ref("");
const keyPem = ref("");

// Step 2: signing unlock passphrase (separate field — used after a key
// is selected to decrypt it for the actual sign() call)
const unlockPassphrase = ref("");

// Optional: user-provided X.509 cert PEM (otherwise auto-issued)
const certPem = ref("");

// Status
const status = ref<"idle" | "working" | "done" | "error">("idle");
const errorMessage = ref("");
const signedXml = ref("");
const keyFingerprint = ref("");

// OpenTimestamps opt-in
const anchorToBitcoin = ref(false);
const timestampStatus = ref<"idle" | "embedded" | "failed">("idle");

const xmlPreview = computed(() => props.cert ? certToCnmlXml(props.cert) : "");

// Derived: passphrase strength hints (shown BEFORE the user submits)
const passphraseTooShort = computed(() =>
  newPassphrase.value.length > 0 && newPassphrase.value.length < 8,
);
const passphraseMatch = computed(() =>
  newPassphrase.value.length > 0 && newPassphrase.value === newPassphraseConfirm.value,
);
const passphraseMismatch = computed(() =>
  newPassphraseConfirm.value.length > 0 && newPassphrase.value !== newPassphraseConfirm.value,
);
const canGenerate = computed(() =>
  newAlias.value.trim().length > 0 &&
  newPassphrase.value.length >= 8 &&
  newPassphrase.value === newPassphraseConfirm.value,
);

// Reset fields when switching modes
watch(mode, () => {
  errorMessage.value = "";
  status.value = "idle";
});

// Reset everything when dialog closes
watch(() => props.open, (open) => {
  if (!open) {
    status.value = "idle";
    errorMessage.value = "";
    timestampStatus.value = "idle";
    anchorToBitcoin.value = false;
  }
});

async function refreshKeys() {
  if (typeof indexedDB === "undefined") return;
  try {
    existingKeys.value = await listKeys();
  } catch (e) {
    console.warn("listKeys failed:", e);
  }
}
refreshKeys();

// ─── Generate a brand-new keypair ───────────────────────────────────
async function generateNew() {
  status.value = "working";
  errorMessage.value = "";
  try {
    if (!newAlias.value.trim()) throw new Error("Enter an alias for the new key.");
    if (newPassphrase.value.length < 8) {
      throw new Error("Passphrase must be at least 8 characters.");
    }
    if (newPassphrase.value !== newPassphraseConfirm.value) {
      throw new Error("Passphrases don't match.");
    }

    // generateKey() persists the encrypted key to IndexedDB.
    const { id, fingerprint } = await generateKey({
      alias: newAlias.value.trim(),
      algorithm: "ECDSA",
      passphrase: newPassphrase.value,
    });

    const stored = await getKey(id);
    if (!stored) throw new Error("Could not load newly generated key (storage failed).");
    const pub = await importPublic(stored);
    const priv = await loadCryptoKey(stored, newPassphrase.value);

    // Issue a real self-signed X.509 v3 certificate for KeyInfo.
    const dn = `O=CNML Web, CN=${newAlias.value.trim()}, C=NL`;
    certPem.value = await issueSelfSignedCert(pub, priv, dn);
    keyFingerprint.value = fingerprint;

    // Pre-fill the unlock passphrase with the same one — user just typed it,
    // saves them re-typing for the immediate sign.
    unlockPassphrase.value = newPassphrase.value;

    selectedKeyId.value = id;
    mode.value = "select";
    status.value = "idle";
    // Wipe the generation fields (the key is now persisted)
    newAlias.value = "";
    newPassphrase.value = "";
    newPassphraseConfirm.value = "";
    await refreshKeys();
  } catch (e) {
    errorMessage.value = (e as Error).message;
    status.value = "error";
  }
}

// ─── Import an existing PEM private key ─────────────────────────────
async function importExisting() {
  status.value = "working";
  errorMessage.value = "";
  try {
    if (!keyPem.value) throw new Error("Paste a private key PEM.");
    if (!newAlias.value.trim()) throw new Error("Enter an alias for the imported key.");
    if (newPassphrase.value.length < 8) throw new Error("Passphrase must be at least 8 characters.");

    const { der, label } = pemToDer(keyPem.value);
    if (!label.includes("PRIVATE")) throw new Error("Expected a PRIVATE KEY PEM.");

    // ECDSA P-256 only. Legacy RSA keys are not accepted — the CNML
    // policy from day one is ECDSA (with Ed25519+ML-DSA hybrid coming).
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8", der,
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["sign"],
    );
    const algorithm: KeyAlgorithm = "ECDSA";

    // Derive the matching public key from the imported private key.
    // WebCrypto can't do this directly; we export the private JWK and
    // reconstruct the public key from its components.
    const jwk = await crypto.subtle.exportKey("jwk", cryptoKey);
    const pubJwk: JsonWebKey = {
      kty: jwk.kty!, n: jwk.n, e: jwk.e, x: jwk.x, y: jwk.y,
      crv: jwk.crv, ext: true,
    };
    const pubKey = await crypto.subtle.importKey(
      "jwk", pubJwk,
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["verify"],
    );
    const spki = await crypto.subtle.exportKey("spki", pubKey);

    const fingerprint = await sha256Hex(spki);
    const { encrypted, salt, iv } = await encryptPrivateKey(der, newPassphrase.value);
    const id = `key_${fingerprint.slice(0, 12)}`;
    const stored: StoredKey = {
      id,
      alias: newAlias.value.trim(),
      algorithm,
      publicKeySpki: spki,
      privateKeyPkcs8: encrypted,
      salt, iv,
      created: Date.now(),
      fingerprint,
    };
    await storeKey(stored);

    // Optionally issue a self-signed cert for this imported key.
    const priv = await loadCryptoKey(stored, newPassphrase.value);
    const dn = `O=CNML Web, CN=${newAlias.value.trim()}, C=NL`;
    certPem.value = await issueSelfSignedCert(pubKey, priv, dn);

    selectedKeyId.value = id;
    keyFingerprint.value = fingerprint;
    unlockPassphrase.value = newPassphrase.value;
    mode.value = "select";
    status.value = "idle";
    newAlias.value = "";
    newPassphrase.value = "";
    newPassphraseConfirm.value = "";
    keyPem.value = "";
    await refreshKeys();
  } catch (e) {
    errorMessage.value = (e as Error).message;
    status.value = "error";
  }
}

// ─── Sign the CNML ──────────────────────────────────────────────────
async function sign() {
  if (!selectedKeyId.value) {
    errorMessage.value = "Select or generate a signing key first.";
    return;
  }
  if (!unlockPassphrase.value) {
    errorMessage.value = "Enter the passphrase to unlock the key.";
    return;
  }
  status.value = "working";
  errorMessage.value = "";
  try {
    const stored = await getKey(selectedKeyId.value);
    if (!stored) throw new Error("Key not found in store.");
    const privateKey = await loadCryptoKey(stored, unlockPassphrase.value);
    const xml = certToCnmlXml(props.cert);
    let signed = await signCnmlXml(xml, privateKey, certPem.value || undefined);

    // Optional: anchor the signed CNML's hash to the Bitcoin blockchain
    // via OpenTimestamps. Free, takes a few seconds. Proves "this exact
    // content existed at block N" — defeats back-dating attacks.
    if (anchorToBitcoin.value) {
      try {
        const proofB64 = await timestampCnml(signed);
        signed = embedTimestampInXml(signed, proofB64);
        timestampStatus.value = "embedded";
      } catch (e) {
        timestampStatus.value = `failed: ${(e as Error).message}`;
      }
    }

    signedXml.value = signed;
    status.value = "done";
    emit("signed", signed);
  } catch (e) {
    errorMessage.value = (e as Error).message;
    status.value = "error";
  }
}

function download() {
  if (!signedXml.value) return;
  const filename = (props.cert?.certificate?.number ?? "cert").replace(/[^A-Za-z0-9._-]/g, "_") + ".cnml.xml";
  const blob = new Blob([signedXml.value], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 bg-black/40 grid place-items-center z-50 p-4">
    <div ref="dialogRef"
         role="dialog"
         aria-modal="true"
         aria-labelledby="sign-dialog-title"
         class="bg-[var(--paper-soft)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-[var(--rule)]">
        <h2 id="sign-dialog-title" class="font-serif text-xl font-semibold text-[var(--ink)]">Sign and download CNML</h2>
        <button @click="emit('close')" aria-label="Close dialog" class="text-[var(--ink-muted)] hover:text-[var(--ink)] text-3xl leading-none">×</button>
      </div>

      <div class="p-6">
        <!-- Step 1: Pick a key -->
        <div class="mb-6">
          <div class="cnml-label mb-3">Step 1 — Pick a signing key</div>
          <div class="flex gap-1 mb-4 p-1 bg-[var(--paper-raised)] rounded-md w-fit">
            <button
              v-for="m in (['select', 'generate', 'import'] as const)"
              :key="m"
              @click="mode = m"
              :class="[
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                mode === m ? 'bg-[var(--ink)] text-[var(--paper-soft)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
              ]"
            >
              {{ m === 'select' ? 'Use existing' : m === 'generate' ? 'Generate new' : 'Import PEM' }}
            </button>
          </div>

          <!-- Select existing -->
          <div v-if="mode === 'select'">
            <div v-if="existingKeys.length === 0" class="cnml-card cnml-card--raised text-center py-8">
              <div class="text-4xl mb-3">🔐</div>
              <div class="font-medium mb-1">No keys in store yet</div>
              <div class="text-sm text-[var(--ink-muted)]">Switch to "Generate new" or "Import PEM" above.</div>
            </div>
            <ul v-else class="space-y-2">
              <li v-for="k in existingKeys" :key="k.id">
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
                    <div class="text-xs text-[var(--ink-muted)] font-mono">
                      {{ k.algorithm }} · {{ k.fingerprint.slice(0, 24) }}…
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          </div>

          <!-- Generate -->
          <div v-else-if="mode === 'generate'" class="space-y-4">
            <label class="block">
              <span class="cnml-label">Key alias <span class="text-[var(--ink-muted)] normal-case font-normal">(shown in the key list)</span></span>
              <input
                v-model="newAlias"
                placeholder="My authority signing key"
                class="cnml-input"
              />
            </label>
            <label class="block">
              <span class="cnml-label">
                Passphrase
                <span class="normal-case font-normal text-[var(--ink-muted)]">— min 8 chars · encrypts the key at rest</span>
              </span>
              <input
                v-model="newPassphrase"
                type="password"
                placeholder="≥ 8 characters"
                class="cnml-input"
                :class="{ 'border-red-400': passphraseTooShort }"
              />
              <span v-if="passphraseTooShort" class="text-xs text-red-700 mt-1 block">
                Too short — needs {{ 8 - newPassphrase.length }} more character{{ 8 - newPassphrase.length === 1 ? '' : 's' }}.
              </span>
            </label>
            <label class="block">
              <span class="cnml-label">Confirm passphrase</span>
              <input
                v-model="newPassphraseConfirm"
                type="password"
                placeholder="Repeat passphrase"
                class="cnml-input"
                :class="{ 'border-red-400': passphraseMismatch }"
              />
              <span v-if="passphraseMatch" class="text-xs text-emerald-700 mt-1 block">✓ Matches.</span>
              <span v-else-if="passphraseMismatch" class="text-xs text-red-700 mt-1 block">Doesn't match.</span>
            </label>
            <button
              @click="generateNew"
              :disabled="!canGenerate || status === 'working'"
              class="cnml-btn cnml-btn-primary w-full"
            >
              {{ status === 'working' ? 'Generating ECDSA P-256…' : 'Generate ECDSA P-256 keypair' }}
            </button>
            <p v-if="!canGenerate && status !== 'working'" class="text-xs text-[var(--ink-muted)] text-center">
              Fill in alias + passphrase (min 8 chars) to enable generation.
            </p>
          </div>

          <!-- Import -->
          <div v-else class="space-y-4">
            <label class="block">
              <span class="cnml-label">Private key (PEM)</span>
              <textarea
                v-model="keyPem"
                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                rows="5"
                class="cnml-input font-mono text-xs"
              ></textarea>
            </label>
            <label class="block">
              <span class="cnml-label">Key alias</span>
              <input v-model="newAlias" placeholder="Imported key" class="cnml-input" />
            </label>
            <label class="block">
              <span class="cnml-label">
                Passphrase
                <span class="normal-case font-normal text-[var(--ink-muted)]">— min 8 chars · encrypts the key at rest</span>
              </span>
              <input
                v-model="newPassphrase"
                type="password"
                placeholder="≥ 8 characters"
                class="cnml-input"
              />
            </label>
            <button
              @click="importExisting"
              :disabled="!keyPem || !newAlias || newPassphrase.length < 8 || status === 'working'"
              class="cnml-btn cnml-btn-primary w-full"
            >
              {{ status === 'working' ? 'Importing…' : 'Import key' }}
            </button>
          </div>
        </div>

        <!-- Step 2: Unlock + sign -->
        <div v-if="selectedKeyId" class="pt-4 border-t border-[var(--rule)]">
          <div class="cnml-label mb-3">Step 2 — Unlock and sign</div>
          <label class="block mb-4">
            <span class="cnml-label">Passphrase (to unlock the selected key)</span>
            <input
              v-model="unlockPassphrase"
              type="password"
              placeholder="Same passphrase you set above"
              class="cnml-input"
            />
          </label>

          <label class="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" v-model="anchorToBitcoin" class="accent-[var(--accent)]" />
            <span>Anchor to Bitcoin blockchain (free, ~5s)</span>
          </label>
          <p v-if="anchorToBitcoin" class="text-xs text-[var(--ink-muted)] mb-2">
            Submits the CNML's SHA-256 to OpenTimestamps. Proves "this content
            existed before block N" — defeats back-dating forgery.
          </p>

          <button
            @click="sign"
            :disabled="!unlockPassphrase || status === 'working'"
            class="cnml-btn cnml-btn-primary w-full"
          >
            {{ status === 'working' ? 'Signing…' : 'Sign CNML XML' }}
          </button>
        </div>

        <!-- Status / error -->
        <div v-if="status === 'error' && errorMessage" class="cnml-callout cnml-callout--error mt-4">
          {{ errorMessage }}
        </div>

        <!-- Success + download -->
        <div v-if="status === 'done'" class="cnml-callout cnml-callout--success mt-4">
          ✓ CNML XML signed with key <span class="font-mono">{{ keyFingerprint.slice(0, 24) }}…</span>
        </div>

        <div v-if="status === 'done' && timestampStatus === 'embedded'" class="cnml-callout cnml-callout--info mt-2">
          ⛓ Timestamp anchored to Bitcoin blockchain via OpenTimestamps.
          Proof embedded in the XML.
        </div>
        <div v-if="status === 'done' && timestampStatus.startsWith('failed')" class="cnml-callout cnml-callout--warning mt-2">
          ⚠ Timestamp submission failed ({{ timestampStatus }}).
          The CNML is signed but has no blockchain proof.
        </div>

        <details v-if="signedXml" class="mt-4">
          <summary class="cursor-pointer text-xs uppercase tracking-wider text-[var(--ink-muted)] font-medium">
            Preview signed XML ({{ signedXml.length }} bytes)
          </summary>
          <pre class="cnml-code-pane mt-2">{{ signedXml }}</pre>
        </details>

        <button
          v-if="status === 'done'"
          @click="download"
          class="cnml-btn cnml-btn-primary w-full mt-4"
        >
          Download .cnml.xml
        </button>
      </div>
    </div>
  </div>
</template>
