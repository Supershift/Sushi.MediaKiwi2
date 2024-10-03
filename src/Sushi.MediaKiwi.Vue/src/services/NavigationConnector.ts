import { NavigationItemDto, Paging, Sorting } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./interfaces/INavigationConnector";
import { injectable, inject } from "tsyringe";
import { type AxiosInstance, type AxiosResponse } from "axios";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetNavigationItems(sectionId?: string, paging?: Paging, sorting?: Sorting<NavigationItemDto>): Promise<ListResult<NavigationItemDto>> {
    const { sortBy, sortDirection } = sorting || {};

    // build querystring params
    const query = {
      ...(sectionId && { sectionId }),
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortDirection }),
      ...paging,
    };
    const response = await this.axios.get<ListResult<NavigationItemDto>>("/navigationitems", { params: query });
    return response.data;
  }

  async GetNavigationItem(id: string): Promise<NavigationItemDto> {
    const response = await this.axios.get<NavigationItemDto>(`/navigationitems/${encodeURIComponent(id)}`);
    return response.data;
  }

  async CreateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto> {
    const response = await this.axios.post<NavigationItemDto>(`/navigationitems/${encodeURIComponent(item.id)}`, item);
    return response.data;
  }

  async UpdateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto> {
    const response = await this.axios.put<NavigationItemDto>(`/navigationitems/${encodeURIComponent(item.id)}`, item);
    return response.data;
  }

  async DeleteNavigationItem(id: string): Promise<AxiosResponse> {
    const response = await this.axios.delete<NavigationItemDto>(`/navigationitems/${encodeURIComponent(id)}`);
    return response;
  }
}
