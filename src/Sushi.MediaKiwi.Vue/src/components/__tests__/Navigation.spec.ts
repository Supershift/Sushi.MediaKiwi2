import { mount, VueWrapper } from "@vue/test-utils";
import MkNavigation from "../MkNavigationNew/MkNavigation.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNavigationStore } from "../../stores/navigation";

describe("MkNavigation", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })
  it("Should display Navigation", () => {
    const navigationstore = useNavigationStore();
    const railItems = [{ id: 0}];
    const wrapper = mount(MkNavigation);
    // TODO: Finalize the component render test
    // @ts-ignore
    // console.log(wrapper.vm.$.setupState);
    // wrapper.vm.$.setupState.railItems = railItems
    // console.log(wrapper);
    // expect to have items in railitems
    wrapper.findComponent("MkNavigationRail");
  });
});
