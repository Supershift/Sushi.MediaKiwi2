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
    VNavigationDrawer: {
      temporary: true, // Lets the navigation drawer appear over the content
    },
  },
};
