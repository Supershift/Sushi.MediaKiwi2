<script setup lang="ts">
  import { ref } from "vue";
  import { TableCellIcon, TableIconPosition } from "@/models/table/TableCellIcon";

  const props = defineProps<{
    data: TableCellIcon;
  }>();

  const showTooltip = ref(false);
</script>

<template>
  <label v-if="data.label && data.position === TableIconPosition.Prepend">{{ data.label }}</label>
  <v-tooltip v-model="showTooltip" location="top" :disabled="!data.tooltip">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="data.iconName" :color="data.color"></v-icon>
    </template>
    <span v-if="data.tooltip">{{ data.tooltip }}</span>
  </v-tooltip>
  <label v-if="data.label && data.position === TableIconPosition.Append">{{ data.label }}</label>
</template>
