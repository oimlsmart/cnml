<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Astro BASE_URL ("/" in dev, "/cnml/" in prod).
const baseUrl = import.meta.env.BASE_URL as string;

const certId = ref("");
const label = ref("");

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

const previewSrc = computed(() => {
  if (!passportUrl.value) return "";
  const target = encodeURIComponent(passportUrl.value);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecclevel=M&data=${target}`;
});

function downloadPreviewSvg() {
  // The QR code is rasterized by the external service. Provide a small
  // SVG wrapper that embeds the preview as an image, so the user has a
  // downloadable file. Users needing a vector QR for print production
  // should regenerate from the passport URL using a dedicated tool.
  if (!previewSrc.value || !passportUrl.value) return;
  const id = certId.value.trim().replace(/[^\w.-]/g, "_") || "cnml-qr";
  const labelText = label.value.trim();
  const labelXml = labelText
    ? `<text x="150" y="330" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="14" fill="#111">${escapeXml(labelText)}</text>`
    : "";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${labelText ? 350 : 300}" viewBox="0 0 300 ${labelText ? 350 : 300}">
  <rect width="300" height="${labelText ? 350 : 300}" fill="#ffffff"/>
  <image href="${escapeXml(previewSrc.value)}" x="0" y="0" width="300" height="300"/>
  ${labelXml}
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
        <img
          v-if="previewSrc"
          :src="previewSrc"
          :alt="`QR code for ${passportUrl}`"
          width="300"
          height="300"
          class="rounded border border-[var(--rule)] bg-white"
        />
        <div v-if="label.trim()" class="text-sm text-[var(--ink)] text-center max-w-[300px]">
          {{ label.trim() }}
        </div>
        <div class="text-xs font-mono text-[var(--ink-muted)] break-all text-center max-w-[300px]">
          {{ passportUrl }}
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="downloadPreviewSvg" class="cnml-btn cnml-btn-primary">Download SVG</button>
        <a :href="`${baseUrl}passport/${certId.trim()}`" class="cnml-btn cnml-btn-secondary">Open passport page</a>
      </div>
      <p class="text-xs text-[var(--ink-muted)] mt-3 leading-relaxed">
        The preview uses error correction level M (15 percent recovery).
        For vector output at production scale, regenerate the QR code from
        the passport URL using a dedicated QR tool.
      </p>
    </div>

    <div v-else class="cnml-card cnml-card--raised text-[var(--ink-muted)] text-sm">
      Enter a certificate identifier to see the QR code preview.
    </div>
  </div>
</template>
