import type { Sorting, View } from "@/models";
import { injectable, inject } from "tsyringe";
import type ListResult from "@/models/api/ListResult";
import { IViewConnector } from "./IViewConnector";
import { Paging } from "@/models/api/Paging";
import type { AxiosInstance } from "axios";

@injectable()
export class ViewConnector implements IViewConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async CreateView(id: string, request: View): Promise<View> {
    const response = await this.axios.post<View>(`/views/${id}`, request);
    return response.data;
  }

  async DeleteView(id: string): Promise<void> {
    await this.axios.delete(`/views/${id}`);
  }

  async GetViews(paging?: Paging, sorting?: Sorting): Promise<ListResult<View>> {
    // build querystring params
    const query = {
      ...paging,
      ...sorting,
    };
    const response = await this.axios.get<ListResult<View>>("/views", { params: query });
    return response.data;
  }

  async GetView(id: string): Promise<View | undefined> {
    const response = await this.axios.get<View>(`/views/${encodeURIComponent(id)}`);
    return response.data;
  }

  async UpdateView(id: string, request: View): Promise<View> {
    const response = await this.axios.put<View>(`/views/${encodeURIComponent(id)}`, request);
    return response.data;
  }
}
