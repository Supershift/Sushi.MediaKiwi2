import { MediakiwiVueOptions } from "@/models";
import { useMediakiwiStore } from "@/stores";

/** Registers the type of icons we have
 *  @param options: MediakiwiVueOptions
 *  If nothing is registered, we use the default icons and aliases that are normally loaded with mediakiwi (mdi)
 */
export function registerIcons(options: MediakiwiVueOptions) {
  const mainStore = useMediakiwiStore();
  if (options && options.vuetifyOptions) {
    // register icons to main store
    mainStore.registerIcons(options.vuetifyOptions);
  }
}
