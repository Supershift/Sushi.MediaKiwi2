import { ListResult, Paging, Sorting } from "@/models";
import { NavigationItem } from "@/models";
import { AxiosResponse } from "axios";

export interface INavigationConnector {
  GetNavigationItems(sectionId?: string, paging?: Paging, sorting?: Sorting<NavigationItem>): Promise<ListResult<NavigationItem>>;
  GetNavigationItem(id: string): Promise<NavigationItem>;
  CreateNavigationItem(item: NavigationItem): Promise<NavigationItem>;
  UpdateNavigationItem(item: NavigationItem): Promise<NavigationItem>;
  DeleteNavigationItem(id: string): Promise<AxiosResponse>;
}
