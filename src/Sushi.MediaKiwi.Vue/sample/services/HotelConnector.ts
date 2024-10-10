import { injectable, inject } from "tsyringe";
import type { AxiosInstance, AxiosResponse } from "axios";
import { HotelDto } from "./../models/HotelDto";
import { ListResult, Paging } from "@/models";

@injectable()
export class HotelConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async GetAllAsync(paging?: Paging, countryCode?: string, isActive?: boolean): Promise<ListResult<HotelDto>> {
    // build querystring params
    const query = {
      ...(paging && { paging }),
      ...(countryCode && { countryCode }),
      ...(isActive && { isActive }),
    };
    const response = await this.axios.get<ListResult<HotelDto>>("/hotel", { params: query });
    return response.data;
  }

  async GetAsync(id: number): Promise<HotelDto> {
    const response = await this.axios.get<HotelDto>(`/hotel/${id}`);
    return response.data;
  }

  async SaveAsync(request: HotelDto): Promise<HotelDto> {
    const createHotelRequest = {
      countryCode: request.countryCode,
      name: request.name,
      isActive: request.isActive,
      srp: request.srp,
    };

    if (request?.id > 0) {
      return (await this.axios.put<HotelDto>(`/hotel/${request.id}`, createHotelRequest)).data;
    } else {
      return (await this.axios.post<HotelDto>("/hotel", createHotelRequest)).data;
    }
  }

  async DeleteAsync(id: number): Promise<AxiosResponse> {
    return await this.axios.delete<HotelDto>(`/hotel/${id}`);
  }
}
