import type { VuetifyOptions } from "vuetify";
import { darkThemeDefinition } from "./dark";
import { lightThemeDefinition } from "./light";
import "vuetify/styles";
import "@/styles/main.scss";

export const themeComfiguration: VuetifyOptions = {
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: darkThemeDefinition,
      light: lightThemeDefinition,
    },
  },
};
