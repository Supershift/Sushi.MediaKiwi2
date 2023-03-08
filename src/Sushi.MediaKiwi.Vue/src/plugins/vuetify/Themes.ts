import { ThemeDefinition } from "vuetify";

/**
 * https://m3.material.io/theme-builder
 * Primary: #4b3ee4
 * Secondary: #0f1325
 * Tertairy: #151e3a
 * Neutral: #919094
 */

export const mediaKiwiLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // Primary colors
    primary: "#4E42E7",
    "on-primary": "#FFFFFF",
    "primary-container": "#E3DFFF",
    "on-primary-container": "#100069",
    // Secondary colors
    secondary: "#4659A9",
    "on-secondary": "#FFFFFF",
    "secondary-container": "#DDE1FF",
    "on-secondary-container": "#001355",
    // Tertiary colors
    tertiary: "#405AA9",
    "on-tertiary": "#FFFFFF",
    "tertiary-container": "#DBE1FF",
    "on-tertiary-container": "#00174D",
    error: "#BA1A1A",
    "on-error": "#FFFFFF",
    "error-container": "#FFDAD6",
    "on-error-container": "#410002",
    background: "#FFFBFF",
    "on-background": "#1C1B1F",
    surface: "#FFFBFF",
    "on-surface": "#1C1B1F",
    outline: "#787680",
    "on-surface-variant": "#E4E1EC",
    "surface-variant": "#47464F",
  },
};

export const mediaKiwiDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    // Primary colors
    primary: "#C3C0FF",
    "on-primary": "#1F00A4",
    "primary-container": "#341ED0",
    "on-primary-container": "#E3DFFF",
    // Secondary colors
    secondary: "#B8C3FF",
    "on-secondary": "#112878",
    "secondary-container": "#2C4090",
    "on-secondary-container": "#DDE1FF",
    // Tertiary colors
    tertiary: "#B5C4FF",
    "on-tertiary": "#032978",
    "tertiary-container": "#254190",
    "on-tertiary-container": "#DBE1FF",
    error: "#FFB4AB",
    "on-error": "#690005",
    "error-container": "#93000A",
    "on-error-container": "#FFDAD6",
    background: "#1C1B1F",
    "on-background": "#E5E1E6",
    surface: "#1C1B1F",
    "on-surface": "#E5E1E6",
    outline: "#928F9A",
    "on-surface-variant": "#47464F",
    "surface-variant": "#C8C5D0",
  },
};
