import { constructor } from "tsyringe/dist/typings/types";
import type { INavigationConnector, IScreenConnector, ISectionConnector } from "@/services";

export interface IMediakiwiServiceRegistrations {
  navigationConnector?: constructor<INavigationConnector>;
  screenConnector?: constructor<IScreenConnector>;
  sectionConnector?: constructor<ISectionConnector>;
}
