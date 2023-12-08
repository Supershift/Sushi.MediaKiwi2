<script setup lang="ts">
  import { TableFilterItem, TableFilterValue } from "@/models";
  import { ref } from "vue";
  import { MkDatePresetMenu } from "../MkDatePresetMenu";

  const props = defineProps<{
    modelValue: TableFilterValue;
    tableFilterItem: TableFilterItem;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  // state
  const model = ref(props.modelValue);

  function applyFilter() {
    emit("update:modelValue", {
      title: model.value.title,
      value: model.value.value,
    });
  }
</script>

<template>
  <MkDatePresetMenu v-model="model" class="mk-table-filter__item" @update:model-value="applyFilter" />
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
