<!-- TODO Add this to the MediaKiwi codebase -->
<script setup lang="ts">
  import { JSXComponent, computed } from "vue";

  /** {@link https://fonts.google.com/icons?icon.query=error&icon.style=Outlined} */
  const props = withDefaults(
    defineProps<{
      /**
       * HTML Tag to render the icon in the DOM
       */
      tag: string;
      /**
       * Icon to render
       */
      icon?: string | (string | [path: string, opacity: number])[] | JSXComponent;
      /**
       * Determines the disabled state of the icon
       */
      disabled?: boolean;
      /**
       * Fill gives you the ability to modify the default icon style. A single icon can render both unfilled and filled states.
       * @example 0, 1 */
      fill?: number | string;
      /**
       * Weight defines the symbol's stroke weight, with a range of weights between thin (100) and bold (700). Weight can also affect the overall size of the symbol.
       * @example Value between 100-700 */
      wght?: number | string;
      /**
       * Weight and grade affect a symbol's thickness. Adjustments to grade are more granular than adjustments to weight and have a small impact on the size of the symbol.
       * @example Value between -25-200
       */
      grad?: number | string;
      /**
       * Optical Sizes range from 20dp to 48dp.
       * @example Value between 20-48
       */
      opsz?: number | string;
    }>(),
    {
      disabled: false,
      icon: undefined,
      fill: 0,
      wght: 400,
      grad: 0,
      opsz: 24,
    }
  );

  const classes = computed(() => {
    return {
      "material-symbols-outlined": true,
      "material-symbols-rounded": true,
      "material-symbols-sharp": true,
    };
  });
</script>
<template>
  <component :is="props.tag" v-cloak :class="classes" :disabled="disabled"> {{ props.icon }} </component>
</template>

<style scoped>
  .material-symbols-outlined,
  .material-symbols-rounded,
  .material-symbols-sharp {
    font-variation-settings: "FILL" v-bind(fill), "wght" v-bind(wght), "GRAD" v-bind(grad), "opsz" v-bind(opsz);
  }
</style>
