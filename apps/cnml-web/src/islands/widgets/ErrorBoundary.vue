<script setup lang="ts">
// Error boundary for Vue islands (TODO.cnml/41).
//
// Wraps an island so that a hydration-time throw is caught and
// rendered as an actionable fallback. Without this, a thrown
// setup() or lifecycle hook leaves the SSR content visible but
// dead — the user sees the dropzone but the file-drop handler
// does nothing.
//
// The boundary is itself an island (mounted client:load). When
// its child throws during the child's hydration, the
// onErrorCaptured hook fires and we swap to the fallback slot.
//
// What is NOT caught:
//   - Event-handler throws (Vue lets you handle those locally)
//   - setTimeout / rAF callbacks
//   - Async errors after the first await (island must wrap in
//     try/catch and set its own reactive error)
//
// The boundary is the backstop for the errors that escape the
// island's own handling.

import { ref, onErrorCaptured } from "vue";

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err as Error;
  // Log to the console for debuggability — the boundary does not
  // eat the trace, it just stops the global handler from spamming
  // the user's screen.
  console.error("[island error]", err);
  return false;
});

function reload() {
  window.location.reload();
}
</script>

<template>
  <div v-if="error" class="cnml-island-error" role="alert">
    <p class="font-semibold text-[var(--ink)]">This section could not load.</p>
    <p class="text-sm text-[var(--ink-muted)] mt-1">
      {{ error.message }}
    </p>
    <button class="cnml-btn cnml-btn-secondary mt-3" @click="reload">
      Reload page
    </button>
  </div>
  <slot v-else />
</template>

<style scoped>
.cnml-island-error {
  padding: 1.5rem;
  border: 1px solid var(--rule);
  border-left: 4px solid #b91c1c;
  background: var(--paper-raised);
  border-radius: 0.5rem;
}
</style>
