import { MediakiwiVueOptions } from "@/models";
import { useMediakiwiStore } from "@/stores";

export function registerIcons(options: MediakiwiVueOptions) {
  const mainStore = useMediakiwiStore();
  if (options && options.vuetifyOptions) {
    // register icons to main store
    mainStore.registerIcons(options.vuetifyOptions);
  }
}
