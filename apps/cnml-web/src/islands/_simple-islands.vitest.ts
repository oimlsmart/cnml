/**
 * Unit tests for the simpler Vue islands (TODO.cnml/35).
 *
 * The Vitest setup wires happy-dom + fake-indexeddb. Each test
 * mounts the island with Vue Test Utils and asserts on the rendered
 * output or on a reactive ref after a simulated interaction.
 *
 * The heavier islands (VerifyDrop, ManufacturerInstanceFlow, KeyManager)
 * touch Web Crypto, fetch, and Confium WASM. They get their own
 * dedicated test files once the simpler islands prove the harness.
 */

import { describe, test, expect, beforeEach, vi, nextTick } from "vitest";
import { mount } from "@vue/test-utils";

describe("Counter.vue (mount + interaction)", () => {
  test("renders 0 by default", async () => {
    const Counter = (await import("./Counter.vue")).default;
    const w = mount(Counter);
    expect(w.text()).toMatch(/0/);
  });

  test("increment button increments the counter", async () => {
    const Counter = (await import("./Counter.vue")).default;
    const w = mount(Counter);
    const buttons = w.findAll("button");
    // [-, +] — the increment button is the second one.
    await buttons[1]!.trigger("click");
    expect(w.text()).toMatch(/1/);
  });

  test("decrement button decrements the counter", async () => {
    const Counter = (await import("./Counter.vue")).default;
    const w = mount(Counter);
    const buttons = w.findAll("button");
    await buttons[0]!.trigger("click");
    expect(w.text()).toMatch(/-1/);
  });
});

describe("ErrorBoundary.vue (basic mount)", () => {
  test("renders the slot when no error fires", async () => {
    const ErrorBoundary = (await import("./widgets/ErrorBoundary.vue")).default;
    const Fine = { name: "Fine", template: `<div>fine</div>` };
    const w = mount({
      components: { ErrorBoundary, Fine },
      template: `<ErrorBoundary><Fine /></ErrorBoundary>`,
    });
    expect(w.text()).toMatch(/fine/);
  });
});
