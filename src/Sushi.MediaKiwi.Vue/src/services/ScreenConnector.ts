import type { IScreenResponse } from "@/models/responses";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";
import { IScreenConnector } from "./IScreenConnector";

@injectable()
export class ScreenConnector implements IScreenConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async GetScreens() {
    const response = await this.axios.get<ListResult<IScreenResponse>>("/screens");
    return response.data;
  }
}
