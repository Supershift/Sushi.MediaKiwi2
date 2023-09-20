<script setup lang="ts">
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";

  // inject dependencies
  const { defaultT } = await useI18next();

  defineProps<{
    selection: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();
</script>

<template>
  <v-toolbar class="mk-bulk-action-bar" color="inverse-surface">
    <v-label class="ms-5 me-4"> {{ selection.length }} {{ defaultT("selected") }} </v-label>
    <v-divider class="mx-2" inset vertical></v-divider>

    <slot></slot>

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
