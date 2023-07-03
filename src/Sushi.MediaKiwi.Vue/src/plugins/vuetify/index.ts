import "@mdi/font/css/materialdesignicons.css";

import "@/styles/main.scss";
import { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import { darkThemeDefinition } from "./themes/dark";
import { lightThemeDefinition } from "./themes/light";

import { mediaKiwiDefaults } from "./Defaults";

const defaultVuetifyOptions = <VuetifyOptions>{
  blueprint: md3,
  components: VComponents,
  directives: VDirectives,
  defaults: mediaKiwiDefaults,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: darkThemeDefinition,
      light: lightThemeDefinition,
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
