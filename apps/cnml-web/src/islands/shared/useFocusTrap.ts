/**
 * Focus trap composable (TODO.cnml/55).
 *
 * When `active` is true, Tab and Shift-Tab cycle within the
 * `container` element. Escape closes (sets `active` to false). On
 * close, focus returns to the element that was focused when the
 * trap opened.
 *
 * Used by MobileNav and SignDialog to satisfy WCAG 2.1 SC 2.1.2,
 * 2.4.3, and 4.1.2.
 */

import { watch, onUnmounted, type Ref, type DeepReadonly } from "vue";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  active: Ref<boolean>,
  container: Ref<HTMLElement | null>,
  onClose?: () => void,
) {
  let previouslyFocused: HTMLElement | null = null;

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      // Don't write to active.value — it may be a computed ref
      // (read-only). The parent's onClose handler updates the state,
      // the watch fires, and the trap tears down.
      onClose?.();
      return;
    }
    if (e.key !== "Tab") return;
    const el = container.value;
    if (!el) return;
    const focusables = Array.from(
      el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => node.offsetParent !== null || node === document.activeElement);
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  watch(active, (on) => {
    if (on) {
      previouslyFocused = document.activeElement as HTMLElement;
      const el = container.value;
      if (el) {
        const first = el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        first?.focus();
      }
      document.addEventListener("keydown", onKeydown, true);
    } else {
      document.removeEventListener("keydown", onKeydown, true);
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown, true);
  });
}
