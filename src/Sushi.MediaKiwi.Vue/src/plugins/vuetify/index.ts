import "vuetify/styles";
import { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { MediakiwiIconOptions } from "@/plugins/icons/icons";

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
  icons: MediakiwiIconOptions,
};

export default defaultVuetifyOptions;
