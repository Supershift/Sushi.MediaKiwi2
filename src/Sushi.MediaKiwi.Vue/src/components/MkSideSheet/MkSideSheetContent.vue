<script setup lang="ts">
  import { StyleValue, computed, ref } from "vue";
  import { IconsLibrary } from "@/models";

  // props that are used to customize the component
  const props = defineProps({
    /** determines if the side sheet is open or not */
    modelValue: {
      type: Boolean,
      default: false,
    },
    /** width of the sheet, ex. 20px, 100vw */
    width: {
      type: [String, Number],
      default: "auto",
    },
    /** height of the sheet, ex. 20px, 100vh */
    height: {
      type: [String, Number],
      default: "auto",
    },
    /** determines if we have a close button or not */
    closeButton: {
      type: Boolean,
      default: false,
    },
    /** class to be assigned on the header */
    headerClass: {
      type: String,
      default: "",
    },
    /** class to be assigned on the body */
    bodyClass: {
      type: String,
      default: "",
    },
    /** class to be assigned on the footer */
    footerClass: {
      type: String,
      default: "",
    },
    /** determined if this is a mobile version*/
    mobile: {
      type: Boolean,
      default: false,
    },
    /** positioning on the z-index (drawer is 1006) */
    zIndex: {
      type: [String, Number],
      default: "auto",
    },
    /** color for the sheet, ex. #ffffff, white, rgb(100, 100, 100) */
    sheetColor: {
      type: String,
      default: "",
    },
    /** indicator to show the progress bar */
    loading: {
      type: Boolean,
      default: false,
    },
  });

  // data
  // --Elements
  const sheet = ref<HTMLElement | null>(null);
  const footer = ref<HTMLElement | null>(null);
  const header = ref<HTMLElement | null>(null);
  const body = ref<HTMLElement | null>(null);

  // --heights
  const footerHeight = ref(footer.value?.clientHeight ?? 0);
  const bodyScrollHeight = ref(body.value?.scrollHeight ?? 0);
  const headerHeight = ref(header.value?.clientHeight ?? 0);
  const sheetHeight = ref(sheet.value?.clientHeight ?? 0);
  const windowHeight = ref(window?.innerHeight ?? 0);

  // slots
  const slots = defineSlots<{
    title?: (props: unknown) => unknown;
    subtitle?: (props: unknown) => unknown;
    default?: (props: unknown) => unknown;
    footer?: (props: unknown) => unknown;
  }>();

  //emits
  const emits = defineEmits(["closed", "opened"]);

  // computed
  const sheetStyles = computed(
    () =>
      ({
        width: !props.mobile ? props.width : "unset", // ensures the full width overlay based on the display size
        zIndex: props.zIndex !== "auto" ? props.zIndex : 1007, // (default: 1007, since drawer is 1006) layer positioning on the z-axis
        backgroundColor: props.sheetColor ?? "rgb(var(--v-theme-surface1))", // custom color for the sheet
      }) as StyleValue
  );

  const bodyHeight = computed<number | undefined>(() => {
    if (!sheetHeight.value) return;
    const sheetMaxHeight = bodyScrollHeight.value + headerHeight.value + footerHeight.value;
    let height = sheetHeight.value - headerHeight.value - footerHeight.value;
    if (props.height === "auto") {
      height = windowHeight.value >= sheetMaxHeight ? bodyScrollHeight.value : windowHeight.value - headerHeight.value - footerHeight.value;
    }
    return height;
  });
</script>
<template>
  <v-sheet ref="side-sheet__sheet" class="side-sheet__sheet" :class="[modelValue && 'side-sheet__sheet--active']" :style="sheetStyles">
    <!-- Start header -->
    <v-card-item ref="side-sheet__header" :class="[headerClass, 'side-sheet__header']">
      <div :class="['side-sheet__header__content']">
        <v-card-title v-if="slots.title" class="d-flex">
          <slot name="title"></slot>
          <v-spacer />
          <v-icon v-if="props.closeButton" :aria-hidden="!props.closeButton" aria-label="close" :icon="IconsLibrary.close" @click="emits('closed')"></v-icon>
        </v-card-title>
        <v-card-subtitle v-if="slots.subtitle">
          <slot name="subtitle"></slot>
        </v-card-subtitle>
      </div>

      <div :class="['side-sheet__header__footer']">
        <v-progress-linear v-if="loading" absolute indeterminate></v-progress-linear>
      </div>
    </v-card-item>
    <!-- Start body -->
    <v-card-text v-if="slots.default" ref="side-sheet__body" :class="[bodyClass, 'side-sheet__body']" :style="{ height: `${bodyHeight}px` }">
      <div class="side-sheet__inner-body">
        <slot name="default"></slot>
      </div>
    </v-card-text>
    <v-divider class="side-sheet__divider" />
    <!-- Start footer -->
    <v-card-actions v-if="slots.footer" ref="side-sheet__footer" :class="[footerClass, 'side-sheet__footer']">
      <slot name="footer"></slot>
    </v-card-actions>
  </v-sheet>
</template>
<style lang="scss">
  @use "../../styles/themes/variables.scss";
  .side-sheet {
    &__sheet {
      display: flex;
      flex-flow: column;
      height: 100%;
      max-width: 100%;
      background-color: rgb(var(--v-theme-surface1));
    }

    &__header {
      padding: 0;
      position: relative;

      &__footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
      }
    }

    &__header__content,
    &__body,
    &__footer {
      padding: 1.5rem;
      overflow: auto;
      background: rgb(var(--v-theme-surface1));
    }

    &__header {
      @media (min-width: variables.$breakpoints-lg) {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      .v-card-item__append {
        padding: 1.5rem;
        display: flex;
        align-self: start;
      }
      .v-card-subtitle {
        overflow: visible;
        white-space: normal;
      }
    }

    &__body {
      text-align: left;
      height: calc(100% - 150px); // so the content is scrollable ( accounting for margins top and bottom)
      @media (min-width: variables.$breakpoints-lg) {
        height: calc(100vh - 220px); // so the content is scrollable ( accounting for margins top and bottom)
      }
    }

    &__footer {
      justify-content: flex-end;
      @media (min-width: 1280px) {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
    }

    &__body {
      position: relative;
    }
  }
</style>
