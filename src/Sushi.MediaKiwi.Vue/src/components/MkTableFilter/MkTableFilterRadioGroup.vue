<script setup lang="ts">
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
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
  const model = ref(modelValue.value);

  function applyFilter() {
    modelValue.value = model.value;
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pl-3 pr-4 py-4">
      <v-radio-group v-model="model" hide-details density="default">
        <v-radio v-for="(option, index) in tableFilterItem.options" :key="index" :label="option.title" :value="option" />
      </v-radio-group>
    </div>
  </MkTableFilterDialog>
</template>
