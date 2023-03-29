<script setup lang="ts">
  import type { ITableFilter, ITableMap, TableFilterValueCollection, ITableSortingValue } from "@/models/table";
  import { ref, computed } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkTableToolbarVue from "./MkTableToolbar.vue";

  const props = defineProps<{
    filterMap?: ITableFilter;
    selectedFilters?: TableFilterValueCollection;
    tableMap: ITableMap<any>;
    data: any[];
    /** ExternalId of the screen instance to which the user is pushed when clicking a row. */
    itemScreenId?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
    /** */
    selectedTableRows?: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "update:selectedFilters", value: TableFilterValueCollection): void;
    (e: "click:row", value: any): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
    (e: "update:selectedTableRows", value?: unknown[]): void;
  }>();

  const hasFilter = props.filterMap !== undefined && props.selectedFilters !== undefined;

  const mkTableViewComponent = ref();
</script>

<template>
  <slot name="header"></slot>
  <template v-if="hasFilter">
    <MkTableFilter :filter-map="<ITableFilter>filterMap" :model-value="<TableFilterValueCollection>selectedFilters" @update:model-value="(e) => emit('update:selectedFilters', e)"> </MkTableFilter>
  </template>

  <template v-if="tableMap.showSelect">
    <v-expand-transition>
      <MkTableToolbarVue v-if="selectedTableRows?.length" :selected-table-rows="selectedTableRows" @click:close="mkTableViewComponent.clearSelectedTableRows">
        <template #actions>
          <slot name="actions"></slot>
        </template>
      </MkTableToolbarVue>
    </v-expand-transition>
  </template>

  <MkTableView
    ref="mkTableViewComponent"
    :table-map="tableMap"
    :data="data"
    :item-screen-id="itemScreenId"
    :selected-sort-option="selectedSortOption"
    :selected-table-rows="selectedTableRows"
    @click:row="(e) => emit('click:row', e)"
    @update:selected-sort-option="(e) => emit('update:selectedSortOption', e)"
    @update:selected-table-rows="(e) => emit('update:selectedTableRows', e)"
  ></MkTableView>
  <slot name="footer"></slot>
</template>
