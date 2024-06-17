import type { VuetifyOptions } from "vuetify";
import { DarkThemeDefinition } from "./DarkThemeDefinition";
import { LightThemeDefinition } from "./LightThemeDefinition";
import { RetroThemeDefinition } from "./RetroThemeDefinition";
import "vuetify/styles";
import "@/styles/main.scss";

export const ThemeComfiguration: VuetifyOptions = {
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: DarkThemeDefinition,
      light: LightThemeDefinition,
      retro: RetroThemeDefinition,
    },
  },
};
