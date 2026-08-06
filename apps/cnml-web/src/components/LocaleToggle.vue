<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getStoredLocale, setStoredLocale, type Locale } from "../composables/useLocale";

const current = ref<Locale>("en");

onMounted(() => {
  current.value = getStoredLocale();
});

function toggle() {
  const next: Locale = current.value === "en" ? "fr" : "en";
  setStoredLocale(next);
  current.value = next;
  // Reload to apply the new locale to any server-rendered strings.
  window.location.reload();
}
</script>

<template>
  <button
    @click="toggle"
    class="cnml-locale-toggle"
    :aria-label="current === 'en' ? 'Switch to French' : 'Switch to English'"
  >
    <span :class="{ 'font-bold': current === 'en' }">EN</span>
    <span aria-hidden="true"> | </span>
    <span :class="{ 'font-bold': current === 'fr' }">FR</span>
  </button>
</template>

<style scoped>
.cnml-locale-toggle {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--ink-muted);
  background: none;
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  transition: color 100ms ease, border-color 100ms ease;
}
.cnml-locale-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
