<script setup lang="ts">
// Reading-progress and back-to-top affordances for docs pages
// (TODO.cnml/39).
//
// Two small UI elements, mounted only on docs routes:
//
//   1. A 2px progress bar fixed to the top of the viewport. Width
//      tracks scroll position. Hidden until the user has scrolled
//      past 5% (avoid noise at the top of the page).
//
//   2. A circular "back to top" button fixed to the bottom-right,
//      visible only after one viewport of scroll.
//
// Both are progressive enhancements. If JS fails to load, neither
// appears; the page is fully usable without them.
//
// A single scroll listener with rAF throttling. No layout thrash.

import { ref, onMounted, onUnmounted } from "vue";

const progress = ref(0);
const showProgress = ref(false);
const showBackToTop = ref(false);
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? scrollTop / max : 0;
    progress.value = Math.min(100, Math.max(0, pct * 100));
    showProgress.value = pct > 0.05;
    showBackToTop.value = scrollTop > doc.clientHeight;
    ticking = false;
  });
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <div
    v-if="showProgress"
    class="cnml-reading-progress"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Reading progress"
  >
    <div class="cnml-reading-progress__bar" :style="{ width: `${progress}%` }" />
  </div>
  <button
    v-if="showBackToTop"
    @click="backToTop"
    class="cnml-back-to-top"
    aria-label="Back to top"
  >
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 16V4M4 10l6-6 6 6"/>
    </svg>
  </button>
</template>

<style scoped>
.cnml-reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  z-index: 50;
  pointer-events: none;
}
.cnml-reading-progress__bar {
  height: 100%;
  background: var(--accent);
  transition: width 80ms linear;
}
.cnml-back-to-top {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--paper-raised);
  border: 1px solid var(--rule);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background 120ms ease, transform 120ms ease;
}
.cnml-back-to-top:hover {
  background: var(--accent-soft);
  transform: translateY(-2px);
}
</style>
