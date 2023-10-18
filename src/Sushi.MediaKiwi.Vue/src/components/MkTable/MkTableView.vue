<script setup lang="ts">
  import { RouteParamValueRaw } from "vue-router";
  import type { TableMap } from "@/models/table/TableMap";
  import MkTableCell from "./MkTableCell.vue";
  import { useMediakiwiStore } from "@/stores/";
  import type { Sorting } from "@/models";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { useTableRowSelection } from "@/composables/useTableRowSelection";
  import { watch } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { VuetifyPaginationMode } from "@/models/pagination/VuetifyPaginationMode";
  import { ref } from "vue";
  import { usePagination } from "@/composables/usePagination";
  import { computed } from "vue";

  // define properties
  const props = defineProps<{
    tableMap?: TableMap<any>;
    itemId?: (entity: any) => any;
    data?: any[];
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** */
    sorting?: Sorting;
    selection?: unknown[];
    /** Make each row in the table selectable. */
    checkbox?: boolean;
    /** Defines the pagination mode */
    paginationMode?: MediakiwiPaginationMode;
  }>();

  // define event
  const emit = defineEmits<{
    (e: "click:row", value: any): void;
    (e: "update:sorting", value?: Sorting): void;
    (e: "update:selection", value?: unknown[]): void;
  }>();

  // define slots
  const slots = defineSlots<{
    footer?: (props: unknown) => any;
    bottom?: (props: unknown) => any;
    /** table templating  */
    thead: (props: unknown) => never;
    /** table templating */
    tbody: (props: any) => never;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const getItemId = computed(() => {
    return props.tableMap?.itemId || props.itemId;
  });

  function onRowClick(event: Event, dataItem: unknown) {
    // emit event
    emit("click:row", dataItem);

    // navigate user to target page if defined
    if (props.itemViewId) {
      // find navigation item for the view
      const view = store.views.find((x) => x.id == props.itemViewId);

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
        if (!getItemId.value) {
          throw new Error(`No itemId function found to resolve ${navigationItem.view?.parameterName}`);
        }
        itemId = getItemId.value(dataItem);
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

  /** Init selection composable for item selection with the table map and data  */
  const { selectAll, selectItem, isItemSelected, isAllSelected, isIndeterminate, selectedItems } = useTableRowSelection({
    itemId: props.tableMap?.itemId || props.itemId,
    data: computed(() => props.data),
  });

  watch(selectedItems, (value) => {
    emit("update:selection", value);
  });

  function clearSelection() {
    selectAll(false);
  }

  const { updatePageIndex, pageIndex } = usePagination();
  // deconstruct the prop to get the pagination mode for the vuetify component
  const vuetifyPaginationMode = ref<VuetifyPaginationMode>(props.paginationMode as VuetifyPaginationMode);

  function loadMore() {
    updatePageIndex(pageIndex + 1);
  }

  defineExpose({
    clearSelection,
  });
</script>

<template>
  <v-table class="mk-table-view">
    <thead>
      <tr>
        <th v-if="checkbox">
          <MkTableCheckbox :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:selected="selectAll" />
        </th>
        <slot name="thead"></slot>
      </tr>
    </thead>
    <tbody>
      <!-- render a row for each provided data entity -->
      <tr v-for="(dataItem, rowIndex) in props.data" :key="rowIndex" style="cursor: pointer" @click.stop="(e) => onRowClick(e, dataItem)">
        <td v-if="checkbox" @click.stop>
          <MkTableCheckbox :is-selected="isItemSelected(dataItem)" @update:selected="(e) => selectItem(dataItem, e)" />
        </td>
        <slot name="tbody" v-bind="dataItem"></slot>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>

    <template #bottom>
      <slot name="bottom"></slot>
    </template>
  </v-table>
</template>

<style scoped lang="scss">
  .v-table {
    .v-table__wrapper {
      table {
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
