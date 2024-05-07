import { NavigationItem, Paging, Sorting } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./interfaces/INavigationConnector";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from "axios";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetNavigationItems(paging?: Paging, sectionId?: number, sorting?: Sorting<NavigationItem>): Promise<ListResult<NavigationItem>> {
    const { sortBy, sortDirection } = sorting || {};

    // build querystring params
    const query = {
      ...(sectionId && { sectionId }),
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortDirection }),
      ...paging,
    };
    const response = await this.axios.get<ListResult<NavigationItem>>("/navigationitems", { params: query });
    return response.data;
  }

  async GetNavigationItem(id: number): Promise<NavigationItem> {
    const response = await this.axios.get<NavigationItem>(`/navigationitems/${encodeURIComponent(id)}`);
    return response.data;
  }

  async CreateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    const response = await this.axios.post<NavigationItem>(`/navigationitems`, item);
    return response.data;
  }

  async UpdateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    const response = await this.axios.put<NavigationItem>(`/navigationitems/${encodeURIComponent(item.id)}`, item);
    return response.data;
  }

  async DeleteNavigationItem(id: number): Promise<AxiosResponse> {
    const response = await this.axios.delete<NavigationItem>(`/navigationitems/${encodeURIComponent(id)}`);
    return response;
  }
}
