import { injectable, inject } from "tsyringe";
import type { AxiosInstance, AxiosResponse } from "axios";
import { Hotel } from "./../models/Hotel";
import { ListResult, Paging } from "@/models";

@injectable()
export class HotelConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async GetAllAsync(paging?: Paging, countryCode?: string, isActive?: boolean): Promise<ListResult<Hotel>> {
    // build querystring params
    const query = {
      ...(paging && { paging }),
      ...(countryCode && { countryCode }),
      ...(isActive && { isActive }),
    };
    const response = await this.axios.get<ListResult<Hotel>>("/hotels", { params: query });
    return response.data;
  }

  async GetAsync(id: number): Promise<Hotel> {
    const response = await this.axios.get<Hotel>(`/hotels/${id}`);
    return response.data;
  }

  async SaveAsync(request: Hotel): Promise<Hotel> {
    if (request?.id > 0) {
      return (await this.axios.put<Hotel>(`/hotels/${request.id}`, request)).data;
    } else {
      return (await this.axios.post<Hotel>("/hotels", request)).data;
    }
  }

  async DeleteAsync(id: number): Promise<AxiosResponse> {
    return await this.axios.delete<Hotel>(`/hotels${id}`);
  }
}
