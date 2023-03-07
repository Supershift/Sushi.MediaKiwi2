import { mount } from "@vue/test-utils";
import MkNavigation from "../MkNavigationNew/MkNavigation.vue";
import { describe, it, expect } from "vitest";


describe("MkNavigation", () => {
  it("Should display Navigation", () => {
    const wrapper = mount(MkNavigation);

    expect(wrapper).toHaveProperty("railItems");
    expect(wrapper).toHaveProperty("listItems");
  });
});
