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
