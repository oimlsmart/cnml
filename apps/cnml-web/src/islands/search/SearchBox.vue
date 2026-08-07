<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string; description?: string };
  }>;
}

interface PagefindModule {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

const query = ref("");
const results = ref<Array<{ url: string; excerpt: string; title: string }>>([]);
const loading = ref(false);
const searched = ref(false);
const pagefind = ref<PagefindModule | null>(null);

onMounted(async () => {
  // Pagefind emits its runtime at /pagefind/pagefind.js under the
  // site base. The index is generated at build time (pnpm build runs
  // the pagefind CLI); in dev mode the file is absent and the import
  // would throw. Skip the load in dev so the console stays clean.
  if (import.meta.env.DEV) return;
  const base = import.meta.env.BASE_URL;
  try {
    pagefind.value = await import(`${base}pagefind/pagefind.js`) as PagefindModule;
  } catch (e) {
    console.error("Pagefind failed to load", e);
  }
});

const hasIndex = computed(() => pagefind.value !== null);

async function runSearch() {
  if (!query.value.trim() || !pagefind.value) return;
  loading.value = true;
  searched.value = true;
  try {
    const search = await pagefind.value.search(query.value);
    const top = search.results.slice(0, 20);
    const enriched = await Promise.all(
      top.map(async (r) => {
        const data = await r.data();
        return {
          url: data.url,
          excerpt: data.excerpt,
          title: data.meta?.title ?? data.url,
        };
      }),
    );
    results.value = enriched;
  } finally {
    loading.value = false;
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    query.value = "";
    results.value = [];
    searched.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex gap-2 mb-6">
      <input
        v-model="query"
        @keydown.enter="runSearch"
        @keydown="onKey"
        type="search"
        placeholder="Search the docs, audiences, and features..."
        aria-label="Search query"
        class="flex-1 cnml-input"
        :disabled="!hasIndex"
      />
      <button
        @click="runSearch"
        class="cnml-btn cnml-btn-primary"
        :disabled="!hasIndex || !query.trim()"
      >
        Search
      </button>
    </div>

    <p v-if="!hasIndex" class="text-sm text-[var(--ink-muted)]">
      The search index is built at deploy time. If the index is missing, the
      deploy is in progress or the build step did not run.
    </p>

    <p v-else-if="searched && !loading && results.length === 0" class="text-sm text-[var(--ink-muted)]">
      No results for "{{ query }}".
    </p>

    <ol v-if="results.length > 0" class="space-y-4">
      <li v-for="r in results" :key="r.url" class="cnml-card p-4">
        <a :href="r.url" class="block font-semibold text-[var(--ink)] hover:text-[var(--accent)]">
          {{ r.title }}
        </a>
        <p
          class="text-sm text-[var(--ink-muted)] mt-1"
          v-html="r.excerpt"
        />
      </li>
    </ol>
  </div>
</template>
