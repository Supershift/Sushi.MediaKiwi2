import "reflect-metadata";
import { shallowMount } from "@vue/test-utils";
import MkBreadcrumbs from "../MkBreadcrumbs/MkBreadcrumbs.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNavigationStore } from "../../stores/navigation";
import { Breadcrumb, type IBreadcrumb } from "../../models/breadcrumb/index";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { container } from "tsyringe";

const pinia = createPinia();

vi.mock("vuetify/lib/framework.mjs")

const breadcrumbsList = [new Breadcrumb("/Home", "Home", "/Home", true, false, false)] as Array<IBreadcrumb>;
describe("MkBreadcrumbs", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    container.reset();
    setActivePinia(pinia)
  })
  it("Should display Breadcrumbs", () => {
    //arrange
    const navigationStore = useNavigationStore();
    navigationStore.setBreadCrumbs(breadcrumbsList);
    (useDisplay as any) = vi.fn().mockReturnValue({ mobile: true });
    const breadcrumbs = breadcrumbsList
    //act
    const wrapper = shallowMount(MkBreadcrumbs, {
      global: {
        plugins: [ pinia ],
        stubs: {
          'v-breadcrumbs': {},
          'v-card': {}
        },
      },
      data: () => {
       return  {
        breadcrumbs
       }
      }
    });
    //assert
    expect(wrapper.exists());
    expect(wrapper.getCurrentComponent()).toBeTruthy();
    expect(wrapper.find("MkBackButton")).toBeTruthy();
    expect(wrapper.find("MkBreadcrumbsItem")).toBeTruthy();
    console.log(wrapper.getCurrentComponent());
  });
});
