import { type VuetifyOptions } from "vuetify";

/**
 * Global configuration for Vuetify
 * https://vuetifyjs.com/en/features/global-configuration/
 */
export const globalConfiguration = <VuetifyOptions>{
  defaults: {
    VEmptyState: {
      VContainer: {
        VCard: {
          class: "bg-surface5 pa-1",
          rounded: "lg",
        },
      },
    },
    VAppBarNavIcon: {
      class: "d-lg-none", // Show the navigation icon only on screens smaller than extra large
    },
  },
};
