<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useFilters, useI18next } from "@/composables";

  // inject dependencies
  const { getFormatterFilterValue } = await useFilters(useI18next("MkFilter"));
  const { defaultT } = await useI18next("MkFilter");

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref<Array<string>>(modelValue.value?.value || []);
  // Menu model for the dropdown context behaviour handling
  const menuModelValue = ref(false);

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

  function applyFilter() {
    if (model.value) {
      // Create the new filter model
      const newFilter = <TableFilterItem>{ ...props.tableFilterItem, selectedValue: { value: model.value } };

      // Get the titles of the selected options
      const title = getFormatterFilterValue(props.tableFilterItem);

      // Bind the new filter model to the model value
      modelValue.value = {
        value: newFilter.selectedValue!.value,
        title: title,
      };
    }
  }

  // Close the menu or apply the filter
  function closeOrApply(e: KeyboardEvent) {
    if (!menuModelValue.value) {
      // if menu closed, then apply filter
      applyFilter();
    } else {
      // if menu open, then close it
      menuModelValue.value = false;
    }
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
        :rules="[...additionalRules]"
        autofocus
        :menu-props="{ modelValue: menuModelValue, persistent: true }"
        clear-on-select
        @keydown.enter="closeOrApply"
        @update:menu="(e) => (menuModelValue = e)"
        @update:search="menuModelValue = true"
        v-bind="tableFilterItem.componentProps"
      >
        <template #selection="{ item }">
          <v-chip v-if="item" v-text="item.title" />
        </template>
      </v-autocomplete>
    </div>
  </MkTableFilterDialog>
</template>
