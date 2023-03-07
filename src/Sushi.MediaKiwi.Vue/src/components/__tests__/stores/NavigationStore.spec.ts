import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationStore } from '../../../stores/navigation'

describe("NavigationStore", () => {
    beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
    })
  it("Should Get NavigationItems", () => {
    const store = useNavigationStore();
    expect(store.navigationItems).toBe([]);
    store.getNavigation();
    expect(store.navigationItems).toBe([]);

  });
});

