<script setup lang="ts">
  import { useI18next } from "@/composables";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";

  // inject dependencies
  const { t } = await useI18next("MkFilter");

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
    if (model.value) {
      modelValue.value = model.value;
    }
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pl-3 pr-4 py-4">
      <v-radio-group v-model="model" hide-details="auto" density="default" :rules="[...additionalRules]">
        <v-radio v-for="(option, index) in tableFilterItem.options" :key="index" :label="option.title" :value="option" />
      </v-radio-group>
    </div>
  </MkTableFilterDialog>
</template>
