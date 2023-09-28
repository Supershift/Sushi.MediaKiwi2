import { IconsLibrary } from "@/models";
import type { VuetifyOptions } from "vuetify";
import { VBtn } from "vuetify/components/VBtn";
import { VNavigationDrawer } from "vuetify/components/VNavigationDrawer";
import { IconsLibrary } from "@/models/enum";


/**
 * Global configuration for Vuetify
 * https://vuetifyjs.com/en/features/global-configuration/
 */
export const globalConfiguration: VuetifyOptions = {
  aliases: {
    // Create an alias, so we can use <v-btn-primary> instead of <v-btn color="primary" variant="flat">
    VBtnPrimary: VBtn,
    VNavigationRail: VNavigationDrawer,
  },
  defaults: {
    // Patterns
    VAppBar: {
      color: "background",
    },
    VNavigationRail: {
      color: "background",
      border: "none",
      rail: true,
    },
    VNavigationDrawer: {
      color: "surface1",
      border: "none",
      style: {
        "border-top-left-radius": "16px",
        "border-top-right-radius": "16px",
      },
      VList: {
        VListItem: {
          variant: "text",
        },
      },
    },
    VMain: {
      color: "background",
      class: "bg-background",
    },
    // Small Components
    VBtn: {
      variant: "text",
      class: "v-btn--mediakiwi",
    },
    VBtnPrimary: {
      variant: "flat",
      color: "primary",
      rounded: "xl",
      class: "v-btn--mediakiwi v-btn--mediakiwi--primary",
    },
    VChip: {
      closeIcon: "mdi-close",
      rounded: "lg",
      class: "bg-secondary-container",
    },
    VCheckbox: {
      color: "primary",
      trueIcon: IconsLibrary.checkboxMarked,
      falseIcons: IconsLibrary.squareOutline,
      indeterminateIcon: IconsLibrary.minusBox,
      class: "v-checkbox--mediakiwi",
      disabled: true,
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
      style: { background: "none" },
    },
    VToolbar: {
      color: "surface1",
    },
    VInput: {
      hideDetails: "auto",
      variant: "outlined",
    },
    VTextField: {
      variant: "outlined",
      color: "outline",
      class: "v-field--mediakiwi",
    },
    VSelect: {
      variant: "outlined",
    },
    VRadioGroup: {
      color: "primary",
      class: "v-radio-group--mediakiwi",
    },
    VRadio: {
      color: "primary",
      trueIcon: IconsLibrary.radioOn,
      falseIcon: IconsLibrary.radioOff,
      class: "v-radio--mediakiwi",
    },
    VAutocomplete: {
      variant: "outlined",
      color: "outline",
      class: "v-autocomplete--mediakiwi",
      menuIcon: IconsLibrary.menuDown,
    },
  },
};
