<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import QRCode from "qrcode";

// Astro BASE_URL ("/" in dev, "/cnml/" in prod).
const baseUrl = import.meta.env.BASE_URL as string;

const certId = ref("");
const label = ref("");
const qrSvg = ref("");
const qrError = ref("");

onMounted(() => {
  // Pre-populate the certificate identifier from the URL query string if
  // the issuing flow linked here with the cert id already known.
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("cert");
  if (fromUrl) certId.value = fromUrl;
});

const passportUrl = computed(() => {
  const id = certId.value.trim();
  if (!id) return "";
  return `https://www.oimlsmart.org/cnml/passport/${id}`;
});

// Regenerate the QR SVG locally whenever the passport URL changes.
// Error correction level M (15 percent recovery). Version auto-detected
// by the qrcode library based on input length. No network calls.
watch(passportUrl, async (url) => {
  qrSvg.value = "";
  qrError.value = "";
  if (!url) return;
  try {
    qrSvg.value = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 300,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch (e) {
    qrError.value = (e as Error).message;
  }
}, { immediate: false });

function downloadPreviewSvg() {
  if (!qrSvg.value || !passportUrl.value) return;
  const id = certId.value.trim().replace(/[^\w.-]/g, "_") || "cnml-qr";
  const labelText = label.value.trim();
  const inner = qrSvg.value;
  // The qrcode library returns an <svg> fragment. Wrap with optional
  // label below the code, preserving vector quality for print output.
  const labelTextXml = labelText
    ? `<text x="150" y="330" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="14" fill="#111">${escapeXml(labelText)}</text>`
    : "";
  const height = labelText ? 350 : 300;
  // Replace the inner <svg ...> opening tag's width/height/viewBox to fit
  // our canvas, then append the label. Simplest: extract the inner body
  // between the first <svg ...> and the closing </svg>.
  const bodyMatch = inner.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const body = bodyMatch ? bodyMatch[1] : "";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${height}" viewBox="0 0 300 ${height}">
  <rect width="300" height="${height}" fill="#ffffff"/>
  <g transform="translate(0,0)">${body}</g>
  ${labelTextXml}
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const dlUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = dlUrl;
  a.download = `${id}.qr.svg`;
  a.click();
  URL.revokeObjectURL(dlUrl);
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  }[c]!));
}
</script>

<template>
  <div class="space-y-6">
    <div class="cnml-card">
      <h2 class="cnml-section-title">Certificate identifier</h2>
      <p class="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
        Enter the CNML instance certificate identifier. The QR code encodes
        the passport URL that resolves to the public passport page for that
        certificate.
      </p>
      <label class="block mb-4">
        <span class="cnml-label">Certificate identifier</span>
        <input v-model="certId" autocomplete="off" placeholder="CNML-1A2B3C4D5E6F7G8H" class="cnml-input font-mono" />
      </label>
      <label class="block">
        <span class="cnml-label">Label (optional, printed below the code)</span>
        <input v-model="label" autocomplete="off" placeholder="Acme LC-500 SN-2026-00001" class="cnml-input" />
      </label>
    </div>

    <div v-if="passportUrl" class="cnml-card">
      <h3 class="cnml-section-title">Preview</h3>
      <div class="flex flex-col items-center gap-3 py-4">
        <div
          v-if="qrSvg"
          class="rounded border border-[var(--rule)] bg-white p-2"
          v-html="qrSvg"
          :aria-label="`QR code for ${passportUrl}`"
          role="img"
        ></div>
        <div v-else-if="qrError" class="text-sm text-[var(--danger)]">
          QR generation failed: {{ qrError }}
        </div>
        <div v-else class="text-sm text-[var(--ink-muted)]">Generating QR code…</div>
        <div v-if="label.trim()" class="text-sm text-[var(--ink)] text-center max-w-[300px]">
          {{ label.trim() }}
        </div>
        <div class="text-xs font-mono text-[var(--ink-muted)] break-all text-center max-w-[300px]">
          {{ passportUrl }}
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="downloadPreviewSvg" class="cnml-btn cnml-btn-primary" :disabled="!qrSvg">Download SVG</button>
        <a :href="`${baseUrl}passport/${certId.trim()}`" class="cnml-btn cnml-btn-secondary">Open passport page</a>
      </div>
      <p class="text-xs text-[var(--ink-muted)] mt-3 leading-relaxed">
        Generated locally in your browser using error correction level M
        (15 percent recovery). No data leaves your device.
      </p>
    </div>

    <div v-else class="cnml-card cnml-card--raised text-[var(--ink-muted)] text-sm">
      Enter a certificate identifier to see the QR code preview.
    </div>
  </div>
</template>
