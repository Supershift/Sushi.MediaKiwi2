import { Configuration } from "@/models";

export type SampleWebConfiguration = Configuration & {
  sampleApi: {
    apiBaseUrl: string;
  };
};
