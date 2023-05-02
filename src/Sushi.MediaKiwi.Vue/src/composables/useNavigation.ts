import { computed, watch } from "vue";
import type { NavigationItem, Section } from "@/models/api";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { NavigationFailure, RouteLocationOptions, RouteParamValueRaw, RouteParamsRaw } from "vue-router";

export function useNavigation() {
  const route = useRoute();
  const currentNavigationItem = computed(() => {
    const result = route.meta.navigationItem as NavigationItem;
    return result;
  });

  const store = useMediakiwiStore();
  const router = useRouter();

  type NavigationTypeGuard = NavigationItem | Section;

  /** Navigate to the homepage */
  function navigateToHome(): Promise<NavigationFailure | void | undefined> {
    // get the first section
    const section = store.sections[0];

    if (section) {
      // navigate to the section
      return navigateTo(section);
    } else {
      throw new Error("No sections found");
    }
  }

  /**
   * Navigates to the parent of the current navigation item
   */
  function navigateToParent(): Promise<NavigationFailure | void | undefined> {
    if (currentNavigationItem.value.parent) {
      return navigateTo(currentNavigationItem.value.parent);
    } else {
      throw new Error("Cannot navigate to parent, no parent found");
    }
  }

  /** Pushes the user to the provided navigation item
   * @param item The navigation item to navigate to
   * @param itemId The id of the item to navigate to. Only required if the navigation item is a dynamic route
   * @param options Additional options to pass to the router
   */
  function navigateTo(item: NavigationTypeGuard, itemId?: RouteParamValueRaw, options?: RouteLocationOptions): Promise<NavigationFailure | void | undefined> {
    if (checkTypeGuardIsSection(item)) {
      // if it's the section, push to the first navigation item in the section
      const section = item as Section;
      const navigationItem = store.rootNavigationItems.find((x) => x.sectionId == section.id);
      if (navigationItem) {
        return router.push({ name: navigationItem.id.toString() });
      } else {
        throw new Error("No default navigation item found for section");
      }
    } else {
      // if it's navigationItem then we push to nav item's path
      const navigationItem = item as NavigationItem;
      let routeParams: RouteParamsRaw | undefined = undefined;
      if (navigationItem.view?.parameterName) {
        // if this is a dynamic route, try to resolve route parameter
        routeParams = {};

        if (itemId === undefined) {
          throw new Error(`Navigating to dynamic route but no itemId provided`);
        }

        routeParams[navigationItem.view.parameterName] = itemId;
      }

      // called to send user to target screen
      return router.push({ name: navigationItem.id.toString(), params: routeParams, ...options });
    }
  }

  // checks Type of ISection
  const checkTypeGuardIsSection = (toBeDetermined: NavigationTypeGuard): boolean => {
    if ((toBeDetermined as NavigationItem).path) {
      return false;
    }
    return true;
  };

  /**
   *
   * @returns The current root item. The root item is the first dynamic item in the tree which is also a leaf node or undefined if no such item exists.
   */
  function determineCurrentRoootItem(): NavigationItem | undefined {
    // go up the tree untill a dynamic item which is its own leaf node is found
    let result: NavigationItem | undefined = undefined;
    let candidate: NavigationItem | undefined = currentNavigationItem.value;
    while (candidate && !result) {
      if (candidate.view?.parameterName && candidate.leaf?.id == candidate.id) {
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

  const currentRouteParamId = computed(() => {
    const navigationItem = currentNavigationItem.value;
    if (navigationItem.view?.parameterName) {
      // if this is a dynamic route, try to resolve route parameter
      return route.params[navigationItem.view.parameterName];
    }
  });

  function getChildren(navigationItem: NavigationItem): Array<NavigationItem> {
    let result = navigationItem.children?.filter((item) => !item.view?.parameterName);

    return result ? result : [];
  }

  /** Gets the id from the url for the current view, if the current view has a parameter. */
  const currentViewParameter = computed(() => {
    const navigationItem = currentNavigationItem.value;
    if (navigationItem.view?.parameterName) {
      // if this is a dynamic route, try to resolve route parameter
      return route.params[navigationItem.view.parameterName];
    }
  });

  const currentViewParameterNumber = computed(() => Number(currentViewParameter.value));

  return {
    currentNavigationItem,
    currentRootItem,
    navigateTo,
    navigateToParent,
    navigateToHome,
    getChildren,
    currentRouteParamId,
    /** Gets the id from the url for the current view, if the current view has a parameter. */
    currentViewParameter,
    /** Gets the id from the url for the current view, if the current view has a parameter, and converts it to a number. */
    currentViewParameterNumber,
  };
}
