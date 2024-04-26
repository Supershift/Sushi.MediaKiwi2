import { ref, computed, watch } from "vue";
import type { ComputedRef } from "vue";
// import type { TableMap } from "@/models/table/TableMap";

/** Proxy type for number or string to allow an array of either type */
type tableMapIdentifierType = number | string | undefined;

/** Tablemap options for the composable to use */
interface useTableRowSelectionOptions<T> {
  data?: ComputedRef<T[] | undefined>;
  itemId?: (entity: T) => string | number;
}

/**
 * Composable to select table rows
 * @param options TableMap and data to use to keep track of selection
 */
export function useTableRowSelection<T>(options: useTableRowSelectionOptions<T>) {
  /** Private collection of the returned itemId() value */
  const { itemId, data } = options;
  const selected = ref<tableMapIdentifierType[]>([]);

  function invokeId(dataItem?: T): any {
    if (itemId && typeof itemId === "function" && dataItem) {
      return itemId(dataItem);
    }
    return null;
  }

  /** Select or remove one or more items from the collection */
  function select(dataItems: T[], value: boolean): void {
    const newSelected = [...selected.value];

    for (const dataItem of dataItems) {
      const itemId = invokeId(dataItem);
      if (itemId) {
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
    if (data?.value) {
      select(data?.value, value);
    }
  }

  /** Select the provided data item */
  function selectItem(dataItem: T, value: boolean): void {
    select([dataItem], value);
  }

  /** Returns if the provided item ids are selected */
  function isSelected(dataItems?: T[]): boolean {
    return (
      dataItems?.every((dataItem) => {
        const itemId = invokeId(dataItem);
        if (itemId) {
          return selected.value.indexOf(itemId) > -1;
        }
        return false;
      }) || false
    );
  }

  /** Returns of some of the provided item ids are selected */
  function isSomeSelected(dataItems?: T[]): boolean {
    return (
      dataItems?.some((dataItem) => {
        const itemId = invokeId(dataItem);
        if (itemId) {
          return selected.value.indexOf(itemId) > -1;
        }
        return false;
      }) || false
    );
  }

  /** Returns the provided dataItem is selected */
  function isItemSelected(dataItem: T): boolean {
    return isSelected([dataItem]);
  }

  /** Returns if 'some' items are selected */
  const isIndeterminate = computed(() => !isSelected(data?.value) && isSomeSelected(data?.value));

  /** Returns if all items ids are selected */
  const isAllSelected = computed(() => isSelected(data?.value));

  /** Return a collection of {@link T} objects from the data based on the the selection */
  const selectedItems = computed<T[]>(() => {
    if (!selected.value || !selected.value.length) {
      return [];
    }

    return (
      data?.value?.filter((item) => {
        return isItemSelected(item);
      }) || []
    );
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
