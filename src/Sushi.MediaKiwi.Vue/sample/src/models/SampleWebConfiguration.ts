import { Configuration } from "@/framework";

export type SampleWebConfiguration = Configuration & {
  sampleApi: {
    apiBaseUrl: string;
  };
};
