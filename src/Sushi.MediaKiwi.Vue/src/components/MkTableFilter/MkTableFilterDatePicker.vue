<script setup lang="ts">
  import { useFilters, useI18next } from "@/composables";
  import { MkDatePicker } from "../MkDatePicker";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  // inject dependencies
  const { getFormatterFilterValue } = await useFilters(useI18next("MkFilter"));

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value?.value);

  function applyFilter() {
    const newModel: TableFilterItem = {
      ...props.tableFilterItem,
      selectedValue: {
        value: model.value[0],
      },
    };

    newModel.selectedValue!.title = getFormatterFilterValue(newModel);

    // Single select, so we only need the first item
    modelValue.value = { ...newModel.selectedValue! };
  }
</script>

<template>
  <MkDatePicker
    v-model="model"
    class="mk-table-filter__item"
    @update:model-value="applyFilter"
    @click:close="() => emit('click:close')"
    :title="tableFilterItem.inputLabel"
  />
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
