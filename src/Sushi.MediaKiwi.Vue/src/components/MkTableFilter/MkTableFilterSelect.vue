<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";

  // inject dependencies
  const { defaultT } = await useI18next("MkFilter");

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<(e: "click:close") => void>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value?.value);

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

  function applyFilter() {
    if (model.value) {
      modelValue.value = {
        value: model.value,
        title: props.tableFilterItem.options?.find((option) => option.value === model.value)?.title,
      };
    }
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pa-6">
      <v-autocomplete
        v-model="model"
        hide-details="auto"
        :items="tableFilterItem.options"
        :label="tableFilterItem.inputLabel || defaultT('Value')"
        :rules="[...additionalRules]"
        autofocus
        @keydown.enter="applyFilter"
        v-bind="tableFilterItem.componentProps"
      />
    </div>
  </MkTableFilterDialog>
</template>
