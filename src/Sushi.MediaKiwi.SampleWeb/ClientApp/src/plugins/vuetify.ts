import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import { mediaKiwiDarkTheme, mediaKiwiLightTheme, mediaKiwiDefaults } from "@supershift/mediakiwi-vue";

// load fonts
const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ "webfontloader");

webFontLoader.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900&display=swap"],
  },
});

const vuetify = createVuetify({
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
});

export default vuetify;
