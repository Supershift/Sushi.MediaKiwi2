import { Section } from "./Section";

/** Represents a single item in a navigation hierarchy. */
export type NavigationItem = {
  /** Unique identifier for this item. */
  id: string;
  /** Label to display. */
  name: string;
  /** If defined, name of the url parameter expected by VueRouter for this item */
  parameterName?: string;
  /** Parent item of this item in the navigation hierarchy. */
  parent?: NavigationItem;
  /** Children of this item in the navigation hierarchy */
  children: NavigationItem[];
  /** Prepend icon - if available will place an icon inform of the Navigation Item */
  icon?: string;
  /** If defined contains details about the view to render for this item */
  componentKey?: string;
  /** Section under which this item is placed. */
  section: Section;
  /** If not empty, access to this screen is restricted to these roles. */
  roles?: string[];
  /** If defined, the layout to use for this item */
  layout?: string;
  /** Custom breadcrumb label */
  breadcrumbLabel?: string;
  /** If defined, this function will be called to get the breadcrumb label for this item. */
  getBreadcrumbLabelCallback?: (currentViewParameter: any) => Promise<string>;
};
