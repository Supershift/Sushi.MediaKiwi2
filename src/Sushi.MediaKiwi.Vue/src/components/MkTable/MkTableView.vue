<script setup lang="ts" generic="T">
  import { RouteParamValueRaw } from "vue-router";
  import type { TableMap } from "@/models/table/TableMap";
  import { useMediakiwiStore } from "@/stores/";
  import type { Sorting, TableColumn } from "@/models";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { computed, onMounted, ref } from "vue";
  import { useTableDisplayOptions } from "@/composables/useTableDisplayOptions";
  import { MkTableBodySlotProps } from "@/models/table/TableProp";

  // inject dependencies
  const { initTableDisplayOptions } = useTableDisplayOptions();

  // define properties
  const props = defineProps<{
    tableMap?: TableMap<T>;
    itemId?: (entity: T) => string | number;
    data?: T[];
    /** Id of the navigation item to which the user is pushed when clicking a row. */
    navigationItemId?: string;
    /** Make each row in the table selectable. */
    checkbox?: boolean;
    /** Defines the pagination mode */
    paginationMode?: MediakiwiPaginationMode;
    /** Defines if the table row has a hover effect */
    showHoverEffect: boolean;
    /** Callback to disable the selection checkbox for a row based on specific criteria */
    disableItemSelection?: (entity: T) => boolean;
  }>();

  /** Use Sorting<T> for typesafety */
  defineModel<Sorting | Sorting<T>>("sorting");
  /** Selected items */
  const selection = defineModel<Array<T>>("selection", { default: [] });
  /** Define Display Options */
  const displayOptions = defineModel<TableColumn[] | boolean>("displayOptions", { required: false, default: [] });
  /** Define Table Reference for when multiple tables are on one view*/
  const tableReference = defineModel<string | undefined>("tableReference", { required: false });
  /** Check if display options are available */
  const hasDisplayOptions = computed(() => displayOptions.value !== undefined && displayOptions.value !== false);

  /** Ref to the table element */
  const tbodyContainer = ref(null);
  const tbodyNode = computed(() => tbodyContainer.value! as Node);

  // define event
  const emit = defineEmits<{
    (e: "click:row", value: T): void;
    (e: "update:sorting", value?: Sorting<T>): void;
    (e: "update:selection", value?: T[]): void;
  }>();

  // define slots
  const slots = defineSlots<{
    footer?: () => never;
    bottom?: () => never;
    /** table templating  */
    thead: () => never;
    /** table templating */
    tbody?: (slotProps: MkTableBodySlotProps<T>) => never;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const getItemId = computed(() => {
    return props.tableMap?.itemId || props.itemId;
  });

  /** Proxy collection that contains the itemIds for the selection collection */
  const selectionIds = computed(() => selection.value?.map((x) => getItemId.value!(x)));
  /** Returns if 'some' items are in the selection collection */
  const isIndeterminate = computed(() => selection.value.length > 0 && !isAllSelected.value);
  /** Returns if all items ids are selection collection */
  const isAllSelected = computed(() => selection.value.length === props.data?.length);
  /** Returns if the provided item ids are selected */
  const isItemSelected = computed(() => (dataItem: T): boolean => {
    const itemId = getItemId.value!(dataItem);
    if (itemId) {
      const index = selectionIds.value?.findIndex((x) => x === itemId);
      return index > -1;
    }
    return false;
  });

  /** Classes for the table row */
  function tableRowClassses() {
    return {
      "has-hover": props.showHoverEffect,
    };
  }

  function onRowClick(_event: Event, dataItem: T) {
    // emit event
    emit("click:row", dataItem);

    // navigate user to target page if defined
    if (props.navigationItemId) {
      // find navigation item
      const navigationItem = store.navigationTree.getNavigationItem(props.navigationItemId);
      if (!navigationItem) {
        throw new Error(`No navigationItem found for id ${props.navigationItemId}`);
      }

      // try to resolve route parameter
      let itemId: RouteParamValueRaw = undefined;
      if (navigationItem.parameterName) {
        if (!getItemId.value) {
          throw new Error(`No itemId function found to resolve ${navigationItem.parameterName}`);
        }
        itemId = getItemId.value(dataItem);
        if (!itemId) {
          throw new Error(`No value returned by itemId function`);
        }
      }

      // push user to target page
      navigation.navigateTo(navigationItem, itemId);
    }
  }

  /**
   * Select ALL items of the data collection
   * @param value - true to select all, false to deselect all
   */
  function onToggleAll(value: boolean): void {
    if (props.data) {
      props.data.forEach((dataItem) => {
        if (!isDisabledItemSelection(dataItem)) {
          onToggleSelection(dataItem, value);
        }
      });
    }
  }

  /**
   * Select or deselect an item from the data collection
   * @param dataItem - the item to select or deselect
   * @param value - true to select, false to deselect
   */
  function onToggleSelection(dataItem: T, value: boolean) {
    // Get the item id
    const itemId = getItemId.value!(dataItem);

    if (itemId) {
      // Find the index of the item in the selection collection
      const index = selectionIds.value?.findIndex((x) => x === itemId);

      if (value) {
        // Add the item if not already present
        if (index === -1) {
          selection.value.push(dataItem);
        }
      } else {
        // Remove the item if present
        if (index > -1) {
          selection.value.splice(index, 1);
        }
      }

      // Emit the updated selection collection
      emit("update:selection", selection.value);
    }
  }

  function isDisabledItemSelection(dataItem: T) {
    let result = false;

    if (props.disableItemSelection) {
      result = props.disableItemSelection(dataItem);
    }

    return result;
  }

  const allItemsDisabled = computed(() => {
    const allItemsDisabled = props.data?.every((x) => isDisabledItemSelection(x)) || false;

    return allItemsDisabled;
  });

  function clearSelection() {
    onToggleAll(false);
  }

  defineExpose({
    clearSelection,
  });

  async function loadDisplayOptions() {
    if (hasDisplayOptions.value) {
      displayOptions.value = initTableDisplayOptions(tableReference.value);
    }
  }

  onMounted(() => {
    const observer = new MutationObserver(loadDisplayOptions);
    observer.observe(tbodyNode.value, {
      childList: true,
      subtree: true,
    });
  });
</script>

<template>
  <v-table class="mk-table-view" :class="{ 'mk-table-display-options': hasDisplayOptions }" :data-table-ref="tableReference">
    <thead class="mk-table-view__header-container">
      <tr>
        <th v-if="checkbox" width="65" class="mk-table-view__checkbox-container--header">
          <MkTableCheckbox :disabled="allItemsDisabled" :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:selected="onToggleAll" />
        </th>
        <slot name="thead"></slot>
      </tr>
    </thead>
    <tbody ref="tbodyContainer" class="mk-table-view__body-container">
      <!-- render a row for each provided data entity -->
      <tr v-for="(dataItem, rowIndex) in props.data" :key="rowIndex" :class="tableRowClassses()" @click.stop="(e) => onRowClick(e, dataItem)">
        <td v-if="checkbox" @click.stop class="mk-table-view__checkbox-container--body">
          <MkTableCheckbox
            :item="dataItem"
            :is-selected="isItemSelected(dataItem)"
            :disabled="isDisabledItemSelection(dataItem)"
            @update:selected="(e) => onToggleSelection(dataItem, e)"
          />
        </td>
        <slot name="tbody" v-bind="{ dataItem }"></slot>
      </tr>
    </tbody>
    <tfoot class="mk-table-view__footer-container">
      <slot name="footer"></slot>
    </tfoot>

    <template #bottom>
      <div v-if="slots?.bottom" class="mk-table-view__bottom">
        <slot name="bottom"></slot>
      </div>
      <v-divider v-if="slots?.bottom" />
    </template>
  </v-table>
</template>

<style scoped lang="scss">
  @use "@/styles/abstracts/mixins" as mixins;

  .v-table {
    .v-table__wrapper {
      table {
        tbody {
          tr {
            transition: 0.2s background-color;
            &.has-hover {
              &:hover {
                @include mixins.hover-effect;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .mk-table-view {
    td[mk-hidden],
    th[mk-hidden] {
      display: none !important;
    }
  }
</style>
