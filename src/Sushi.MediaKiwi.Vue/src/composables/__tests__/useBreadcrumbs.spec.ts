import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { useBreadcrumbs } from "./../useBreadcrumbs";
import { NavigationItem } from "@/models/navigation";
import { createPinia, setActivePinia } from "pinia";

const hoist = vi.hoisted(() => {
  return {
    isMobile: false,
    currentRootItem: <NavigationItem>{},
    currentNavigationItem: <NavigationItem>{},
  };
});

// mock useDisplay
vi.mock("vuetify/lib/framework.mjs", () => ({
  useDisplay: () => {
    return {
      xs: {
        value: hoist.isMobile,
      },
    };
  },
}));

// mock useNavigation
vi.mock("@/composables/useNavigation", async () => {
  return {
    useNavigation: () => {
      return {
        currentRootItem: {
          value: hoist.currentRootItem,
        },
        currentNavigationItem: {
          value: hoist.currentNavigationItem,
        },
      };
    },
  };
});

// mock navigation
const mockNavigationItem = (id: string, name: string, parent?: NavigationItem): NavigationItem => ({
  id,
  name,
  parent,
  children: [],
  breadcrumbLabel: "",
  section: { id: "section1", name: "Section 1", items: [] },
});

describe("useBreadcrumbs", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should generate only entity details breadcrumbs", () => {
    const rootItem = mockNavigationItem("hotel", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem, parent: rootItem };

    const { breadcrumbs } = useBreadcrumbs();

    expect(breadcrumbs.value).toHaveLength(1);
  });

  it("should show mobile back button when xs is true and breadcrumbs exist", () => {
    hoist.isMobile = true;

    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem, parent: rootItem };

    const { showMobileBackButton } = useBreadcrumbs();

    expect(showMobileBackButton.value).toBe(true);
  });

  it("should determine if breadcrumbs have items with names", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem, parent: rootItem };

    const { hasBreadcrumbs } = useBreadcrumbs();

    expect(hasBreadcrumbs.value).toBe(true);
  });

  it("should set current breadcrumb label", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem, parent: rootItem };

    const { setCurrentBreadcrumbLabel, breadcrumbs } = useBreadcrumbs();

    // set breadcrumb label
    setCurrentBreadcrumbLabel("New Label");

    // get the last item in the breadcrumbs
    const lastItem = <NavigationItem>{ ...breadcrumbs.value.pop() };
    expect(lastItem.breadcrumbLabel).toBe("New Label");
  });

  it("should get breadcrumb label", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem, parent: rootItem };

    const { breadcrumbs } = useBreadcrumbs();

    const lastItem = { ...breadcrumbs.value.pop() };
    expect(lastItem?.breadcrumbLabel).toBe("");
    expect(lastItem?.name).toBe("Child");
  });

  it("should generate breadcrumbs with entity sibling", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem1 = mockNavigationItem("child1", "Child 1", rootItem);
    const childItem2 = mockNavigationItem("child2", "Child 2", rootItem);
    const childItem3 = mockNavigationItem("child3", "Child 3", rootItem);
    rootItem.children.push(childItem1);
    rootItem.children.push(childItem2);
    rootItem.children.push(childItem3);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem2, parent: rootItem };

    const { breadcrumbs, getBreadcrumbLabel } = useBreadcrumbs();

    expect(breadcrumbs.value).toHaveLength(2);
    expect(getBreadcrumbLabel(breadcrumbs.value[0])).toBe("Child 1");
    expect(getBreadcrumbLabel(breadcrumbs.value[1])).toBe("Child 2");
  });

  // test to check the last item in the breadcrumbs is the current navigation item
  it("should generate breadcrumbs with entity sibling", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem1 = mockNavigationItem("child1", "Child 1", rootItem);
    const childItem2 = mockNavigationItem("child2", "Child 2", rootItem);
    const childItem3 = mockNavigationItem("child3", "Child 3", rootItem);
    rootItem.children.push(childItem1);
    rootItem.children.push(childItem2);
    rootItem.children.push(childItem3);

    hoist.currentRootItem = { ...rootItem };
    hoist.currentNavigationItem = { ...childItem2, parent: rootItem };

    const { isCurrentNavigationItem } = useBreadcrumbs();

    expect(isCurrentNavigationItem({ ...childItem1 })).toBe(false);
    expect(isCurrentNavigationItem({ ...childItem2 })).toBe(true);
    expect(isCurrentNavigationItem({ ...childItem3 })).toBe(false);
  });
});
