import { constructor } from "tsyringe/dist/typings/types";
import { IAdminTranslationConnector } from "@/services/interfaces";

export interface IMediakiwiServiceRegistrations {
  adminTranslationConnector?: constructor<IAdminTranslationConnector>;
}
