<script setup lang="ts">
  import { MkDatePicker } from "../MkDatePicker";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value?.value);

  function applyFilter() {
    // Single select, so we only need the first item
    modelValue.value = {
      value: model.value[0],
    };
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
