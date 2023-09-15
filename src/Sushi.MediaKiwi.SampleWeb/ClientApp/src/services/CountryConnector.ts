import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import { Country } from "@/models/Country";
import { ListResult, Paging } from "@supershift/mediakiwi-vue";

@injectable()
export class CountryConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async GetAll(paging?: Paging): Promise<ListResult<Country>> {
    // build querystring params
    const query = {
      ...paging,
    };
    const response = await this.axios.get<ListResult<Country>>("/countries", { params: query });
    return response.data;
  }

  async SaveAsync(request: Country): Promise<Country> {
    return (await this.axios.put<Country>(`/countries/${request.code}`, request)).data;
  }
}
