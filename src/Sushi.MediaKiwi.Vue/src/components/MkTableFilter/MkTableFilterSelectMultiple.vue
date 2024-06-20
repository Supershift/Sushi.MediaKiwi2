<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useI18next } from "@/composables";

  // inject dependencies
  const { t, defaultT } = await useI18next("MkFilter");

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref<Array<string>>(modelValue.value?.value || []);

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

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
        hide-details="auto"
        :items="tableFilterItem.options"
        :label="tableFilterItem.inputLabel || defaultT('Value')"
        :rules="[(v: any) => !!v && !!v.length || t(`EmptyFilterError`, `This field is required`), ...additionalRules]"
      >
        <template #selection="{ item }">
          <v-chip v-if="item" v-text="item.title" />
        </template>
      </v-autocomplete>
    </div>
  </MkTableFilterDialog>
</template>
