<script setup lang="ts">
  import type { TableMap, TableFilter } from "@/models/table";
  import type { Sorting } from "@/models/api";
  import { ref } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkTableToolbarVue from "./MkTableToolbar.vue";
  import MkTableAction from "@/components/MkTableAction/MkTableAction.vue";
  import { IListResult, IPagingResult } from "@/models";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { onMounted } from "vue";

  // define properties
  const props = defineProps<{
    /** Collection of filters to filter data. */
    filters?: TableFilter;
    /** Defines mapping between data and the table. */
    tableMap: TableMap<any>;
    /** Sets data and paging properties based on the API's result. */
    apiResult?: IListResult<any>;
    /** An array of objects used for automatically generating rows. */
    data?: any[];
    /** When set, enables paging based on provided values. */
    paging?: IPagingResult;
    /** Currently selected page index. */
    currentPage?: number;
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** */
    sorting?: Sorting;
    /** */
    selection?: unknown[];
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;
    /** Make each row in the table selectable. */
    checkbox?: boolean;
    /** Callback invoked when the component needs new data, i.e. a filter changes, the current page changes, etc. */
    onLoad?: () => Promise<void>;
    /** Title specificly for the current table */
    title?: string;
    /** Displays the action bar if set to true and itemViewId has a value */
    actions?: boolean;
  }>();

  // define events
  const emit = defineEmits<{
    (e: "update:filters", value: TableFilter): void;
    (e: "click:row", value: unknown): void;
    (e: "update:sorting", value?: Sorting): void;
    (e: "update:selection", value?: unknown[]): void;
    (e: "update:currentPage", value: number): void;
  }>();

  // define slots
  const slots = defineSlots<{
    header?: (props: unknown) => any;
    actions?: (props: unknown) => any;
    "selection-actions"?: (props: unknown) => any;
    footer?: (props: unknown) => any;
  }>();

  // inject dependencies
  const snackbar = useSnackbarStore();

  // define reactive variables
  const inProgress = ref(false);
  const mkTableViewComponent = ref();

  // event listeners
  onMounted(async () => {
    await loadData();
  });

  async function pageChanged(value: number) {
    emit("update:currentPage", value - 1);
    await loadData();
  }

  async function filterChanged(value: TableFilter) {
    // reset paging
    emit("update:currentPage", 0);
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

    <template v-if="(props.actions || props.new) && props.itemViewId">
      <v-divider />
      <MkTableAction :item-view-id="props.itemViewId" :new="props.new" :title="props.title">
        <template v-if="slots.actions" #actions>
          <slot name="actions"></slot>
        </template>
      </MkTableAction>
    </template>

    <template v-if="filters">
      <MkTableFilter :model-value="filters" @update:model-value="filterChanged" />
    </template>

    <template v-if="checkbox">
      <v-expand-transition>
        <MkTableToolbarVue v-if="selection?.length" :selection="selection" @click:close="mkTableViewComponent.clearSelection">
          <template #selection-actions>
            <slot name="selection-actions"></slot>
          </template>
        </MkTableToolbarVue>
      </v-expand-transition>
    </template>

    <MkTableView
      ref="mkTableViewComponent"
      :table-map="tableMap"
      :data="apiResult ? apiResult.result : data"
      :item-view-id="itemViewId"
      :sorting="sorting"
      :selection="selection"
      :checkbox="checkbox"
      class="mk-table"
      @click:row="(e) => emit('click:row', e)"
      @update:sorting="sortingChanged"
      @update:selection="(e) => emit('update:selection', e)"
    >
      <template #footer>
        <tr>
          <td :colspan="tableMap.items.length" justify="end">
            <v-pagination
              v-if="currentPage !== undefined"
              :model-value="currentPage + 1"
              :length="apiResult ? apiResult.pageCount : paging?.pageCount"
              @update:model-value="pageChanged"
            ></v-pagination>
          </td>
        </tr>
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
