import { MediakiwiVueOptions } from "@/models/options/";
import { DependencyContainer } from "tsyringe";
import { App } from "vue";

export function registerOptions(container: DependencyContainer, app: App, mediakiwiOptions: MediakiwiVueOptions) {
  // register the mediakiwi options in the container
  container.register("MediakiwiOptions", { useValue: mediakiwiOptions });

  // register the mediakiwi options in the app
  app.provide("mediakiwi", { ...mediakiwiOptions });
}
