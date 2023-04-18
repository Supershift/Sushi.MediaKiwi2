import type { View } from "@/models";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";
import { IViewConnector } from "./IViewConnector";
import { Paging } from "@/models/api/Paging";

@injectable()
export class ViewConnector implements IViewConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async CreateView(request: View): Promise<View> {
    const response = await this.axios.post<View>(`/views`, request);
    return response.data;
  }

  async DeleteView(id: number): Promise<void> {
    await this.axios.delete(`/views/${id}`);
  }

  async GetViews(sectionId?: number, paging?: Paging): Promise<ListResult<View>> {
    // build querystring params
    const query = {
      sectionId: sectionId,
      ...paging,
    };
    const response = await this.axios.get<ListResult<View>>("/views", { params: query });
    return response.data;
  }

  async GetView(id: number): Promise<View | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await this.axios.get<View>(`/views/${id}`);
    return response.data;
  }

  async UpdateView(id: number, request: View): Promise<View> {
    const response = await this.axios.put<View>(`/views/${id}`, request);
    return response.data;
  }
}
