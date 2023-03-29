import { type IBreadcrumb } from "../breadcrumb";
import { type NavigationItem, type Section } from "../api";

export interface INavigationState {
  navigationItems: Array<NavigationItem>;
  sectionItems: Array<Section>;
  breadcrumbItems: Array<IBreadcrumb>;
  drawer: boolean;
}
export class NavigationState implements INavigationState {
  navigationItems: Array<NavigationItem>;
  sectionItems: Array<Section>;
  breadcrumbItems: Array<IBreadcrumb>;
  drawer: boolean;

  constructor(navigationItems: Array<NavigationItem>, sectionItems: Array<Section>, breadcrumbItems: Array<IBreadcrumb>, drawer: boolean) {
    this.navigationItems = navigationItems;
    this.sectionItems = sectionItems;
    this.breadcrumbItems = breadcrumbItems;
    this.drawer = drawer;
  }
}
