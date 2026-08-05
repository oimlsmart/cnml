<script setup lang="ts">
/**
 * NavDropdown — navigation dropdown for the CNML site header.
 *
 * Opens on hover (desktop) and on click (mobile/keyboard). Closes on
 * click-outside, on Escape, and on mouseleave (with a short delay so
 * the user can cross the gap between button and panel).
 *
 * Adding a new dropdown = adding a config entry in Base.astro, not
 * creating a new component.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface NavLink {
  readonly label: string
  readonly href: string
  readonly desc?: string
}

export interface NavDropdownConfig {
  readonly id: string
  readonly label: string
  readonly links: readonly NavLink[]
}

const props = defineProps<{
  config: NavDropdownConfig
  currentPath: string
}>()

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

function isLinkActive(href: string, currentPath: string): boolean {
  const normalized = href.replace(/\/$/, '')
  if (normalized === '') return currentPath === '/'
  return currentPath === href || currentPath.startsWith(href.endsWith('/') ? href : href + '/')
}

const isActive = () => props.config.links.some(link => isLinkActive(link.href, props.currentPath))
const activeClass = (href: string) => isLinkActive(href, props.currentPath) ? 'is-active' : ''

function toggle() {
  isOpen.value = !isOpen.value
}

function onEnter() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  isOpen.value = true
}

function onLeave() {
  closeTimer = setTimeout(() => { isOpen.value = false }, 150)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

function onDocumentClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<template>
  <div
    ref="root"
    class="cnml-nav-dropdown"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <button
      class="cnml-nav__link cnml-nav-dropdown__trigger"
      :class="{ 'is-active': isActive(), 'is-open': isOpen }"
      @click="toggle"
      :data-testid="`nav-dropdown-${config.id}`"
      :aria-label="config.label"
      :aria-expanded="isOpen"
    >
      <span>{{ config.label }}</span>
      <span class="cnml-nav-dropdown__caret" aria-hidden="true">▾</span>
    </button>
    <div
      class="cnml-nav-dropdown__panel"
      :class="{ 'is-open': isOpen }"
    >
      <a
        v-for="link in config.links"
        :key="link.href"
        :href="link.href"
        class="cnml-nav-dropdown__link"
        :class="activeClass(link.href)"
      >
        <div class="cnml-nav-dropdown__link-label">{{ link.label }}</div>
        <div v-if="link.desc" class="cnml-nav-dropdown__link-desc">{{ link.desc }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.cnml-nav-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.cnml-nav-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font: inherit;
}
.cnml-nav-dropdown__caret {
  font-size: 0.625rem;
  color: var(--ink-muted);
  transition: transform var(--bp-transition-fast);
}
.cnml-nav-dropdown__trigger.is-open .cnml-nav-dropdown__caret {
  transform: rotate(180deg);
}

.cnml-nav-dropdown__panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  min-width: 16rem;
  background: var(--paper-soft);
  border: 1px solid var(--rule);
  border-radius: var(--bp-radius-md);
  padding: 0.375rem;
  box-shadow: var(--bp-shadow-md);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  /* Hidden state */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity var(--bp-transition-fast), transform var(--bp-transition-fast), visibility var(--bp-transition-fast);
}
.cnml-nav-dropdown__panel.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.cnml-nav-dropdown__link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: var(--bp-radius-sm);
  color: var(--ink-soft);
  text-decoration: none;
  transition: background var(--bp-transition-fast), color var(--bp-transition-fast);
}
.cnml-nav-dropdown__link:hover {
  background: var(--accent-soft);
  color: var(--accent);
  text-decoration: none;
}
.cnml-nav-dropdown__link.is-active {
  color: var(--accent);
  font-weight: 500;
}
.cnml-nav-dropdown__link-label {
  font-size: 0.875rem;
}
.cnml-nav-dropdown__link-desc {
  font-size: 0.75rem;
  color: var(--ink-muted);
  margin-top: 0.125rem;
}

/* On narrow viewports, force the dropdown panel to span the available
   width so links don't overflow. */
@media (max-width: 768px) {
  .cnml-nav-dropdown__panel {
    min-width: 12rem;
  }
}
</style>
