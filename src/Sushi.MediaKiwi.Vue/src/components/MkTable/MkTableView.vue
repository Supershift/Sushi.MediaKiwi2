<script setup lang="ts">
  import { useRouter, type RouteParamsRaw } from "vue-router";
  import type { ITableMap } from "@/models/table/ITableMap";
  import type { ITableMapItem } from "@/models/table/ITableMapItem";
  import MkTableCell from "./MkTableCell.vue";
  import { store } from "@/stores/mediakiwi/mock";
  import { TableSortingType } from "@/models";
  import type { ITableSortingValue } from "@/models";

  const props = defineProps<{
    tableMap: ITableMap<unknown>;
    data: unknown[];
    /** Name of the IScreen instance to which the user is pushed when clicking a row */
    itemScreenName?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
  }>();

  const emit = defineEmits<{
    (e: "click:row", value: unknown): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
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

  function onSorting(mapItem: ITableMapItem<unknown>) {
    if (mapItem?.isSortable) {
      let sortOption = null;

      let currentSort: TableSortingType | undefined = props.selectedSortOption?.sortOption;
      if (mapItem.id !== props.selectedSortOption?.id) {
        currentSort = undefined;
      }

      if (currentSort === TableSortingType.Desc) {
        sortOption = TableSortingType.Asc;
      } else {
        sortOption = TableSortingType.Desc;
      }

      if (sortOption) {
        const dataItem: ITableSortingValue = { id: mapItem.id, sortOption };
        emit("update:selectedSortOption", dataItem);
      } else {
        emit("update:selectedSortOption");
      }
    }
  }

  function isSortable(mapItem: ITableMapItem<unknown>) {
    if (!props.selectedSortOption?.sortOption) {
      return false;
    }

    if (!mapItem.isSortable) {
      return false;
    }

    if (props.selectedSortOption.id === mapItem.id) {
      return true;
    }
  }
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <!-- render a header cell for each mapping item -->
        <th v-for="mapItem in props.tableMap.items" @click="onSorting(mapItem)">
          {{ mapItem.headerTitle }}
          <template v-if="isSortable(mapItem)">
            <v-icon v-if="props.selectedSortOption?.sortOption === TableSortingType.Asc">mdi-arrow-up</v-icon>
            <v-icon v-else>mdi-arrow-down</v-icon>
          </template>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- render a row for each provided data entity -->
      <tr v-for="dataItem in props.data" @click="(e) => onRowClick(e, dataItem)" style="cursor: pointer">
        <!-- render a cell for each mapping item -->
        <MkTableCell v-for="mapItem in props.tableMap.items" :data="dataItem" :map-item="mapItem"> </MkTableCell>
      </tr>
    </tbody>
  </v-table>
</template>
