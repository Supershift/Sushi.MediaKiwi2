import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import { Country } from "./../models/Country";
import { ListResult, Paging } from "@/models";

@injectable()
export class CountryConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async GetAll(paging?: Paging): Promise<ListResult<Country>>;
  async GetAll(paging?: Paging, countryCode?: string): Promise<ListResult<Country>>;
  async GetAll(paging?: Paging, countryCode?: string, countryName?: string): Promise<ListResult<Country>>;
  async GetAll(paging?: Paging, countryCode?: string, countryName?: string): Promise<ListResult<Country>> {
    // build querystring params
    const query = {
      ...(countryCode && { countryCode }),
      ...(countryName && { countryName }),
      ...paging,
    };
    const response = await this.axios.get<ListResult<Country>>("/countries", { params: query });
    return response.data;
  }

  async GetCountry(code: string): Promise<Country> {
    const response = await this.axios.get<Country>(`/countries/${code}`);
    return response.data;
  }
}
