import { Configuration } from "@supershift/mediakiwi-vue";

export type SampleWebConfiguration = Configuration & {
  sampleApi: {
    apiBaseUrl: string;
  };
};
