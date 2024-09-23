import { ListResult, Paging, Sorting } from "@/models";
import { NavigationItemDto } from "@/models";
import { AxiosResponse } from "axios";

export interface INavigationConnector {
  GetNavigationItems(sectionId?: string, paging?: Paging, sorting?: Sorting<NavigationItemDto>): Promise<ListResult<NavigationItemDto>>;
  GetNavigationItem(id: string): Promise<NavigationItemDto>;
  CreateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto>;
  UpdateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto>;
  DeleteNavigationItem(id: string): Promise<AxiosResponse>;
}
