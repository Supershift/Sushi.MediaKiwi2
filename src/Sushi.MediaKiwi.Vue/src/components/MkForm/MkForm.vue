<script setup lang="ts">
  import { ref } from "vue";
  import MkFormToolbar from "./MkFormToolbar.vue";
  import { useNavigation } from "@/composables/useNavigation";

  const props = defineProps<{
    onSave?: (event: Event) => Promise<void>;
    onDelete?: (event: Event) => Promise<void>;
    onUndo?: (event: Event) => Promise<void>;
  }>();

  const inProgress = ref(false);
  const successSnackbar = ref(false);
  const failedSnackbar = ref(false);
  const navigation = useNavigation();

  async function onSave(event: Event) {
    if (!props.onSave) {
      throw new Error("No onSave handler provided");
    }
    inProgress.value = true;
    try {
      await props.onSave(event);
      successSnackbar.value = true;
    } catch (error) {
      failedSnackbar.value = true;
      throw error;
    } finally {
      inProgress.value = false;
    }
  }

  async function onDelete(event: Event) {
    if (!props.onDelete) {
      throw new Error("No onDelete handler provided");
    }
    inProgress.value = true;
    try {
      await props.onDelete(event);
      successSnackbar.value = true;
      // send back to parent
      navigation.navigateToParent();
    } catch (error) {
      failedSnackbar.value = true;
      throw error;
    } finally {
      inProgress.value = false;
    }
  }

  async function onUndo(event: Event) {
    if (!props.onUndo) {
      throw new Error("No onUndo handler provided");
    }
    inProgress.value = true;
    try {
      await props.onUndo(event);
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
  <MkFormToolbar
    :disabled="inProgress"
    v-bind="$attrs"
    @save="onSave"
    @undo="onUndo"
    @delete="onDelete"
    :delete="$props.onDelete ? true : false"
    :save="$props.onSave ? true : false"
    :undo="$props.onUndo ? true : false"
  >
    <v-progress-linear indeterminate absolute v-if="inProgress"></v-progress-linear>
  </MkFormToolbar>
  <v-form :disabled="inProgress">
    <slot></slot>
  </v-form>
  <v-snackbar v-model="successSnackbar"><slot name="success">Action completed</slot></v-snackbar>
  <v-snackbar v-model="failedSnackbar"><slot name="failed">Action failed</slot></v-snackbar>
</template>
