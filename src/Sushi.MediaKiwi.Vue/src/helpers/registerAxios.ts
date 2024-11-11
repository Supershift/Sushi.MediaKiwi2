import { MediakiwiVueOptions } from "@/models/options/";
import { Api, createAxiosClient } from "@/services";
import { DependencyContainer } from "tsyringe";

export function registerAxios(container: DependencyContainer, options: MediakiwiVueOptions) {
  const api = new Api();
  api.instance = createAxiosClient(options.apiBaseUrl.replace('mediakiwi/api', ''));
  container.register("MediaKiwiApi", { useValue: api });
}
