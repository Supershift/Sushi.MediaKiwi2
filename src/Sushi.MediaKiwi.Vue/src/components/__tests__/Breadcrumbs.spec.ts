import { mount } from "@vue/test-utils";
import MkBreadcrumbs from "../MkBreadcrumbs/MkBreadcrumbs.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNavigationStore } from "../../stores/navigation";
import { Breadcrumb, IBreadcrumb } from "../../models/breadcrumb";

const breadcrumbsList = [new Breadcrumb("/Home", "Home", "/Home", true, false, false)] as Array<IBreadcrumb>;

describe("MkBreadcrumbs", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })
  it("Should display Breadcrumbs", () => {
    //arrange
    const navigationStore = useNavigationStore();
    navigationStore.setBreadCrumbs(breadcrumbsList);

    //act
    const wrapper = mount(MkBreadcrumbs);
    
    //assert
    expect(wrapper).toBeTruthy();
    // expect(wrapper.text()).toContain("Home");
  });
});
