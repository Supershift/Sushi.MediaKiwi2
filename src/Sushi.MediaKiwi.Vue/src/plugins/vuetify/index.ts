import "@mdi/font/css/materialdesignicons.css";

import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";
/**
 * https://vuetifyjs.com/en/labs/introduction/
 * Experiment and use in-development components before they’re released.
 */
import { VInfiniteScroll, VDatePicker } from "vuetify/labs/components";

import { md3 } from "vuetify/blueprints";
import { mdi, aliases } from "vuetify/iconsets/mdi";

import { themeComfiguration } from "./themes";
import { globalConfiguration } from "./GlobalConfiguration";

const defaultVuetifyOptions = <VuetifyOptions>{
  ...globalConfiguration,
  ...themeComfiguration,
  blueprint: md3,
  components: {
    ...VComponents,
    VInfiniteScroll,
    VDatePicker,
  },
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
