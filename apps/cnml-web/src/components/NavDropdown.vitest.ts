/**
 * Unit tests for the NavDropdown island (TODO.cnml/35).
 */

import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NavDropdown from "./NavDropdown.vue";

const config = {
  id: "test",
  label: "Test",
  links: [
    { label: "First", href: "/first" },
    { label: "Second", href: "/second" },
  ],
};

describe("NavDropdown.vue", () => {
  test("renders the trigger button with the label", () => {
    const w = mount(NavDropdown, {
      props: { config, currentPath: "/" },
    });
    expect(w.text()).toMatch(/Test/);
    expect(w.find("button").exists()).toBe(true);
  });

  test("starts closed", () => {
    const w = mount(NavDropdown, {
      props: { config, currentPath: "/" },
    });
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
  });

  test("opens on trigger click", async () => {
    const w = mount(NavDropdown, {
      props: { config, currentPath: "/" },
    });
    await w.find("button").trigger("click");
    expect(w.find("button").attributes("aria-expanded")).toBe("true");
  });

  test("renders all links when open", async () => {
    const w = mount(NavDropdown, {
      props: { config, currentPath: "/" },
    });
    await w.find("button").trigger("click");
    const links = w.findAll("a");
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links[0]!.attributes("href")).toBe("/first");
  });
});
