import { computed } from "vue";
import type { NavigationItem, Section } from "@/models/api";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { NavigationFailure, RouteLocationOptions, RouteParamValueRaw, RouteParamsRaw } from "vue-router";

/** Composable for navigation related functionality
 *  Calls mediakiwistore then router, in that order
 */
export function useNavigation() {
  const route = useRoute();
  const currentNavigationItem = computed(() => {
    const result = route.meta.navigationItem as NavigationItem;
    return result;
  });

  const store = useMediakiwiStore();
  const router = useRouter();

  type NavigationTypeGuard = NavigationItem | Section;

  /** Navigate to the homepage
   * @returns A promise which resolves when the navigation is complete or fails when the navigation fails and throws an Error
   */
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
   * @returns A promise which resolves when the navigation is complete or fails when the navigation fails and throws an Error
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
      // if it's the section, push to the first navigation item in the section which is not a folder
      const section = item as Section;
      const navigationItem = store.rootNavigationItems.find((x) => x.sectionId == section.id && x.viewId);
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
        routeParams = route.params;
        if (itemId) routeParams[navigationItem.view.parameterName] = itemId;
      }

      // called to send user to target screen
      return router.push({ name: navigationItem.id.toString(), params: routeParams, ...options });
    }
  }

  /** (Typecheck) Checks if the provided navigation item is a section or a navigation item
   * @param toBeDetermined The item to check
   */
  const checkTypeGuardIsSection = (toBeDetermined: NavigationTypeGuard): boolean => {
    if ((toBeDetermined as NavigationItem).path) {
      return false;
    }
    return true;
  };

  /**
   *
   * @returns The current root item. The root item is a parent with item navigation or the section.
   */
  function determineCurrentRoootItem(): NavigationItem | undefined {
    // go up the tree untill a parent is found which has item navigation AND has multiple items
    let result: NavigationItem | undefined = undefined;
    let candidate: NavigationItem | undefined = currentNavigationItem.value?.parent;
    while (candidate && !result) {
      if (candidate.hasItemNavigation && candidate.children && candidate.children.length > 1) {
        result = candidate;
      } else {
        if (candidate.parent) {
          // get parent and use it as next candidate
          candidate = candidate.parent;
        } else {
          // if parent is undefined, we have reached the top of the tree
          candidate = undefined;
          result = candidate;
        }
      }
    }
    return result;
  }

  /** The current root item. The root item is a parent with item navigation or the section. */
  const currentRootItem = computed(determineCurrentRoootItem);

  /** Gets the id from the url for the current view, if the current view has a parameter.
   * @returns The id from the url for the current view, if the current view has a parameter or null.
   */
  const currentRouteParamId = computed(() => {
    const navigationItem = currentNavigationItem.value;
    if (navigationItem.view?.parameterName) {
      // if this is a dynamic route, try to resolve route parameter
      return route.params[navigationItem.view.parameterName];
    }
    return null;
  });

  /** Gets all children for a specific navigation item
   * @param navigationItem The navigation item to get the children for
   * @returns The children of the navigation item or empty array if no children are found
   */
  function getChildren(navigationItem: NavigationItem): Array<NavigationItem> {
    const result = navigationItem.children?.filter((item) => !item.view?.parameterName);

    return result ?? [];
  }

  /** Gets all items for the current root item
   * @returns The children of the current root item or all root items for the current section if no root item is found
   */
  function getItemsBasedOnRoot(): NavigationItem[] | undefined {
    // get current root navigation item
    const rootNode = currentRootItem.value;

    if (rootNode) {
      // get all children for navigation item
      const result = rootNode.children;
      return result;
    } else {
      // we are on the root level, so return all root items for current section
      return store.rootNavigationItems.filter((x) => x.sectionId == currentNavigationItem.value?.sectionId);
    }
  }

  /** Gets all items for the current section
   * @returns The children of the current section or empty array if no section is found
   */
  function getAllItemsBasedOnSection(): NavigationItem[] {
    // if route is not for a the current navigation item, return empty array
    if (!currentNavigationItem.value) return [];

    // get all items for the current item's section
    const navigationItems = store.navigationItems.filter((x) => x.sectionId == currentNavigationItem.value.sectionId);
    return navigationItems;
  }

  /** Gets the id from the url for the current view, if the current view has a parameter.
   * @returns The id as string or undefined.
   */
  const currentViewParameter = computed(() => {
    const navigationItem = currentNavigationItem.value;
    if (navigationItem.view?.parameterName) {
      // if this is a dynamic route, try to resolve route parameter
      return typeof route.params[navigationItem.view.parameterName] === "string" ? (route.params[navigationItem.view.parameterName] as string) : undefined;
    }
    return undefined;
  });

  /** Gets the id from the url for the current view, if the current view has a parameter, and converts it to a number. */
  const currentViewParameterNumber = computed(() => Number(currentViewParameter.value));

  /** Gets all sections which have navigation items. */
  const currentSections = computed(() => store.sections.filter((section) => store.navigationItems.some((item) => item.sectionId === section.id)));

  /** Determines if the provided navigation item is the current navigation item
   *  @param navigationItem The navigation item to check
   *  @returns True if the provided navigation item is the current navigation item,
   *  or if the provided navigation item is the ONLY child of the current navigation item that 'has item navigation', and points to a view
   * */
  function determineIfNavigationItemIsActive(navigationItem: NavigationItem): boolean {
    const currentParent = currentNavigationItem.value?.parent;
    if (!currentNavigationItem.value) return false;

    // if the provided navigation item is the same as the current navigation item, then it is active
    // or if the provided navigation item is the ONLY child of the current navigation item that 'has item navigation', and points to a view, then it is active
    const result =
      currentNavigationItem.value.id === navigationItem.id ||
      (currentParent?.id === navigationItem.id && navigationItem.hasItemNavigation && navigationItem.view && navigationItem.children?.length === 1);

    return result === true;
  }

  function determineIfSectionIsActive(section: Section): boolean {
    if (!section) {
      return false;
    }
    return currentNavigationItem.value?.sectionId === section.id;
  }

  return {
    currentNavigationItem,
    currentRootItem,
    navigateTo,
    navigateToParent,
    navigateToHome,
    getChildren,
    determineCurrentRoootItem,
    getItemsBasedOnRoot,
    getAllItemsBasedOnSection,
    determineIfNavigationItemIsActive,
    determineIfSectionIsActive,
    currentRouteParamId,
    /** Gets the id from the url for the current view, if the current view has a parameter. */
    currentViewParameter,
    /** Gets the id from the url for the current view, if the current view has a parameter, and converts it to a number. */
    currentViewParameterNumber,
    /** Gets all sections which have navigation items. */
    currentSections,
  };
}
