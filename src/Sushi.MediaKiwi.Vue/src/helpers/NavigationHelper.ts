import type { INavigationItem } from "@/models/navigation";
import type { RouteLocationNormalizedLoaded } from "vue-router";

/**
     * Get all direct children for an INavigationItem.
     * @param navigationItem 
     * @param navigationItems 
     * @param excludeDataItems If true, no children will be returned which require an object instance, i.e. an order details screen which requires an order.
     * @returns 
     */
export function getNavigationItemChildren(navigationItem: INavigationItem | undefined, navigationItems: INavigationItem[], excludeDataItems: boolean) {
    var result = navigationItems.filter(item => item.parentNavigationItemId == navigationItem?.id);
    if (excludeDataItems) {
        result = result.filter(item => !item.isDynamicRoute);
    }
    return result;
}

export function getNavigationItemForRoute(route: RouteLocationNormalizedLoaded , navigationItems: INavigationItem[]) : INavigationItem | undefined
{
    var result = navigationItems.find(item => item.id.toString() == route.name);
    return result;
}
