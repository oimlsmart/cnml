<script setup lang="ts">
import FieldLabel from "./FieldLabel.vue";
const props = defineProps<{ label: string; modelValue: string | number | null | undefined; placeholder?: string; type?: string; required?: boolean; hint?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();

// Coerce objects to strings for display. Sample data may contain
// nested objects where a schema field expects a scalar; showing
// [object Object] is worse than showing a JSON representation.
const displayValue = computed(() => {
  const v = props.modelValue;
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
});
</script>

<script lang="ts">
import { computed } from "vue";
</script>

<template>
  <label class="block">
    <FieldLabel :label="label" :required="required" />
    <input
      :type="type ?? 'text'"
      :value="displayValue"
      :placeholder="placeholder"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="cnml-input"
    />
    <span v-if="hint" class="block text-xs text-[var(--ink-muted)] mt-1">{{ hint }}</span>
  </label>
</template>
