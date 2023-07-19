import "vuetify/styles";
import { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import { mediaKiwiDarkTheme, mediaKiwiLightTheme } from "./Themes";

import { mediaKiwiDefaults } from "./Defaults";

const defaultVuetifyOptions = <VuetifyOptions>{
  blueprint: md3,
  components: VComponents,
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
