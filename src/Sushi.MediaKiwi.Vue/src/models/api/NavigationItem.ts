import { View } from "./View";

/** Represents a single item in a navigation hierarchy. */
export interface NavigationItem {
  /** Unique identifier for this item. */
  id: number;
  /** Label to display. */
  name: string;
  /** Application section to which this item belongs. */
  sectionId: number;
  /** Id of the parent of this item in the navigation hierarchy. */
  parentNavigationItemId?: number;
  /** Identifier of the view to load when this navigation item is activated. If empty, the item is a folder. */
  viewId?: string;
  /** Path, relative to the application's root. Not provided by API, but needs to be calculated based on item's hierarchy. */
  path: string;
  /** Parent item of this item in the navigation hierarchy. */
  parent?: NavigationItem;
  /** Children of this item in the navigation hierarchy */
  children?: NavigationItem[];
  /** View to load when this navigation item is activated. If empty, the item is a folder. */
  view?: View;
  /** Prepend icon - if available will place an icon inform of the Navigation Item */
  icon?: string;
  /** Set to true if this is a dynamic item with its own children. */
  hasItemNavigation?: boolean;
}
