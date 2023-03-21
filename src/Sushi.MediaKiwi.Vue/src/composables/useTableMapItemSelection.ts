import { ref, computed } from "vue";
import type { ComputedRef } from "vue";
import type { ITableMap } from "@/models/table/ITableMap";

/** Proxy type for number or string to allow an array of either type */
type tableMapIdentifierType = number | string | undefined;

/** Return type of the composable */
interface useTableMapItemSelection {
  selectAll: (value: boolean) => void;
  selectItem: (dataItem: unknown, value: boolean) => void;
  isItemSelected: (dataItem: unknown) => boolean;
  isIndeterminate: ComputedRef<boolean>;
  isAllSelected: ComputedRef<boolean>;
  selectedItems: ComputedRef<string[] | number[]>;
}

/** Tablemap options for the composable to use */
interface tableMapItemSelectionOptions {
  tableMap: ITableMap<unknown>;
  data: unknown[];
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
  function select(items: tableMapIdentifierType[], value: boolean): void {
    const newSelected = [...selected.value];

    for (const item of items) {
      if (value) {
        if (newSelected.indexOf(item) === -1) {
          newSelected.push(item);
        }
      } else {
        if (newSelected.indexOf(item) > -1) {
          newSelected.splice(newSelected.indexOf(item), 1);
        }
      }
    }
    selected.value = newSelected;
  }

  /** Select ALL items of the tablemap */
  function selectAll(value: boolean): void {
    select(tableMapItemIds.value, value);
  }

  /** Select the provided data item */
  function selectItem(dataItem: unknown, value: boolean): void {
    if (tableMap?.itemId) {
      const itemId = tableMap.itemId(dataItem);
      if (itemId) {
        select([itemId], value);
      }
    }
  }

  /** Create a collection of the table map item id's  */
  const tableMapItemIds = computed(() => {
    return data
      .map((dataItem) => {
        if (tableMap?.itemId) {
          return tableMap.itemId(dataItem);
        }
      })
      .map((m) => m);
  });

  /** Returns if the provided item ids are selected */
  function isSelected(items: tableMapIdentifierType[]): boolean {
    return items.every((item) => selected.value.includes(item));
  }

  /** Returns of some of the provided item ids are selected */
  function isSomeSelected(items: tableMapIdentifierType[]): boolean {
    return items.some((item) => selected.value.includes(item));
  }

  /** Returns the provided dataItem is selected */
  function isItemSelected(dataItem: unknown): boolean {
    if (tableMap?.itemId) {
      const itemId = tableMap?.itemId(dataItem);
      return isSelected([itemId]);
    }
    return false;
  }

  /** Returns if 'some' items are selected */
  const isIndeterminate = computed(() => !isSelected(tableMapItemIds.value) && isSomeSelected(tableMapItemIds.value));

  /** Returns if all items ids are selected */
  const isAllSelected = computed(() => isSelected(tableMapItemIds.value));

  /** Return a collection of numbers or strings based on the type of first item */
  const selectedItems = computed<string[] | number[]>(() => {
    if (!selected.value || !selected.value.length) {
      return [];
    }

    if (typeof selected.value[0] === "string") {
      return <string[]>selected.value;
    } else if (typeof selected.value[0] === "number") {
      return <number[]>selected.value;
    }

    return [];
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
