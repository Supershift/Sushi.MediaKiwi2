import { IconsLibrary } from "@/models";
import { type VuetifyOptions } from "vuetify";
import { VBtn } from "vuetify/components/VBtn";
import { VNavigationDrawer } from "vuetify/components/VNavigationDrawer";

export const InputVariant = "outlined";

/**
 * Global configuration for Vuetify
 * https://vuetifyjs.com/en/features/global-configuration/
 */
export const GlobalConfiguration: VuetifyOptions = {
  aliases: {
    // Create an alias, so we can use <v-btn-primary> instead of <v-btn color="primary" variant="flat">
    VBtnPrimary: VBtn,
    VNavigationRail: VNavigationDrawer,
    VNavigationDrawerSideSheet: VNavigationDrawer,
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
      class: "v-navigation-rail--mediakiwi",
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
    VNavigationDrawerSideSheet: {
      color: "background",
      border: "none",
      location: "right",
      class: "v-navigation-drawer--mediakiwi--side-sheet",
    },
    VMain: {
      color: "background",
      class: "bg-background",
    },
    VMenu: {
      class: "v-menu--mediakiwi",
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
      closeIcon: IconsLibrary.close,
      rounded: "lg",
      class: "bg-secondary-container",
    },
    VCheckbox: {
      color: "primary",
      trueIcon: IconsLibrary.checkboxMarked,
      falseIcons: IconsLibrary.checkboxOff,
      indeterminateIcon: IconsLibrary.minusBox,
      class: "v-checkbox--mediakiwi",
      VLabel: {
        style: {
          opacity: "1",
        },
      },
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
      // Form fields inside a table have some other layout properties
      VTextField: {
        variant: "outlined",
        hideDetails: true,
        class: "v-text-field--mediakiwi",
      },
      VAutocomplete: {
        variant: "outlined",
        class: "v-autocomplete--mediakiwi",
      },
    },
    VToolbar: {
      color: "surface1",
      class: "v-toolbar--mediakiwi",
    },
    VInput: {
      hideDetails: "auto",
      class: "v-input--mediakiwi",
      variant: InputVariant,
    },
    VTextarea: {
      variant: InputVariant,
      color: "outline",
      class: "v-field--mediakiwi",
    },
    VTextField: {
      variant: InputVariant,
      color: "outline",
      class: "v-field--mediakiwi",
    },
    VSelect: {
      variant: InputVariant,
      menuIcon: IconsLibrary.menuDown,
      clearIcon: IconsLibrary.clear,
      class: "v-select--mediakiwi",
    },
    VFileInput: {
      variant: "outlined",
      baseColor: "on-surface-variant",
      clearable: true,
      centerAffix: true,
      clearIcon: IconsLibrary.clear,
      prependInnerIcon: IconsLibrary.paperclip,
      class: "v-file-input--mediakiwi",
    },
    VSlider: {
      color: "primary",
      thumbColor: "primary",
      trackColor: "surface-variant",
      trackSize: 4,
      tickSize: 3,
      class: "v-slider--mediakiwi",
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
      variant: InputVariant,
      color: "outline",
      class: "v-autocomplete--mediakiwi",
      menuIcon: IconsLibrary.menuDown,
      VChip: {
        variant: "outlined",
        class: "",
      },
    },
    VBreadcrumbs: {
      color: "primary",
      density: "compact",
      class: "v-breadcrumbs--mediakiwi",
    },
    VStepper: {
      color: "primary",
      variant: "flat",
      class: "v-stepper--mediakiwi",
    },
    VForm: {
      class: "v-form--mediakiwi",
    },
    VDatePicker: {
      class: "v-date-picker--mediakiwi",
      elevation: 0, // Should be default in vuetify, but it's not
    },
    VEmptyState: {
      class: "v-empty-state--mediakiwi",
    },
  },
};
