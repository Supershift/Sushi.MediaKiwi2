<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { TableFilterType } from "@/models";

  const { t, defaultT } = await useI18next("MkFilter");

  // inject dependencies
  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value?.value || "");

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  const inputLabel = computed(() => {
    if (props.tableFilterItem.inputLabel) {
      return props.tableFilterItem.inputLabel;
    }
    return props.tableFilterItem.type === TableFilterType.Contains ? defaultT.value("Contains") : defaultT.value("Value");
  });

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

  function applyFilter() {
    if (model.value) {
      modelValue.value = {
        value: model.value,
        title: model.value,
      };
    }
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pa-6">
      <v-text-field v-model="model" :label="inputLabel" hide-details="auto" :rules="[...additionalRules]" autofocus> </v-text-field>
    </div>
  </MkTableFilterDialog>
</template>
