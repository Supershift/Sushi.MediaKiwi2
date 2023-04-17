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
  });
  const emits = defineEmits(["closed", "opened"]);
  // Local variables
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

  // hooks
  onBeforeMount(() => {
    window.addEventListener("resize", calculateRightSize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateRightSize);
  });
  onMounted(() => {
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
    <div class="mk-sp-wrapper">
      <Transition name="overlay">
        <div v-show="modelValue" ref="overlay" class="mk-sp-overlay" :style="overlayStyles"></div>
      </Transition>
      <v-sheet class="mk-sp-sheet">
        <div ref="mk-sp-header" :class="[headerClass, 'mk-sp__header']">
          <slot name="header"></slot>
          <v-btn icon="mdi-close" variant="text" @click="handleClose"> Close </v-btn>
        </div>
        <div ref="mk-sp-body" :class="[bodyClass, 'mk-sp__body']">
          <slot name="default"></slot>
        </div>
        <div ref="mk-sp-footer" :class="[footerClass, 'mk-sp__footer']">
          <slot name="footer"></slot>
        </div>
      </v-sheet>
    </div>
  </teleport>
</template>
<style scoped lang="scss">
  .mk-sp-wrapper {
    .mk-sp {
      &-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      &-sheet {
        position: fixed;
        top: 0;
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
</style>
