<script setup lang="ts">
  import { StyleValue, computed, nextTick, ref, watch } from "vue";
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
    header?: (props: unknown) => unknown;
    default?: (props: unknown) => unknown;
    footer?: (props: unknown) => unknown;
  }>();

  //emits
  const emits = defineEmits(["update:modelValue", "closed", "opened"]);

  // computed
  const sheetStyles = computed(
    () =>
      ({
        width: !props.mobile ? props.width : "100vw", // ensures the full width overlay based on the display size
        zIndex: 1007, //props.zIndex, // (default: 1007, since drawer is 1006) layer positioning on the z-axis
        backgroundColor: props.sheetColor ?? "rgb(var(--v-theme-surface1))", // custom color for the sheet
      } as StyleValue)
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
  const widthStyles = computed(
    () =>
      ({
        width: !props.mobile ? props.width : "100vw",
      } as StyleValue)
  );
</script>
<template>
  <v-sheet ref="side-sheet__sheet" class="side-sheet__sheet" :class="[modelValue && 'side-sheet__sheet--active']" :style="sheetStyles">
    <!-- Start header -->
    <v-card-item v-if="slots.header" ref="side-sheet__header" :class="[headerClass, 'side-sheet__header']">
      <slot name="header"></slot>
      <template #append>
        <v-icon v-if="props.closeButton" :aria-hidden="!props.closeButton" aria-label="close" :icon="IconsLibrary.close" @click="emits('closed')"></v-icon>
      </template>
    </v-card-item>
    <!-- Start body -->
    <v-card-text v-if="slots.default" ref="side-sheet__body" :class="[bodyClass, 'side-sheet__body']" :style="{ height: `${bodyHeight}px` }">
      <slot name="default"></slot>
    </v-card-text>
    <v-divider class="side-sheet__divider" />
    <!-- Start footer -->
    <v-card-actions v-if="slots.footer" ref="side-sheet__footer" :class="[footerClass, 'side-sheet__footer']" :style="widthStyles">
      <slot name="footer"></slot>
    </v-card-actions>
  </v-sheet>
</template>
<style lang="scss">
  .side-sheet {
    &__sheet {
      height: 100%;
      max-width: 100%;
      background-color: rgb(var(--v-theme-surface1));
    }
    &__header,
    &__body,
    &__footer {
      padding: 1.5rem;
      text-align: center;
      overflow: auto;
      background: rgb(var(--v-theme-surface1));
    }
    &__header {
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    &__body {
      text-align: left;
      height: calc(100% - 102px); // so the content is scrollable ( accounting for margins top and bottom)
    }
    @media (min-width: md) {
      &__body {
        height: calc(100vh - 166px); // so the content is scrollable ( accounting for margins top and bottom)
      }
    }
    &__footer {
      position: fixed;
      bottom: 0;
      justify-content: flex-end;
      // width: 100%;
      // height: 64px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
    &__body {
      position: relative;
    }
  }
</style>
