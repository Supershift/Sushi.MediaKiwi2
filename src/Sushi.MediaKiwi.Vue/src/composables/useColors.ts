import { useTheme } from "vuetify";
import { computed, ref } from "vue";

type color = {
  key: string;
  value: string;
};

export function useColors() {
  const theme = useTheme();

  /**
   * Collection of keys from the colors object, use dark colors as default since the keys are the same
   */
  const colors = computed(() => {
    return Object.keys(theme.global.current.value.colors)
      .filter((color) => color.indexOf("on-") === -1)
      .map((key) => {
        return {
          key,
          value: theme.global.current.value.colors[key],
          onKey: `on-${key}`,
          onValue: theme.global.current.value.colors[`on-${key}`],
        };
      })
      .sort((a: color, b: color) => {
        return a.key.localeCompare(b.key);
      });
  });

  const variables = theme.global.current.value.variables;

  /**
   * Collection of keys from the colors object, use dark colors as default since the keys are the same
   */
  const cssVariables = computed(() => {
    let cssVariables = {};
    for (const key of Object.keys(variables)) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(`--v-${key}`); // #00eb9b

      cssVariables = { ...cssVariables, ...{ [key]: value } };
    }
    return cssVariables;
  });

  /**
   * Collection of variants defined by Vuetify
   */
  const variants = ref<Array<"flat" | "text" | "elevated" | "tonal" | "outlined" | "plain">>(["text", "elevated", "flat", "outlined", "tonal", "plain"]);

  /**
   * Return a background class for the color (e.g. bg-primary, bg-secondary, etc.)
   * For the on- colors, add the mk prefix (e.g. mk-bg-on-primary, mk-bg-on-secondary, etc.)
   */
  function getColorBackgroundClasses(key: string) {
    if (key && key.startsWith("on-")) {
      // add mk prefix, vuetify does not provide a class on- variables
      return `mk-bg-${key}`;
    }
    return `bg-${key}`;
  }

  return {
    colors,
    variants,
    variables,
    cssVariables,
    getColorBackgroundClasses,
  };
}
