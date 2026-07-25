<script setup lang="ts">
defineProps<{ label: string; modelValue: string | number | null | undefined; placeholder?: string; type?: string; required?: boolean; hint?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="block">
    <span class="cnml-label">
      {{ label }}
      <span v-if="required" class="text-[var(--ink)] normal-case font-bold">*</span>
    </span>
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
