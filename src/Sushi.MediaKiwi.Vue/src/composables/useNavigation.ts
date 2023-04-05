import { computed, watch } from "vue";
import type { NavigationItem, Section } from "@/models/api";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";

export function useNavigation() {
  const route = useRoute();
  const router = useRouter();
  const store = useMediakiwiStore();

  const currentNavigationItem = computed(() => {
    const result = route.meta.navigationItem as NavigationItem;
    return result;
  });

  type NavigationTypeGuard = NavigationItem | Section;

  function navigateTo(item: NavigationTypeGuard): void {
    // Since we are injecting the router via the store it is already up and running when we initiate
    if (checkTypeGuardIsSection(item)) {
      // if it's the section, push to the first navigation item in the section
      const section = item as Section;
      const navigationItem = store.rootNavigationItems.find((x) => x.sectionId == item.id);
      if (navigationItem) {
        router.push({ name: navigationItem.id.toString() });
      } else {
        console.warn("No default navigation item found for section");
      }
    } else {
      // if its navigationItem then we push to nav item's path
      const navigationItem = item as NavigationItem;
      if (navigationItem) {
        // called to send user to target screen
        router.push({ name: navigationItem.id.toString() });
      }
    }
  }

  // checks Type of ISection
  const checkTypeGuardIsSection = (toBeDetermined: NavigationTypeGuard): boolean => {
    if ((toBeDetermined as NavigationItem).path) {
      return false;
    }
    return true;
  };

  function determineCurrentRoootItem(): NavigationItem | undefined {
    // go up the tree untill a dynamic item which is its own leaf node is found
    let result: NavigationItem | undefined = undefined;
    let candidate: NavigationItem | undefined = currentNavigationItem.value;
    while (candidate && !result) {
      if (candidate.isDynamicRoute && candidate.leaf?.id == candidate.id) {
        // we have found a dynamic route which is a leaf node
        result = candidate;
      } else {
        if (candidate.parent) {
          // get parent and use it as next candidate
          candidate = candidate.parent;
        } else {
          // parent is undefined, we have reached the top of the tree
          candidate = undefined;
          result = candidate;
        }
      }
    }
    return result;
  }

  const currentRootItem = computed(determineCurrentRoootItem);

  function getChildren(navigationItem: NavigationItem): Array<NavigationItem> {
    let result = navigationItem.children?.filter((item) => !item.isDynamicRoute);

    return result ? result : [];
  }
  return { currentNavigationItem, currentRootItem, navigateTo, getChildren };
}
