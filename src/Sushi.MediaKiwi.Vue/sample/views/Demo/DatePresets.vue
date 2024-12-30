<script setup lang="ts">
  import MkDatePresetMenu from "@/components/MkDatePresetMenu/MkDatePresetMenu.vue";
  import { TableFilterValue } from "@/models";
  import { ref } from "vue";

  const dateRange = ref<TableFilterValue>({
    title: "Last 7 days",
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
  });
</script>
<template>
  <v-label>Date Range</v-label>
  <p>{{ dateRange }}</p>
  <MkDatePresetMenu
    v-model:model-value="dateRange"
    elevation="3"
    item-title="title"
    item-value="value"
    :days="[7, 28, 90, 180, 365]"
    hide-details
    date-picker-title="SelectDateRange"
    has-forever
    forever-label="End of time"
    forever-threshold="01-01-1700"
  />
</template>
