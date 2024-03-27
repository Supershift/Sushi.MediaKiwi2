import { NavigationConnector, ViewConnector, SectionConnector } from "./";
import { IMediakiwiServiceRegistrations } from "@/models";

export function getFakes(): IMediakiwiServiceRegistrations {
  var result: IMediakiwiServiceRegistrations = {
    navigationConnector: NavigationConnector,
    viewConnector: ViewConnector,
    sectionConnector: SectionConnector,
  };

  return result;
}
