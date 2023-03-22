<script setup lang="ts">
  defineProps<{
    selectedTableRows: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();
</script>

<template>
  <v-toolbar>
    <v-label class="ms-5 me-4"> {{ selectedTableRows.length }} selected </v-label>
    <v-divider class="mx-2" inset vertical></v-divider>

    <slot name="actions"></slot>

    <v-spacer></v-spacer>

    <v-btn icon="mdi-close" @click="emit('click:close')"></v-btn>
  </v-toolbar>
</template>
