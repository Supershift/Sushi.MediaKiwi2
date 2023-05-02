import { NavigationItem } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetNavigationItems() {
    const response = await this.axios.get<ListResult<NavigationItem>>("/navigationitems");
    return response.data;
  }
}
