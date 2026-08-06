/**
 * Code-block copy button (TODO 43).
 *
 * A single delegated click listener on the docs <main> element.
 * Avoids mounting one Vue island per code block (heavy). The
 * listener detects clicks on `.cnml-code-copy` and copies the
 * sibling `<pre>` text to the clipboard.
 *
 * Mount from docs pages (both [slug] and [...slug] routes).
 */

export function mountCodeCopy(): () => void {
  const onClick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target?.classList?.contains("cnml-code-copy")) return;
    const block = target.closest(".cnml-code-block");
    if (!block) return;
    // Prefer the currently-visible <pre>; fall back to the first.
    const pres = block.querySelectorAll("pre");
    let pre: Element | null = null;
    for (const p of pres) {
      const cs = window.getComputedStyle(p);
      if (cs.display !== "none") {
        pre = p;
        break;
      }
    }
    pre ??= pres[0] ?? null;
    if (!pre) return;
    const text = pre.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      const original = target.textContent;
      target.textContent = "Copied";
      setTimeout(() => {
        if (original !== null) target.textContent = original;
      }, 1500);
    } catch {
      // Clipboard API may be unavailable (HTTP, older browser).
      // Silent — the button's hover affordance still works.
    }
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
