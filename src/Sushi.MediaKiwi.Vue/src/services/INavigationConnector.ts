import { ListResult } from "@/models";
import { INavigationResponse } from "@/models/responses";

export interface INavigationConnector {
  GetNavigationItems(): Promise<ListResult<INavigationResponse>>;
}
