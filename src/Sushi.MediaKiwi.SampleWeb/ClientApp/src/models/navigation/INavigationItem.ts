export interface INavigationItem {
  id: number;
  name: string;
  typeId: number;
  sectionId: number;
  parentNavigationItemId?: number;
  screenId?: number;
  path: string;
  /** If true, this item has a dynamic route which requires an ID in the url. */
  isDynamicRoute: boolean;
  /** If this item is for a dynamic route, the route's dyanmic part is set here, e.g. :userID */
  dynamicRouteParamaterName?: string;
}
