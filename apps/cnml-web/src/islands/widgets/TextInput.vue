<script setup lang="ts">
import FieldLabel from "./FieldLabel.vue";
defineProps<{ label: string; modelValue: string | number | null | undefined; placeholder?: string; type?: string; required?: boolean; hint?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="block">
    <FieldLabel :label="label" :required="required" />
    <input
      :type="type ?? 'text'"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="cnml-input"
    />
    <span v-if="hint" class="block text-xs text-[var(--ink-muted)] mt-1">{{ hint }}</span>
  </label>
</template>
