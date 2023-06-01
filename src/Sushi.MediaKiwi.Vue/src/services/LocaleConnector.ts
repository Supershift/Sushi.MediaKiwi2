import type { AxiosInstance } from "axios";
import { inject, injectable } from "tsyringe";
import { ILocaleConnector } from "./ILocaleConnector";
import { ListResult, Locale, Paging } from "@/models";

@injectable()
export class LocaleConnector implements ILocaleConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetLocales(onlyEnabled: boolean, paging?: Paging): Promise<ListResult<Locale>> {
    // build querystring params
    const query = {
      onlyEnabled: onlyEnabled,
      ...paging,
    };
    const response = await this.axios.get<ListResult<Locale>>("/locales", { params: query });
    return response.data;
  }

  async GetEnabledLocales(): Promise<ListResult<Locale>> {
    const response = await this.axios.get<ListResult<Locale>>("/locales/enabled");
    return response.data;
  }
}
