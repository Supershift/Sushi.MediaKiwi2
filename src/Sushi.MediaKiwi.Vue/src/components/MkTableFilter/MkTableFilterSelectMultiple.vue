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
    modelValue.value = {
      value: model.value,
    };
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pa-6">
      <v-autocomplete
        v-model="model"
        multiple
        hide-details
        :items="tableFilterItem.options"
        :label="tableFilterItem.inputLabel || defaultT('Value')"
        :rules="[(v: any) => !!v && !!v.length]"
      >
        <template #selection="{ item }">
          <v-chip v-if="item" v-text="item.title" />
        </template>
      </v-autocomplete>
    </div>
  </MkTableFilterDialog>
</template>
