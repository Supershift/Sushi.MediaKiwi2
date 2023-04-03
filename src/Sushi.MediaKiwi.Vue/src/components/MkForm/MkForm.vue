<script setup lang="ts">
  import { ref } from "vue";
  import MkFormToolbar from "./MkFormToolbar.vue";

  const emit = defineEmits(["save", "undo", "delete"]);
  const props = defineProps<{
    onSubmit: () => Promise<void>;
  }>();

  const inProgress = ref(false);
  const successSnackbar = ref(false);
  const failedSnackbar = ref(false);

  async function onSave(event: Event) {
    inProgress.value = true;
    try {
      await props.onSubmit();
      successSnackbar.value = true;
    } catch (error) {
      failedSnackbar.value = true;
      throw error;
    } finally {
      inProgress.value = false;
    }
  }
</script>
<template>
  <MkFormToolbar :disabled="inProgress" v-bind="$attrs" @save="onSave" @undo="$emit('undo', $event)" @delete="$emit('delete', $event)">
    <v-progress-linear indeterminate absolute v-if="inProgress"></v-progress-linear>
  </MkFormToolbar>
  <v-form :disabled="inProgress">
    <slot></slot>
  </v-form>
  <v-snackbar v-model="successSnackbar"><slot name="success">Action completed</slot></v-snackbar>
  <v-snackbar v-model="failedSnackbar"><slot name="failed">Action failed</slot></v-snackbar>
</template>
