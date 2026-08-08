<script setup lang="ts">
/**
 * FieldLabel — shared label + required-indicator for form fields.
 *
 * Every form widget (TextInput, EnumSelect) renders the same label
 * structure: a cnml-label span with the label text and a bold asterisk
 * when the field is required. This widget keeps the markup consistent
 * and adds an sr-only "required" annotation for screen readers.
 */
defineProps<{ label: string; required?: boolean }>();
</script>

<template>
  <span class="cnml-label">
    {{ label }}
    <span v-if="required" class="text-[var(--ink)] normal-case font-bold">*</span>
    <span v-if="required" class="sr-only"> required</span>
  </span>
</template>
