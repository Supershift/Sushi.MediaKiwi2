import { IMediakiwiServiceRegistrations } from "@/models/options/IMediakiwiVueOptions";
import { NavigationConnector } from "@/services";
import { DependencyContainer } from "tsyringe";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
}
