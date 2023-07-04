import type { VuetifyOptions } from "vuetify";
import { VBtn } from "vuetify/components/VBtn";

/**
 * Global configuration for Vuetify
 * https://vuetifyjs.com/en/features/global-configuration/
 */
export const globalConfiguration: VuetifyOptions = {
  aliases: {
    // Create an alias, so we can use <v-btn-primary> instead of <v-btn color="primary" variant="flat">
    VBtnPrimary: VBtn,
  },
  defaults: {
    VAppBar: {
      elevation: 2,
    },
    VNavigationDrawer: {
      bg: "surface1",
      VList: {
        variant: "flat",
        color: "secondary-container",
      },
    },
    VBtn: {
      variant: "text",
      class: "v-btn--mediakiwi",
    },
    VBtnPrimary: {
      variant: "flat",
      color: "primary",
      rounded: "xl",
      class: "v-btn--mediakiwi",
    },
    VChip: {
      closeIcon: "mdi-close",
      rounded: "lg",
      class: "bg-secondary-container",
    },
    VDivider: {
      color: "outline-variant",
      class: "v-divider--mediakiwi",
    },
    VCard: {
      variant: "none",
      rounded: false,
    },
    VTable: {
      variant: "none",
      rounded: false,
    },
  },
};
