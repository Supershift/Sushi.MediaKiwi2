<script setup lang="ts">
  import { ref } from "vue";
  import { TableCellIcon, TableIconPosition } from "@/models/table/TableCellIcon";

  defineProps<{
    data: TableCellIcon;
  }>();
</script>

<template>
  <label v-if="data.label && data.position === TableIconPosition.Prepend" data-cy="prepend-label">{{ data.label }}</label>
  <v-tooltip location="top" :disabled="!data.tooltip">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="data.iconName" :color="data.color" data-cy="icon"></v-icon>
    </template>
    <span v-if="data.tooltip" data-cy="tooltip">{{ data.tooltip }}</span>
  </v-tooltip>
  <label v-if="data.label && data.position === TableIconPosition.Append" data-cy="append-label">{{ data.label }}</label>
</template>
