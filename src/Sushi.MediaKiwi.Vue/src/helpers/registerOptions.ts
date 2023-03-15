import { IMediakiwiVueOptions } from "@/models/options/";
import { DependencyContainer } from "tsyringe";

export function registerOptions(container: DependencyContainer, mediakiwiOptions: IMediakiwiVueOptions) {
  // register axios
  container.register("MediakiwiOptions", { useValue: mediakiwiOptions });
}
