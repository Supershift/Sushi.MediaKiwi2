<script setup lang="ts">
  import { useRouter, type RouteParamsRaw } from "vue-router";
  import type { ITableMap } from "@/models/table/ITableMap";
  import type { ITableMapItem } from "@/models/table/ITableMapItem";
  import MkTableCell from "./MkTableCell.vue";
  import { store } from "@/stores/mediakiwi/mock";
  import { TableSortingDirection } from "@/models";
  import type { ITableSortingValue } from "@/models";
  import TableSortingHelper from "@/helpers/TableSortingHelper";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { useTableMapItemSelection } from "@/composables/useTableMapItemSelection";
  import { watch } from "vue";

  // Create instance of the table sorting helper
  const tableSortingHelper = new TableSortingHelper();

  const props = defineProps<{
    tableMap: ITableMap<unknown>;
    data: unknown[];
    /** Name of the IScreen instance to which the user is pushed when clicking a row */
    itemScreenName?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
    selectedTableRows?: unknown[];
  }>();

  const emit = defineEmits<{
    (e: "click:row", value: unknown): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
    (e: "update:selectedTableRows", value?: unknown[]): void;
  }>();

  const router = useRouter();

  function onRowClick(event: Event, dataItem: unknown) {
    // emit event
    emit("click:row", dataItem);

    // navigate user to target page if defined
    if (props.itemScreenName !== undefined) {
      // find navigation item for the screen
      let screen = store.screens.find((x) => x.name == props.itemScreenName);
      if (screen === undefined) {
        throw new Error(`No screen found for name ${props.itemScreenName}`);
      }
      let navigationItem = store.navigationItems.find((x) => x.screenId == screen?.id);
      if (navigationItem === undefined) {
        throw new Error(`No navigationItem found for screen ${props.itemScreenName}`);
      }

      // try to resolve route parameter
      let routeParams: RouteParamsRaw = {};
      if (navigationItem.isDynamicRoute !== undefined) {
        if (props.tableMap.itemId === undefined) {
          throw new Error(`No itemId function found to resolve ${navigationItem.dynamicRouteParamaterName}`);
        }
        let itemId = props.tableMap.itemId(dataItem);
        if (itemId === undefined) {
          throw new Error(`No value returned by itemId function`);
        }
        if (navigationItem.dynamicRouteParamaterName !== undefined) {
          routeParams[navigationItem.dynamicRouteParamaterName] = itemId;
        }
      }

      // push user to target page
      router.push({ name: navigationItem.id.toString(), params: routeParams });
    }
  }

  function onSortClick(tableMapItem: ITableMapItem<unknown>) {
    if (tableMapItem?.sortingOptions) {
      const dataItem = tableSortingHelper.parseTableSortingValue(tableMapItem, props.selectedSortOption);
      emit("update:selectedSortOption", dataItem);
    }
  }

  /** Init selection composable for item selection with the table map and data  */
  const { selectAll, selectItem, isItemSelected, isAllSelected, isIndeterminate, selectedItems } = useTableMapItemSelection({
    tableMap: props.tableMap,
    data: props.data,
  });

  watch(selectedItems, (value) => {
    emit("update:selectedTableRows", value);
  });
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th v-if="tableMap.showSelect">
          <MkTableCheckbox :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:is-selected="selectAll" />
        </th>
        <!-- render a header cell for each mapping item -->
        <th v-for="mapItem in props.tableMap.items" :key="mapItem.id" :class="tableSortingHelper.getSortingClasses(mapItem, props.selectedSortOption)" @click="onSortClick(mapItem)">
          {{ mapItem.headerTitle }}
          <v-icon v-show="props.selectedSortOption?.sortDirection === TableSortingDirection.Asc">mdi-arrow-up</v-icon>
          <v-icon v-show="props.selectedSortOption?.sortDirection === TableSortingDirection.Desc">mdi-arrow-down</v-icon>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- render a row for each provided data entity -->
      <tr v-for="(dataItem, index) in props.data" :key="index" style="cursor: pointer" @click.stop="(e) => onRowClick(e, dataItem)">
        <td v-if="tableMap.showSelect" @click.stop>
          <MkTableCheckbox :is-selected="isItemSelected(dataItem)" @update:is-selected="(e) => selectItem(dataItem, e)" />
        </td>
        <!-- render a cell for each mapping item -->
        <MkTableCell v-for="mapItem in props.tableMap.items" :key="mapItem.id" :data="dataItem" :map-item="mapItem"></MkTableCell>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
  th:not(.sortable-active) .v-icon {
    visibility: hidden;
  }

  th.sortable {
    font-weight: 700;
  }

  th.sortable:hover {
    cursor: pointer;
  }

  th.sortable:hover .v-icon {
    visibility: visible;
  }
</style>
