import type { NavigationItem } from "@/models/";
import type { RouteLocationNormalizedLoaded } from "vue-router";

/**
 * Get all direct children for an INavigationItem.
 * @param navigationItem
 * @param navigationItems
 * @param excludeDataItems If true, no children will be returned which require an object instance, i.e. an order details screen which requires an order.
 * @returns
 */
export function getNavigationItemChildren(navigationItem: NavigationItem | undefined, navigationItems: NavigationItem[], excludeDataItems: boolean): Array<NavigationItem> {
  let result = navigationItems.filter((item) => item.parentNavigationItemId == navigationItem?.id);
  if (excludeDataItems) {
    result = result.filter((item) => !item.isDynamicRoute);
  }

  return result;
}

export function getNavigationItemForRoute(route: RouteLocationNormalizedLoaded, navigationItems: NavigationItem[]): NavigationItem | undefined {
  // check from route, otherwise check from store
  const result = navigationItems.find((item) => item.id.toString() == route?.name);
  // if (route !== undefined && route.name === undefined && section !== undefined && section.id) {
  //   result = navigationItems.find((item) => item.id.toString() == section?.id.toString());
  // }

  return result;
}
