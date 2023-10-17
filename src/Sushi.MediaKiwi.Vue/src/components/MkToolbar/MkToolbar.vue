<script setup lang="ts">
  import { MkNewItemButton, MkOverflowMenuIcon } from "@/components";

  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance */
    itemViewId?: string;
    /** Title specificly for the current table */
    title?: string;
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Visible action slot for the MkToolbar */
    toolbar?: (props: unknown) => never;
    /** Menu actions for the MkToolbar */
    overflowMenuActions?: (props: unknown) => never;
  }>();
</script>

<template>
  <v-card variant="text">
    <v-container fluid>
      <v-row class="pb-2 ml-0 align-center">
        <v-card-title class="px-0 text-title-medium">{{ title }}</v-card-title>

        <v-spacer></v-spacer>

        <v-card-actions>
          <template v-if="slots.toolbar">
            <slot name="toolbar"></slot>
          </template>

          <!-- Render the new button when the prop is set -->
          <template v-if="props.itemViewId && props.new">
            <MkNewItemButton :item-view-id="props.itemViewId" />
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
