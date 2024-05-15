import { ListResult, NavigationItem } from "@/models";
import { INavigationConnector } from "@/services";
import { navigationItems } from "./repository";
import { AxiosResponse } from "axios";

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

  GetNavigationItem(_id: string): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  CreateNavigationItem(_item: NavigationItem): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  UpdateNavigationItem(_item: NavigationItem): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  DeleteNavigationItem(_id: string): Promise<AxiosResponse<any, any>> {
    throw new Error("Method not implemented.");
  }
}
