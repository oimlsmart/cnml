<script setup lang="ts">
/**
 * SchemaForm — generic, recursive JSON-Schema-driven form builder.
 *
 * The schema IS the spec. If a field needs special rendering, the schema
 * declares it via standard JSON Schema (`type`, `format`, `oneOf`, `enum`)
 * or `x-oiml-*` UI hints (`x-oiml-widget`, `x-oiml-section`). There are no
 * bespoke per-Recommendation Vue components — adding a new R only requires
 * dropping its schema YAML into packages/cnml-schemas/src/schemas/.
 *
 * Rendering rules (in priority order):
 *   1. `oneOf` with `const` → enum select
 *   2. `allOf` referencing StructuredValue → StructuredValueEditor
 *      (which itself switches between scalar / range / enum / list modes
 *      based on the inner schema)
 *   3. `type: object` → recurse as a nested fieldset
 *   4. `type: array` → list editor
 *   5. `type: boolean` → checkbox
 *   6. `type: integer|number` → number input
 *   7. `format: date` → date input
 *   8. Otherwise → text input
 *
 * `x-oiml-section` annotations (string) group sibling fields into
 * visually distinct cards within the same parent object.
 */
import { reactive, computed, watch, ref } from "vue";
import TextInput from "../widgets/TextInput.vue";
import EnumSelect from "../widgets/EnumSelect.vue";
import StructuredValueEditor from "../widgets/StructuredValueEditor.vue";
import SignDialog from "../SignDialog.vue";
import { downloadBlob } from "../shared/dom";
import { useSampleManager } from "./useSampleManager";

defineOptions({ name: "SchemaForm" });  // enables self-recursion in template

interface Props {
  schema: any;
  rId?: string;
  shortTitle?: string;
  modelValue?: any;
  sample?: any;
  samples?: string;
  /** Depth in the tree — 0 for the root, increments on recursion. */
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), { depth: 0 });
const emit = defineEmits<{ "update:modelValue": [value: any] }>();

const defs = computed(() => props.schema?.definitions ?? {});

// ─── Default-value derivation (mirrors schema, including nested objects) ───
function makeDefaults(schema: any): any {
  if (!schema) return undefined;
  const r = resolveAllOf(schema) ?? schema;
  if (!r) return undefined;
  if (r.$ref) {
    // Cross-file $refs (e.g., "_core.yaml#/definitions/...") can't be
    // resolved at runtime — only same-file refs. Return an empty object
    // so the form doesn't crash; nested fields show as empty placeholders.
    const resolved = resolveRef(r.$ref);
    return resolved ? makeDefaults(resolved) : {};
  }
  if (r.allOf) {
    const merged: any = {};
    for (const part of r.allOf) {
      const sub = makeDefaults(part);
      if (sub && typeof sub === "object") Object.assign(merged, sub);
    }
    return merged;
  }
  if (r.type === "object" && r.properties) {
    const obj: Record<string, unknown> = {};
    for (const [name, subSchema] of Object.entries<any>(r.properties)) {
      obj[name] = makeDefaults(subSchema) ?? null;
    }
    return obj;
  }
  if (r.type === "array") return [];
  if (r.const !== undefined) return r.const;
  if (r.default !== undefined) return r.default;
  if (r.type === "string") return "";
  if (r.type === "integer" || r.type === "number") return null;
  if (r.type === "boolean") return false;
  return undefined;
}

function resolveRef($ref: string): any {
  if ($ref.startsWith("#/definitions/")) {
    return defs.value[$ref.slice("#/definitions/".length)];
  }
  return undefined;
}

function resolveAllOf(schema: any): any {
  if (!schema) return schema;
  if (schema.$ref) return resolveAllOf(resolveRef(schema.$ref));
  if (schema.allOf) {
    for (const part of schema.allOf) {
      const resolved = resolveAllOf(part);
      if (resolved?.type === "object" && resolved.properties) return resolved;
    }
  }
  return schema;
}

function extractEnum(oneOf: any[] | undefined): { value: string; description?: string }[] {
  if (!oneOf) return [];
  return oneOf
    .filter((s: any) => s.const !== undefined)
    .map((s: any) => ({ value: String(s.const), description: s.description }));
}

// Root-level state (depth 0 only). Nested levels mutate their parent's
// reactive state directly via v-model — Vue's reactivity propagates.
const state = reactive(makeDefaults(props.schema) ?? {});

watch(state, (v) => emit("update:modelValue", v), { deep: true });

const signOpen = ref(false);

function loadSampleData(s: any) {
  if (!s) return;
  for (const key of Object.keys(s)) {
    (state as Record<string, unknown>)[key] = (s as Record<string, unknown>)[key];
  }
}

const {
  allSamples,
  currentSampleFilename,
  selectSample,
  loadFirst,
} = useSampleManager<any>({
  samplesJson: () => props.samples,
  loadInto: loadSampleData,
});

function loadDemo() {
  loadSampleData(props.sample);
  const first = loadFirst();
  if (first) currentSampleFilename.value = first.filename;
}

function resetForm() {
  const fresh = makeDefaults(props.schema);
  if (fresh) {
    for (const key of Object.keys(state as Record<string, unknown>)) {
      delete (state as Record<string, unknown>)[key];
    }
    Object.assign(state, fresh);
  }
}

// ─── Property walking ────────────────────────────────────────────────────

type FieldKind = "object" | "structured-value" | "enum" | "scalar-string" | "scalar-number" | "boolean" | "array";

function fieldKind(propSchema: any): FieldKind {
  const resolved = resolveAllOf(propSchema);
  if (resolved?.type === "object") return "object";
  if (propSchema?.allOf?.some((s: any) => s.$ref?.includes("StructuredValue"))) return "structured-value";
  if (propSchema?.allOf?.some((s: any) => s.properties?.value?.oneOf)) return "enum";
  if (resolved?.oneOf) return "enum";
  if (resolved?.type === "array") return "array";
  if (resolved?.type === "boolean") return "boolean";
  if (resolved?.type === "number" || resolved?.type === "integer") return "scalar-number";
  return "scalar-string";
}

function enumFromProp(propSchema: any): { value: string; description?: string }[] {
  const allOfNarrowing = propSchema?.allOf?.find((s: any) => s.properties?.value?.oneOf);
  if (allOfNarrowing) return extractEnum(allOfNarrowing.properties.value.oneOf);
  return extractEnum(propSchema?.oneOf);
}

function humanize(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Top-level properties, derived from the resolved schema.
const topProps = computed(() => {
  const root = resolveAllOf(props.schema);
  return root?.properties ? Object.entries<any>(root.properties) : [];
});

function onSigned(xml: string) {
  signOpen.value = false;
  const num = (state as any)?.certificate?.number ?? "cnml-cert";
  downloadBlob(xml, `${num.replace(/[^A-Za-z0-9._-]/g, "-")}.cnml.xml`, "application/xml");
}

// Save the current form state as a YAML file. Generic — works for any R.
async function saveYaml() {
  const yamlModule = await import("yaml");
  const text = "---\n" + yamlModule.default.stringify(state) + "\n";
  const num = (state as any)?.certificate?.number ?? props.rId ?? "cnml-cert";
  downloadBlob(text, `${String(num).replace(/[^A-Za-z0-9._-]/g, "-")}.yaml`, "text/yaml");
}
</script>

<template>
  <div class="space-y-6">
    <!-- Demo toolbar (root only — nested recursion doesn't show this) -->
    <div v-if="depth === 0" class="cnml-toolbar">
      <div class="flex-1 min-w-[200px]">
        <label class="cnml-label" for="cnml-sample-select">Sample data</label>
        <select
          v-if="allSamples.length > 0"
          id="cnml-sample-select"
          :value="currentSampleFilename ?? ''"
          @change="(e) => selectSample((e.target as HTMLSelectElement).value)"
          class="cnml-select mt-1 max-w-md"
        >
          <option value="" disabled>Select a real cert…</option>
          <option v-for="s in allSamples" :key="s.filename" :value="s.filename">
            {{ s.data?.certificate?.number ?? s.filename }}
          </option>
        </select>
        <div v-else class="text-xs text-[var(--ink-muted)]">No bundled samples — top-level scalars only.</div>
      </div>
      <div class="flex gap-2">
        <button v-if="sample" type="button" @click="loadDemo" class="cnml-btn cnml-btn-primary">Fill demo data</button>
        <button type="button" @click="resetForm" class="cnml-btn cnml-btn-secondary">Reset</button>
        <button type="button" @click="saveYaml" class="cnml-btn cnml-btn-secondary">Save YAML ↓</button>
        <button type="button" @click="signOpen = true" class="cnml-btn cnml-btn-primary">Sign and download CNML</button>
      </div>
    </div>

    <!-- Recursive field rendering -->
    <section
      v-for="([propName, propSchema]) in topProps"
      :key="propName"
      :class="depth === 0 ? 'cnml-card' : ''"
    >
      <h3 v-if="depth === 0" class="cnml-section-title">{{ humanize(propName) }}</h3>
      <h4 v-else class="font-serif font-semibold text-base text-[var(--ink)] mb-2">{{ humanize(propName) }}</h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <template v-if="fieldKind(propSchema) === 'object'">
          <!-- Recurse into nested object: SchemaForm renders itself with the
               nested schema + nested state. Vue's reactivity propagates
               changes up through the shared reactive() tree. -->
          <div class="col-span-2">
            <SchemaForm
              :schema="resolveAllOf(propSchema)"
              :depth="depth + 1"
              v-model="state[propName]"
            />
          </div>
        </template>

        <template v-else-if="fieldKind(propSchema) === 'structured-value'">
          <StructuredValueEditor
            :label="humanize(propName)"
            v-model="state[propName]"
            value-kind="scalar"
          />
        </template>

        <template v-else-if="fieldKind(propSchema) === 'enum'">
          <EnumSelect
            :label="humanize(propName)"
            v-model="state[propName]"
            :options="enumFromProp(propSchema)"
          />
        </template>

        <template v-else-if="fieldKind(propSchema) === 'boolean'">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="state[propName]" />
            {{ humanize(propName) }}
          </label>
        </template>

        <template v-else>
          <TextInput
            :label="humanize(propName)"
            :type="fieldKind(propSchema) === 'scalar-number' ? 'number' : 'text'"
            v-model="state[propName]"
          />
        </template>
      </div>
    </section>

    <details v-if="depth === 0" class="cnml-card">
      <summary class="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] cursor-pointer">Live JSON preview</summary>
      <pre class="cnml-code-pane mt-4">{{ JSON.stringify(state, null, 2) }}</pre>
    </details>

    <SignDialog v-if="depth === 0" :cert="state" :open="signOpen" @close="signOpen = false" @signed="onSigned" />
  </div>
</template>
