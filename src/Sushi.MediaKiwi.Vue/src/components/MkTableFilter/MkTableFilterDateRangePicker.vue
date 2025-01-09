<script setup lang="ts">
  import { DateRange, TableFilterItem, TableFilterValue, TitledDateRange } from "@/models";
  import { computed, ref } from "vue";
  import { MkDatePresetMenu } from "../MkDatePresetMenu";

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const customDateRangeOptions = computed(() => {
    return props.tableFilterItem.options?.map((x) => {
      return {
        title: x.title,
        start: (x.value as DateRange).start,
        end: (x.value as DateRange).end,
      } as TitledDateRange;
    });
  });

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
  <MkDatePresetMenu 
    v-model="model" 
    date-picker-class="mk-table-filter__item" 
    @update:model-value="applyFilter" 
    :datePickerTitle="tableFilterItem.inputLabel"
    :customOptions="customDateRangeOptions" />
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
