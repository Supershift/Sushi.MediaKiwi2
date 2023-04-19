import type { Paging, Section } from "@/models";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";
import { ISectionConnector } from "./ISectionConnector";

@injectable()
export class SectionConnector implements ISectionConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async CreateSection(request: Section): Promise<Section> {
    const response = await this.axios.post<Section>(`/sections`, request);
    return response.data;
  }

  async DeleteSection(id: number): Promise<void> {
    await this.axios.delete(`/sections/${id}`);
  }

  async GetSections(paging?: Paging): Promise<ListResult<Section>> {
    // build querystring params
    const query = {
      ...paging,
    };
    const response = await this.axios.get<ListResult<Section>>("/sections", { params: query });
    return response.data;
  }

  async GetSection(id: number): Promise<Section | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await this.axios.get<Section>(`/sections/${id}`);
    return response.data;
  }

  async UpdateSection(id: number, request: Section): Promise<Section> {
    const response = await this.axios.put<Section>(`/sections/${id}`, request);
    return response.data;
  }
}
