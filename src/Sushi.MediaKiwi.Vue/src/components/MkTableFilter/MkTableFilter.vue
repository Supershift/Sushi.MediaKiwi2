<script setup lang="ts">
  import { shallowReactive, ref, watch } from "vue";
  import type { ITableFilter, ITableFilterItem, TableFilterValueCollection, ITableFilterValue } from "@/models/table/";

  const props = defineProps<{
    filterMap: ITableFilter;
    modelValue: TableFilterValueCollection;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValueCollection): void;
  }>();

  const menu = ref(false);

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

  /** Sets the current filter, current filter value and opens the menu */
  function setCurrentFilter(selectedFilter: ITableFilterItem) {
    openMenu();
    state.currentFilterValue = props.modelValue.get(selectedFilter.id);
    state.currentFilter = selectedFilter;
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

    closeFilter();
    closeMenu();
  }

  /* Removed the filterItem id from the modelValue collection. */
  function removeFilter(filterItem: ITableFilterItem) {
    // delete the filter value if we had a value, but it is now undefined
    if (filterItem) {
      props.modelValue.delete(filterItem.id);
    }

    // emit an event telling the selected filters have changed
    emit("update:modelValue", props.modelValue);
  }

  function closeMenu() {
    menu.value = false;
  }

  function openMenu() {
    menu.value = true;
  }

  function closeFilter() {
    // close the filter
    state.currentFilterValue = undefined;
    state.currentFilter = undefined;
  }

  /**
   * Watch for the menu ref
   * Closes the filter when updated to false in any way (ie. click next to it)
   */
  watch(menu, () => {
    if (!menu.value) {
      closeFilter();
    }
  });
</script>

<template>
  <v-toolbar>
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <!-- Button -->
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary" icon="mdi-filter-variant"> </v-btn>
      </template>

      <!-- context menu -->
      <v-list v-if="!state.currentFilter">
        <v-list-item v-for="filter in filterMap.items" :value="filter" @click="changeCurrentFilter(filter)">
          <v-list-item-title>{{ filter.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- filter compoment -->
      <v-card v-else-if="state.currentFilter" width="400" :title="state.currentFilter.title">
        <component :is="state.currentFilter.component" :table-filter-item="state.currentFilter" v-model="state.currentFilterValue"> </component>
        <v-card-actions>
          <v-btn @click="applyFilter()">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- Chips -->
    <template v-for="filter in filterMap.items">
      <v-chip class="ma-1" v-if="modelValue.has(filter.id)" @click="setCurrentFilter(filter)"
        >{{ filter.title }} : {{ modelValue.get(filter.id)?.title }}
        <v-btn class="ma-1" color="default" density="compact" size="small" icon="mdi-close-circle" @click.prevent="removeFilter(filter)"></v-btn>
      </v-chip>
    </template>
  </v-toolbar>
</template>
