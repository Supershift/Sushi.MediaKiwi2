import { NavigationItem, Paging, Translation } from "@/models";
import ListResult from "@/models/api/ListResult";
import { INavigationConnector } from "./interfaces/INavigationConnector";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance, AxiosResponse } from "axios";
import { IAdminTranslationConnector } from "./interfaces";

@injectable()
export class AdminTranslationConnector implements IAdminTranslationConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async Update(item: Translation): Promise<void> {
    await this.axios.put<void>(
      `/admin/translations/${encodeURIComponent(item.localeId)}/${encodeURIComponent(item.namespace)}/${encodeURIComponent(item.key)}`,
      item
    );
  }

  async GetKeys(localeId?: string): Promise<ListResult<string>> {
    const query = {
      localeId,
    };
    const response = await this.axios.get<ListResult<string>>("/admin/translations/keys", { params: query });
    return response.data;
  }
  async GetAll(localeId?: string, namespace?: string, key?: string, value?: string): Promise<ListResult<Translation>> {
    // build querystring params
    const query = {
      localeId,
      namespace,
      key,
      value,
    };
    const response = await this.axios.get<ListResult<Translation>>("/admin/translations", { params: query });
    return response.data;
  }

  async GetNamespaces(localeId?: string) {
    // build querystring params
    const query = {
      localeId,
    };
    const response = await this.axios.get<ListResult<string>>("/admin/translations/namespaces", { params: query });
    return response.data;
  }
}
