import { mount } from "@vue/test-utils";
import MkNavigation from "../MkNavigation.vue";
import { describe, it, expect } from "vitest";

describe("MkNavigation", () => {
  it("should display header text", () => {
    const msg = "MkNavigation";
    const wrapper = mount(MkNavigation, { props: { msg } });

    expect(wrapper.text()).toEqual(msg);
  });
});
