import "@/styles/main.scss";
import type { VuetifyOptions } from "vuetify";
import { createVuetify as actualCreateVuetify } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";
import { md3 } from "vuetify/blueprints";
import { MediakiwiIconOptions } from "@/plugins/icons/icons";
import { ThemeComfiguration } from "./themes";
import { GlobalConfiguration } from "./global";
import { useDeepMerge } from "@/composables/useDeepMerge";
import { loadTheme } from "./themes/ThemeProvider";
import LuxonAdapter from "@date-io/luxon"

export const defaultVuetifyOptions = <VuetifyOptions>{
  ...GlobalConfiguration,
  ...ThemeComfiguration,
  blueprint: md3,
  components: {
    ...VComponents,
  },
  directives: VDirectives,
  icons: MediakiwiIconOptions,
};

/**
 * Proxy for the createVuetify function from the vuetify package.
 * @param options
 */
export function createVuetify(options?: VuetifyOptions) {
  // inject dependencies
  const { deepMerge } = useDeepMerge();

  let vuetifyOptions: VuetifyOptions;

  // Get the options
  if (options) {
    // merge default options with custom options, if custom options is provided
    vuetifyOptions = deepMerge(defaultVuetifyOptions, options);
  } else {
    // use default options if no custom options is provided
    vuetifyOptions = { ...defaultVuetifyOptions };
  }

  // get the theme from local storage and set it in the options
  const storedTheme = loadTheme();
  if (storedTheme && vuetifyOptions?.theme) {
    vuetifyOptions.theme.defaultTheme = storedTheme;
  }

  vuetifyOptions.date = { adapter: LuxonAdapter };

  // create the vuetify instance
  const vuetify = actualCreateVuetify(vuetifyOptions);

  return { vuetify, vuetifyOptions };
}
