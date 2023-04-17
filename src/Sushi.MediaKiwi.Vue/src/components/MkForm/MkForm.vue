<script setup lang="ts">
  import { ref } from "vue";
  import MkFormToolbar from "./MkFormToolbar.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useSnackbarStore } from "@/stores/snackbar";

  const props = defineProps<{
    onSave?: (event: Event) => Promise<void>;
    onDelete?: (event: Event) => Promise<void>;
    onUndo?: (event: Event) => Promise<void>;
  }>();

  const inProgress = ref(false);

  // inject dependencies
  const navigation = useNavigation();
  const snackbar = useSnackbarStore();

  async function onSave(event: Event) {
    if (!props.onSave) {
      throw new Error("No onSave handler provided");
    }
    inProgress.value = true;
    try {
      await props.onSave(event);
      snackbar.showMessage("Saved successfully");
    } catch (error) {
      snackbar.showMessage("Failed to save");
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
      snackbar.showMessage("Deleted successfully");
      // send back to parent
      navigation.navigateToParent();
    } catch (error) {
      snackbar.showMessage("Failed to delete");
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
      snackbar.showMessage("Changes reverted");
    } catch (error) {
      snackbar.showMessage("Failed to revert changes");
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
</template>
