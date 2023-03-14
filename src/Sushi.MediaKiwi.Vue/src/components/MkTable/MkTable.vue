<script setup lang="ts">
  import type { ITableFilter, ITableMap, TableFilterValueCollection, ITableSortingValue } from "@/models/table";

  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";

  const props = defineProps<{
    filterMap?: ITableFilter;
    selectedFilters?: TableFilterValueCollection;
    tableMap: ITableMap<any>;
    data: any[];
    /** Name of the IScreen instance to which the user is pushed when clicking a row */
    itemScreenName?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
  }>();

  const emit = defineEmits<{
    (e: "update:selectedFilters", value: TableFilterValueCollection): void;
    (e: "click:row", value: any): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
  }>();

  const hasFilter = props.filterMap !== undefined && props.selectedFilters !== undefined;
</script>

<template>
  <slot name="header"></slot>
  <template v-if="hasFilter">
    <MkTableFilter :filter-map="<ITableFilter>filterMap" :model-value="<TableFilterValueCollection>selectedFilters" @update:model-value="(e) => emit('update:selectedFilters', e)"> </MkTableFilter>
  </template>
  <MkTableView
    :table-map="tableMap"
    :data="data"
    :item-screen-name="itemScreenName"
    @click:row="(e) => emit('click:row', e)"
    :selected-sort-option="selectedSortOption"
    @update:selected-sort-option="(e) => emit('update:selectedSortOption', e)"
  ></MkTableView>
  <slot name="footer"></slot>
</template>
