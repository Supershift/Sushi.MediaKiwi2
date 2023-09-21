<script setup lang="ts">
  import { IconsLibrary } from "@/models";
  import { onBeforeMount, onBeforeUnmount, StyleValue, nextTick, watch, computed, onMounted, ref } from "vue";
  import { useDisplay } from "vuetify";
  import useSideSheet from "@/composables/useSideSheet";
  // props that are used to customize the component
  const props = defineProps({
    /** name of the element the sheet teleports on, this is  used as a hook*/
    idName: {
      type: String,
      default: "mk-side-sheet-hook",
    },
    /** determines if the side sheet is open or not */
    modelValue: {
      type: Boolean,
      default: false,
    },
    /** positioning on the z-index (drawer is 1006) */
    zIndex: {
      type: [String, Number],
      default: "auto",
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
    /** color for the sheet, ex. #ffffff, white, rgb(100, 100, 100) */
    sheetColor: {
      type: String,
      default: "",
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
    /** role we assigned the sidesheet, this ensures we only have one instance running of the sheet */
    role: {
      type: String,
      default: "sideSheet",
    },
    /** determines if we have a close button or not */
    hasClose: {
      type: Boolean,
      default: false,
    },
  });

  // emits
  const emits = defineEmits(["closed", "opened"]);

  // slots
  const sl = defineSlots<{
    header?: (props: unknown) => unknown;
    default?: (props: unknown) => unknown;
    footer?: (props: unknown) => unknown;
  }>();

  // Local variables
  let teleportContainer = undefined as HTMLDivElement | undefined;
  const footerHeight = ref(0);
  const bodyScrollHeight = ref(0);
  const headerHeight = ref(0);
  const sheetHeight = ref(0);
  const windowHeight = ref(0);
  const sheet = ref<HTMLElement | null>(null);
  const footer = ref<HTMLElement | null>(null);
  const header = ref<HTMLElement | null>(null);
  const body = ref<HTMLElement | null>(null);
  const zIndex = ref<number | string>();
  const { mobile } = useDisplay();
  const showOverlay = ref(false);
  const sheetValue = ref(false);
  const hookName = ref(props.idName); // check if the hook name is set, if not use the default
  const { state, openSideSheet, closeSideSheet, hasRole } = useSideSheet();

  // computed
  const bodyHeight = computed<number | undefined>(() => {
    if (!sheetHeight.value) return;
    const sheetMaxHeight = bodyScrollHeight.value + headerHeight.value + footerHeight.value;
    let height = sheetHeight.value - headerHeight.value - footerHeight.value;
    if (props.height === "auto") {
      height = windowHeight.value >= sheetMaxHeight ? bodyScrollHeight.value : windowHeight.value - headerHeight.value - footerHeight.value;
    }
    return height;
  });
  const sheetStyles = computed(
    () =>
      ({
        width: !mobile.value ? props.width : "100vw", // ensures the full width overlay based on the display size
        maxWidth: "100%",
        zIndex: zIndex.value, // (default: 1007, since drawer is 1006) layer positioning on the z-axis
        backgroundColor: props.sheetColor, // custom color for the sheet
      } as StyleValue)
  );
  const wrapperStyles = computed(
    () =>
      ({
        width: props.modelValue && mobile.value ? props.width : "20vw", // this determines if the content gets pushed or not, minimal 20vw
        marginTop: props.modelValue && !mobile.value ? "64px" : "0",
      } as StyleValue)
  );
  const hasCloseButton = computed(() => props.hasClose == true);

  // functions
  const calculateRightSize = async () => {
    if (window?.innerHeight > 0) windowHeight.value = window.innerHeight;
    footerHeight.value = footer.value ? footer.value.clientHeight : 0;
    headerHeight.value = header.value ? header.value.clientHeight : 0;
    bodyScrollHeight.value = body.value ? body.value.scrollHeight : 0;
    sheetHeight.value = sheet.value ? sheet.value.clientHeight : 0;
  };

  function handleClose() {
    closeSideSheet(props.role);
    emits("closed", state);
    sheetValue.value = false;
    showOverlay.value = false;
  }

  const getMaxZIndex = () =>
    Math.max(
      ...Array.from(document.querySelectorAll("body *"), (el) => parseFloat(window.getComputedStyle(el).zIndex)).filter((zIndex) => !Number.isNaN(zIndex)),
      0
    );

  // hooks
  onBeforeMount(() => {
    // determines where the sheet is teleported on
    const alreadyCreatedTarget = document.getElementById(props.idName);
    if (alreadyCreatedTarget) return;
    teleportContainer = document.createElement("div");
    teleportContainer.setAttribute("id", props.idName);
    document.body.appendChild(teleportContainer);
    // register listener for resizing
    window.addEventListener("resize", calculateRightSize);
  });
  onBeforeUnmount(() => {
    // unregister listener for resizing
    window.removeEventListener("resize", calculateRightSize);

    if (sheetValue.value) {
      sheetValue.value = false;
    }
    if (showOverlay.value) {
      showOverlay.value = false;
    }

    if (teleportContainer) {
      document.body.removeChild(teleportContainer);
    }
  });
  onMounted(() => {
    showOverlay.value = props.modelValue;
    zIndex.value = props.zIndex === "auto" ? getMaxZIndex() : props.zIndex;
  });

  //watchers
  watch(
    () => [header.value, footer.value, props.height, props.width, props.modelValue],
    () => {
      if (props.modelValue) {
        showOverlay.value = true;
        // delays the opening of the sheet to allow the transition to work, primarily on mobile
        setTimeout(() => {
          openSideSheet(props.role);
          sheetValue.value = true;
          emits("opened", state);
        }, 300);
      } else {
        showOverlay.value = false;
        sheetValue.value = false;
      }
      nextTick(() => calculateRightSize());
    }
  );
</script>
<template>
  <teleport :to="`.${hookName}`" class="side-sheet">
    <!-- Overlay Mobile -->
    <v-overlay v-if="mobile && hasRole(props.role)" v-model:model-value="showOverlay" class="side-sheet__overlay d-flex justify-end">
      <v-expand-x-transition>
        <div v-show="sheetValue" class="side-sheet__wrapper side-sheet--mobile" :class="[sheetValue && 'side-sheet__wrapper--active']" :style="wrapperStyles">
          <v-sheet ref="side-sheet__sheet" class="side-sheet__sheet" :class="[sheetValue && 'side-sheet__sheet--active']" :style="sheetStyles">
            <!-- Start of Header  -->
            <v-card-item v-if="sl.header" ref="side-sheet__header" :class="[headerClass, 'side-sheet__header']">
              <slot name="header"></slot>
              <template #append>
                <v-icon v-if="hasCloseButton" :aria-hidden="!hasCloseButton" aria-label="close" :icon="IconsLibrary.close" @click="handleClose"></v-icon>
              </template>
            </v-card-item>
            <!-- Start of Body -->
            <v-card-text v-if="sl.default" ref="side-sheet__body" :class="[bodyClass, 'side-sheet__body']" :style="{ height: `${bodyHeight}px` }">
              <slot name="default"></slot>
            </v-card-text>
            <v-divider v-if="sl.footer" />
            <!-- Start of Footer -->
            <v-card-actions v-if="sl.footer" ref="side-sheet__footer" :class="[footerClass, 'side-sheet__footer']">
              <slot name="footer"></slot>
            </v-card-actions>
          </v-sheet>
        </div>
      </v-expand-x-transition>
    </v-overlay>
    <!-- Overlay Desktop -->
    <v-expand-x-transition v-else>
      <div
        v-show="modelValue && !mobile && hasRole(props.role)"
        class="side-sheet__wrapper"
        :class="[modelValue && 'side-sheet__wrapper--active']"
        :style="wrapperStyles"
      >
        <v-sheet ref="side-sheet__sheet" class="side-sheet__sheet" :class="[modelValue && 'side-sheet__sheet--active']" :style="sheetStyles">
          <!-- Start header -->
          <v-card-item v-if="sl.header" ref="side-sheet__header" :class="[headerClass, 'side-sheet__header']">
            <slot name="header"></slot>
            <template #append>
              <v-icon v-if="hasCloseButton" :aria-hidden="!hasCloseButton" aria-label="close" :icon="IconsLibrary.close" @click="handleClose"></v-icon>
            </template>
          </v-card-item>
          <!-- Start body -->
          <v-card-text v-if="sl.default" ref="side-sheet__body" :class="[bodyClass, 'side-sheet__body']" :style="{ height: `${bodyHeight}px` }">
            <slot name="default"></slot>
          </v-card-text>
          <v-divider v-if="sl.footer" />
          <!-- Start footer -->
          <v-card-actions v-if="sl.footer" ref="side-sheet__footer" :class="[footerClass, 'side-sheet__footer']">
            <slot name="footer"></slot>
          </v-card-actions>
        </v-sheet>
      </div>
    </v-expand-x-transition>
  </teleport>
</template>
<style lang="scss">
  .side-sheet {
    &__wrapper {
      position: relative;
      background-color: rgb(var(--v-theme-surface));

      .side-sheet {
        &__sheet {
          height: 100%;
          background-color: rgb(var(--v-theme-surface1));
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }
        &__header,
        &__body,
        &__footer {
          text-align: center;
          overflow: auto;
        }
        &__body {
          text-align: left;
          height: calc(100% - 128px); // so the content is scrollable ( accounting for margins top and bottom)
        }
        @media (min-width: 900px) {
          &__body {
            height: calc(100% - 175px); // so the content is scrollable ( accounting for margins top and bottom)
          }
        }
        &__footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 64px;
          background: rgb(var(--v-theme-surface1));
        }
        &__body {
          position: relative;
        }
      }
    }
    &--mobile {
      height: 100vh;
    }
  }

  // this is needed to override the default overlay color of vuetify
  .v-overlay__scrim {
    background: rgba(var(--v-theme-surface-1)) !important;
  }
</style>
