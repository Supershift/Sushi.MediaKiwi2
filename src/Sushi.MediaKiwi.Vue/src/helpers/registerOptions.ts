import { MediakiwiVueOptions } from "@/models/options/";
import { DependencyContainer } from "tsyringe";

export function registerOptions(container: DependencyContainer, mediakiwiOptions: MediakiwiVueOptions) {
  // register the mediakiwi options in the container
  container.register("MediakiwiOptions", { useValue: mediakiwiOptions });
}
