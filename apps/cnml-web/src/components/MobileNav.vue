<script setup lang="ts">
/**
 * MobileNav — full-screen slide-in mobile navigation for the CNML site.
 *
 * Triggered by a hamburger button in the header (below the md
 * breakpoint). Dropdown sections expand as accordions. The theme
 * toggle lives at the bottom of the panel.
 */
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

// Astro passes data-astro-cid-* attributes to every island component.
// MobileNav renders a fragment (trigger button + slide-in panel), so
// Vue can't auto-inherit the attribute. Disable inheritance to silence
// the "extraneous non-props attributes" warning.
defineOptions({ inheritAttrs: false })
import { useFocusTrap } from '../islands/shared/useFocusTrap'
import type { NavDropdownConfig } from './NavDropdown.vue'

export interface MobileNavItem {
  readonly type: 'dropdown' | 'link'
  readonly label: string
  readonly href?: string
  readonly config?: NavDropdownConfig
}

const props = defineProps<{
  items: readonly MobileNavItem[]
}>()

const isOpen = ref(false)
const expandedSection = ref<string | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const { isDark, toggle: toggleTheme } = useTheme()

useFocusTrap(isOpen, panelRef, () => {
  isOpen.value = false
  document.body.style.overflow = ''
})

function toggleMenu() {
  isOpen.value = !isOpen.value
  document.body.style.overflow = isOpen.value ? 'hidden' : ''
}

function toggleSection(id: string) {
  expandedSection.value = expandedSection.value === id ? null : id
}

function closeMenu() {
  isOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  // Close on Escape
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) closeMenu()
  })
})
</script>

<template>
  <!-- Hamburger trigger button -->
  <button
    class="cnml-mobile-nav__trigger"
    @click="toggleMenu"
    aria-label="Open menu"
    :aria-expanded="isOpen"
  >
    <span class="cnml-mobile-nav__bar" :class="{ 'is-open-1': isOpen }"></span>
    <span class="cnml-mobile-nav__bar" :class="{ 'is-open-2': isOpen }"></span>
    <span class="cnml-mobile-nav__bar" :class="{ 'is-open-3': isOpen }"></span>
  </button>

  <!-- Full-screen mobile nav overlay -->
  <Transition name="mobile-nav">
    <div v-if="isOpen" ref="panelRef" class="cnml-mobile-nav__overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <!-- Panel header with close -->
      <div class="cnml-mobile-nav__header">
        <span class="cnml-mobile-nav__title">CNML</span>
        <button
          class="cnml-mobile-nav__close"
          @click="closeMenu"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 5 L15 15 M15 5 L5 15" />
          </svg>
        </button>
      </div>

      <!-- Nav items -->
      <div class="cnml-mobile-nav__body">
        <template v-for="(item, i) in items" :key="i">
          <!-- Dropdown section -->
          <div v-if="item.type === 'dropdown' && item.config">
            <button
              class="cnml-mobile-nav__section"
              @click="toggleSection(item.config.id)"
              :aria-expanded="expandedSection === item.config.id"
            >
              <span>{{ item.config.label }}</span>
              <span class="cnml-mobile-nav__caret" :class="{ 'is-expanded': expandedSection === item.config.id }">▾</span>
            </button>
            <Transition name="expand">
              <div v-if="expandedSection === item.config.id" class="cnml-mobile-nav__sublist">
                <a
                  v-for="link in item.config.links"
                  :key="link.href"
                  :href="link.href"
                  class="cnml-mobile-nav__sublink"
                  @click="closeMenu"
                >
                  {{ link.label }}
                </a>
              </div>
            </Transition>
          </div>

          <!-- Standalone link -->
          <a
            v-else
            :href="item.href"
            class="cnml-mobile-nav__section"
            @click="closeMenu"
          >{{ item.label }}</a>
        </template>

        <!-- Bottom: theme toggle -->
        <div class="cnml-mobile-nav__footer">
          <button
            class="cnml-mobile-nav__theme"
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <span v-if="!isDark">☀</span>
            <span v-else>☾</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cnml-mobile-nav__trigger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--rule);
  border-radius: var(--bp-radius-sm);
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  align-items: center;
  padding: 0;
}
.cnml-mobile-nav__bar {
  display: block;
  width: 1.25rem;
  height: 0;
  border-top: 2px solid var(--ink);
  border-radius: 1px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.cnml-mobile-nav__bar.is-open-1 { transform: translateY(7px) rotate(45deg); }
.cnml-mobile-nav__bar.is-open-2 { opacity: 0; }
.cnml-mobile-nav__bar.is-open-3 { transform: translateY(-7px) rotate(-45deg); }

.cnml-mobile-nav__overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: var(--paper);
  display: flex;
  flex-direction: column;
}

.cnml-mobile-nav__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--rule);
  flex-shrink: 0;
}
.cnml-mobile-nav__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1rem;
  color: var(--ink);
}
.cnml-mobile-nav__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--rule);
  border-radius: var(--bp-radius-sm);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.cnml-mobile-nav__body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cnml-mobile-nav__section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-soft);
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  border-radius: var(--bp-radius-sm);
  transition: color var(--bp-transition-fast);
  font-family: inherit;
}
.cnml-mobile-nav__section:hover {
  color: var(--accent);
  text-decoration: none;
}
.cnml-mobile-nav__caret {
  font-size: 0.625rem;
  color: var(--ink-muted);
  transition: transform var(--bp-transition-fast);
}
.cnml-mobile-nav__caret.is-expanded {
  transform: rotate(180deg);
}

.cnml-mobile-nav__sublist {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
}
.cnml-mobile-nav__sublink {
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  color: var(--ink-soft);
  text-decoration: none;
  border-radius: var(--bp-radius-sm);
}
.cnml-mobile-nav__sublink:hover {
  color: var(--accent);
  text-decoration: none;
}

.cnml-mobile-nav__footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.cnml-mobile-nav__theme {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--rule);
  border-radius: var(--bp-radius-sm);
  background: transparent;
  color: var(--ink-soft);
  font-size: 1.125rem;
  cursor: pointer;
}
.cnml-mobile-nav__theme:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: transform 0.25s ease;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  transform: translateX(100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Show the hamburger only below the md breakpoint. */
@media (max-width: 768px) {
  .cnml-mobile-nav__trigger {
    display: inline-flex;
  }
}
</style>
