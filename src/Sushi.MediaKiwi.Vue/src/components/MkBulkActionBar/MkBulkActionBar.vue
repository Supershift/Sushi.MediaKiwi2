<script setup lang="ts">
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";
  import { reactive } from "vue";
  import { ref } from "vue";

  type ConfirmState = {
    show?: boolean;
    callback?: () => void;
  };

  // inject dependencies
  const { defaultT } = await useI18next();

  defineProps<{
    selection: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  const confirmState = ref<ConfirmState>({});

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
  function setConfirmState(callback: () => any) {
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
</script>

<template>
  <v-toolbar class="mk-bulk-action-bar" color="inverse-surface">
    <v-label class="ms-5 me-4"> {{ selection.length }} {{ defaultT("selected") }} </v-label>
    <v-divider class="mx-2" inset vertical></v-divider>

    <template v-if="!confirmState?.show">
      <slot name="default" :confirm="setConfirmState"></slot>
    </template>
    <v-spacer></v-spacer>

    <template v-if="confirmState.show">
      <v-btn @click="clearConfirmState">{{ defaultT("Cancel") }}</v-btn>
      <v-btn-primary @click="onConfirm">{{ defaultT("Confirm") }}</v-btn-primary>
    </template>

    <v-btn v-if="!confirmState?.show" :icon="IconsLibrary.close" @click="emit('click:close')"></v-btn>
  </v-toolbar>
</template>
<style>
  .mk-bulk-action-bar {
    * {
      color: rgb(var(--v-theme-inverse-on-surface));
    }
  }
</style>
