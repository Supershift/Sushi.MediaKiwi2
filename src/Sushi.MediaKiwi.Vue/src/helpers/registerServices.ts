import { IMediakiwiServiceRegistrations } from "@/models/options/";
import { NavigationConnector, ScreenConnector, SectionConnector } from "@/services";
import { DependencyContainer } from "tsyringe";
import mediaKiwiAxiosInstance from "@/services/interceptors/MediakiwiAxiosInstance";
import { RouterHelper } from "@/router/routerHelper";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register axios
  container.register("IMediakiwiAxiosInstance", {
    useValue: mediaKiwiAxiosInstance,
  });

  // register helpers
  container.register("RouterHelper", RouterHelper);

  // register connectors
  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
  container.register("IScreenConnector", registations?.screenConnector ? registations.screenConnector : ScreenConnector);
  container.register("ISectionConnector", registations?.sectionConnector ? registations.sectionConnector : SectionConnector);
}
