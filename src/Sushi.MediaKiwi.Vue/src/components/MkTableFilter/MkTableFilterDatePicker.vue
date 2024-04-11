<script setup lang="ts">
  import { MkDatePicker } from "../MkDatePicker";
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  // inject dependencies
  const { formatDate } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  // state
  const model = ref(props.modelValue?.value);

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  function applyFilter() {
    // Single select, so we only need the first item
    const value = model.value[0];
    emit("update:modelValue", {
      title: formatDate.value(value),
      value: value,
    });
  }
</script>

<template>
  <MkDatePicker v-model="model" class="mk-table-filter__item" @update:model-value="applyFilter" @click:close="() => emit('click:close')" />
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
