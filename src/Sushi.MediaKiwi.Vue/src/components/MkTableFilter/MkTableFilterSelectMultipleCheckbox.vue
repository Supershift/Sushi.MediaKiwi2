<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useFilters, useI18next } from "@/composables";

  const { getFormatterFilterValue } = await useFilters(useI18next("MkFilter"));

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
    if (model.value) {
      // Create the new filter model
      const newFilter = <TableFilterItem>{ ...props.tableFilterItem, selectedValue: { value: model.value } };

      // Get the titles of the selected options
      const title = getFormatterFilterValue(newFilter);

      // Bind the new filter model to the model value
      modelValue.value = {
        value: newFilter.selectedValue!.value,
        title: title,
      };
    }
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pl-0 py-4">
      <v-checkbox
        v-for="option in tableFilterItem.options"
        :key="option.value"
        v-model="model"
        :value="option.value"
        :label="option.title"
        density="comfortable"
        class="mk-table-filter__item__checkbox pl-3"
        hide-details="auto"
        :rules="[...additionalRules]"
        v-bind="tableFilterItem.componentProps"
      />
    </div>
  </MkTableFilterDialog>
</template>
<style scoped lang="scss">
  @use "@/styles/abstracts/mixins" as mixins;

  .mk-table-filter__item__checkbox {
    &:hover {
      @include mixins.hover-effect;
    }
  }
</style>
