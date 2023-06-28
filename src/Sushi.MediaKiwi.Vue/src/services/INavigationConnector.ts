import { ListResult, Paging } from "@/models";
import { NavigationItem } from "@/models";

export interface INavigationConnector {
  GetNavigationItems(paging?: Paging): Promise<ListResult<NavigationItem>>;
}
