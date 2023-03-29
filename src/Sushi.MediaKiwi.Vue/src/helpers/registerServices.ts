import { IMediakiwiServiceRegistrations } from "@/models/options/";
import { NavigationConnector, ViewConnector, SectionConnector } from "@/services";
import { DependencyContainer, Lifecycle } from "tsyringe";
import mediaKiwiAxiosInstance from "@/services/interceptors/MediakiwiAxiosInstance";

import { RouterManager } from "@/router/routerManager";
import { RouteGenerator } from "@/router/routeGenerator";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register axios
  container.register("IMediakiwiAxiosInstance", {
    useValue: mediaKiwiAxiosInstance,
  });

  // register helpers
  container.register("RouteGenerator", { useClass: RouteGenerator }, { lifecycle: Lifecycle.Transient });
  container.register("RouterManager", { useClass: RouterManager }, { lifecycle: Lifecycle.Singleton });

  // register connectors
  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
  container.register("IViewConnector", registations?.viewConnector ? registations.viewConnector : ViewConnector);
  container.register("ISectionConnector", registations?.sectionConnector ? registations.sectionConnector : SectionConnector);
}
