import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTableDisplayStore } from "../tableDisplay";
import { testDisplayOptions } from "../__mocks__/tableDisplay";
import { NavigationItem } from "@/models/navigation";

// Mocking localStorage
vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
  setItem: vi.fn(),
});

const hoist = vi.hoisted(() => {
  return {
    currentNavigationItem: <NavigationItem>{
      id: "testView",
    },
  };
});

// mock useNavigation
vi.mock("@/composables/useNavigation", async () => {
  return {
    useNavigation: () => {
      return {
        currentNavigationItem: {
          value: hoist.currentNavigationItem,
        },
      };
    },
  };
});

// Mocked displayoptions

describe("useTableDisplayStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Pinia state before each test
    setActivePinia(createPinia());
  });

  describe("variables", () => {
    it("should have displayOptionsKey", () => {
      const store = useTableDisplayStore();
      expect(store.displayOptionsKey).toBe("MkTableDisplayOptions_testView");
    });
    it("should have navItemRef", () => {
      const store = useTableDisplayStore();
      expect(store.navItemRef).toBe("testView");
    });
  });
  describe("actions", () => {
    it("sets and saves display options to localStorage", async () => {
      // arrange
      const store = useTableDisplayStore();

      // act
      const storageSpyOn = vi.spyOn(localStorage, "setItem");
      await store.setDisplayOptions(testDisplayOptions);
      const expectedResult = ["MkTableDisplayOptions_testView", JSON.stringify(testDisplayOptions)];

      // assert
      expect(store.displayOptions).toEqual(testDisplayOptions);
      expect(storageSpyOn).toHaveBeenCalledWith(...expectedResult);
    });

    it("gets display options, defaulting when unset", () => {
      const store = useTableDisplayStore();
      expect(store.getDisplayOptions()).toEqual({});
    });

    it("fetches and updates display options from localStorage", async () => {
      // arrange
      localStorage.getItem = vi.fn().mockImplementation(() => JSON.stringify(testDisplayOptions));
      const store = useTableDisplayStore();
      const storageSpyOn = vi.spyOn(localStorage, "getItem");

      // act
      await store.fetchDisplayOptions();

      // assert
      expect(store.displayOptions).toEqual(testDisplayOptions);
      expect(storageSpyOn).toHaveBeenCalled();
    });
  });
});
