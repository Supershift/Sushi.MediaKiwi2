import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import { mkDarkThemeDefinition } from "./themes/dark";
import { mkLightThemeDefinition } from "./themes/light";

import { mediaKiwiDefaults } from "./Defaults";

const defaultVuetifyOptions = <VuetifyOptions>{
  blueprint: md3,
  components: VComponents,
  directives: VDirectives,
  defaults: mediaKiwiDefaults,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: mkDarkThemeDefinition,
      light: mkLightThemeDefinition,
    },
    variations: {
      colors: ["primary", "secondary", "tertiary", "error", "neutral", "neutral-variant"],
      lighten: 10,
      darken: 10,
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
