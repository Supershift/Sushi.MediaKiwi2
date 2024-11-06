import type { Paging, SectionDto } from "@/models";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import type ListResult from "@/models/api/ListResult";
import { ISectionConnector } from "./ISectionConnector";

@injectable()
export class SectionConnector implements ISectionConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async CreateSection(id: string, request: SectionDto): Promise<SectionDto> {
    const response = await this.axios.post<SectionDto>(`/sections/${encodeURIComponent(id)}`, request);
    return response.data;
  }

  async DeleteSection(id: string): Promise<void> {
    await this.axios.delete(`/sections/${encodeURIComponent(id)}`);
  }

  async GetSections(paging?: Paging): Promise<ListResult<SectionDto>> {
    // build querystring params
    const query = {
      ...paging,
    };
    const response = await this.axios.get<ListResult<SectionDto>>("/sections", { params: query });
    return response.data;
  }

  async GetSection(id: string): Promise<SectionDto | undefined> {
    const response = await this.axios.get<SectionDto>(`/sections/${encodeURIComponent(id)}`);
    return response.data;
  }

  async UpdateSection(id: string, request: SectionDto): Promise<SectionDto> {
    const response = await this.axios.put<SectionDto>(`/sections/${encodeURIComponent(id)}`, request);
    return response.data;
  }
}
