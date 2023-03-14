import { IMediakiwiServiceRegistrations } from "@/models/options/IMediakiwiVueOptions";
import { NavigationConnector } from "@/services";
import { DependencyContainer } from "tsyringe";
import mediaKiwiAxiosInstance from "@/services/interceptors/MediakiwiAxiosInstance";

export function registerServices(container: DependencyContainer, registations?: IMediakiwiServiceRegistrations) {
  // register axios
  container.register("IMediakiwiAxiosInstance", {
    useValue: mediaKiwiAxiosInstance,
  });

  container.register("INavigationConnector", registations?.navigationConnector ? registations.navigationConnector : NavigationConnector);
}
