<script setup lang="ts">
  import { FilterOperatorValue } from "@/models/table/filter/FilterOperatorValue";
  import { TableFilterItem, TableFilterValue } from "@/models";
  import { computed, reactive, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useI18next } from "@/composables";
  import { useFilters } from "@/composables/useFilters";
  import { table } from "console";

  // inject dependencies
  const { defaultT } = await useI18next();
  const { getOperatorOptions } = await useFilters(useI18next());

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const state = reactive({
    operator: modelValue.value?.value?.operator,
    value: modelValue.value?.value?.value,
  });

  const operators = computed(() => props.tableFilterItem.options || getOperatorOptions());
  const additionalRules = computed(() => {
    // If rules are defined in the filter item, use them
    if (props.tableFilterItem.rules) {
      return props.tableFilterItem.rules;
    }

    // If no options are defined, only allow numbers
    if (!props.tableFilterItem.options?.length) {
      return [(v: any) => !isNaN(v)];
    }

    return [];
  });

  const inputType = computed(() => (props.tableFilterItem.options ? "text" : "number"));

  function onApply() {
    modelValue.value = {
      value: {
        operator: state.operator,
        value: state.value,
      },
    };
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="onApply">
    <div class="pa-6">
      <v-row>
        <v-col>
          <v-select
            v-model="state.operator"
            hide-details="auto"
            :items="operators"
            :label="tableFilterItem.inputLabel || defaultT('Operator')"
            :rules="[
                (v: any) => v != undefined && v != null || defaultT(`Filter.EmptyError`, `This field is required`),  
              ]"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="state.value"
            hide-details="auto"
            :type="inputType"
            :rules="[
              (v: any) => v != undefined && v != null || defaultT(`Filter.EmptyError`, `This field is required`),
              ...additionalRules
              ]"
            :label="tableFilterItem.inputLabel || defaultT('Value')"
          />
        </v-col>
      </v-row>
    </div>
  </MkTableFilterDialog>
</template>
