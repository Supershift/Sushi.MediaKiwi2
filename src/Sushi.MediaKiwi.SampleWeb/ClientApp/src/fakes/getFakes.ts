import { NavigationConnector, ScreenConnector, SectionConnector } from ".";
import { IMediakiwiServiceRegistrations } from "@supershift/mediakiwi-vue";

export function getFakes(): IMediakiwiServiceRegistrations {
  var result: IMediakiwiServiceRegistrations = {
    navigationConnector: NavigationConnector,
    screenConnector: ScreenConnector,
    sectionConnector: SectionConnector,
  };

  return result;
}
