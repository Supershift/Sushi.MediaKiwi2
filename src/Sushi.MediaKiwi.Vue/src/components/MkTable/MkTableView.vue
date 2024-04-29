<script setup lang="ts" generic="T">
  import { RouteParamValueRaw } from "vue-router";
  import type { TableMap } from "@/models/table/TableMap";
  import { useMediakiwiStore } from "@/stores/";
  import type { Sorting } from "@/models";
  import MkTableCheckbox from "./MkTableCheckbox.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { computed } from "vue";

  // define properties
  const props = defineProps<{
    tableMap?: TableMap<T>;
    itemId?: (entity: T) => string | number;
    data?: T[];
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
    /** Make each row in the table selectable. */
    checkbox?: boolean;
    /** Defines the pagination mode */
    paginationMode?: MediakiwiPaginationMode;
    /** Defines if the table row has a hover effect */
    showHoverEffect: boolean;
    /** Callback to disable the selection checkbox for a row based on specific criteria */
    disableItemSelection?: (entity: T) => boolean;
  }>();

  /** Use Sorting<T> for typesavety  */
  defineModel<Sorting | Sorting<T>>("sorting");
  /** Selected items */
  const selection = defineModel<Array<T>>("selection", { default: [] });

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
    tbody: (props: T) => never;
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
  const tableRowClassses = computed(() => {
    return {
      "has-hover": props.showHoverEffect,
    };
  });

  function onRowClick(_event: Event, dataItem: T) {
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
</script>

<template>
  <v-table class="mk-table-view">
    <thead>
      <tr>
        <th v-if="checkbox" width="65">
          <MkTableCheckbox :disabled="allItemsDisabled" :is-indeterminate="isIndeterminate" :is-selected="isAllSelected" @update:selected="onToggleAll" />
        </th>
        <slot name="thead"></slot>
      </tr>
    </thead>
    <tbody>
      <!-- render a row for each provided data entity -->
      <tr v-for="(dataItem, rowIndex) in props.data" :key="rowIndex" :class="tableRowClassses" @click.stop="(e) => onRowClick(e, dataItem)">
        <td v-if="checkbox" @click.stop>
          <MkTableCheckbox
            :item="dataItem"
            :is-selected="isItemSelected(dataItem)"
            :disabled="isDisabledItemSelection(dataItem)"
            @update:selected="(e) => onToggleSelection(dataItem, e)"
          />
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
