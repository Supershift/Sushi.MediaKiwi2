import { type INavigationConnector, ListResult, INavigationResponse } from "@supershift/mediakiwi-vue";
import { navigationItems } from "./repository";

export class NavigationConnector implements INavigationConnector {
  GetNavigationItems(): Promise<ListResult<INavigationResponse>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<INavigationResponse>();
      result.result = navigationItems;
      result.totalCount = navigationItems.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
