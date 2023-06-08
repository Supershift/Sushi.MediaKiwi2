import { ListResult, Locale, Paging } from "@/models";

export interface ILocaleConnector {
  Create(id: string, request: Locale): Promise<Locale>;
  Delete(id: string): Promise<void>;
  Get(id: string): Promise<Locale>;
  GetAll(onlyEnabled: boolean, paging?: Paging): Promise<ListResult<Locale>>;
  GetEnabledLocales(): Promise<ListResult<Locale>>;
  Update(id: string, request: Locale): Promise<Locale>;
}
