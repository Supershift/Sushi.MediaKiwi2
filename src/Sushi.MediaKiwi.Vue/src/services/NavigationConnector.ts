import { INavigationItem } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async GetNavigationItems() {
    const response = await this.axios.get<ListResult<INavigationItem>>("/navigationitems");
    return response.data;
  }
}
