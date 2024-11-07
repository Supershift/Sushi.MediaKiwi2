import { IMediakiwiServiceRegistrations } from "@/models/options/";
import { DependencyContainer, Lifecycle } from "tsyringe";

import { RouterManager } from "@/router/routerManager";
import { RouteGenerator } from "@/router/routeGenerator";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register helpers
  container.register("RouteGenerator", { useClass: RouteGenerator }, { lifecycle: Lifecycle.Transient });
  container.register("RouterManager", { useClass: RouterManager }, { lifecycle: Lifecycle.Singleton });
}
