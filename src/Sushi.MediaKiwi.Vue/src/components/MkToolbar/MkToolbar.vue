<script setup lang="ts">
  import MkToolbarNewItemButton from "./MkToolbarNewItemButton.vue";
  import { IconsLibrary } from "@/models";

  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance */
    itemViewId?: string;
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;
    /** Title specificly for the current table */
    title?: string;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Slot for the visible buttons in the action obar */
    actions?: (props: unknown) => any;
    /** Slot designed for the buttons (or whatever the user wants) that are available behind the 3 dots menu */
    menuActions?: (props: unknown) => any;
  }>();
</script>

<template>
  <v-card variant="text">
    <v-container>
      <v-row class="pb-2 align-center">
        <v-card-title class="px-0 text-title-medium">{{ title }}</v-card-title>

        <v-spacer></v-spacer>

        <v-card-actions>
          <template v-if="slots.actions">
            <slot name="actions"></slot>
          </template>

          <!-- Render the new button when the prop is set -->
          <template v-if="props.itemViewId && props.new">
            <MkToolbarNewItemButton :item-view-id="props.itemViewId" />
          </template>

          <!-- Render the actions slot -->
          <v-btn v-if="slots.menuActions" icon color="primary">
            <v-icon :icon="IconsLibrary.dotsVertical"></v-icon>

            <v-menu activator="parent">
              <slot name="menuActions"></slot>
            </v-menu>
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped lang="scss">
  .v-list {
    display: flex;
    flex-flow: column;
  }
</style>
