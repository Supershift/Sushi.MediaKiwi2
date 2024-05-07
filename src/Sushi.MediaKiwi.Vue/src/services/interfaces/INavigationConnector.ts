import { ListResult, Paging, Sorting } from "@/models";
import { NavigationItem } from "@/models";
import { AxiosResponse } from "axios";

export interface INavigationConnector {
  GetNavigationItems(paging?: Paging, sectionId?: number, sorting?: Sorting<NavigationItem>): Promise<ListResult<NavigationItem>>;
  GetNavigationItem(id: number): Promise<NavigationItem>;
  CreateNavigationItem(item: NavigationItem): Promise<NavigationItem>;
  UpdateNavigationItem(item: NavigationItem): Promise<NavigationItem>;
  DeleteNavigationItem(id: number): Promise<AxiosResponse>;
}
