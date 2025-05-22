import { Section } from "./Section";

/** Represents a single item in a navigation hierarchy. */
export class NavigationItem {
  constructor(
    /** Unique identifier for this item. */
    readonly id: string,
    /** Label to display. */
    readonly name: string,
    /** Section under which this item is placed. */
    readonly section: Section,
    /** Children of this item in the navigation hierarchy */
    public children: NavigationItem[],
    /** If defined, name of the url parameter expected by VueRouter for this item */
    readonly parameterName?: string | null,
    /** Parent item of this item in the navigation hierarchy. */
    readonly parent?: NavigationItem,
    /** Prepend icon - if available will place an icon inform of the Navigation Item */
    readonly icon?: string,
    /** If defined contains details about the view to render for this item */
    public componentKey?: string,
    /** If not empty, access to this screen is restricted to these roles. */
    readonly roles?: string[],
    /** If defined, the layout to use for this item */
    readonly layout?: string,
    /** If defined, the entity that this navigation item represents. Used to display the entity name in the breadcrumbs. */
    public entity?: {
      label: string;
      id: string;
    },
    /**
     * If defined, the navigation item is used to group items in the navigation hierarchy and can be toggled through the UI.
     * Groups are not displayed in the breadcrumbs.
     */
    readonly isGroup?: boolean,
    /** Append a divider beneath the menu item */
    readonly appendDivider?: boolean,
    public tooltip?: string,
    /** If defined, the navigation item is not displayed in the UI. */
    public displayState?: NavigationItemDisplayState
  ) {}

  disable(tooltip?: string) {
    this.displayState = "disabled";
    this.tooltip = tooltip;
  }

  hide() {
    this.displayState = "hidden";
  }

  show(tooltip?: string) {
    this.displayState = undefined;
    this.tooltip = tooltip;
  }

  get isDisabled() {
    return this.displayState === "disabled";
  }

  get isHidden() {
    return this.displayState === "hidden";
  }
}

export type NavigationItemDisplayState = "disabled" | "hidden" | undefined;
