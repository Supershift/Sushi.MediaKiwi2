import { NavigationConnector, ViewConnector, SectionConnector } from "./";
import { IMediakiwiServiceRegistrations } from "@mediakiwi/";

export function getFakes(): IMediakiwiServiceRegistrations {
  var result: IMediakiwiServiceRegistrations = {
    navigationConnector: NavigationConnector,
    viewConnector: ViewConnector,
    sectionConnector: SectionConnector,
  };

  return result;
}
