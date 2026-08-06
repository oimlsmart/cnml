<!--
  Counter — test fixture (TODO.cnml/51).

  This component is not mounted on any page. It exists only as a
  Vitest fixture for the Vue-island test harness
  (`_simple-islands.vitest.ts`). The accessibility doc mentions a
  "Counter component" as a conceptual example of button sizing;
  that reference is prose, not a literal reference to this file.

  Per the project's never-delete rule, the file is retained as a
  fixture rather than removed.
-->
<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <div class="p-4 rounded-lg border border-[var(--rule)] inline-flex items-center gap-3">
    <button
      @click="count--"
      aria-label="Decrease count"
      class="h-8 w-8 rounded bg-[var(--paper-raised)] border border-[var(--rule)]"
    >-</button>
    <span class="font-mono" aria-live="polite">{{ count }}</span>
    <button
      @click="count++"
      aria-label="Increase count"
      class="h-8 w-8 rounded bg-[var(--paper-raised)] border border-[var(--rule)]"
    >+</button>
  </div>
</template>
