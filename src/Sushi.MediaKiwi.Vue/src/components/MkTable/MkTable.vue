<script setup lang="ts">
  import type { TableMap, TableFilter } from "@/models/table";
  import type { Sorting } from "@/models/api";
  import { ref } from "vue";
  import MkTableFilter from "@/components/MkTableFilter/MkTableFilter.vue";
  import MkTableView from "./MkTableView.vue";
  import MkTableToolbarVue from "./MkTableToolbar.vue";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { IListResult, IPagingResult } from "@/models";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { onMounted } from "vue";
  import { useI18next } from "@/composables/useI18next";

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
  }>();

  // define events
  const emit = defineEmits<{
    (e: "update:filters", value: TableFilter): void;
    (e: "click:row", value: unknown): void;
    (e: "update:sorting", value?: Sorting): void;
    (e: "update:selection", value?: unknown[]): void;
    (e: "update:currentPage", value: number): void;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const snackbar = useSnackbarStore();
  const { t } = useI18next();

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
    <template v-if="filters || (props.new && props.itemViewId)">
      <MkTableFilter :model-value="filters" @update:model-value="filterChanged">
        <template #actions>
          <v-btn v-if="props.new && props.itemViewId" prepend-icon="mdi-plus" @click="onNewClick">{{ t("New item") }}</v-btn>
        </template>
      </MkTableFilter>
    </template>

    <template v-if="checkbox">
      <v-expand-transition>
        <MkTableToolbarVue v-if="selection?.length" :selection="selection" @click:close="mkTableViewComponent.clearSelection">
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
