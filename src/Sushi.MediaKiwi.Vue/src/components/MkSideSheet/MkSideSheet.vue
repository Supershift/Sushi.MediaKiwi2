<script setup lang="ts">
  import { onBeforeMount, onBeforeUnmount, StyleValue, watch, computed, onMounted, ref } from "vue";
  import { useDisplay } from "vuetify";
  import useSideSheet from "@/composables/useSideSheet";
  import MkSideSheetContent from "./MkSideSheetContent.vue";

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
    /** width of the sheet, ex. 20 */
    width: {
      type: Number,
      default: 475,
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
    /** determines if we have a close button or not */
    closeButton: {
      type: Boolean,
      default: false,
    },
    /** indicator to show the progress bar */
    inProgress: {
      type: Boolean,
      default: false,
    },
  });

  // emits
  const emits = defineEmits(["closedSheet", "openedSheet"]);

  // slots
  defineSlots<{
    title?: (props: unknown) => unknown;
    subtitle?: (props: unknown) => unknown;
    default?: (props: unknown) => unknown;
    footer?: (props: unknown) => unknown;
  }>();

  // Local variables
  const showOverlay = ref(false);
  const sheetValue = ref(false);
  const zIndex = ref<number | string>();
  const { mobile } = useDisplay();
  const { state, openSideSheet, closeSideSheet, isOpen, mountTeleportContainer, unMountTeleportContainer } = useSideSheet();
  // Proxy ref for the drawer to mutate
  const drawerModelValue = ref(props.modelValue);

  // computed
  const width = computed(() => {
    return props.width; // this determines if the content gets pushed or not, minimal 20vw
  });

  const wrapperStyles = computed(() => ({ width: width.value } as StyleValue));

  // functions
  function handleClose() {
    closeSideSheet();
    emits("closedSheet", state);
    sheetValue.value = false;
    showOverlay.value = false;
  }
  function handleOpen() {
    showOverlay.value = true;
    openSideSheet();
    sheetValue.value = true;
    emits("openedSheet", state);
  }

  const getMaxZIndex = () =>
    Math.max(...Array.from(document.querySelectorAll("body *"), (el) => parseFloat(window.getComputedStyle(el).zIndex)).filter((idx) => !Number.isNaN(idx)), 0);

  // hooks
  onBeforeMount(() => {
    mountTeleportContainer(props.idName);
  });
  onBeforeUnmount(() => {
    unMountTeleportContainer();
  });
  onMounted(() => {
    showOverlay.value = props.modelValue;
    zIndex.value = props.zIndex === "auto" ? getMaxZIndex() : props.zIndex;
  });

  //watchers
  watch(
    () => [props.modelValue],
    () => {
      if (props.modelValue) {
        handleOpen();
      } else {
        handleClose();
      }
    }
  );

  // watch the modelValue and update the drawerModelValue
  watch(
    () => props.modelValue,
    (value) => {
      drawerModelValue.value = value;
    }
  );
</script>
<template>
  <teleport :to="`.${props.idName}`" class="side-sheet">
    <!-- Overlay Mobile -->
    <v-overlay v-if="mobile && isOpen()" v-model:model-value="showOverlay" class="side-sheet__overlay d-flex justify-end">
      <v-expand-x-transition>
        <div v-show="sheetValue" class="side-sheet__wrapper side-sheet--mobile" :class="[sheetValue && 'side-sheet__wrapper--active']" :style="wrapperStyles">
          <mk-side-sheet-content
            :model-value="modelValue"
            :close-button="closeButton"
            :header-class="headerClass"
            :body-class="bodyClass"
            :footer-class="footerClass"
            :height="height"
            :width="width"
            :sheet-color="sheetColor"
            :z-index="zIndex"
            :in-progress="inProgress"
            :mobile="true"
            @closed="handleClose"
            @opened="handleOpen"
          >
            <template #title>
              <slot name="title"></slot>
            </template>
            <template #subtitle>
              <slot name="subtitle"></slot>
            </template>
            <template #default>
              <slot name="default"></slot>
            </template>
            <template #footer>
              <slot name="footer"></slot>
            </template>
          </mk-side-sheet-content>
        </div>
      </v-expand-x-transition>
    </v-overlay>
    <div v-else>
      <!-- Overlay Desktop This component is an aliass created in the GlobalConfiguration  -->
      <v-navigation-drawer-side-sheet v-show="!mobile" v-model="drawerModelValue" :width="width" disable-resize-watcher>
        <mk-side-sheet-content
          :model-value="modelValue"
          :close-button="closeButton"
          :header-class="headerClass"
          :body-class="bodyClass"
          :footer-class="footerClass"
          :height="height"
          :width="width"
          :sheet-color="sheetColor"
          :z-index="zIndex"
          :in-progress="inProgress"
          :mobile="true"
          @closed="handleClose"
          @opened="handleOpen"
        >
          <template #title>
            <slot name="title"></slot>
          </template>
          <template #subtitle>
            <slot name="subtitle"></slot>
          </template>
          <template #default>
            <slot name="default"></slot>
          </template>
          <template #footer>
            <slot name="footer"></slot>
          </template>
        </mk-side-sheet-content>
      </v-navigation-drawer-side-sheet>
    </div>
  </teleport>
</template>
<style lang="scss">
  @import "../../styles/themes/variables.scss";
  .side-sheet {
    &--mobile {
      height: 100vh;
    }
  }

  // this is needed to override the default overlay color of vuetify
  .v-overlay__scrim {
    background: rgba(var(--v-theme-surface-1)) !important;
  }
  @media (max-width: $breakpoints-lg) {
    .v-overlay__content {
      right: 0;
      top: 0;
    }
  }
</style>
