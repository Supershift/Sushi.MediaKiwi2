import { ViewDto } from "./ViewDto";

/** Represents a single item in a navigation hierarchy. */
export interface NavigationItemDto {
  /** Unique identifier for this item. */
  id: string;
  /** Label to display. */
  name: string;
  /** Application section to which this item belongs. */
  sectionId: string;
  /** Id of the parent of this item in the navigation hierarchy. */
  parentNavigationItemId?: string | null;
  /** Identifier of the view to load when this navigation item is activated. If empty, the item is a folder. */
  viewId?: string | null;

  /** Parent item of this item in the navigation hierarchy. */
  parent?: NavigationItemDto;
  /** Children of this item in the navigation hierarchy */
  children?: NavigationItemDto[];
  /** View to load when this navigation item is activated. If empty, the item is a folder. */
  view?: ViewDto;
  /** Prepend icon - if available will place an icon inform of the Navigation Item */
  icon?: string | null;
  /** Set to true if this is a dynamic item with its own children. */
  hasItemNavigation?: boolean;
  
  sortOrder: number;
}
