import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";
/**
 * https://vuetifyjs.com/en/labs/introduction/
 * Experiment and use in-development components before they’re released.
 */
import { VInfiniteScroll, VDatePicker } from "vuetify/labs/components";

import { md3 } from "vuetify/blueprints";
import { mdi, aliases } from "vuetify/iconsets/mdi";
import { mediaKiwiDarkTheme, mediaKiwiLightTheme } from "./Themes";
import { mediaKiwiDefaults } from "./Defaults";

const defaultVuetifyOptions = <VuetifyOptions>{
  blueprint: md3,
  components: {
    ...VComponents,
    VInfiniteScroll,
    VDatePicker,
  },
  directives: VDirectives,
  defaults: mediaKiwiDefaults,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: mediaKiwiDarkTheme,
      light: mediaKiwiLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
};

export default defaultVuetifyOptions;
