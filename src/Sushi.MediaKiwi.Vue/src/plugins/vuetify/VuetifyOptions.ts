import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { MediakiwiIconOptions } from "@/plugins/icons/icons";

import { ThemeComfiguration } from "./themes";
import { GlobalConfiguration } from "./global";

const defaultVuetifyOptions = <VuetifyOptions>{
  ...GlobalConfiguration,
  ...ThemeComfiguration,
  blueprint: md3,
  components: {
    ...VComponents,
  },
  directives: VDirectives,
  icons: MediakiwiIconOptions,
};

export default defaultVuetifyOptions;
