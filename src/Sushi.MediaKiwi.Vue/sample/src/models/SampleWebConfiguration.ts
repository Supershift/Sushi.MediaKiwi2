import { Configuration } from "@mediakiwi/";

export type SampleWebConfiguration = Configuration & {
  sampleApi: {
    apiBaseUrl: string;
  };
};
