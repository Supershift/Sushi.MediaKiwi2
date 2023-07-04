import "@mdi/font/css/materialdesignicons.css";

import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import { themeComfiguration } from "./themes";
import { globalConfiguration } from "./GlobalConfiguration";

const defaultVuetifyOptions = <VuetifyOptions>{
  ...globalConfiguration,
  ...themeComfiguration,
  blueprint: md3,
  components: VComponents,
  directives: VDirectives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
};

export default defaultVuetifyOptions;
