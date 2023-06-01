import { ListResult, Locale, Paging } from "@/models";

export interface ILocaleConnector {
  GetLocales(onlyEnabled: boolean, paging?: Paging): Promise<ListResult<Locale>>;
  GetEnabledLocales(): Promise<ListResult<Locale>>;
}
