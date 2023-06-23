import { ThemeDefinition } from "vuetify";
import { default as darkColors } from "@/assets/style/themes/dark/abstracts/_colors.module.scss";

export const mkDarkThemeDefinition: ThemeDefinition = {
  dark: true,
  colors: {
    // Primary colors
    primary: darkColors.primary,
    "on-primary": darkColors.onPrimary,
    "primary-container": darkColors.primaryContainer,
    "on-primary-container": darkColors.onPrimaryContainer,
    // Secondary colors
    secondary: darkColors.secondary,
    "on-secondary": darkColors.onSecondary,
    "secondary-container": darkColors.secondaryContainer,
    "on-secondary-container": darkColors.onSecondaryContainer,
    // Tertiary colors
    tertiary: darkColors.tertiary,
    "on-tertiary": darkColors.onTertiary,
    "tertiary-container": darkColors.tertiaryContainer,
    "on-tertiary-container": darkColors.onTertiaryContainer,
    error: darkColors.error,
    "on-error": darkColors.onError,
    "error-container": darkColors.errorContainer,
    "on-error-container": darkColors.onErrorContainer,
    background: darkColors.background,
    "on-background": darkColors.onBackground,
    surface: darkColors.surface,
    "on-surface": darkColors.onSurface,
    outline: darkColors.outline,
    "on-surface-variant": darkColors.onSurfaceVariant,
    "surface-variant": darkColors.surfaceVariant,
  },
};
