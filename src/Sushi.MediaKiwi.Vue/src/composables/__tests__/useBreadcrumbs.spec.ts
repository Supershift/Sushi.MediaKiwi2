import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { useBreadcrumbs } from "./../useBreadcrumbs";
import { NavigationItem } from "@/models/navigation";
import { createPinia, setActivePinia } from "pinia";

let { isMobile, currentRootItem, currentNavigationItem, currentViewParameter, getViewParameter } = vi.hoisted(() => {
  return {
    isMobile: false,
    currentRootItem: <NavigationItem>{},
    currentNavigationItem: <NavigationItem>{},
    currentViewParameter: "",
    getViewParameter: vi.fn().mockImplementation(() => currentViewParameter),
  };
});

// mock useDisplay
vi.mock("vuetify/lib/framework.mjs", () => ({
  useDisplay: () => {
    return {
      xs: {
        value: isMobile,
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
          value: currentRootItem,
        },
        currentNavigationItem: {
          value: currentNavigationItem,
        },
        currentViewParameter: {
          value: currentViewParameter,
        },
        getViewParameter: getViewParameter,
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

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem, parent: rootItem };

    const { breadcrumbs } = useBreadcrumbs();

    expect(breadcrumbs.value).toHaveLength(1);
  });

  it("should show mobile back button when xs is true and breadcrumbs exist", () => {
    isMobile = true;

    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem, parent: rootItem };

    const { showMobileBackButton } = useBreadcrumbs();

    expect(showMobileBackButton.value).toBe(true);
  });

  it("should determine if breadcrumbs have items with names", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem, parent: rootItem };

    const { hasBreadcrumbs } = useBreadcrumbs();

    expect(hasBreadcrumbs.value).toBe(true);
  });

  it("should set current breadcrumb label", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem, parent: rootItem };

    const { setCurrentBreadcrumbLabel, breadcrumbs } = useBreadcrumbs();

    // set breadcrumb label
    setCurrentBreadcrumbLabel("New Label");

    // get the last item in the breadcrumbs
    const lastItem = <NavigationItem>{ ...breadcrumbs.value.pop() };
    expect(lastItem.entity?.label).toBe("New Label");
  });

  it("should get breadcrumb label", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem = mockNavigationItem("child", "Child", rootItem);
    rootItem.children.push(childItem);

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem, parent: rootItem };

    const { breadcrumbs } = useBreadcrumbs();

    const lastItem = { ...breadcrumbs.value.pop() };
    expect(lastItem.entity?.label).toBe(undefined);
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

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem2, parent: rootItem };

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

    currentRootItem = { ...rootItem };
    currentNavigationItem = { ...childItem2, parent: rootItem };

    const { isCurrentNavigationItem } = useBreadcrumbs();

    expect(isCurrentNavigationItem({ ...childItem1 })).toBe(false);
    expect(isCurrentNavigationItem({ ...childItem2 })).toBe(true);
    expect(isCurrentNavigationItem({ ...childItem3 })).toBe(false);
  });

  ////

  it("should revert to the default navigation item name if a new entity is requested", () => {
    const rootItem = mockNavigationItem("root", "Root");
    const childItem1 = mockNavigationItem("child1", "Child 1", rootItem);
    rootItem.children.push(childItem1);

    currentRootItem = { ...rootItem };
    currentViewParameter = "child1";
    currentNavigationItem = { ...childItem1, parent: rootItem };

    const breadcrumbs = useBreadcrumbs();

    // act - set breadcrumb label for child 1 (current navigation item)
    breadcrumbs.setCurrentBreadcrumbLabel("Custom Child 1 label");

    const lastItem = <NavigationItem>{ ...breadcrumbs.breadcrumbs.value[breadcrumbs.breadcrumbs.value.length - 1] };
    expect(breadcrumbs.getBreadcrumbLabel(lastItem)).toBe("Custom Child 1 label");

    // change the current navigation item to child 2
    currentViewParameter = "child2";

    const newBreadcrumbs = useBreadcrumbs();

    // Without setting the current breadcrumb label for child 2,
    // we expect the breadcrumb label to be the default name of the navigation item,
    // and not the custom label we set for child 1
    const lastItemB = <NavigationItem>{ ...newBreadcrumbs.breadcrumbs.value[breadcrumbs.breadcrumbs.value.length - 1] };
    expect(newBreadcrumbs.getBreadcrumbLabel(lastItemB)).not.toBe("Custom Child 1 label");
    expect(newBreadcrumbs.getBreadcrumbLabel(lastItemB)).toBe("Child 1");
  });
});
