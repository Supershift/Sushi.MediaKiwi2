import { IMediakiwiServiceRegistrations } from "@/models/options/";
import { NavigationConnector, ViewConnector, SectionConnector } from "@/services";
import { DependencyContainer, Lifecycle } from "tsyringe";

import { RouterManager } from "@/router/routerManager";
import { RouteGenerator } from "@/router/routeGenerator";
import { RoleConnector } from "@/services/RoleConnector";
import { LocaleConnector } from "@/services/LocaleConnector";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register helpers
  container.register("RouteGenerator", { useClass: RouteGenerator }, { lifecycle: Lifecycle.Transient });
  container.register("RouterManager", { useClass: RouterManager }, { lifecycle: Lifecycle.Singleton });

  // register connectors
  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
  container.register("IViewConnector", registations?.viewConnector ? registations.viewConnector : ViewConnector);
  container.register("ISectionConnector", registations?.sectionConnector ? registations.sectionConnector : SectionConnector);
  container.register("IRoleConnector", registations?.roleConnector ? registations.roleConnector : RoleConnector);
  container.register("ILocaleConnector", registations?.localeConnector ? registations.localeConnector : LocaleConnector);
}
