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
    primary: "#4e42e7",
    "on-primary": "#ffffff",
    "primary-container": "#e3dfff",
    "on-primary-container": "#100069",
    // Secondary colors
    secondary: "#4659a9",
    "on-secondary": "#ffffff",
    "secondary-container": "#dde1ff",
    "on-secondary-container": "#001355",
    // Tertiary colors
    tertiary: "#405aa9",
    "on-tertiary": "#ffffff",
    "tertiary-container": "#dbe1ff",
    "on-tertiary-container": "#00174d",
    error: "#ba1a1a",
    "on-error": "#ffffff",
    "error-container": "#ffdad6",
    "on-error-container": "#410002",
    background: "#fefbff",
    "on-background": "#001849",
    surface: "#fefbff",
    "on-surface": "#001849",
    outline: "#787680",
    "surface-variant": "#e4e1ec",
    "on-surface-variant": "#e7e8ed",
  },
};

export const mediaKiwiDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    // Primary colors
    primary: "#c3c0ff",
    "on-primary": "#1f00a4",
    "primary-container": "#341ed0",
    "on-primary-container": "#e3dfff",
    // Secondary colors
    secondary: "#b8c3ff",
    "on-secondary": "#112878",
    "secondary-container": "#2c4090",
    "on-secondary-container": "#dde1ff",
    // Tertiary colors
    tertiary: "#b5c4ff",
    "on-tertiary": "#032978",
    "tertiary-container": "#254190",
    "on-tertiary-container": "#dbe1ff",
    error: "#ffb4ab",
    "on-error": "#690005",
    "error-container": "#93000a",
    "on-error-container": "#ffdad6",
    background: "#001849",
    "on-background": "#dbe1ff",
    surface: "#15202B",
    "on-surface": "#dbe1ff",
    outline: "#928f9a",
    "surface-variant": "#47464f",
    "on-surface-variant": "#0f1325",
  },
};
