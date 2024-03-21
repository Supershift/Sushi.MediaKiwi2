import { type INavigationConnector, ListResult, NavigationItem } from "@/framework";
import { navigationItems } from "./repository";

export class NavigationConnector implements INavigationConnector {
  GetNavigationItems(): Promise<ListResult<NavigationItem>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<NavigationItem>();
      result.result = navigationItems;
      result.totalCount = navigationItems.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
