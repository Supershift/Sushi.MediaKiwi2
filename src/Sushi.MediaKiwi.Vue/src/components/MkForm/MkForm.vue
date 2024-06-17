<script setup lang="ts">
  import { ref } from "vue";
  import { MkToolbar } from "@/components/MkToolbar";
  import { useNavigation } from "@/composables/useNavigation";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { useI18next } from "@/composables/useI18next";
  import MkOverflowMenuIcon from "../MkOverflowMenuIcon/MkOverflowMenuIcon.vue";

  // inject dependencies
  const { defaultT } = await useI18next();

  // define properties
  const props = defineProps<{
    onSave?: (event?: Event) => Promise<void>;
    onDelete?: (event: Event) => Promise<void>;
    onLoad?: (event?: Event) => Promise<void>;
    sticky?: boolean;
    title?: string;
    hideToolbar?: boolean;
  }>();

  // define slots
  defineSlots<{
    toolbarHeader?: void;
    default?: void;
  }>();

  // define reactive variables
  const inProgress = ref(false);

  // inject dependencies
  const navigation = useNavigation();
  const snackbar = useSnackbarStore();

  // event listeners
  async function onSave(event?: Event) {
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
  <MkToolbar
    v-if="!hideToolbar"
    :loading="inProgress"
    v-bind="$attrs"
    :item-view-id="navigation.currentNavigationItem.value.viewId"
    :title="props.title ?? navigation.currentNavigationItem.value.viewId"
    :new="false"
    :delete="$props.onDelete ? true : false"
    :save="$props.onSave ? true : false"
    :undo="$props.onLoad && $props.onSave ? true : false"
    :sticky="props.sticky ? true : false"
    @save="onSave"
    @undo="onUndo"
    @delete="onDelete"
  >
    <template #header>
      <slot name="toolbarHeader"></slot>
      <v-card-actions>
        <v-btn v-if="onUndo" :disabled="false" @click="onUndo">{{ defaultT("Undo") }}</v-btn>
        <v-btn v-if="onSave" :disabled="false" @click="onSave">{{ defaultT("Save") }}</v-btn>
        <MkOverflowMenuIcon v-if="onDelete">
          <v-list-item v-if="onDelete" @click="onDelete"> {{ defaultT("Delete") }}</v-list-item>
        </MkOverflowMenuIcon>
      </v-card-actions>
    </template>
  </MkToolbar>
  <v-form :disabled="inProgress" :class="[{ 'v-form--sticky': $props.sticky }]">
    <slot></slot>
  </v-form>
</template>
