<script setup lang="ts">
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
    <span class="cnml-label">
      {{ label }}
      <span v-if="required" class="text-[var(--ink)] normal-case font-bold">*</span>
    </span>
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
