<script setup lang="ts">
  import type { ITableFilter, ITableMap, TableFilterValueCollection, ITableSortingValue } from "@/models/table";
  import { ref } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkTableToolbarVue from "./MkTableToolbar.vue";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";

  const props = defineProps<{
    filterMap?: ITableFilter;
    selectedFilters?: TableFilterValueCollection;
    tableMap: ITableMap<any>;
    data: any[];
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
    /** */
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:selectedFilters", value: TableFilterValueCollection): void;
    (e: "click:row", value: any): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
    (e: "update:selectedTableRows", value?: unknown[]): void;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const hasFilter = props.filterMap !== undefined && props.selectedFilters !== undefined;

  const mkTableViewComponent = ref();

  function onNewClick() {
    // navigate user to target page if defined
    if (props.itemViewId) {
      // find navigation item for the view
      const view = store.views.find((x) => x.externalId == props.itemViewId);

      if (!view) {
        throw new Error(`No view found for external id ${props.itemViewId}`);
      }
      const navigationItem = store.navigationItems.find((x) => x.viewId == view?.id);
      if (!navigationItem) {
        throw new Error(`No navigationItem found for view ${props.itemViewId}`);
      }

      // push user to target page
      navigation.navigateTo(navigationItem, 0);
    }
  }
</script>

<template>
  <slot name="header"></slot>
  <template v-if="hasFilter">
    <MkTableFilter :filter-map="<ITableFilter>filterMap" :model-value="<TableFilterValueCollection>selectedFilters" @update:model-value="(e) => emit('update:selectedFilters', e)"> </MkTableFilter>
  </template>

  <v-btn v-if="props.new && props.itemViewId" @click="onNewClick">New</v-btn>

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
    :item-view-id="itemViewId"
    :selected-sort-option="selectedSortOption"
    :selected-table-rows="selectedTableRows"
    @click:row="(e) => emit('click:row', e)"
    @update:selected-sort-option="(e) => emit('update:selectedSortOption', e)"
    @update:selected-table-rows="(e) => emit('update:selectedTableRows', e)"
  ></MkTableView>
  <slot name="footer"></slot>
</template>
