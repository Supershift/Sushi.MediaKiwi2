import { constructor } from "tsyringe/dist/typings/types";
import type { INavigationConnector, IViewConnector, ISectionConnector } from "@/services";
import { IRoleConnector } from "@/services/IRoleConnector";

export interface IMediakiwiServiceRegistrations {
  navigationConnector?: constructor<INavigationConnector>;
  viewConnector?: constructor<IViewConnector>;
  sectionConnector?: constructor<ISectionConnector>;
  roleConnector?: constructor<IRoleConnector>;
}
