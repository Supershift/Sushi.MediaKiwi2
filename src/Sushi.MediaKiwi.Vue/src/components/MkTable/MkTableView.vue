<script setup lang="ts">
  import { useRouter, type RouteParamsRaw } from "vue-router";
  import type { ITableMap } from "@/models/table/ITableMap";
  import type { ITableMapItem } from "@/models/table/ITableMapItem";
  import MkTableCell from "./MkTableCell.vue";
  import { useMediakiwiStore } from "@/stores/";
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
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
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
  const store = useMediakiwiStore();
  function onRowClick(event: Event, dataItem: unknown) {
    // emit event
    emit("click:row", dataItem);

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

      // try to resolve route parameter
      const routeParams: RouteParamsRaw = {};
      if (navigationItem.isDynamicRoute) {
        if (!props.tableMap.itemId) {
          throw new Error(`No itemId function found to resolve ${navigationItem.dynamicRouteParameterName}`);
        }
        const itemId = props.tableMap.itemId(dataItem);
        if (!itemId) {
          throw new Error(`No value returned by itemId function`);
        }
        if (navigationItem.dynamicRouteParameterName) {
          routeParams[navigationItem.dynamicRouteParameterName] = itemId;
        }
      }

      // push user to target page
      router.push({ name: navigationItem.id.toString(), params: routeParams });
    } else {
      console.warn("no target view id defined on table");
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

  function clearSelectedTableRows() {
    selectAll(false);
  }

  defineExpose({
    clearSelectedTableRows,
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

<style scoped lang="scss">
  thead {
    th {
      &:not(.sortable-active) .v-icon {
        visibility: hidden;
      }

      &.sortable {
        font-weight: 700;
        &:hover {
          cursor: pointer;
          .v-icon {
            visibility: visible;
          }
        }
      }
    }
  }

  tbody {
    tr {
      transition: 0.2s background-color;
      &:hover {
        background: rgba(var(--v-theme-surface-variant), var(--v-hover-opacity));
      }
    }
  }
</style>
