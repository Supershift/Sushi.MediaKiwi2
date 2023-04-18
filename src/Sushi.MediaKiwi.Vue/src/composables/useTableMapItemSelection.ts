import { ref, computed } from "vue";
import type { ComputedRef } from "vue";
import type { TableMap } from "@/models/table/TableMap";

/** Proxy type for number or string to allow an array of either type */
type tableMapIdentifierType = number | string | undefined;

/** Return type of the composable */
interface useTableMapItemSelection {
  selectAll: (value: boolean) => void;
  selectItem: (dataItem: unknown, value: boolean) => void;
  isItemSelected: (dataItem: unknown) => boolean;
  isIndeterminate: ComputedRef<boolean>;
  isAllSelected: ComputedRef<boolean>;
  selectedItems: ComputedRef<unknown[]>;
}

/** Tablemap options for the composable to use */
interface tableMapItemSelectionOptions {
  tableMap: TableMap<unknown>;
  data?: unknown[];
}

/**
 * Composable to select table rows
 * @param options TableMap and data to use to keep track of selection
 * @returns {useTableMapItemSelection}
 */
export function useTableMapItemSelection(options: tableMapItemSelectionOptions): useTableMapItemSelection {
  /** Private collection of the returned itemId() value */
  const selected = ref<tableMapIdentifierType[]>([]);
  const { tableMap, data } = options;

  /** Select or remove one or more items from the collection */
  function select(dataItems: unknown[], value: boolean): void {
    const newSelected = [...selected.value];

    for (const dataItem of dataItems) {
      if (tableMap.itemId) {
        const itemId = tableMap.itemId(dataItem);
        const index = newSelected.indexOf(itemId);

        if (value) {
          // Add the item if not already present
          if (index === -1) {
            newSelected.push(itemId);
          }
        } else {
          // Remove the item if present
          if (index > -1) {
            newSelected.splice(index, 1);
          }
        }
      }
    }
    selected.value = newSelected;
  }

  /** Select ALL items of the tablemap */
  function selectAll(value: boolean): void {
    select(data!, value);
  }

  /** Select the provided data item */
  function selectItem(dataItem: unknown, value: boolean): void {
    select([dataItem], value);
  }

  /** Returns if the provided item ids are selected */
  function isSelected(dataItems: unknown[]): boolean {
    return dataItems.every((dataItem) => {
      if (tableMap.itemId) {
        const itemId = tableMap.itemId(dataItem);
        return selected.value.indexOf(itemId) > -1;
      }
      return false;
    });
  }

  /** Returns of some of the provided item ids are selected */
  function isSomeSelected(dataItems: unknown[]): boolean {
    return dataItems.some((dataItem) => {
      if (tableMap.itemId) {
        const itemId = tableMap.itemId(dataItem);
        return selected.value.indexOf(itemId) > -1;
      }
      return false;
    });
  }

  /** Returns the provided dataItem is selected */
  function isItemSelected(dataItem: unknown): boolean {
    return isSelected([dataItem]);
  }

  /** Returns if 'some' items are selected */
  const isIndeterminate = computed(() => !isSelected(data) && isSomeSelected(data));

  /** Returns if all items ids are selected */
  const isAllSelected = computed(() => isSelected(data));

  /** Return a collection of unknown objects from the data based on the the selection */
  const selectedItems = computed<unknown[]>(() => {
    if (!selected.value || !selected.value.length) {
      return [];
    }

    return data.filter((item) => {
      return isItemSelected(item);
    });
  });

  return {
    selectAll,
    selectItem,
    isAllSelected,
    isItemSelected,
    isIndeterminate,
    selectedItems,
  };
}
