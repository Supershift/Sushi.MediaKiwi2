<script setup lang="ts">
  import { MkNewItemButton, MkOverflowMenuIcon } from "@/components";

  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance */
    itemViewId?: string;
    /** Title specificly for the current table */
    title?: string;
    /** Determines if the toolbar is disabled, default: false */
    disabled?: boolean;
    /** Determines if the delete button is shown, default: false */
    delete?: boolean;
    /** Determines if the toolbar has a new button, default: false. */
    new?: boolean;
    /** Determines if we only want to emit instead of navigating to the given itemViewId */
    newEmit?: boolean;
    /** Overrides the "new item" button title */
    newTitle?: string;
    /** Determines if the save button is shown, default: false */
    save?: boolean;
    /** Determines if the undo button is shown, default: false */
    undo?: boolean;
    /** Determines if the toolbar becomes sticky at the top of the page, default: false */
    sticky?: boolean;
    /** */
    onSave?: (event?: Event) => Promise<any>;
    onUndo?: (event?: Event) => Promise<any>;
    onDelete?: (event: Event) => Promise<any>;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Visible action slot for the MkToolbar */
    toolbar?: (props: unknown) => never;
    /** Visible header for the MkToolbar */
    title?: () => never;
    /** Visible header for the MkToolbar */
    header?: (props: unknown) => never;
    /** Menu actions for the MkToolbar */
    overflowMenuActions?: (props: unknown) => never;
  }>();

  // define events
  const emit = defineEmits<{
    (e: "click:new", value?: string): void;
  }>();
</script>

<template>
  <v-card variant="text" :class="['v-toolbar--mediakiwi', { 'v-toolbar--sticky': props.sticky }]">
    <v-container class="pl-0" fluid>
      <v-row v-if="slots.header" class="justify-end">
        <slot name="header"></slot>
      </v-row>
      <v-row v-if="slots.toolbar || slots.overflowMenuActions || props.title || props.new" class="pb-2 ml-0 align-center">
        <v-card-title v-if="title" class="px-0 text-title-medium">{{ title }}</v-card-title>
        <slot v-else-if="slots.title" name="title"></slot>

        <v-spacer></v-spacer>

        <v-card-actions>
          <template v-if="slots.toolbar">
            <slot name="toolbar"></slot>
          </template>

          <!-- Render the new button when the prop is set -->
          <template v-if="props.new">
            <MkNewItemButton :item-view-id="props.itemViewId" :new-title="props.newTitle" :new-emit="props.newEmit" @click:new="emit('click:new', $event)" />
          </template>

          <MkOverflowMenuIcon v-if="slots.overflowMenuActions">
            <slot name="overflowMenuActions"></slot>
          </MkOverflowMenuIcon>
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
