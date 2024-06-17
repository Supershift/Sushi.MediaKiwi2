import { ThemeDefinition } from "vuetify";
import colors from "@/styles/themes/retro/_colors.module.scss";
import variables from "@/styles/themes/_variables.module.scss";
import "@/styles/themes/retro/_overrides.scss";

export const RetroThemeDefinition: ThemeDefinition = {
  dark: false,
  colors: colors,
  variables,
};
