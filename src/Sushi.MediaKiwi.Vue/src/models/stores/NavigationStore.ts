import { type IBreadcrumb } from "../breadcrumb";
import { type INavigationItem } from "../navigation";
import { type ISection } from "../section";

export interface INavigationState {
  navigationItems: Array<INavigationItem>;
  sectionItems: Array<ISection>;
  breadcrumbItems: Array<IBreadcrumb>;
  drawer: boolean;
}
export class NavigationState implements INavigationState {
  navigationItems: Array<INavigationItem>;
  sectionItems: Array<ISection>;
  breadcrumbItems: Array<IBreadcrumb>;
  drawer: boolean;

  constructor(navigationItems: Array<INavigationItem>, sectionItems: Array<ISection>, breadcrumbItems: Array<IBreadcrumb>, drawer: boolean) {
    this.navigationItems = navigationItems;
    this.sectionItems = sectionItems;
    this.breadcrumbItems = breadcrumbItems;
    this.drawer = drawer;
  }
}
