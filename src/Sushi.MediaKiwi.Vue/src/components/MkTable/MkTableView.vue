<script setup lang="ts">
  import { RouteParamValueRaw } from "vue-router";
  import type { TableMap } from "@/models/table/TableMap";
  import type { TableMapItem } from "@/models/table/TableMapItem";
  import MkTableCell from "./MkTableCell.vue";
  import { useMediakiwiStore } from "@/stores/";
  import { SortDirection } from "@/models";
  import type { Sorting } from "@/models";
  import TableSortingHelper from "@/helpers/TableSortingHelper";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { useTableMapItemSelection } from "@/composables/useTableMapItemSelection";
  import { watch } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { computed } from "vue";

  // define properties
  const props = defineProps<{
    tableMap: TableMap<any>;
    data?: any[];
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** */
    selectedSortOption?: Sorting;
    selection?: unknown[];
    /** Make each row in the table selectable. */
    checkbox?: boolean;
  }>();

  // define event
  const emit = defineEmits<{
    (e: "click:row", value: any): void;
    (e: "update:selectedSortOption", value?: Sorting): void;
    (e: "update:selection", value?: unknown[]): void;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const tableSortingHelper = new TableSortingHelper();
  const navigation = useNavigation();

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
      let itemId: RouteParamValueRaw = undefined;
      if (navigationItem.view?.parameterName) {
        if (!props.tableMap.itemId) {
          throw new Error(`No itemId function found to resolve ${navigationItem.view?.parameterName}`);
        }
        itemId = props.tableMap.itemId(dataItem);
        if (!itemId) {
          throw new Error(`No value returned by itemId function`);
        }
      }

      // push user to target page
      navigation.navigateTo(navigationItem, itemId);
    } else {
      console.warn("no target view id defined on table");
    }
  }

  function onClick(tableMapItem: TableMapItem<unknown>) {
    if (tableMapItem?.sortingOptions) {
      const dataItem = tableSortingHelper.parseSorting(tableMapItem.sortingOptions, props.selectedSortOption);
      emit("update:selectedSortOption", dataItem);
    }
  }

  function getHeaderClasses(tableMapItem: TableMapItem<unknown>) {
    if (tableMapItem?.sortingOptions) {
      return tableSortingHelper.getSortingClasses(tableMapItem.sortingOptions, props.selectedSortOption);
    }
  }

  function isActiveSort(tableMapItem: TableMapItem<unknown>) {
    if (tableMapItem?.sortingOptions) {
      return tableSortingHelper.isActiveSort(tableMapItem.sortingOptions, props.selectedSortOption);
    }
    return false;
  }

  const sortIcon = computed(() => {
    if (props.selectedSortOption?.sortDirection === SortDirection.Asc) {
      return "mdi-arrow-up";
    } else {
      return "mdi-arrow-down";
    }
  });

  function sortingClasses() {
    return {
      hidden: !props.selectedSortOption,
    };
  }

  /** Init selection composable for item selection with the table map and data  */
  const { selectAll, selectItem, isItemSelected, isAllSelected, isIndeterminate, selectedItems } = useTableMapItemSelection({
    tableMap: props.tableMap,
    data: props.data,
  });

  watch(selectedItems, (value) => {
    emit("update:selection", value);
  });

  function clearSelection() {
    selectAll(false);
  }

  defineExpose({
    clearSelection,
  });
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th v-if="checkbox">
          <MkTableCheckbox :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:is-selected="selectAll" />
        </th>
        <!-- render a header cell for each mapping item -->
        <th v-for="(mapItem, index) in props.tableMap.items" :key="index" :class="getHeaderClasses(mapItem)" @click="onClick(mapItem)">
          {{ mapItem.headerTitle }}
          <v-icon v-if="mapItem.sortingOptions" :icon="sortIcon" :class="sortingClasses()" />
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- render a row for each provided data entity -->
      <tr v-for="(dataItem, rowIndex) in props.data" :key="rowIndex" style="cursor: pointer" @click.stop="(e) => onRowClick(e, dataItem)">
        <td v-if="checkbox" @click.stop>
          <MkTableCheckbox :is-selected="isItemSelected(dataItem)" @update:is-selected="(e) => selectItem(dataItem, e)" />
        </td>
        <!-- render a cell for each mapping item -->
        <MkTableCell v-for="(mapItem, cellIndex) in props.tableMap.items" :key="cellIndex" :data="dataItem" :map-item="mapItem"></MkTableCell>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>
  </v-table>
</template>

<style scoped lang="scss">
  .v-table {
    .v-table__wrapper {
      table {
        thead {
          th {
            .v-icon.hidden {
              visibility: hidden;
            }

            &.sortable {
              font-weight: 700 !important;
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
      }
    }
  }
</style>
