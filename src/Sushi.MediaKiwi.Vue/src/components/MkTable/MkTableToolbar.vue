<script setup lang="ts">
  import { IconsLibrary } from "@/models";

  defineProps<{
    selection: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();
</script>

<template>
  <v-toolbar class="mk-bulk-action-bar" color="inverse-surface">
    <v-label class="ms-5 me-4"> {{ selection.length }} selected </v-label>
    <v-divider class="mx-2" inset vertical></v-divider>

    <slot name="selectionActions"></slot>

    <v-spacer></v-spacer>

    <v-btn :icon="IconsLibrary.close" @click="emit('click:close')"></v-btn>
  </v-toolbar>
</template>
<style>
  .mk-bulk-action-bar {
    * {
      color: rgb(var(--v-theme-inverse-on-surface));
    }
  }
</style>
