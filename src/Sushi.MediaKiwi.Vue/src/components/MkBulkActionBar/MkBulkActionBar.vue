<script setup lang="ts" generic="T">
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";
  import { ref } from "vue";

  // inject dependencies
  const { defaultT } = await useI18next();

  const props = defineProps<{
    /** Callback function to execute when the close button is clicked */
    onClose?: () => void;
  }>();

  const modelValue = defineModel<Array<T>>({ required: true });

  const confirmState = ref<{
    show?: boolean;
    callback?: () => void;
  }>({});

  // define slots
  const slots = defineSlots<{
    default?: (props: { confirm: (callback: () => void) => void }) => never;
  }>();

  /**
   * Reset the confirm state and callback function
   */
  function clearConfirmState() {
    confirmState.value = {
      show: false,
      callback: undefined,
    };
  }

  /**
   * Set the confirm state and callback function to show the confirm action buttons
   * @param callback The callback function to execute when the confirm button is clicked
   */
  function setConfirmState(callback: () => void) {
    // Bind the confirm state with the callback
    confirmState.value = {
      show: true,
      callback,
    };
  }

  /**
   * Execute the callback function
   */
  function onConfirm() {
    if (confirmState.value.show) {
      confirmState.value?.callback?.();
    }
    clearConfirmState();
  }

  function onCloseClick() {
    modelValue.value = [];
    props.onClose?.();
  }
</script>

<template>
  <v-toolbar class="mk-bulk-action-bar" color="inverse-surface">
    <v-label class="ms-5 me-4"> {{ modelValue.length }} {{ defaultT("selected") }} </v-label>
    <v-divider class="mx-2" inset vertical></v-divider>

    <template v-if="!confirmState?.show">
      <slot name="default" :confirm="setConfirmState"></slot>
    </template>
    <v-spacer></v-spacer>

    <template v-if="confirmState.show">
      <div class="d-flex ga-2 flex-row">
        <v-btn @click="clearConfirmState">{{ defaultT("Cancel") }}</v-btn>
        <v-btn color="primary" variant="flat" @click="onConfirm">{{ defaultT("Confirm") }}</v-btn>
      </div>
    </template>

    <v-btn v-if="!confirmState?.show" :icon="IconsLibrary.close" @click="onCloseClick"></v-btn>
  </v-toolbar>
</template>
<style>
  .mk-bulk-action-bar {
    * {
      color: rgb(var(--v-theme-inverse-on-surface));
    }
  }
</style>
