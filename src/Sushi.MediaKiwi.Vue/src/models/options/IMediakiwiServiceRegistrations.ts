import { constructor } from "tsyringe/dist/typings/types";
import type { INavigationConnector, IViewConnector, ISectionConnector } from "@/services";

export interface IMediakiwiServiceRegistrations {
  navigationConnector?: constructor<INavigationConnector>;
  viewConnector?: constructor<IViewConnector>;
  sectionConnector?: constructor<ISectionConnector>;
}
