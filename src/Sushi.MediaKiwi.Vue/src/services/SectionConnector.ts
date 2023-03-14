import type { ISectionResponse } from "@/models/responses";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";
import { ISectionConnector } from "./ISectionConnector";

@injectable()
export class SectionConnector implements ISectionConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async GetSections() {
    const response = await this.axios.get<ListResult<ISectionResponse>>("/sections");
    return response.data;
  }
}
