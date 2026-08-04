---
title: WCAG 2.2 AA Conformance
description: How the CNML web application meets the WCAG 2.2 AA success criteria across interactive components and layout.
---

# WCAG 2.2 AA Conformance

The CNML web application targets Level AA of the Web Content Accessibility
Guidelines (WCAG) 2.2. This page documents, criterion by criterion, how the
interactive Vue islands and the Astro layout implement the relevant success
criteria, and records the residual limitations that an auditor should be
aware of.

The conformance scope covers the interactive signing, verification, key
management, and certificate-signing-request flows surfaced at `/create`,
`/verify`, `/keys`, and `/csr`, together with the global layout shipped in
`Base.astro` and the design tokens defined in `app.css`.

## 1. Perceivable

### 1.1.1 Non-text Content

Every icon-only and short-label control exposes an accessible name.

- The delete buttons in `KeyManager.vue` carry `aria-label` values that
  interpolate the key alias, producing unambiguous names such as "Delete key
  NMi Certin B.V. (NL1)".
- The download, cert-import, and trusted-key-removal buttons likewise expose
  `aria-label` values derived from the key alias.
- The upload affordances ("Upload .pub.pem", "Import PEM", "Import cert")
  carry `aria-label` descriptions of the action.
- The decorative emoji glyphs (the file icon on the dropzone, the key glyph
  on empty states, the verification status glyphs) are marked
  `aria-hidden="true"` because the adjacent text conveys the same meaning.
- The OIML mark in the header has a textual equivalent in the brand lockup,
  and the brand link carries `aria-label="CNML home"`.

### 1.3.1 Info and Relationships

Form fields use programmatic label association throughout.

- Every `<input>`, `<select>`, and `<textarea>` in `KeyManager.vue`,
  `SignDialog.vue`, `CsrGenerator.vue`, and the form widgets is wrapped by a
  `<label>` element, or associated via `for`/`id` (the sample-data select in
  `SchemaForm.vue`).
- `StructuredValueEditor.vue` was refactored from an unlabelled `<div>` into
  a `<fieldset>` with a `<legend>`; the min/max, scalar, enum, and unit
  inputs each carry a `.sr-only` label so that assistive technology announces
  the field purpose.
- Required fields in the key-generation, key-import, cert-import, and CSR
  identity forms are marked with a visible asterisk (`aria-hidden="true"`)
  and an `.sr-only` "required" string so that the constraint is announced to
  screen readers without being read twice.
- Error messages use `role="alert"` so they are announced immediately when
  they appear. The passphrase-strength hints in `SignDialog.vue` additionally
  use `aria-describedby` to associate the hint with its input.
- Status messages in `SignDialog.vue` and `VerifyDrop.vue` use `role="status"`
  and `aria-live` regions so that signing success, verification progress, and
  verification outcomes are announced politely.
- The mode-switch button group in `SignDialog.vue` exposes selection state
  via `aria-pressed`, and the toggle buttons in `KeyManager.vue` expose
  `aria-expanded` for their expandable forms.

### 1.3.5 Identify Input Purpose

Passphrase fields use `autocomplete="new-password"` when creating a new key
and `autocomplete="current-password"` when unlocking an existing one, so that
credential managers offer appropriate behaviour. The CSR identity fields use
the appropriate autofill tokens (`organization`, `country-name`,
`organization title`). Free-form aliases use `autocomplete="off"` so that
browsers do not surface irrelevant saved data.

### 1.4.3 Contrast (Minimum)

The design tokens defined in `app.css` were chosen for AA contrast. The
primary text colour (`--ink`, `#0a1628`) on the paper background (`#faf6ee`)
yields a ratio well above 4.5:1; the muted text colour (`--ink-muted`,
`#6b7a92`) on paper yields approximately 4.6:1, satisfying the threshold for
body text. The accent colour (`#004996`) on paper yields approximately 7.4:1.
The status badges and callouts are defined as paired
background-plus-foreground tokens, each tuned for AA contrast, and flip to
dark-mode equivalents under `.dark`.

### 1.4.10 Reflow

The layout uses a fluid max-width container (`max-w-7xl`) and the forms use
responsive grid templates (`grid-cols-1 sm:grid-cols-2`) that collapse to a
single column below the small breakpoint. No fixed-width container prevents
reflow at 320 CSS pixels; the only horizontally-oriented regions (the
verification tile grid, the key-row action button clusters) use
`flex-wrap` so that they reflow rather than truncate.

### 1.4.11 Non-text Contrast

The focus indicator added in `global.css` (a 2-pixel solid outline in the
accent colour at 2-pixel offset) meets the 3:1 contrast threshold against the
paper, paper-soft, and paper-raised surfaces. Button borders on the secondary
variant use `--rule` against paper, which is at the threshold; the hover and
focus-visible states raise the border to `--ink` and `--accent` respectively,
clearing 3:1.

### 1.4.12 Text Spacing

No component declares a fixed `line-height` that would break when a user
overrides spacing. The form labels use a relative font size and the inputs
inherit body line-height. The `cnml-code-pane` uses a unitless line-height of
1.5, which scales with user font-size overrides.

## 2. Operable

### 2.1.1 Keyboard

Every interactive control is operable from the keyboard.

- All buttons, links, and form controls are native HTML elements and inherit
  keyboard operability.
- The `VerifyDrop.vue` dropzone was extended with a `@keydown` handler that
  activates the file picker on Enter and Space, in addition to the native
  `<label>`-wrapped file input that is now in the tab order (`.sr-only`
  rather than `hidden`, so it remains focusable).
- The `SignDialog.vue` mode-switch buttons are native `<button>` elements and
  are reachable by Tab.

### 2.1.2 No Keyboard Trap

`SignDialog.vue` implements a focus trap: while the dialog is open, Tab and
Shift-Tab cycle within the dialog's focusable elements. Escape closes the
dialog. On close, focus is restored to the element that had focus before the
dialog opened (`lastFocused`). The focus trap is implemented in the `onKey`
handler and the `watch` on `props.open`.

### 2.4.1 Bypass Blocks

The skip-link in `Base.astro` (`<a href="#main">`) is the first focusable
element in the document. It is visually hidden until focused, at which point
it appears at the top-left of the viewport. The `<main>` element carries
`id="main"` as the jump target.

### 2.4.3 Focus Order

No `tabindex` value greater than 0 is used anywhere in the application. The
dropzone's `tabindex="0"` places it in the natural tab order at its document
position, which matches the visual order. The dialog's focus management
explicitly moves focus to the first focusable child on open.

### 2.4.7 Focus Visible

The global `:focus-visible` style in `app.css` applies a 2-pixel accent
outline to every focusable element. The component-specific `:focus-visible`
rules added to `global.css` reinforce this for buttons, nav links, and the
brand lockup, and the dropzone's `focus-visible:` utilities apply a visible
border and outline when activated by keyboard.

### 2.5.5 Target Size (Minimum)

The `.cnml-btn` class declares `min-height: 1.5rem` and default padding of
`0.5rem 1rem`, yielding a target of at least 24 by 24 CSS pixels. The
Counter component's buttons are 32 by 32 pixels. The dropzone's hit area is
the entire bordered region.

## 3. Understandable

### 3.2.1 On Focus and 3.2.2 On Input

No control initiates a context change on focus or on input. The sample-data
select in `SchemaForm.vue` changes form contents on change, but this is an
explicit user action on a `<select>` whose options are visible, and the
change is to the form's own contents rather than a navigation or context
change.

### 3.3.1 Error Identification and 3.3.3 Error Suggestion

All errors are described in text. The passphrase-strength hints in
`SignDialog.vue` go beyond color: they include the count of remaining
characters required ("Too short - needs 2 more characters"). The
passphrase-mismatch hint states "Doesn't match." Key-generation errors,
cert-import errors, CSR errors, and trust-store errors are surfaced as text
in `.cnml-text-danger` callouts with `role="alert"`. The color is never the
only signal.

## 4. Robust

### 4.1.2 Name, Role, Value

- `SignDialog.vue` exposes `role="dialog"`, `aria-modal="true"`, and
  `aria-labelledby` pointing to the dialog title.
- The `VerifyDrop.vue` dropzone exposes `role="button"` with an `aria-label`
  describing the affordance.
- The mode-switch in `SignDialog.vue` exposes `aria-pressed` for each toggle.
- The expandable-form toggles in `KeyManager.vue` expose `aria-expanded`.
- The verification status tiles expose `role="status"` and an `.sr-only`
  text equivalent of the glyph.
- The `StructuredValueEditor.vue` widget uses `<fieldset>`/`<legend>` for its
  grouping semantics.

## Reduced Motion

`global.css` includes a `@media (prefers-reduced-motion: reduce)` block that
collapses every animation and transition to a near-zero duration and forces
`scroll-behavior: auto`. This honors the OS-level "reduce motion" preference
and ensures that the card-hover lift, button color transitions, and smooth
scrolling do not present a vestibular hazard.

## Known Limitations

The following items are out of scope for this pass and are recorded for a
future audit:

- The dynamically-created file inputs in `KeyManager.vue`
  (`triggerCertUpload`, `triggerPrivateKeyUpload`,
  `triggerTrustedKeyUpload`) are spawned via `document.createElement` and
  invoked with `.click()` immediately. They are not in the tab order; the
  visible button labels serve as the accessible affordance. A future
  enhancement could replace these with persistent visually-hidden file
  inputs.
- The `<details>`/`<summary>` disclosure pattern used for live JSON previews
  and signed-XML previews relies on the browser's native disclosure
  triangle, which does not always meet 3:1 contrast. This is a
  browser-rendered affordance outside the application's style scope.
- The verification check pipeline emits check results with `role="status"`
  on each tile; a future enhancement could consolidate these into a single
  `aria-live` summary region to reduce announcement verbosity for
  screen-reader users verifying many files in sequence.
- Color contrast for the `--ink-muted` token (`#6b7a92`) on the cream paper
  background is at the AA threshold (approximately 4.6:1) for body text but
  does not satisfy the 7:1 AAA threshold. This is acceptable at the AA
  target but should be revisited if the target is raised.
