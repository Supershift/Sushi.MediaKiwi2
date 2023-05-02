import { MediakiwiVueOptions } from "@supershift/mediakiwi-vue";

export type AppSettings = {
  mediaKiwi: MediakiwiVueOptions;
  sampleApi: {
    apiBaseUrl: string;
  };
};
