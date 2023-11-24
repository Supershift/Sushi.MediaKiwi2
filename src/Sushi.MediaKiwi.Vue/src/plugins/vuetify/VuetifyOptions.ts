import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

// Still in labs, but we need it
import { VStepper, VDatePicker } from "vuetify/lib/labs/components.mjs";

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
    VStepper,
    VDatePicker,
  },
  directives: VDirectives,
  icons: MediakiwiIconOptions,
};

export { defaultVuetifyOptions };
