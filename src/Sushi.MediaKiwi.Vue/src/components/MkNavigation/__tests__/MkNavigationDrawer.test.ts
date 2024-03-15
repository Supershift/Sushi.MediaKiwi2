/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MkNavigationDrawer from "../MkNavigationDrawer.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountWithLayoutAsync } from "@test/utils";
import { NavigationItem } from "@/models";
import { computed } from "vue";

// mock libraries
// vi.mock("i18next");
vi.mock("@azure/msal-browser");
vi.mock("@/stores/useMediakiwiStore");
vi.mock("@/composables/useNavigation", () => {
  return {
    useNavigation: () => {
      return {
        navigateTo: () => {
          return Promise.resolve();
        },
        determineIfSectionIsActive: () => {
          return true;
        },
        getAllItemsBasedOnSection: () => {
          return [];
        },
        getItemsBasedOnRoot: () => {
          return [];
        },
        getItemsBasedOnSection: () => {
          return [];
        },
        currentRootItem: computed(() => {
          return {
            id: 1,
            name: "Section One",
            sortOrder: 0,
            icon: "$arrowLeft",
          };
        }),
      };
    },
  };
});

vi.mock("@/composables/useI18next", () => {
  return {
    defaultT: (key: string) => computed(() => key),
    t: (key: string) => computed(() => key),
  };
});

describe("MkNavigationDrawer", () => {
  // Declare the props to be used in all tests
  const props = {
    listItems: [
      {
        id: 444,
        name: "Test Item",
        sectionId: 1,
        viewId: "home",
        path: "/home",
      },
    ] as Array<NavigationItem>,
  };

  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it.skip("Should be rendered", async () => {
    // TODO: Mock the i18next

    // Mount the component in a suspense wrapper
    const wrapper = await mountWithLayoutAsync(MkNavigationDrawer, props);

    // Check that the component is rendered and contains an icon
    const outputHtml = wrapper.html();
    expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
    expect(outputHtml).toContain("v-navigation-drawer");
  });
});
