<script setup lang="ts">
  import { onBeforeMount, onBeforeUnmount, StyleValue, nextTick, watch, computed, onMounted, ref } from "vue";
  import { useDisplay } from "vuetify";

  // props that are used to customize the component
  const props = defineProps({
    /** name of the element the panel teleports on */
    idName: {
      type: String,
      default: "mk-sp-container",
    },
    /** determines if the side panel is open or not */
    modelValue: {
      type: Boolean,
      default: false,
    },
    /** positioning on the z-index (drawer is 1006) */
    zIndex: {
      type: [String, Number],
      default: "auto",
    },
    /** width of the panel, ex. 20px, 100vw */
    width: {
      type: [String, Number],
      default: "auto",
    },
    /** height of the panel, ex. 20px, 100vh */
    height: {
      type: [String, Number],
      default: "auto",
    },
    /** color for the panel, ex. #ffffff, white, rgb(100, 100, 100) */
    panelColor: {
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
  const panelHeight = ref(0);
  const windowHeight = ref(0);
  const panel = ref<HTMLElement | null>(null);
  const footer = ref<HTMLElement | null>(null);
  const header = ref<HTMLElement | null>(null);
  const body = ref<HTMLElement | null>(null);
  const zIndex = ref<number | string>();
  const { mobile } = useDisplay();

  // computed
  const bodyHeight = computed<number | undefined>(() => {
    if (!panelHeight.value) return;
    const panelMaxHeight = bodyScrollHeight.value + headerHeight.value + footerHeight.value;
    let height = panelHeight.value - headerHeight.value - footerHeight.value;
    if (props.height === "auto") {
      height = windowHeight.value >= panelMaxHeight ? bodyScrollHeight.value : windowHeight.value - headerHeight.value - footerHeight.value;
    }
    return height;
  });
  const panelStyles = computed(
    () =>
      ({
        width: !mobile.value ? props.width : "100vw", // ensures the full width overlay based on the display size
        maxWidth: "100%",
        zIndex: zIndex.value, // (default: 1007, since drawer is 1006) layer positioning on the z-axis
        backgroundColor: props.panelColor, // custom color for the panel
      } as StyleValue)
  );
  const wrapperStyles = computed(
    () =>
      ({
        width: props.modelValue ? props.width : "unset", // this determines if the content gets pushed or not
      } as StyleValue)
  );

  // functions
  const calculateRightSize = async () => {
    if (window?.innerHeight > 0) windowHeight.value = window.innerHeight;
    footerHeight.value = footer.value ? footer.value.clientHeight : 0;
    headerHeight.value = header.value ? header.value.clientHeight : 0;
    bodyScrollHeight.value = body.value ? body.value.scrollHeight : 0;
    panelHeight.value = panel.value ? panel.value.clientHeight : 0;
  };

  function handleClose() {
    emits("closed");
  }

  const getMaxZIndex = () => Math.max(...Array.from(document.querySelectorAll("body *"), (el) => parseFloat(window.getComputedStyle(el).zIndex)).filter((zIndex) => !Number.isNaN(zIndex)), 0);

  // hooks
  onBeforeMount(() => {
    // determines where the panel is teleported on
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
  });
  onMounted(() => {
    zIndex.value = props.zIndex === "auto" ? getMaxZIndex() : props.zIndex;
    emits("opened");
  });

  //watchers
  watch(
    () => [header.value, footer.value, props.height, props.width, props.modelValue],
    () => {
      nextTick(() => calculateRightSize());
    }
  );
</script>
<template>
  <teleport :to="`#${idName}`">
    <div class="mk-sp-wrapper" :class="[modelValue && 'mk-sp-wrapper--active']" :style="wrapperStyles">
      <v-expand-x-transition>
        <v-sheet v-show="modelValue" ref="mk-sp-panel" class="mk-sp-sheet" :class="[modelValue && 'mk-sp-sheet--active']" :style="panelStyles">
          <v-card-item ref="mk-sp-header" :class="[headerClass, 'mk-sp__header']">
            <slot name="header"></slot>
            <template #append>
              <v-btn icon="mdi-close" variant="text" @click="handleClose"> close </v-btn>
            </template>
          </v-card-item>
          <v-card-text ref="mk-sp-body" :class="[bodyClass, 'mk-sp__body']" :style="{ height: `${bodyHeight}px` }">
            <slot name="default"></slot>
          </v-card-text>
          <v-card-actions ref="mk-sp-footer" :class="[footerClass, 'mk-sp__footer']">
            <slot name="footer"></slot>
          </v-card-actions>
        </v-sheet>
      </v-expand-x-transition>
    </div>
  </teleport>
</template>
<style scoped lang="scss">
  .mk-sp-wrapper {
    position: relative;
    margin-top: 64px;
    z-index: 1007;
    .mk-sp {
      &-sheet {
        position: fixed;
        height: 100%;
        right: 0;
        background-color: rgba(var(--v-theme-surface), 1);
      }
      &__header,
      &__body,
      &__footer {
        overflow: auto;
      }
      &__body {
        height: 75vh;
      }
      &__footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: var(rgba(28, 27, 31, var(--overlay-opacity)));
      }
      &__body {
        position: relative;
      }
    }
  }

  @media (min-width: 960px) {
    .mk-sp-wrapper {
      z-index: unset;
    }
  }
</style>
