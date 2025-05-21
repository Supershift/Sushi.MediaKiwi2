<script setup lang="ts">
  import { computed } from "vue";

  const props = withDefaults(
    defineProps<{
      title?: string | null;
      subtitle?: string;
      width?: number | string;
      color?: string;
      rounded?: string;
      variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
    }>(),
    {
      title: undefined,
      subtitle: undefined,
      width: 555,
      color: "surface5",
      rounded: "lg",
      variant: "flat",
    }
  );

  const slots = defineSlots<{
    title?: () => void;
    prependHeader?: () => void;
    header?: () => void;
    default?: () => void;
  }>();

  const cardClasses = computed(() => {
    return {
      "px-6": true,
      "pb-6": true,
      "mb-6": true,
      "pt-6": !slots?.header,
      "pt-3": slots?.header,
    };
  });

  const sheetClasses = computed(() => {
    return {
      "mt-4": props.title,
      "form-card__content": true,
    };
  });

  const cssWidth = computed(() => `${props.width}px`);
</script>

<template>
  <v-card class="form-card" :class="cardClasses" :variant="variant" :rounded="rounded" :color="color" v-bind="$attrs">
    <div v-if="slots.prependHeader" class="mb-4">
      <slot name="prependHeader"></slot>
    </div>
    <div
      :class="{
        'form-card__header': true,
        'd-flex': slots?.header,
        'flex-wrap': true,
        'flex-1-0': slots?.header,
        'justify-space-between': slots?.header,
        'align-center': slots.header,
      }"
    >
      <v-card-title v-if="props.title" class="px-0 pt-0 pb-0 text-title-medium">{{ props.title }}</v-card-title>
      <slot v-else-if="slots.title" name="title"></slot>
      <slot v-if="slots?.header" name="header"></slot>
    </div>
    <v-card-subtitle v-if="props?.subtitle" class="px-0 pt-0 text-body-medium">{{ props.subtitle }}</v-card-subtitle>

    <v-card-text class="pa-0">
      <v-sheet v-if="slots.default" :class="sheetClasses" :color="color">
        <slot name="default"></slot>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>
<style scoped lang="scss">
  .form-card__content {
    // Forms without FormInputRow should have a max-width
    &:not(:has(.form-card-row)) {
      max-width: v-bind(cssWidth);
    }

    // Forms with FormInputRow should be different
    &:has(.form-card-row) {
      // Their direct children that aren't form rows should have a max-width
      > div {
        &:not(:has(.form-card-row__col--input)) {
          max-width: v-bind(cssWidth);
        }
      }

      .form-card-row__col--append {
        padding-top: 0 !important;
      }
    }
  }
</style>
