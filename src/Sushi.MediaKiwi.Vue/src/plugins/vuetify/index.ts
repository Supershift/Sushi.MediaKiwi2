import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { MediakiwiIconOptions } from "@/plugins/icons/icons";

import { themeComfiguration } from "./themes";
import { globalConfiguration } from "./GlobalConfiguration";

const defaultVuetifyOptions = <VuetifyOptions>{
  ...globalConfiguration,
  ...themeComfiguration,
  blueprint: md3,
  components: VComponents,
  directives: VDirectives,
  icons: MediakiwiIconOptions,
};

export default defaultVuetifyOptions;
