import { MediakiwiVueOptions } from "@/models/options/";
import { DependencyContainer } from "tsyringe";

export function registerOptions(container: DependencyContainer, mediakiwiOptions: MediakiwiVueOptions) {
  // register axios
  container.register("MediakiwiOptions", { useValue: mediakiwiOptions });
}
