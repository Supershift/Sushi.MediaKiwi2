<script setup lang="ts">
  import { onBeforeMount, onBeforeUnmount, StyleValue, nextTick, watch, computed, onMounted, ref } from "vue";
  import { useDisplay } from "vuetify";

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
  });

  // emits
  const emits = defineEmits(["closed", "opened"]);

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

  // functions
  const calculateRightSize = async () => {
    if (window?.innerHeight > 0) windowHeight.value = window.innerHeight;
    footerHeight.value = footer.value ? footer.value.clientHeight : 0;
    headerHeight.value = header.value ? header.value.clientHeight : 0;
    bodyScrollHeight.value = body.value ? body.value.scrollHeight : 0;
    sheetHeight.value = sheet.value ? sheet.value.clientHeight : 0;
  };

  function handleClose() {
    emits("closed");
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
          sheetValue.value = true;
          emits("opened");
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
  <teleport :to="`#${hookName}`">
    <!-- Overlay Mobile -->
    <v-overlay v-if="mobile" v-model:model-value="showOverlay" class="mk-sp-overlay d-flex justify-end">
      <v-expand-x-transition>
        <div v-show="sheetValue" class="mk-sp-wrapper" :class="[sheetValue && 'mk-sp-wrapper-active']" :style="wrapperStyles">
          <v-sheet ref="mk-sp-sheet" class="mk-sp-sheet" :class="[sheetValue && 'mk-sp-sheet-active']" :style="sheetStyles">
            <!-- Start of Header  -->
            <v-card-item ref="mk-sp-header" :class="[headerClass, 'mk-sp-header']">
              <slot name="header"></slot>
              <template #append>
                <v-icon aria-hidden="false" aria-label="close" @click="handleClose">mdi-close</v-icon>
              </template>
            </v-card-item>
            <!-- Start of Body -->
            <v-card-text ref="mk-sp-body" :class="[bodyClass, 'mk-sp-body']" :style="{ height: `${bodyHeight}px` }">
              <slot name="default"></slot>
            </v-card-text>
            <!-- Start of Footer -->
            <v-card-actions ref="mk-sp-footer" :class="[footerClass, 'mk-sp-footer']">
              <slot name="footer"></slot>
            </v-card-actions>
          </v-sheet>
        </div>
      </v-expand-x-transition>
    </v-overlay>
    <!-- Overlay Desktop -->
    <v-expand-x-transition v-else>
      <div v-show="modelValue && !mobile" class="mk-sp-wrapper" :class="[modelValue && 'mk-sp-wrapper-active']" :style="wrapperStyles">
        <v-sheet ref="mk-sp-sheet" class="mk-sp-sheet" :class="[modelValue && 'mk-sp-sheet-active']" :style="sheetStyles">
          <!-- Start header -->
          <v-card-item ref="mk-sp-header" :class="[headerClass, 'mk-sp-header']">
            <slot name="header"></slot>
            <template #append>
              <v-icon aria-hidden="false" aria-label="close" @click="handleClose">mdi-close</v-icon>
            </template>
          </v-card-item>
          <!-- Start body -->
          <v-card-text ref="mk-sp-body" :class="[bodyClass, 'mk-sp-body']" :style="{ height: `${bodyHeight}px` }">
            <slot name="default"></slot>
          </v-card-text>
          <!-- Start footer -->
          <v-card-actions ref="mk-sp-footer" :class="[footerClass, 'mk-sp-footer']">
            <slot name="footer"></slot>
          </v-card-actions>
        </v-sheet>
      </div>
    </v-expand-x-transition>
  </teleport>
</template>
<style lang="scss">
  .mk-sp-wrapper {
    position: relative;
    height: 100vh;

    .mk-sp {
      &-sheet {
        height: 100%;
        background-color: rgba(var(--v-theme-surface), 1);
      }
      &-header,
      &-body,
      &-footer {
        text-align: center;
        overflow: auto;
      }
      &-body {
        text-align: left;
        height: calc(100% - 128px); // so the content is scrollable ( accounting for margins top and bottom)
      }
      @media (min-width: 900px) {
        &-body {
          height: calc(100% - 175px); // so the content is scrollable ( accounting for margins top and bottom)
        }
      }
      &-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 64px;
        background: rgba(var(--v-theme-surface), 1);
      }
      &-body {
        position: relative;
      }
    }
  }

  // this is needed to override the default overlay color
  .v-overlay__scrim {
    background: rgba(var(--v-theme-surface), 1) !important;
  }
</style>
