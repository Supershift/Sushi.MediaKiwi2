<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useI18next } from "@/composables";

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
  const model = ref<Array<string>>(modelValue.value?.value || []);

  function applyFilter() {
    // Find the titles for the selected values
    const title =
      props.tableFilterItem?.options
        ?.filter((x) => model.value.includes(x.value))
        .map((x) => x.title)
        .join(", ") || "";

    modelValue.value = {
      title,
      value: model.value,
    };
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pa-6">
      <v-autocomplete v-model="model" multiple hide-details :items="tableFilterItem.options" :label="tableFilterItem.inputLabel || defaultT('Value')">
        <template #selection="{ item }">
          <v-chip v-if="item" v-text="item.title" />
        </template>
      </v-autocomplete>
    </div>
  </MkTableFilterDialog>
</template>
