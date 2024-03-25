import { ListResult, NavigationItem } from "@/models";
import { INavigationConnector } from "@/services";
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
