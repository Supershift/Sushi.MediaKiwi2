import { NavigationItem as NavigationItemModel, NavigationTree, Section as SectionModel } from "@/models/navigation";
import { INavigationProvider } from "./INavigationProvider";

export type NavigationItem = {
  /** Unique identifier for this item. */
  id: string;
  /** Label to display. */
  name: string;
  /** If defined, name of the url parameter expected by VueRouter for this item */
  parameterName?: string;
  /** Children of this item in the navigation hierarchy */
  children?: NavigationItem[];
  /** Prepend icon - if provided will place an icon in front of the Navigation Item */
  icon?: string;
  /** If defined, key of the component's module */
  componentKey?: string;
  /** If provided, access to this item is restricted to these roles. */
  roles?: string[];
  /** If provided, the navigation item will have a layout with that name */
  layout?: string;
  /**
   * If defined, the navigation item is used to group items in the navigation hierarchy and can be toggled through the UI.
   * Groups are not displayed in the breadcrumbs.
   */
  isGroup?: boolean;
  /** Append a divider beneath the menu item */
  appendDivider?: boolean;
};

export type Section = {
  /** Unique identifier for this section. */
  id: string;
  /** Label to display. */
  name: string;
  /** Prepend icon - if provided will place an icon above the Section */
  icon?: string;
  /** If provided, access to this section is restricted to these roles. */
  roles?: string[];
  /** Tooltip text */
  tooltip?: string;
  /** Items in this section */
  items: NavigationItem[];
};

export class ObjectNavigationProvider implements INavigationProvider {
  private navigationTree: NavigationTree = new NavigationTree([]);

  async GetTreeAsync(): Promise<NavigationTree> {
    return this.navigationTree;
  }

  SetTree(sections: Section[]) {
    // convert provided sections to tree
    const resultItems: SectionModel[] = [];
    sections.forEach((section) => {
      const resultItem: SectionModel = {
        id: section.id,
        name: section.name,
        icon: section.icon,
        roles: section.roles,
        tooltip: section.tooltip,
        items: [],
      };

      resultItem.items = this.convertNavigationItem(section.items, resultItem);

      resultItems.push(resultItem);
    });

    this.navigationTree = new NavigationTree(resultItems);
  }

  private convertNavigationItem(items: NavigationItem[], section: SectionModel, parent?: NavigationItemModel): NavigationItemModel[] {
    const result: NavigationItemModel[] = [];
    items.forEach((item) => {
      const resultItem: NavigationItemModel = {
        id: item.id,
        name: item.name,
        parameterName: item.parameterName,
        icon: item.icon,
        roles: item.roles,
        section: section,
        parent: parent,
        children: [],
        layout: item.layout,
        appendDivider: item.appendDivider,
        isGroup: item.isGroup,
      };

      if (!item.isGroup) resultItem.componentKey = item.componentKey;

      if (item.children) resultItem.children = this.convertNavigationItem(item.children, section, resultItem);
      result.push(resultItem);
    });
    return result;
  }
}
