import { NavigationItem, Paging } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetNavigationItems(paging?: Paging) {
    // build querystring params
    const query = {
      ...paging,
    };
    const response = await this.axios.get<ListResult<NavigationItem>>("/navigationitems", { params: query });
    return response.data;
  }
}
