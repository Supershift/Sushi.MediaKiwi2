import { type INavigationConnector, ListResult, INavigationItem } from "@supershift/mediakiwi-vue";
import { navigationItems } from "./repository";

export class NavigationConnector implements INavigationConnector {
  GetNavigationItems(): Promise<ListResult<INavigationItem>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<INavigationItem>();
      result.result = navigationItems;
      result.totalCount = navigationItems.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
