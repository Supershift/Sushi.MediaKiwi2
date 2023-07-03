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
      .map((key) => {
        return {
          key,
          value: theme.global.current.value.colors[key],
        };
      })
      .filter((color) => color.key.indexOf("surface-") === -1) // remove surface colors
      .sort((a: color, b: color) => {
        const aKey = a.key.toLowerCase().replace("on-", "");
        const bKey = b.key.toLowerCase().replace("on-", "");
        return aKey.localeCompare(bKey);
      });
  });

  /**
   * Collection of keys from the colors object, use dark colors as default since the keys are the same
   */
  const surfaces = computed(() => {
    return Object.keys(theme.global.current.value.colors)
      .map((key) => {
        return {
          key,
          value: theme.global.current.value.colors[key],
        };
      })
      .filter((color) => color.key.indexOf("surface-") > -1) // remove surface colors
      .sort((a: color, b: color) => {
        const aKey = a.key.toLowerCase().replace("on-", "");
        const bKey = b.key.toLowerCase().replace("on-", "");
        return aKey.localeCompare(bKey);
      });
  });

  const variables = theme.global.current.value.variables;

  // /**
  //  * Collection of keys from the colors object, use dark colors as default since the keys are the same
  //  */
  const cssVariables = computed(() => {
    let cssVariables = {};
    for (const key of Object.keys(variables)) {
      console.log(`--v-${key}`);
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
   * Get the color value for the key
   * @param key The key of the color (e.g. primary, secondary, error, etc.)
   */
  // const getColorValue = (key: string) => {
  //   return theme.global.current.value.colors[key];
  // };

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
    surfaces,
    variables,
    cssVariables,
    getColorBackgroundClasses,
  };
}
