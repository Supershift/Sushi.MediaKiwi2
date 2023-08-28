import type { VuetifyOptions } from "vuetify";
import { darkThemeDefinition } from "./dark";
import { lightThemeDefinition } from "./light";

export const themeComfiguration: VuetifyOptions = {
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: darkThemeDefinition,
      light: lightThemeDefinition,
    },
  },
};
