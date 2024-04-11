import { NavigationItem, Paging } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./interfaces/INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance, AxiosResponse } from "axios";

@injectable()
export class NavigationConnector implements INavigationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetNavigationItems(paging?: Paging) {
    // build querystring params
    const query = {
      ...paging,
    };
    const response = await this.axios.get<ListResult<NavigationItem>>("/navigationitems", { params: query });
    return response.data;
  }

  async GetNavigationItem(id: number): Promise<NavigationItem> {
    const response = await this.axios.get<NavigationItem>(`/navigationitems/${id}`);
    return response.data;
  }

  async CreateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    const response = await this.axios.post<NavigationItem>(`/navigationitems/${item.id}`, item);
    return response.data;
  }

  async UpdateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    const response = await this.axios.put<NavigationItem>(`/navigationitems/${item.id}`, item);
    return response.data;
  }

  async DeleteNavigationItem(id: number): Promise<AxiosResponse> {
    const response = await this.axios.delete<NavigationItem>(`/navigationitems/${id}`);
    return response;
  }
}
