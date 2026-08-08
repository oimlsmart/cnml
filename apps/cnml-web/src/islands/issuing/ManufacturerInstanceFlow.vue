<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import QRCode from "qrcode";
import {
  generateKey, getKey, loadCryptoKey, importPublic,
  issueSelfSignedCert, signCnmlXml, sha256Hex,
  type StoredKey,
} from "@oiml/cnml-crypto";
import { instanceCertToXml, type InstanceCertificate } from "@oiml/cnml-xml";
import { fingerprintShort } from "../shared/display";

// The schema (_instance.yaml) is passed from the Astro page. The form
// field set, the XML serializer, and the passport projection all derive
// from this schema. The props below carry it for future use (field-
// level validation, conditional rendering, label overrides).
const props = defineProps<{ schema?: Record<string, unknown> }>();

// Astro BASE_URL ("/" in dev, "/cnml/" in prod) for prefixing internal links.
const baseUrl = import.meta.env.BASE_URL as string;

// ─── Form state ─────────────────────────────────────────────────────
const manufacturerName = ref("");
const modelName = ref("");
const serialNumber = ref("");
const firmwareHash = ref("");
const manufacturingDate = ref(new Date().toISOString().slice(0, 10));
const passphrase = ref("");
const passphraseConfirm = ref("");

// ─── Workflow state ─────────────────────────────────────────────────
const step = ref<"form" | "working" | "done">("form");
const errorMessage = ref("");
const signedXml = ref("");
const certId = ref("");
const keyFingerprint = ref("");
const certPem = ref("");
const keyAlias = ref("");
const createdKey = ref<StoredKey | null>(null);

onMounted(() => {
  // Restore a previously generated manufacturer key if present.
  try {
    const stash = sessionStorage.getItem("cnml-mfr-key");
    if (stash) {
      const parsed = JSON.parse(stash);
      keyAlias.value = parsed.alias ?? "";
      keyFingerprint.value = parsed.fingerprint ?? "";
    }
  } catch { /* no-op */ }
});

const passportUrl = computed(() =>
  `https://www.oimlsmart.org/cnml/passport/${certId.value}`,
);

// Locally-generated QR SVG (no external API). Regenerated whenever the
// passport URL changes once a cert id is assigned.
const qrSvg = ref("");
watch(passportUrl, async (url) => {
  qrSvg.value = "";
  if (!url || !certId.value) return;
  try {
    qrSvg.value = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {
    // Silent degradation; the dedicated QR page has full error reporting.
  }
});

const formValid = computed(() =>
  manufacturerName.value.trim().length > 0 &&
  modelName.value.trim().length > 0 &&
  serialNumber.value.trim().length > 0 &&
  manufacturingDate.value.length > 0 &&
  passphrase.value.length >= 8 &&
  passphrase.value === passphraseConfirm.value,
);

function buildInstanceXml(): string {
  // Serialize via @oiml/cnml-xml. The XML shape is driven by the
  // InstanceCertificate interface which mirrors _instance.yaml —
  // the schema is the specification.
  const data: InstanceCertificate = {
    manufacturer: manufacturerName.value.trim(),
    model: modelName.value.trim(),
    serialNumber: serialNumber.value.trim(),
    manufacturingDate: manufacturingDate.value,
  };
  const fw = firmwareHash.value.trim();
  if (fw) data.firmwareHash = fw;
  return instanceCertToXml(data);
}

async function ensureManufacturerKey(): Promise<{ priv: CryptoKey; pub: CryptoKey; pem: string }> {
  // Reuse the in-session key if the user already generated one.
  const stash = sessionStorage.getItem("cnml-mfr-key");
  if (stash) {
    try {
      const parsed = JSON.parse(stash);
      const stored = await getKey(parsed.id);
      if (stored) {
        const priv = await loadCryptoKey(stored, passphrase.value);
        const pub = await importPublic(stored);
        return { priv, pub, pem: parsed.certPem ?? "" };
      }
    } catch { /* fall through to generate */ }
  }

  // Generate a fresh delegated signing key for this manufacturer.
  const alias = `${manufacturerName.value.trim()} instance signer`;
  const { id, fingerprint } = await generateKey({
    alias,
    algorithm: "ECDSA",
    passphrase: passphrase.value,
  });
  const stored = await getKey(id);
  if (!stored) throw new Error("Key generation failed.");
  const priv = await loadCryptoKey(stored, passphrase.value);
  const pub = await importPublic(stored);
  const dn = `O=${manufacturerName.value.trim()}, CN=${alias}, C=NL`;
  const pem = await issueSelfSignedCert(pub, priv, dn);

  createdKey.value = stored;
  keyAlias.value = alias;
  keyFingerprint.value = fingerprint;
  sessionStorage.setItem("cnml-mfr-key", JSON.stringify({ id, alias, fingerprint, certPem: pem }));
  return { priv, pub, pem };
}

async function signInstance() {
  if (!formValid.value) {
    errorMessage.value = "Complete the required fields and confirm the passphrase matches.";
    return;
  }
  step.value = "working";
  errorMessage.value = "";
  try {
    const { priv, pem } = await ensureManufacturerKey();
    certPem.value = pem;
    const xml = buildInstanceXml();
    const signed = await signCnmlXml(xml, priv, pem || undefined);
    signedXml.value = signed;

    // Derive a stable certificate identifier from the payload hash.
    const digest = await sha256Hex(new TextEncoder().encode(signed));
    certId.value = `CNML-${digest.slice(0, 16).toUpperCase()}`;
    step.value = "done";
  } catch (e) {
    errorMessage.value = (e as Error).message;
    step.value = "form";
  }
}

function downloadBundle() {
  if (!signedXml.value) return;
  const bundle = [
    "-----BEGIN CNML INSTANCE CERTIFICATE-----",
    btoa(signedXml.value),
    "-----END CNML INSTANCE CERTIFICATE-----",
    "",
    certPem.value,
  ].join("\n");
  const blob = new Blob([bundle], { type: "application/x-pem-file" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${serialNumber.value.replace(/\s+/g, "_") || "instance"}.cnml.pem`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetForm() {
  manufacturerName.value = "";
  modelName.value = "";
  serialNumber.value = "";
  firmwareHash.value = "";
  manufacturingDate.value = new Date().toISOString().slice(0, 10);
  passphrase.value = "";
  passphraseConfirm.value = "";
  signedXml.value = "";
  certId.value = "";
  errorMessage.value = "";
  createdKey.value = null;
  step.value = "form";
}
</script>

<template>
  <div class="space-y-6">
    <!-- Step 1: identity form -->
    <div v-if="step === 'form'" class="cnml-card">
      <h2 class="cnml-section-title">Manufacturer and device identity</h2>
      <p class="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
        The instance certificate binds a single instrument to the manufacturer's
        delegated signing key. Each field is attested by the manufacturer
        signature and is verifiable by anyone holding the certificate chain.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="cnml-label">Manufacturer name<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="manufacturerName" autocomplete="organization" placeholder="Acme Weighing Systems" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Model name<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="modelName" autocomplete="off" placeholder="LC-500 load cell" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Device serial number<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="serialNumber" autocomplete="off" placeholder="SN-2026-00001" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Firmware hash (SHA-256, optional)</span>
          <input v-model="firmwareHash" autocomplete="off" placeholder="9f86d081884c7d65..." class="cnml-input font-mono text-xs" />
        </label>
        <label class="block">
          <span class="cnml-label">Manufacturing date<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="manufacturingDate" type="date" class="cnml-input" />
        </label>
      </div>

      <h3 class="cnml-section-title mt-6">Delegated signing key</h3>
      <p class="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
        The browser generates an ECDSA P-256 keypair representing the
        manufacturer's delegated authority. The private key is encrypted with
        your passphrase and stored only in this browser. It is never transmitted.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="cnml-label">Passphrase (8 characters minimum)<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="passphrase" type="password" autocomplete="new-password" class="cnml-input" />
        </label>
        <label class="block">
          <span class="cnml-label">Confirm passphrase<span aria-hidden="true">*</span><span class="sr-only"> required</span></span>
          <input v-model="passphraseConfirm" type="password" autocomplete="new-password" class="cnml-input" />
        </label>
      </div>

      <div class="flex items-center gap-3 mt-6">
        <button @click="signInstance" :disabled="!formValid" class="cnml-btn cnml-btn-primary">
          Sign instance certificate
        </button>
        <div v-if="errorMessage" role="alert" class="text-sm cnml-text-danger">{{ errorMessage }}</div>
      </div>
    </div>

    <!-- Step 2: working -->
    <div v-else-if="step === 'working'" class="cnml-card text-center py-12">
      <div class="text-sm text-[var(--ink-muted)]">Generating key and signing certificate...</div>
    </div>

    <!-- Step 3: signed certificate and QR -->
    <div v-else class="space-y-6">
      <div class="cnml-card">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 class="cnml-section-title">Instance certificate signed</h2>
            <div class="text-xs text-[var(--ink-muted)] font-mono mt-1">
              Key: {{ keyAlias }} <span v-if="keyFingerprint">· {{ fingerprintShort(keyFingerprint) }}</span>
            </div>
          </div>
          <span class="cnml-tag cnml-badge-success">Valid</span>
        </div>

        <dl class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wider text-[var(--ink-muted)]">Manufacturer</dt>
            <dd class="text-[var(--ink)] mt-1">{{ manufacturerName }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-[var(--ink-muted)]">Model</dt>
            <dd class="text-[var(--ink)] mt-1">{{ modelName }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-[var(--ink-muted)]">Serial</dt>
            <dd class="text-[var(--ink)] mt-1 font-mono">{{ serialNumber }}</dd>
          </div>
        </dl>

        <div class="mt-4 text-sm">
          <span class="text-xs uppercase tracking-wider text-[var(--ink-muted)]">Certificate identifier</span>
          <div class="font-mono text-[var(--ink)] mt-1">{{ certId }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="cnml-card">
          <h3 class="cnml-section-title">QR code</h3>
          <p class="text-sm text-[var(--ink-muted)] mb-3 leading-relaxed">
            Print this QR code on the device body. A market surveillance officer
            scans it to reach the public passport page.
          </p>
          <div
            v-if="certId && qrSvg"
            class="mx-auto rounded border border-[var(--rule)] bg-white p-2 max-w-[256px]"
            v-html="qrSvg"
            :aria-label="`QR code for ${passportUrl}`"
            role="img"
          ></div>
          <div class="text-xs font-mono text-[var(--ink-muted)] mt-3 break-all text-center">
            {{ passportUrl }}
          </div>
          <a :href="`${baseUrl}qr-code?cert=${encodeURIComponent(certId)}`" class="cnml-btn cnml-btn-secondary mt-3 inline-block">
            Open QR code page
          </a>
        </div>

        <div class="cnml-card">
          <h3 class="cnml-section-title">Delivery</h3>
          <p class="text-sm text-[var(--ink-muted)] mb-3 leading-relaxed">
            Download the certificate bundle for archival or transmission to the
            SMI twin interface on SMART instruments.
          </p>
          <button @click="downloadBundle" class="cnml-btn cnml-btn-primary mb-2">
            Download certificate bundle
          </button>
          <a :href="`${baseUrl}passport/${certId}`" class="cnml-btn cnml-btn-secondary block">
            View passport page
          </a>
          <button @click="resetForm" class="cnml-btn cnml-btn-ghost mt-2">
            Sign another instrument
          </button>
        </div>
      </div>

      <details class="cnml-card">
        <summary class="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] cursor-pointer">
          Signed XML preview
        </summary>
        <pre class="cnml-code-pane mt-2 max-h-96 overflow-auto">{{ signedXml }}</pre>
      </details>
    </div>
  </div>
</template>
