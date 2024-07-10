<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts" generic="T">
  import { TableMap, TableFilter, TableColumn } from "@/models/table";
  import { Paging, Sorting } from "@/models/api";
  import { ref, watch } from "vue";
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
  import MkTableHead from "./MkTableHead.vue"; // Mk-Th
  import MkTableCell from "./MkTableCell.vue"; // Mk-Td
  import MkDisplayOptions from "@/components/MkDisplayOptions/MkDisplayOptions.vue";
  import { defaultPageSizeOptions, defaultPageSize } from "@/constants";
  import { useComponentContext } from "@/composables/useComponentContext";
  import MkEmptyState from "../MkEmptyState/MkEmptyState.vue";

  // define properties
  const props = withDefaults(
    defineProps<{
      /** Defines mapping between data and the table. */
      tableMap?: TableMap<T>;
      /** Sets data and paging properties based on the API's result. */
      apiResult?: IListResult<T>;
      /** An array of objects used for automatically generating rows. */
      data?: T[];
      /** When set, enables paging based on provided values. */
      paging?: IPagingResult;
      /** ExternalId of the view instance to which the user is pushed when clicking a row. */
      itemViewId?: string;
      /** Determines if the toolbar has a new button, default: false. */
      new?: boolean;
      /** Determines if we only want to emit instead of navigating to the given itemViewId */
      newEmit?: boolean;
      /** Overrides the "new item" button title */
      newTitle?: string;
      /** Callback invoked when the component needs new data, i.e. a filter changes, the current page changes, etc. */
      onLoad?: () => Promise<void>;
      /** Title specificly for the current table */
      title?: string;
      /** Defines the pagination mode */
      paginationMode?: MediakiwiPaginationMode;
      /** */
      itemId?: (entity: T) => string | number;
      /** Hides the empty state component entirely */
      hideEmptyState?: boolean;
      /** Title for the Empty State component */
      emptyStateTitle?: string;
      /** Subtitle for the Empty State component  */
      emptyStateSubtitle?: string;
      /** Hides the bulk action bar while keeing the checkboxes intact */
      hideBulkActionBar?: boolean;
      /** 'Tracks' the item the user viewed when changing pageSize, when true calculates this instead of resetting pageIndex to 0 */
      pageTracking?: boolean;
      /** Callback to disable the selection checkbox for a row based on specific criteria */
      disableItemSelection?: (entity: T) => boolean;
    }>(),
    {
      paginationMode: "controls",
    }
  );

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
  const displayOptions = defineModel<TableColumn[] | boolean>("displayOptions", { required: false });
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
    header?: () => never;
    footer?: () => never;
    /** Visible action slot for the MkToolbar */
    toolbar?: () => never;
    /** Menu actions for the MkToolbar */
    overflowMenuActions?: () => never;
    /** Action slot for the MkBulkActionBar */
    bulkActionBar?: (props: { confirm: (callback: () => void) => void }) => never;
    /** table templating  */
    thead?: () => never;
    /** table templating */
    tbody?: (dataItem: T) => never;
    /** Custom component for the empty state */
    emptyState?: () => never;
    /* Custom title */
    toolbarTitle?: () => never;
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
   * Either by itemViewId or click:row event
   */
  const hasTableRowClickAction = computed<boolean>(() => {
    return hasDefinedEmit("click:row") || props.itemViewId !== undefined;
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
        throw error;
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
        :item-view-id="props.itemViewId"
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

    <MkTableView
      ref="mkTableViewComponent"
      :table-map="tableMap"
      :data="apiResult ? apiResult.result : data"
      :item-view-id="itemViewId"
      v-model:sorting="sorting"
      v-model:selection="selection"
      :checkbox="selection ? true : false"
      class="mk-table"
      :pagination-mode="paginationMode"
      :item-id="itemId"
      :show-hover-effect="hasTableRowClickAction"
      @click:row="(e) => emit('click:row', e)"
      @update:sorting="sortingChanged"
      @update:selection="(e) => emit('update:selection', e)"
      @rendered:body="(e) => console.log('Rendered body', e)"
      :disable-item-selection="props.disableItemSelection"
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
        <MkPagination
          :model-value="currentPagination"
          :paging-result="pagingResult"
          :mode="paginationMode"
          :page-size-options="pageSizes"
          :page-tracking="props?.pageTracking"
          :hide-pagination="!showPagination"
          @update:model-value="pageChanged"
        >
          <template #prepend>
            <MkDisplayOptions v-if="hasDisplayOptions" v-model:display-options="displayOptions" v-model:table-reference="tableReference" />
          </template>
        </MkPagination>
      </template>
    </MkTableView>

    <template v-if="!hideEmptyState && initialDataLoaded && !data?.length && !apiResult?.result?.length">
      <slot v-if="slots.emptyState" name="emptyState"></slot>
      <MkEmptyState
        v-else
        :new="props.new"
        :item-view-id="props.itemViewId"
        :new-title="props.newTitle"
        :new-emit="props.newEmit"
        :headline="props.emptyStateTitle"
        :text="props.emptyStateSubtitle"
        @click:new="emit('click:new', $event)"
      />
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
  }
</style>
