import type { INavigationResponse } from "@/models/responses";
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  GetNavigationItems = async () => {
    return this.axios.get<ListResult<INavigationResponse>>("/navigationitems").then((response) => {
      return response.data;
    });
  };
}
