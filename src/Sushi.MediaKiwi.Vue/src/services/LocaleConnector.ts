import type { AxiosInstance } from "axios";
import { inject, injectable } from "tsyringe";
import { ILocaleConnector } from "./ILocaleConnector";
import { ListResult, Locale, Paging } from "@/models";

@injectable()
export class LocaleConnector implements ILocaleConnector {
  readonly path = "/locales";

  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async Create(id: string, request: Locale): Promise<Locale> {
    const response = await this.axios.post<Locale>(`${this.path}/${encodeURIComponent(id)}`, request);
    return response.data;
  }

  async Delete(id: string): Promise<void> {
    await this.axios.delete(`${this.path}/${encodeURIComponent(id)}`);
  }

  async Get(id: string): Promise<Locale> {
    const response = await this.axios.get<Locale>(`${this.path}/${encodeURIComponent(id)}`);
    return response.data;
  }

  async GetAll(onlyEnabled: boolean, paging?: Paging): Promise<ListResult<Locale>> {
    // build querystring params
    const query = {
      onlyEnabled: onlyEnabled,
      ...paging,
    };
    const response = await this.axios.get<ListResult<Locale>>(`${this.path}`, { params: query });
    return response.data;
  }

  async GetEnabledLocales(): Promise<ListResult<Locale>> {
    const response = await this.axios.get<ListResult<Locale>>(`${this.path}/enabled`);
    return response.data;
  }

  async Update(id: string, request: Locale): Promise<Locale> {
    const response = await this.axios.put<Locale>(`${this.path}/${encodeURIComponent(id)}`, request);
    return response.data;
  }
}
