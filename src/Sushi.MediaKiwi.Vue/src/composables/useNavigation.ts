import { computed, watch } from "vue";
import type { NavigationItem } from "@/models/api";
import { useRoute } from "@/router";
import { getNavigationItemChildren } from "@/helpers";
import { useMediakiwiStore } from "@/stores";

export function useNavigation() {
  const store = useMediakiwiStore();
  const route = useRoute();

  const currentNavigationItem = computed(() => {
    const result = route.meta.navigationItem as NavigationItem;
    return result;
  });

  function determineCurrentRoootItem(): NavigationItem | undefined {
    // go up the tree untill a dynamic item with children is found OR we hit the root
    let result: NavigationItem | undefined = undefined;
    let candidate: NavigationItem | undefined = currentNavigationItem.value;
    while (candidate && !result) {
      if (candidate.isDynamicRoute && getNavigationItemChildren(candidate, store.navigationItems, true)?.length) {
        // we have found a dynamic route with children
        result = candidate;
      } else {
        if (candidate.parent) {
          // get parent and use it as next candidate
          candidate = candidate.parent;
        } else {
          // no more parent, we have found a result, it is the root node
          candidate = undefined;
          result = candidate;
        }
      }
    }
    return result;
  }

  const currentActiveNavigationItem = computed(() => {
    // go up the tree until we find a normal item or a dynamic item with children
  });

  const currentRootItem = computed(determineCurrentRoootItem);
  return { currentNavigationItem, currentActiveNavigationItem, currentRootItem };
}
