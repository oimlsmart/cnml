/**
 * Unit tests for the credential-exchange holder island. The heavier
 * interactions (real key store, live coordinator) are covered by the
 * crypto package's exchange-client tests; here we pin the form's
 * validation gating and the empty-key state.
 */

import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

describe("CollectCredential.vue", () => {
  test("renders the two-turn exchange form with a disabled collect button", async () => {
    const CollectCredential = (await import("./issuing/CollectCredential.vue")).default;
    const w = mount(CollectCredential);
    expect(w.text()).toMatch(/Collect a staged credential/);
    expect(w.text()).toMatch(/identifier-control challenge/);
    const button = w.find("button");
    expect(button.text()).toMatch(/Collect credential/);
    expect(button.attributes("disabled")).toBeDefined();
  });

  test("keeps the button disabled until identifier, key, and passphrase are set", async () => {
    const CollectCredential = (await import("./issuing/CollectCredential.vue")).default;
    const w = mount(CollectCredential);
    const inputs = w.findAll("input");
    const identifier = inputs.find((i) => i.attributes("placeholder") === "Example Instruments");
    const passphrase = inputs.find((i) => i.attributes("type") === "password");

    await identifier!.setValue("Example Instruments");
    const button = w.find("button");
    expect(button.attributes("disabled")).toBeDefined();

    await passphrase!.setValue("a-long-passphrase");
    // Still disabled: no key is selected (the store is empty in tests).
    expect(button.attributes("disabled")).toBeDefined();
    expect(w.text()).toMatch(/No keys in this browser yet/);
  });
});
