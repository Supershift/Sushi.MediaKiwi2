<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";

  // inject dependencies
  const { defaultT } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value);

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

  function applyFilter() {
    modelValue.value = model.value;
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
        return-object
        :rules="[(v: any) => !!v || defaultT(`Filter.EmptyError`, `This field is required`), ...additionalRules]"
      ></v-autocomplete>
    </div>
  </MkTableFilterDialog>
</template>
