<script setup lang="ts">
  import { ref } from "vue";
  import MkFormToolbar from "./MkFormToolbar.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useSnackbarStore } from "@/stores/snackbar";

  // define properties
  const props = defineProps<{
    onSave?: (event: Event) => Promise<void>;
    onDelete?: (event: Event) => Promise<void>;
    onLoad?: (event?: Event) => Promise<void>;
  }>();

  // define reactive variables
  const inProgress = ref(false);

  // inject dependencies
  const navigation = useNavigation();
  const snackbar = useSnackbarStore();

  // event listeners
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

  async function onLoad(event?: Event) {
    if (!props.onLoad) {
      throw new Error("No onLoad handler provided");
    }
    inProgress.value = true;
    try {
      await props.onLoad(event);
    } catch (error) {
      snackbar.showMessage("Failed to load data");
      throw error;
    } finally {
      inProgress.value = false;
    }
  }

  async function onUndo(event?: Event) {
    if (!props.onLoad) {
      throw new Error("No onLoad handler provided");
    }
    inProgress.value = true;
    try {
      await props.onLoad(event);
      snackbar.showMessage("Changes reverted");
    } catch (error) {
      snackbar.showMessage("Failed to revert changes");
      throw error;
    } finally {
      inProgress.value = false;
    }
  }

  // load data async on created
  await onLoad();
</script>
<template>
  <MkFormToolbar
    :disabled="inProgress"
    v-bind="$attrs"
    :delete="$props.onDelete ? true : false"
    :save="$props.onSave ? true : false"
    :undo="$props.onLoad && $props.onSave ? true : false"
    :sticky="true"
    @save="onSave"
    @undo="onUndo"
    @delete="onDelete"
  >
    <v-progress-linear v-if="inProgress" indeterminate absolute></v-progress-linear>
  </MkFormToolbar>
  <v-form :disabled="inProgress">
    <slot></slot>
  </v-form>
</template>
