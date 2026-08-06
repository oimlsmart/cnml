<script setup lang="ts">
// On-this-page navigation for docs (TODO.cnml/42).
//
// Renders the entries (computed at build time by extractToc) and
// uses IntersectionObserver to highlight the section currently in
// view. Two variants: "inline" (mobile, collapsible) and "sticky"
// (desktop sidebar).

import { ref, onMounted, onUnmounted, type PropType } from "vue";

interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

const props = defineProps({
  entries: {
    type: Array as PropType<TocEntry[]>,
    required: true,
  },
  variant: {
    type: String as PropType<"inline" | "sticky">,
    default: "inline",
  },
});

const activeSlug = ref<string>("");
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Observe each heading element. When one enters the top 30% of
  // the viewport, mark it active.
  const headings = props.entries
    .map((e) => document.getElementById(e.slug))
    .filter((el): el is HTMLElement => el !== null);

  if (headings.length === 0) return;

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        activeSlug.value = visible[0]!.target.id;
      }
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
  );

  for (const h of headings) observer.observe(h);
});

onUnmounted(() => {
  observer?.disconnect();
});

function onClick(e: MouseEvent, slug: string) {
  e.preventDefault();
  const el = document.getElementById(slug);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${slug}`);
  }
}
</script>

<template>
  <div :class="['docs-toc', `docs-toc--${variant}`]">
    <div class="docs-toc__heading">On this page</div>
    <ul class="docs-toc__list">
      <li
        v-for="entry in entries"
        :key="entry.slug"
        :class="['docs-toc__item', `docs-toc__item--l${entry.level}`]"
      >
        <a
          :href="`#${entry.slug}`"
          @click="(e) => onClick(e, entry.slug)"
          :class="{ 'docs-toc__link--active': activeSlug === entry.slug }"
          class="docs-toc__link"
        >{{ entry.text }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.docs-toc__heading {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-muted);
  margin-bottom: 0.5rem;
}
.docs-toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.docs-toc__item--l3 {
  padding-left: 0.75rem;
  font-size: 0.85em;
}
.docs-toc__link {
  display: block;
  color: var(--ink-muted);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.3;
  padding: 0.125rem 0;
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  transition: color 100ms ease, border-color 100ms ease;
}
.docs-toc__link:hover {
  color: var(--accent);
}
.docs-toc__link--active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}
</style>
