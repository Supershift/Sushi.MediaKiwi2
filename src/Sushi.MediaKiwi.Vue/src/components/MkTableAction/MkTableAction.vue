<script setup lang="ts">
  import MkTableActionNewItemButton from "./MkTableActionNewItemButton.vue";

  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance */
    itemViewId?: string;
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;
    /** Title specificly for the current table */
    title?: string;
  }>();
</script>

<template>
  <v-card variant="text">
    <v-container>
      <v-row class="pb-2">
        <v-card-title class="px-0">{{ title }}</v-card-title>

        <v-spacer></v-spacer>

        <v-card-actions>
          <!-- Render the new button when the prop is set -->
          <template v-if="props.itemViewId && props.new">
            <MkTableActionNewItemButton :item-view-id="props.itemViewId" />
          </template>

          <!-- Default location to render all other child elements -->
          <v-btn icon color="primary">
            <v-icon>mdi-dots-vertical</v-icon>

            <v-menu activator="parent">
              <slot></slot>
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
