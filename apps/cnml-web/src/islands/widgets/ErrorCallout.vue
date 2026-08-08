<script setup lang="ts">
/**
 * ErrorCallout — shared error display for Vue islands.
 *
 * Every interactive island (SignDialog, KeyManager, VerifyDrop,
 * ManufacturerInstanceFlow) renders the same error markup: a
 * role="alert" div with cnml-callout--error classes. This widget
 * keeps the markup and ARIA consistent across components.
 *
 * Pass `message` as a reactive ref or string. When empty, the
 * callout renders nothing.
 */
defineProps<{ message: string }>();
</script>

<template>
  <div
    v-if="message"
    role="alert"
    aria-live="assertive"
    class="cnml-callout cnml-callout--error mt-4"
  >
    {{ message }}
  </div>
</template>
