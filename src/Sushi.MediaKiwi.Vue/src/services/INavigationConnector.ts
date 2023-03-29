import { ListResult } from "@/models";
import { NavigationItem } from "@/models";

export interface INavigationConnector {
  GetNavigationItems(): Promise<ListResult<NavigationItem>>;
}
