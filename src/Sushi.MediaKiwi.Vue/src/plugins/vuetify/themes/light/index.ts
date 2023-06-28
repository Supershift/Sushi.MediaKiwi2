import { ThemeDefinition } from "vuetify";
import lightColors from "@/styles/themes/light/_colors.module.scss";

export const lightThemeDefinition: ThemeDefinition = {
  dark: false,
  colors: {
    // Primary colors
    primary: lightColors.primary,
    "on-primary": lightColors.onPrimary,
    "primary-container": lightColors.primaryContainer,
    "on-primary-container": lightColors.onPrimaryContainer,
    // Secondary colors
    secondary: lightColors.secondary,
    "on-secondary": lightColors.onSecondary,
    "secondary-container": lightColors.secondaryContainer,
    "on-secondary-container": lightColors.onSecondaryContainer,
    // Tertiary colors
    tertiary: lightColors.tertiary,
    "on-tertiary": lightColors.onTertiary,
    "tertiary-container": lightColors.tertiaryContainer,
    "on-tertiary-container": lightColors.onTertiaryContainer,
    error: lightColors.error,
    "on-error": lightColors.onError,
    "error-container": lightColors.errorContainer,
    "on-error-container": lightColors.onErrorContainer,
    background: lightColors.background,
    "on-background": lightColors.onBackground,
    surface: lightColors.surface,
    "on-surface": lightColors.onSurface,
    outline: lightColors.outline,
    "on-surface-variant": lightColors.onSurfaceVariant,
    "surface-variant": lightColors.surfaceVariant,
  },
};
