<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
  import type { TableMap, TableFilter, TableBodySlotResult } from "@/models/table";
  import type { Paging, Sorting } from "@/models/api";
  import { ref } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";

  import MkBulkActionBar from "@/components/MkBulkActionBar/MkBulkActionBar.vue";
  import MkToolbar from "@/components/MkToolbar/MkToolbar.vue";

  import MkPagination from "@/components/MkPagination/MkPagination.vue";
  import { IListResult, IPagingResult } from "@/models";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { onMounted, computed } from "vue";

  import { ITableMapPaging } from "@/models/table/TableMapPaging";
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { pageSizeOptions } from "@/constants";
  import MkTableHead from "./MkTableHead.vue"; // Mk-Th
  import MkTableCell from "./MkTableCell.vue"; // Mk-Td

  // define properties
  const props = withDefaults(
    defineProps<{
      /** Collection of filters to filter data. */
      filters?: TableFilter;
      /** Defines mapping between data and the table. */
      tableMap?: TableMap<any>;
      /** Sets data and paging properties based on the API's result. */
      apiResult?: IListResult<any>;
      /** An array of objects used for automatically generating rows. */
      data?: any[];
      /** When set, enables paging based on provided values. */
      paging?: IPagingResult;
      /** ExternalId of the view instance to which the user is pushed when clicking a row. */
      itemViewId?: string;
      /** */
      sorting?: Sorting;
      /** */
      selection?: unknown[];
      /** Displays new item button if set to true and itemViewId has a value */
      new?: boolean;
      /** Callback invoked when the component needs new data, i.e. a filter changes, the current page changes, etc. */
      onLoad?: () => Promise<void>;
      /** Title specificly for the current table */
      title?: string;
      /** Currently selected page index and optional size */
      currentPagination: Paging;
      /** Defines the pagination mode */
      paginationMode?: MediakiwiPaginationMode;
      /** */
      itemId?: (entity: any) => string | number;
    }>(),
    {
      paginationMode: "controls",
    }
  );

  // define events
  const emit = defineEmits<{
    (e: "update:filters", value: TableFilter): void;
    (e: "click:row", value: unknown): void;
    (e: "update:sorting", value?: Sorting): void;
    (e: "update:selection", value?: unknown[]): void;
    (e: "update:currentPagination", value: Paging): void;
  }>();

  // define slots
  const slots = defineSlots<{
    header?: (props: unknown) => any;
    footer?: (props: unknown) => any;
    /** Visible action slot for the MkToolbar */
    toolbar?: (props: unknown) => never;
    /** Menu actions for the MkToolbar */
    overflowMenuActions?: (props: unknown) => never;
    /** Action slot for the MkBulkActionBar */
    bulkActionBar?: (props: unknown) => never;
    /** table templating  */
    thead?: (props: unknown) => never;
    /** table templating */
    tbody?: (props: TableBodySlotResult<any>) => never;
  }>();

  // inject dependencies
  const snackbar = useSnackbarStore();

  // define reactive variables
  const inProgress = ref(false);
  const mkTableViewComponent = ref();

  const isBooleanColumn = computed(() => {
    if (props.tableMap && props.tableMap.items && props.tableMap.items[0] && props.tableMap.items[0].value && props.data && props.data[0]) {
      const value = props.tableMap.items[0].value(props.data[0]);
      return typeof value === "boolean";
    }
    return false;
  });

  // Deconstruct the ApiResult or paging prop to an ITableMapPaging
  const pagingResult = computed<ITableMapPaging | undefined | null>(() => {
    const resultCount = props.apiResult?.result?.length;

    if (props.apiResult) {
      const { pageCount, totalCount } = props.apiResult;
      return { pageCount, totalCount, resultCount };
    } else if (props.paging) {
      const { pageCount, totalCount } = props.paging;
      return { pageCount, totalCount, resultCount };
    }
    return undefined;
  });

  const showPagination = computed(() => {
    const lowestPagingOption = Math.min(...pageSizeOptions);
    return props.currentPagination && pagingResult.value && pagingResult.value.totalCount && pagingResult.value.totalCount > lowestPagingOption;
  });

  // event listeners
  onMounted(async () => {
    await loadData();
  });

  async function pageChanged(value: Paging) {
    // Change the current page index
    emit("update:currentPagination", value);
    await loadData();
  }

  async function filterChanged(value: TableFilter) {
    // reset paging
    emit("update:currentPagination", {
      pageIndex: 0,
      pageSize: props.currentPagination.pageSize,
    });
    // update filters
    emit("update:filters", value);
    // fetch data
    await loadData();
  }

  async function sortingChanged(value?: Sorting) {
    // update sorting
    emit("update:sorting", value);
    // fetch data
    await loadData();
  }

  // local functions
  async function loadData() {
    // if a data callback is defined, call it so the parent can fetch data
    if (props.onLoad) {
      // start progress indicator
      inProgress.value = true;
      try {
        await props.onLoad();
      } catch (error) {
        snackbar.showMessage("Failed to fetch data");
        throw error;
      } finally {
        // stop progress indicator
        inProgress.value = false;
      }
    }
  }
</script>

<template>
  <v-card>
    <v-progress-linear v-if="inProgress" indeterminate absolute></v-progress-linear>
    <slot name="header"></slot>

    <template v-if="(slots.toolbar || slots.overflowMenuActions || props.new || props.title) && props.itemViewId">
      <MkToolbar :item-view-id="props.itemViewId" :new="props.new" :title="props.title">
        <template v-if="slots.toolbar" #toolbar>
          <slot name="toolbar"></slot>
        </template>
        <template v-if="slots.overflowMenuActions" #overflowMenuActions>
          <slot name="overflowMenuActions"></slot>
        </template>
      </MkToolbar>
    </template>

    <template v-if="filters">
      <MkTableFilter :model-value="filters" @update:model-value="filterChanged" />
    </template>

    <template v-if="selection">
      <v-expand-transition>
        <MkBulkActionBar v-if="selection?.length" :selection="selection" @click:close="mkTableViewComponent.clearSelection">
          <slot name="bulkActionBar"></slot>
        </MkBulkActionBar>
      </v-expand-transition>
    </template>

    <MkTableView
      ref="mkTableViewComponent"
      :table-map="tableMap"
      :data="apiResult ? apiResult.result : data"
      :item-view-id="itemViewId"
      :sorting="sorting"
      :selection="selection"
      :checkbox="selection ? true : false"
      class="mk-table"
      :pagination-mode="paginationMode"
      :item-id="itemId"
      @click:row="(e) => emit('click:row', e)"
      @update:sorting="sortingChanged"
      @update:selection="(e) => emit('update:selection', e)"
    >
      <template #thead>
        <slot v-if="slots.thead" name="thead"></slot>
        <template v-else>
          <!-- render a head cell for each mapping item -->
          <MkTableHead
            v-for="(mapItem, index) in props.tableMap?.items"
            :key="index"
            :sorting="sorting"
            :map-item="mapItem"
            :truncate="!isBooleanColumn"
            @update:sorting="(value) => emit('update:sorting', value)"
          />
        </template>
      </template>

      <template #tbody="{ dataItem }">
        <slot v-if="slots.tbody" name="tbody" :data-item="dataItem"></slot>
        <template v-else>
          <!-- render a body cell for each mapping item -->
          <MkTableCell v-for="(mapItem, cellIndex) in props.tableMap?.items" :key="cellIndex" :data="dataItem" :map-item="mapItem"></MkTableCell>
        </template>
      </template>

      <!-- Only show the controls if the pagination mode is unset or set to 'controls' -->
      <template v-if="paginationMode === 'controls'" #bottom>
        <MkPagination
          v-if="showPagination"
          :model-value="currentPagination"
          :paging-result="pagingResult"
          :mode="paginationMode"
          @update:model-value="pageChanged"
        />
      </template>
    </MkTableView>

    <slot name="footer"></slot>
  </v-card>
</template>

<!-- Can't set any positioning on pagination element, so added custom css -->
<style lang="scss">
  .mk-table {
    .v-pagination {
      .v-pagination__list {
        display: flex;
        flex-flow: row;
        justify-content: flex-end;
        width: auto;
      }
    }
  }
</style>
