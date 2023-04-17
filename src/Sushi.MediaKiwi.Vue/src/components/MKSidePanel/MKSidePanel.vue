<script setup lang="ts">
  import { onBeforeMount, onBeforeUnmount, StyleValue, nextTick, watch, computed, onMounted, ref } from "vue";

  const props = defineProps({
    idName: {
      type: String,
      default: "mk-sp-container",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: [String, Number],
      default: "auto",
    },
    width: {
      type: [String, Number],
      default: "auto",
    },
    height: {
      type: [String, Number],
      default: "auto",
    },
    headerClass: {
      type: String,
      default: "",
    },
    bodyClass: {
      type: String,
      default: "",
    },
    footerClass: {
      type: String,
      default: "",
    },
    transitionName: {
      type: String,
      default: undefined,
    },
  });
  const emits = defineEmits(["closed", "opened", "update:modelValue"]);
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
  const zIndex = ref<number>();

  const overlayStyles = computed(
    () =>
      ({
        zIndex: zIndex.value,
        // animationDuration: `${props.overlayDuration}ms`,
        // "--overlay-opacity": props.overlayOpacity,
        // opacity: props.modelValue ? props.overlayOpacity : 0,
        // backgroundColor: props.overlayColor,
        pointerEvents: !props.modelValue ? "none" : "all",
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
    // TODO: fix the width when we close
  }

  const getMaxZIndex = () => Math.max(...Array.from(document.querySelectorAll("body *"), (el) => parseFloat(window.getComputedStyle(el).zIndex)).filter((zIndex) => !Number.isNaN(zIndex)), 0);

  // hooks
  onBeforeMount(() => {
    const alreadyCreatedTarget = document.getElementById(props.idName);
    if (alreadyCreatedTarget) return;
    teleportContainer = document.createElement("div");
    teleportContainer.setAttribute("id", props.idName);
    document.body.appendChild(teleportContainer);
    window.addEventListener("resize", calculateRightSize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateRightSize);
  });
  onMounted(() => {
    //zIndex.value = props.zIndex === "auto" ? getMaxZIndex() : props.zIndex;
    if (props.modelValue) {
      // TODO: fix the width to be opened
    }
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
    <div v-if="modelValue" class="mk-sp-wrapper" :class="[modelValue && 'mk-sp-wrapper--active']">
      <Transition name="overlay">
        <div v-show="modelValue" ref="overlay" class="mk-sp-overlay" :style="overlayStyles"></div>
      </Transition>
      <Transition :name="transitionName || `slide-right`">
        <v-sheet ref="mk-sp-panel" class="mk-sp-sheet" :class="[modelValue && 'mk-sp-sheet--active']">
          <v-card-item ref="mk-sp-header" :class="[headerClass, 'mk-sp__header']">
            <slot name="header"></slot>
            <template v-slot:append>
              <v-btn icon="mdi-close" variant="text" @click="handleClose"> close </v-btn>
            </template>
          </v-card-item>
          <v-card-text ref="mk-sp-body" :class="[bodyClass, 'mk-sp__body']">
            <slot name="default"></slot>
          </v-card-text>
          <v-card-actions ref="mk-sp-footer" :class="[footerClass, 'mk-sp__footer']">
            <slot name="footer"></slot>
          </v-card-actions>
        </v-sheet>
      </Transition>
    </div>
  </teleport>
</template>
<style scoped lang="scss">
  .mk-sp-wrapper {
    position: relative;
    margin-top: 64px;
    .mk-sp {
      &-overlay {
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
      }
      &-sheet {
        position: fixed;
        height: 100%;
        right: 0;
      }
      &__header,
      &__body,
      &__footer {
        overflow: auto;
      }
      &__body {
        position: relative;
      }
    }
  }

  .mk-sp {
    &-wrapper--active,
    &-sheet--active {
      width: 20vw;
    }
  }

  // Transitions
  .overlay-enter-active,
  .overlay-leave-active {
    animation: overlay-transition;
  }
  .overlay-leave-active {
    animation-direction: reverse;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    animation: slide-right;
  }
  .slide-right-leave-active {
    animation-direction: reverse;
  }

  //animations
  @keyframes slide-right {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes overlay-transition {
    0% {
      opacity: 0;
    }
    100% {
      opacity: var(--overlay-opacity);
    }
  }
</style>
