import { ListResult, Translation } from "@/models";

export interface IAdminTranslationConnector {
  GetNamespaces(localeId?: string): Promise<ListResult<string>>;
  GetKeys(localeId?: string): Promise<ListResult<string>>;
  GetAll(localeId?: string, namespace?: string, key?: string, value?: string): Promise<ListResult<Translation>>;
  Update(item: Translation): Promise<void>;
}
