import { constructor } from "tsyringe/dist/typings/types";
import type { INavigationConnector, IViewConnector, ISectionConnector, ILocaleConnector } from "@/services";
import { IRoleConnector } from "@/services/IRoleConnector";
import { IAdminTranslationConnector } from "@/services/interfaces";

export interface IMediakiwiServiceRegistrations {
  navigationConnector?: constructor<INavigationConnector>;
  viewConnector?: constructor<IViewConnector>;
  sectionConnector?: constructor<ISectionConnector>;
  roleConnector?: constructor<IRoleConnector>;
  localeConnector?: constructor<ILocaleConnector>;
  adminTranslationConnector?: constructor<IAdminTranslationConnector>;
}
