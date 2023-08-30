<script setup lang="ts">
  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance */
    itemViewId?: string;
    /** Title specificly for the current table */
    title?: string;
  }>();
</script>

<template>
  <v-card variant="text">
    <v-container>
      <v-row class="pb-2 ml-0 align-center">
        <v-card-title class="px-0 text-title-medium">{{ title }}</v-card-title>

        <v-spacer></v-spacer>

        <v-card-actions>
          <slot></slot>
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
