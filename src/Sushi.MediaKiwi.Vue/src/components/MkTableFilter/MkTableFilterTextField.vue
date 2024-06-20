<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { TableFilterType } from "@/models";

  const { defaultT } = await useI18next();

  // inject dependencies
  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value?.value || "");

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  const inputLabel = computed(() => {
    if (props.tableFilterItem.inputLabel) {
      return props.tableFilterItem.inputLabel;
    }
    return props.tableFilterItem.type === TableFilterType.Contains ? defaultT.value("Contains") : defaultT.value("Value");
  });

  function applyFilter() {
    modelValue.value = {
      value: model.value,
    };
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pa-6">
      <v-text-field v-model="model" :label="inputLabel" hide-details :rules="[(v: any) => !!v]"> </v-text-field>
    </div>
  </MkTableFilterDialog>
</template>
