<script setup lang="ts">
import { computed } from "vue";
import TextInput from "./TextInput.vue";

interface StructuredValue {
  value?: number | string | { min?: number | "N/A"; max?: number | "N/A" } | (string | number)[];
  unit_id?: string;
  unit_symbol?: string;
  footnote_markers?: string[];
  _qualifier?: string;
  _note?: string;
}

const props = withDefaults(defineProps<{
  label: string;
  modelValue?: StructuredValue;
  valueKind?: "scalar" | "range" | "list" | "enum";
  enumOptions?: { value: string; description?: string }[];
  unitOptions?: string[];
}>(), {
  modelValue: () => ({ value: "" }),
  valueKind: "scalar",
});

const emit = defineEmits<{ "update:modelValue": [value: StructuredValue] }>();

// Defensive accessor — parent state may be initialising.
const mv = computed(() => props.modelValue ?? { value: "" });
const valueOrObj = computed(() => mv.value.value ?? "");

function setValue(path: string, val: unknown) {
  const next: StructuredValue = { ...mv.value };
  if (path === "value")        next.value = val as StructuredValue["value"];
  else if (path === "min")     {
    const cur = typeof next.value === "object" && next.value !== null && !Array.isArray(next.value)
      ? next.value
      : {};
    next.value = { ...cur, min: val as number | "N/A" };
  }
  else if (path === "max")     {
    const cur = typeof next.value === "object" && next.value !== null && !Array.isArray(next.value)
      ? next.value
      : {};
    next.value = { ...cur, max: val as number | "N/A" };
  }
  else if (path === "unit_id") next.unit_id = val as string;
  emit("update:modelValue", next);
}
</script>

<template>
  <fieldset
    class="rounded-xl border border-[var(--rule)] p-4 bg-[var(--paper-raised)]"
  >
    <legend class="text-sm font-semibold px-1">{{ label }}</legend>
    <div class="text-xs text-[var(--ink-muted)] mb-3">{{ valueKind ?? "scalar" }}</div>

    <!-- Range -->
    <div v-if="valueKind === 'range'" class="flex gap-2 items-center">
      <label class="block flex-1">
        <span class="sr-only">Minimum value for {{ label }}</span>
        <input
          :value="(valueOrObj as { min?: number })?.min ?? ''"
          type="number" placeholder="min"
          @input="setValue('min', Number(($event.target as HTMLInputElement).value))"
          class="cnml-input w-24"
        />
      </label>
      <span class="text-[var(--ink-muted)]" aria-hidden="true">…</span>
      <label class="block flex-1">
        <span class="sr-only">Maximum value for {{ label }}</span>
        <input
          :value="(valueOrObj as { max?: number })?.max ?? ''"
          type="number" placeholder="max"
          @input="setValue('max', Number(($event.target as HTMLInputElement).value))"
          class="cnml-input w-24"
        />
      </label>
    </div>

    <!-- Enum -->
    <label v-else-if="valueKind === 'enum' && enumOptions" class="block">
      <span class="sr-only">{{ label }}</span>
      <select
        :value="(valueOrObj as string) ?? ''"
        @change="setValue('value', ($event.target as HTMLSelectElement).value)"
        class="cnml-select"
      >
        <option value="" disabled>Select…</option>
        <option v-for="opt in enumOptions" :key="opt.value" :value="opt.value">
          {{ opt.value }}{{ opt.description ? ` — ${opt.description}` : "" }}
        </option>
      </select>
    </label>

    <!-- Scalar -->
    <label v-else class="block">
      <span class="sr-only">{{ label }}</span>
      <input
        :value="(valueOrObj as string) ?? ''"
        @input="setValue('value', ($event.target as HTMLInputElement).value)"
        class="cnml-input"
      />
    </label>

    <!-- Unit picker -->
    <div v-if="unitOptions?.length" class="mt-2">
      <label class="block">
        <span class="sr-only">Unit for {{ label }}</span>
        <select
          :value="mv.unit_id ?? ''"
          @change="setValue('unit_id', ($event.target as HTMLSelectElement).value)"
          class="cnml-select text-xs"
        >
          <option value="">no unit</option>
          <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
        </select>
      </label>
    </div>
  </fieldset>
</template>

