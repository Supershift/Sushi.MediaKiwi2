import { MediakiwiVueOptions } from "@/models/options/";
import { createAxiosClient } from "@/services";
import { DependencyContainer } from "tsyringe";

export function registerAxios(container: DependencyContainer, options: MediakiwiVueOptions) {
  // register axios
  const axiosInstance = createAxiosClient(options.apiBaseUrl);
  container.register("MediakiwiAxiosInstance", {
    useValue: axiosInstance,
  });
}
