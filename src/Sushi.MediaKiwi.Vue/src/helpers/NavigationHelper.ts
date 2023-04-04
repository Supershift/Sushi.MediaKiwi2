import type { NavigationItem } from "@/models/";

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
