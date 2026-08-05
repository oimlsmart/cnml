<script setup lang="ts">
/**
 * ThemeToggle — dark/light mode switch for the CNML site header.
 *
 * Reads the saved preference from localStorage on mount (falling back
 * to the OS preference), and toggles the `.dark` class on <html>.
 * The sun icon is shown in light mode (click to go dark), the moon
 * icon in dark mode (click to go light).
 */
import { useTheme } from '../composables/useTheme'
const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="cnml-theme-toggle"
    @click="toggle"
    data-testid="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span v-show="!isDark" class="cnml-theme-toggle__icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1L4.7 4.7" />
      </svg>
    </span>
    <span v-show="isDark" class="cnml-theme-toggle__icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.5 12.5A7.5 7.5 0 0 1 7.5 2.5a7.5 7.5 0 1 0 10 10z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.cnml-theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--rule);
  border-radius: var(--bp-radius-sm);
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  transition: color var(--bp-transition-fast), border-color var(--bp-transition-fast);
}
.cnml-theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.cnml-theme-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.cnml-theme-toggle__icon {
  display: inline-flex;
}
.cnml-theme-toggle__icon svg {
  width: 1rem;
  height: 1rem;
  display: block;
}
</style>
