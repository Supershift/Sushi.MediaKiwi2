import type { INavigationResponse } from "@/models/responses";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async GetNavigationItems() {
    const response = await this.axios.get<ListResult<INavigationResponse>>("/navigationitems");
    return response.data;
  }
}
