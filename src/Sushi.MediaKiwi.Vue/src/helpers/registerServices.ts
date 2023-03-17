import { IMediakiwiServiceRegistrations } from "@/models/options/";
import { NavigationConnector, ScreenConnector, SectionConnector } from "@/services";
import { DependencyContainer, type RegistrationOptions, Lifecycle } from "tsyringe";
import mediaKiwiAxiosInstance from "@/services/interceptors/MediakiwiAxiosInstance";

import { RouterManager } from "@/router/routerManager";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register axios
  container.register("IMediakiwiAxiosInstance", {
    useValue: mediaKiwiAxiosInstance,
  });

  // register helpers
  container.register("RouterManager", { useClass: RouterManager }, { lifecycle: Lifecycle.Singleton });

  // register connectors
  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
  container.register("IScreenConnector", registations?.screenConnector ? registations.screenConnector : ScreenConnector);
  container.register("ISectionConnector", registations?.sectionConnector ? registations.sectionConnector : SectionConnector);
}
