/**
 * Unit tests for the ThemeToggle island (TODO.cnml/35).
 */

import { describe, test, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ThemeToggle from "./ThemeToggle.vue";

beforeEach(() => {
  // Reset localStorage and classList between tests.
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeToggle.vue", () => {
  test("renders a button with an aria-label", () => {
    const w = mount(ThemeToggle);
    const btn = w.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toMatch(/mode/i);
  });

  test("click toggles the dark class on <html>", async () => {
    const w = mount(ThemeToggle);
    const btn = w.find("button");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    await btn.trigger("click");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await btn.trigger("click");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("persists the choice to localStorage", async () => {
    const w = mount(ThemeToggle);
    const btn = w.find("button");
    await btn.trigger("click");
    expect(window.localStorage.getItem("cnml-theme")).toBe("dark");
    await btn.trigger("click");
    expect(window.localStorage.getItem("cnml-theme")).toBe("light");
  });
});
