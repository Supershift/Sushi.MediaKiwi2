<script setup lang="ts">
  import { shallowReactive } from "vue";
  import type { ITableFilter, ITableFilterItem, TableFilterValueCollection, ITableFilterValue } from "@/models/table/";

  const props = defineProps<{
    filterMap: ITableFilter;
    modelValue: TableFilterValueCollection;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValueCollection): void;
  }>();

  // holds the current filter being edited and its value
  interface IState {
    currentFilter: ITableFilterItem | undefined;
    currentFilterValue: ITableFilterValue | undefined;
  }

  const state = shallowReactive<IState>({
    currentFilter: undefined,
    currentFilterValue: undefined,
  });

  /* Sets the provided filter as currently selected filter */
  function changeCurrentFilter(selectedFilter: ITableFilterItem) {
    state.currentFilter = selectedFilter;
    state.currentFilterValue = undefined;
  }

  /* Reads the value currently set in the filter input and sets it on the filter as the selected value. */
  function applyFilter() {
    // get value and set it to selected filter values
    if (state.currentFilter !== undefined) {
      if (state.currentFilterValue !== undefined) {
        props.modelValue.set(state.currentFilter.id, state.currentFilterValue);
      } else if (props.modelValue.has(state.currentFilter.id)) {
        // delete the filter value if we had a value, but it is now undefined
        props.modelValue.delete(state.currentFilter.id);
      }
    }

    // emit an event telling the selected filters have changed
    emit("update:modelValue", props.modelValue);

    // close the filter
    state.currentFilterValue = undefined;
    state.currentFilter = undefined;
  }
</script>

<template>
  <v-toolbar>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Filter </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="filter in filterMap.items" :value="filter" @click="changeCurrentFilter(filter)">
          <v-list-item-title>{{ filter.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <template v-for="filter in filterMap.items">
      <v-chip v-if="modelValue.has(filter.id)">{{ filter.title }} : {{ modelValue.get(filter.id)?.title }}</v-chip>
    </template>
  </v-toolbar>
  <v-card width="400" :title="state.currentFilter.title" v-if="state.currentFilter !== undefined">
    <component :is="state.currentFilter.component" :table-filter-item="state.currentFilter" v-model="state.currentFilterValue"> </component>
    <v-card-actions>
      <v-btn @click="applyFilter()">Apply</v-btn>
    </v-card-actions>
  </v-card>
</template>
