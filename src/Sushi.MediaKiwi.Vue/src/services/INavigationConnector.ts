import { ListResult } from "@/models";
import { INavigationItem } from "@/models";

export interface INavigationConnector {
  GetNavigationItems(): Promise<ListResult<INavigationItem>>;
}
