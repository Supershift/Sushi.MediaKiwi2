import { MediakiwiVueOptions } from "@/models";
import { inject } from "vue";

export function useMediakiwiVueOptions() {
  function getOptions() {
    const mediakiwiOptions = inject("mediakiwi") as MediakiwiVueOptions;
    return mediakiwiOptions || {};
  }

  return getOptions();
}
