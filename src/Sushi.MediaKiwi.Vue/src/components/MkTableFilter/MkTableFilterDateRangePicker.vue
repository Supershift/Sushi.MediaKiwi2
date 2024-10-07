<script setup lang="ts">
  import { TableFilterItem, TableFilterValue } from "@/models";
  import { ref } from "vue";
  import { MkDatePresetMenu } from "../MkDatePresetMenu";

  defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value);

  function applyFilter() {
    modelValue.value = { ...model.value };
  }
</script>

<template>
  <MkDatePresetMenu v-model="model" date-picker-class="mk-table-filter__item" @update:model-value="applyFilter" :datePickerTitle="tableFilterItem.inputLabel" />
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
