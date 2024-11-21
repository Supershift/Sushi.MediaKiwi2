<script setup lang="ts" generic="T">
  import type { Sorting } from "@/models";
  import { RouteParamValueRaw } from "vue-router";
  import { useMediakiwiStore } from "@/stores/";
  import { useNavigation } from "@/composables/useNavigation";
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import { useTableDisplayOptions } from "@/composables/useTableDisplayOptions";
  import { MkTableContextMenuSlotProps, MkTableBodySlotProps, MkTableViewProps, MkTableBulkActionBarSlotProps } from "@/models/table/TableProps";
  import { useContextmenu } from "@/composables/useContextmenu";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
  import { useItemSelectionShortcuts } from "@/composables/useItemSelectionShortcuts";

  // inject dependencies
  const { initTableDisplayOptions } = useTableDisplayOptions();
  const { openContextMenu, contextMenuProps, contextMenuPositionProps } = useContextmenu<T>();

  // define properties
  const props = defineProps<MkTableViewProps<T>>();

  // define selection
  let itemSelectionShortcuts: ReturnType<typeof useItemSelectionShortcuts<T>> | undefined = undefined;
  if (props.checkbox) {
    // const { isSelectionMode, createSelectionProps }
    itemSelectionShortcuts = useItemSelectionShortcuts<T>({
      onCtrlA: () => onToggleAll(true),
      onShiftClick: ({ dataItem }) => onSelectRangeItems(dataItem),
      onCtrlClick: ({ dataItem }) => onSelectItem(dataItem),
    });
  }

  /** Use Sorting<T> for typesafety */
  defineModel<Sorting | Sorting<T>>("sorting");
  /** Selected items */
  const selection = defineModel<Array<T>>("selection", { default: [] });
  /** Define Display Options */
  const displayOptions = defineModel<TableDisplayOptions | boolean>("displayOptions", { required: false, default: [] });
  /** Define Table Reference for when multiple tables are on one view*/
  const tableReference = defineModel<string | undefined>("tableReference", { required: false });
  /** Check if display options are available */
  const hasDisplayOptions = computed(() => displayOptions.value !== undefined && displayOptions.value !== false);

  /** Ref to the table element */
  const tbodyContainer = ref<any>(null);
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
    contextmenu?: (slotProps: MkTableContextMenuSlotProps<T>) => never;
    bulkActionBar?: (slotProps: MkTableBulkActionBarSlotProps) => never;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const getItemId = computed(() => {
    return props.tableMap?.itemId || props.itemId;
  });

  /** Proxy collection that contains the itemIds for the selection collection */
  const selectionIds = computed(() => selection.value?.map((x) => getItemId.value?.(x)));
  /** Returns if 'some' items are in the selection collection */
  const isIndeterminate = computed(() => selection.value.length > 0 && !isAllSelected.value);
  /** Returns if all items ids are selection collection */
  const isAllSelected = computed(() => selection.value.length === props.data?.length);
  /** Returns if the provided item ids are selected */
  const isItemSelected = computed(() => (dataItem: T): boolean => {
    const itemId = getItemId.value?.(dataItem);
    if (itemId) {
      const index = selectionIds.value?.findIndex((x) => x === itemId);
      return index > -1;
    }
    return false;
  });

  /** Classes for the table row */
  function tableRowClassses(dataItem: T) {
    return {
      "has-hover": props.showHoverEffect,
      "mk-table-view__row--selected": isItemSelected.value(dataItem),
      "cursor-not-allowed":
        props.checkbox && itemSelectionShortcuts?.isSelectionMode.value && (isDisabledItemSelection(dataItem) || isRemovedItemSelection(dataItem)),
    };
  }

  function handleNavigation(dataItem: T) {
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

  function handleSelection(dataItem: T) {
    const isSelected = isItemSelected.value(dataItem);
    onToggleSelection(dataItem, !isSelected);
  }

  function onSelectRangeItems(dataItem: T) {
    // select all items between the last selected item and the current item
    const lastSelectedIndex = props.data?.findIndex((x) => getItemId.value!(x) === selectionIds.value[selectionIds.value.length - 1]);
    const currentIndex = props.data?.findIndex((x) => getItemId.value!(x) === getItemId.value!(dataItem));
    // if both indexes are found
    if (lastSelectedIndex !== undefined && currentIndex !== undefined) {
      let start = Math.min(lastSelectedIndex, currentIndex);
      let end = Math.max(lastSelectedIndex, currentIndex);
      // Correct the indexes to keep the current selection as is
      if (end < start) {
        end++;
      } else if (end > start) {
        start++;
      }
      // Select all items between the start and end index
      for (let i = start; i <= end; i++) {
        const item = props.data?.[i];
        if (item && !isDisabledItemSelection(item)) {
          handleSelection(item);
        }
      }
    }
  }

  function onSelectItem(dataItem: T) {
    if (!isDisabledItemSelection(dataItem) && !isRemovedItemSelection(dataItem)) {
      handleSelection(dataItem);
    }
  }

  function onRowClick(_event: MouseEvent, dataItem: T) {
    if (!itemSelectionShortcuts?.isSelectionMode.value) {
      handleNavigation(dataItem);
    }
  }

  /**
   * Select ALL items of the data collection
   * @param value - true to select all, false to deselect all
   */
  function onToggleAll(value: boolean): void {
    if (props.data) {
      props.data.forEach((dataItem) => {
        if (!isDisabledItemSelection(dataItem) && !isRemovedItemSelection(dataItem)) {
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
          if (!isDisabledItemSelection(dataItem) && !isRemovedItemSelection(dataItem)) {
            selection.value.push(dataItem);
          }
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

  function isRemovedItemSelection(dataItem: T) {
    let result = false;

    if (props.removeItemSelection) {
      result = props.removeItemSelection(dataItem);
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
      const columns = initTableDisplayOptions(tableReference.value, displayOptions.value);

      displayOptions.value = <TableDisplayOptions>{
        columns: columns,
      };
    }
  }

  /**
   * Returns a row key for the provided data item, or a fallback value if no key can be generated
   * @param dataItem The data item for which to generate a key
   * @param fallback The fallback value to use if no key can be generated
   */
  function getRowKey(dataItem: T, fallback: number) {
    if (getItemId.value && dataItem) {
      return getItemId.value(dataItem);
    }
    return fallback;
  }

  const observer = new MutationObserver(loadDisplayOptions);

  function openContextMenuPreCheck(event: MouseEvent, dataItem: T) {
    openContextMenu(event, dataItem, {
      isBulkAction: !!selectionIds.value?.length,
    });
  }

  onMounted(() => {
    observer.observe(tbodyNode.value, {
      childList: true,
      subtree: true,
    });
  });

  onUnmounted(() => {
    observer.disconnect();
  });

  function ok() {
    alert("ok");
  }
</script>

<template>
  <v-table ref="myTable" class="mk-table mk-table-view" :class="{ 'mk-table-display-options': hasDisplayOptions }" :data-table-ref="tableReference">
    <thead class="mk-table-view__header-container">
      <tr>
        <th v-if="checkbox && !props.hideSelectionCheckbox" width="65" class="mk-table-view__checkbox-container--header">
          <MkTableCheckbox :disabled="allItemsDisabled" :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:selected="onToggleAll" />
        </th>
        <slot name="thead"></slot>
        <th v-if="slots.contextmenu && !props.hideTableRowActions">&nbsp;</th>
      </tr>
    </thead>
    <tbody ref="tbodyContainer" class="mk-table-view__body-container">
      <!-- render a row for each provided data entity -->
      <tr
        v-for="(dataItem, rowIndex) in props.data"
        :key="getRowKey(dataItem, rowIndex)"
        class="mk-table-view__row"
        :class="tableRowClassses(dataItem)"
        @click.stop="(e) => onRowClick(e, dataItem)"
        @contextmenu.prevent="(e) => openContextMenuPreCheck(e, dataItem)"
        v-bind="itemSelectionShortcuts?.createSelectionProps(dataItem)"
      >
        <td v-if="checkbox && !props.hideSelectionCheckbox" @click.stop class="mk-table-view__checkbox-container--body">
          <MkTableCheckbox
            v-if="!isRemovedItemSelection(dataItem)"
            :item="dataItem"
            :is-selected="isItemSelected(dataItem)"
            :disabled="isDisabledItemSelection(dataItem)"
            @update:selected="(e) => onToggleSelection(dataItem, e)"
          />
        </td>
        <slot name="tbody" v-bind="{ dataItem }"></slot>
        <td v-if="slots.contextmenu && !props.hideTableRowActions">
          <v-menu>
            <template #activator="{ props }">
              <v-btn size="x-small" icon variant="text" v-bind="props"><v-icon icon="$dotsVertical" /> </v-btn>
            </template>
            <slot name="contextmenu" v-bind:dataItem="dataItem"></slot>
          </v-menu>
        </td>
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
  <v-menu v-if="slots.contextmenu || slots.bulkActionBar" v-bind="contextMenuPositionProps">
    <slot name="contextmenu" v-bind="contextMenuProps"></slot>
  </v-menu>
</template>

<style scoped lang="scss">
  @use "@/styles/abstracts/mixins" as mixins;

  .v-table {
    .v-table__wrapper {
      table {
        tbody {
          tr {
            transition: 0.2s background-color;
            user-select: none;
            &.has-hover {
              &:hover {
                @include mixins.hover-effect;
              }
            }

            &.cursor-not-allowed {
              cursor: not-allowed;
            }

            &.mk-table-view__row--selected {
              background-color: rgb(var(--v-theme-secondary-container)) !important; //, var(--v-disabled-opacity)) !important;
              color: var(--v-theme-on-secondary-container) !important;
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
