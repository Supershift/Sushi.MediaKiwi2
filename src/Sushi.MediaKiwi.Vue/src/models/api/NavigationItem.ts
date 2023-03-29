/** Represents a single item in a navigation hierarchy. */
export interface NavigationItem {
  /** Unique identifier for this item. */
  id: number;
  /** Label to display. */
  name: string;
  /** Application section to which this item belongs. */
  sectionId: number;
  /** Parent of this item in the navigation hierarchy. */
  parentNavigationItemId?: number;
  /** Identifier of the view to load when this navigation item is activated. If empty, the item is a folder. */
  viewId?: number;
  /** If true, this item has a dynamic route which requires an ID in the url. */
  isDynamicRoute: boolean;
  /** If this item is for a dynamic route, the route's dyanmic part is set here, e.g. :userID */
  dynamicRouteParamaterName?: string;
  /** Path, relative to the application's root. Not provided by API, but needs to be calculated based on item's hierarchy. */
  path: string;
}
