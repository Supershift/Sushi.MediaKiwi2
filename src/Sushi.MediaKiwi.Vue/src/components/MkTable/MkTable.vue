<script setup lang="ts">
  import type { ITableMap, ITableSortingValue, TableFilter } from "@/models/table";
  import { ref } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkTableToolbarVue from "./MkTableToolbar.vue";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { IListResult, IPagingResult } from "@/models";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { onMounted } from "vue";

  // define properties
  const props = defineProps<{
    filters?: TableFilter;
    tableMap: ITableMap<any>;
    apiResult?: IListResult<any>;
    data?: any[];
    paging?: IPagingResult;
    currentPage?: number;
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** */
    selectedSortOption?: ITableSortingValue;
    /** */
    selectedTableRows?: unknown[];
    /** Displays new item button if set to true and itemViewId has a value */
    new?: boolean;

    /** Make each row in the table selectable. */
    showSelect?: boolean;
    onNeedData?: () => Promise<void>;
  }>();

  // define events
  const emit = defineEmits<{
    (e: "update:filters", value: TableFilter): void;
    (e: "click:row", value: unknown): void;
    (e: "update:selectedSortOption", value?: ITableSortingValue): void;
    (e: "update:selectedTableRows", value?: unknown[]): void;
    (e: "update:currentPage", value: number): void;
  }>();

  // define reactive variables
  const inProgress = ref(false);
  const mkTableViewComponent = ref();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const snackbar = useSnackbarStore();

  // event listeners
  onMounted(async () => {
    await needData();
  });

  async function pageChanged(value: number) {
    emit("update:currentPage", value);
    await needData();
  }

  async function filterChanged(value: TableFilter) {
    // reset paging
    emit("update:currentPage", 1);
    // update filters
    emit("update:filters", value);
    // fetch data
    await needData();
  }

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

  // local functions
  async function needData() {
    // if a data callback is defined, call it so the parent can fetch data
    if (props.onNeedData) {
      // start progress indicator
      inProgress.value = true;
      try {
        await props.onNeedData();
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
    <v-progress-linear indeterminate absolute v-if="inProgress"></v-progress-linear>
    <slot name="header"></slot>
    <template v-if="filters">
      <MkTableFilter :model-value="filters" @update:model-value="filterChanged"> </MkTableFilter>
    </template>

    <v-btn v-if="props.new && props.itemViewId" @click="onNewClick">New</v-btn>

    <template v-if="showSelect">
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
      :data="apiResult ? apiResult.result : data"
      :item-view-id="itemViewId"
      :selected-sort-option="selectedSortOption"
      :selected-table-rows="selectedTableRows"
      :show-select="showSelect"
      @click:row="(e) => emit('click:row', e)"
      @update:selected-sort-option="(e) => emit('update:selectedSortOption', e)"
      @update:selected-table-rows="(e) => emit('update:selectedTableRows', e)"
    >
      <template #footer>
        <v-pagination v-if="currentPage" v-bind:model-value="currentPage" @update:model-value="pageChanged" :length="apiResult ? apiResult.pageCount : paging?.pageCount"></v-pagination>
      </template>
    </MkTableView>
    <slot name="footer"></slot>
  </v-card>
</template>
