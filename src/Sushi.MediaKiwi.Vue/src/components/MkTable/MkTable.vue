<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts" generic="T">
  import { TableMap, TableFilter, TableColumn } from "@/models/table";
  import { Paging, Sorting } from "@/models/api";
  import { ref, watch } from "vue";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { onMounted, computed } from "vue";
  import { ITableMapPaging } from "@/models/table/TableMapPaging";
  import { defaultPageSizeOptions, defaultPageSize } from "@/constants";
  import { useComponentContext } from "@/composables/useComponentContext";
  import {
    MkTableContextMenuSlotProps,
    MkTableBodySlotProps,
    MkTableBulkActionBarSlotProps,
    MkTableProps,
    MkTableTableSlotProps,
  } from "@/models/table/TableProps";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkBulkActionBar from "@/components/MkBulkActionBar/MkBulkActionBar.vue";
  import MkToolbar from "@/components/MkToolbar/MkToolbar.vue";
  import MkPagination from "@/components/MkPagination/MkPagination.vue";
  import MkTableHead from "./MkTableHead.vue"; // Mk-Th
  import MkTableCell from "./MkTableCell.vue"; // Mk-Td
  import MkDisplayOptions from "@/components/MkDisplayOptions/MkDisplayOptions.vue";
  import MkEmptyState from "../MkEmptyState/MkEmptyState.vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";

  // define properties
  const props = withDefaults(defineProps<MkTableProps<T>>(), {
    paginationMode: "controls",
  });

  /** Use Sorting<T> for typesafety  */
  const sorting = defineModel<Sorting | Sorting<T>>("sorting");
  /** Selected items */
  const selection = defineModel<Array<T>>("selection");
  /** Collection of filters to filter data. */
  const filters = defineModel<TableFilter>("filters");
  /** Currently selected page index and optional size */
  const currentPagination = defineModel<Paging>("currentPagination", {
    default: <Paging>{
      pageIndex: 0,
      pageSize: defaultPageSize,
    },
  });
  /** Display options for the table */
  const displayOptions = defineModel<TableDisplayOptions | boolean>("displayOptions", { required: false });
  const hasDisplayOptions = computed(() => displayOptions.value !== undefined && displayOptions.value !== false);
  /** Reference for multiple tables on one view */
  const tableReference = defineModel<string>("tableReference", { required: false, default: "Table" });

  const sortBy = computed(() => sorting.value?.sortBy);
  const sortDirection = computed(() => sorting.value?.sortDirection);

  // define events
  const emit = defineEmits<{
    (e: "update:filters", value: TableFilter): void;
    (e: "click:row", value: T): void;
    (e: "update:sorting", value?: Sorting<T> | Sorting): void;
    (e: "update:selection", value?: T[]): void;
    (e: "update:currentPagination", value: Paging): void;
    (e: "click:new", value?: string): void;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Add markup above the entire component */
    header?: () => never;
    /** Add markup below the entire component */
    footer?: () => never;
    /** Visible action slot for the MkToolbar */
    toolbar?: () => never;
    /** Add actions behind an overflow menu (kebab-menu) */
    overflowMenuActions?: () => never;
    /** Add action for when the bulk action bar appears */
    bulkActionBar?: (slotProps: MkTableBulkActionBarSlotProps) => never;
    /** Add markup between the filterbar and table */
    prependTable?: () => never;
    /** Replace the table with you're own component */
    table?: (slotProps: MkTableTableSlotProps<T>) => never;
    /** Header for the table body using templating */
    thead?: () => never;
    /** Body for the table body using templating */
    tbody?: (slotProps: MkTableBodySlotProps<T>) => never;
    /** Custom component for the empty state */
    emptyState?: () => never;
    /* Custom title */
    toolbarTitle?: () => never;
    /** Context menu slot */
    contextmenu?: (slotProps: MkTableContextMenuSlotProps<T>) => never;
  }>();

  // inject dependencies
  const snackbar = useSnackbarStore();
  const { hasDefinedEmit } = useComponentContext();

  // define reactive variables
  const initialDataLoaded = ref(false);
  const inProgress = ref(false);
  const mkTableViewComponent = ref();
  const pageSizes = ref([...defaultPageSizeOptions]);
  // Add the current page size if present to the pageSizes array, only if its above the defaultPageSize (10)
  if (currentPagination.value?.pageSize && currentPagination.value?.pageSize > defaultPageSize) {
    pageSizes.value.push(currentPagination.value.pageSize);
  }

  const isBooleanColumn = computed(() => {
    if (props.tableMap && props.tableMap.items && props.tableMap.items[0] && props.tableMap.items[0].value && props.data && props.data[0]) {
      const value = props.tableMap.items[0].value(props.data[0]);
      return typeof value === "boolean";
    }
    return false;
  });

  /**
   * Returns if the component has click implementation
   * Either by navigationItemId or click:row event
   */
  const hasTableRowClickAction = computed<boolean>(() => {
    return hasDefinedEmit("click:row") || props.navigationItemId !== undefined;
  });

  /**
   * Deconstruct the ApiResult or paging prop to an ITableMapPaging
   */
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

  /** Determines if the pagination should be displayed */
  const showPagination = computed(() => {
    return currentPagination.value && pagingResult.value && pagingResult.value.pageCount && props.paginationMode === "controls";
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
      pageSize: currentPagination.value?.pageSize,
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

        // When the data is loaded, set the initialDataLoaded to true
        initialDataLoaded.value = true;
      } catch (error) {
        snackbar.showMessage("Failed to fetch data");
      } finally {
        // stop progress indicator
        inProgress.value = false;
      }
    }
  }

  // Watch for changes in sorting and direction
  watch([sortBy, sortDirection], loadData);
</script>

<template>
  <v-card>
    <v-progress-linear v-if="inProgress" indeterminate absolute></v-progress-linear>
    <slot name="header"></slot>

    <template v-if="props.new || props.title || slots.toolbar || slots.overflowMenuActions">
      <MkToolbar
        :navigation-item-id="props.navigationItemId"
        :title="props.title"
        :new="props.new"
        :new-emit="props.newEmit"
        :new-title="props.newTitle"
        @click:new="emit('click:new', $event)"
      >
        <template v-if="slots.toolbarTitle" #title>
          <slot name="toolbarTitle"></slot>
        </template>
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

    <template v-if="selection && !props.hideBulkActionBar">
      <v-expand-transition>
        <MkBulkActionBar v-if="selection?.length" :selection="selection" @click:close="mkTableViewComponent.clearSelection">
          <template #default="{ confirm }">
            <slot name="bulkActionBar" :confirm="confirm"></slot>
          </template>
        </MkBulkActionBar>
      </v-expand-transition>
    </template>

    <slot v-if="slots.prependTable" name="prependTable"></slot>

    <slot v-if="slots.table" name="table" :data="apiResult ? apiResult.result : data" :item-id="itemId"></slot>
    <template v-else>
      <MkTableView
        ref="mkTableViewComponent"
        :table-map="tableMap"
        :data="apiResult ? apiResult.result : data"
        :navigation-item-id="navigationItemId"
        v-model:sorting="sorting"
        v-model:selection="selection"
        :checkbox="selection ? true : false"
        :pagination-mode="paginationMode"
        :item-id="itemId"
        :show-hover-effect="hasTableRowClickAction"
        :hide-table-row-actions="hideTableRowActions"
        :hide-selection-checkbox="hideSelectionCheckbox"
        @click:row="(e) => emit('click:row', e)"
        @update:sorting="sortingChanged"
        @update:selection="(e) => emit('update:selection', e)"
        :disable-item-selection="props.disableItemSelection"
        :remove-item-selection="props.removeItemSelection"
        v-model:display-options="displayOptions"
        v-model:tableReference="tableReference"
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

        <template #tbody="dataItem">
          <slot v-if="slots.tbody" name="tbody" v-bind="dataItem"></slot>
          <template v-else>
            <!-- render a body cell for each mapping item -->
            <MkTableCell v-for="(mapItem, cellIndex) in props.tableMap?.items" :key="cellIndex" :data="dataItem" :map-item="mapItem"></MkTableCell>
          </template>
        </template>

        <!-- Only show the controls if the pagination mode is unset or set to 'controls' -->
        <template #bottom>
          <v-divider />
          <div class="mk-table__footer">
            <div v-if="hasDisplayOptions" class="mk-table__footer-item">
              <MkDisplayOptions v-model:display-options="displayOptions" v-model:table-reference="tableReference" />
            </div>
            <div v-if="showPagination" class="mk-table__footer-item">
              <MkPagination
                :model-value="currentPagination"
                :paging-result="pagingResult"
                :mode="paginationMode"
                :page-size-options="pageSizes"
                :page-tracking="props?.pageTracking"
                :hide-pagination="!showPagination"
                @update:model-value="pageChanged"
              />
            </div>
          </div>
        </template>

        <template #contextmenu="props" v-if="slots.contextmenu">
          <slot name="contextmenu" v-bind="props"></slot>
        </template>
      </MkTableView>

      <template v-if="!hideEmptyState && initialDataLoaded && !data?.length && !apiResult?.result?.length">
        <slot v-if="slots.emptyState" name="emptyState"></slot>
        <MkEmptyState
          v-else
          :new="props.new"
          :navigation-item-id="props.navigationItemId"
          :new-title="props.newTitle"
          :new-emit="props.newEmit"
          :headline="props.emptyStateTitle"
          :text="props.emptyStateSubtitle"
          @click:new="emit('click:new', $event)"
        />
      </template>
    </template>

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
    &__footer {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 24px;
    }
  }
</style>
