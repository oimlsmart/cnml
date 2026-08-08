<script setup lang="ts">
import FieldLabel from "./FieldLabel.vue";
defineProps<{
  label: string;
  modelValue: string | null | undefined;
  options: { value: string; description?: string }[];
  required?: boolean;
}>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="block">
    <FieldLabel :label="label" :required="required" />
    <select
      :value="modelValue ?? ''"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="cnml-select"
    >
      <option value="" disabled>Select…</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.value }}{{ opt.description ? ` — ${opt.description}` : "" }}
      </option>
    </select>
  </label>
</template>
