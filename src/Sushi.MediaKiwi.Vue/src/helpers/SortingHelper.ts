import { ITableMapSortingOptions, TableSortingDirection } from "@/models";
import type { ITableSortingValue } from "@/models";

/**
 * Determine the new sort order direction based on the current direction
 * @param sortingOptions
 * @param currentSort
 */
export function getSortingDirection(sortingOptions?: ITableMapSortingOptions, currentSort?: ITableSortingValue): TableSortingDirection {
  // Return the default sort option when current sort order is present
  if (!currentSort || sortingOptions?.id !== currentSort?.id) {
    return TableSortingDirection.Desc;
  }

  // Toggle the sort and return
  return currentSort?.sortDirection === TableSortingDirection.Desc ? TableSortingDirection.Asc : TableSortingDirection.Desc;
}

/**
 * Creates an ITableSortingValue with a new toggled direction and new id
 * @param sortingOptions
 * @param selectedSortingValue
 */
export function getTableSortingValue(sortingOptions?: ITableMapSortingOptions, selectedSortingValue?: ITableSortingValue): ITableSortingValue | undefined {
  if (sortingOptions) {
    const sortDirection = getSortingDirection(sortingOptions, selectedSortingValue);
    const dataItem: ITableSortingValue = { id: sortingOptions?.id, sortDirection };
    return dataItem;
  }
}

/**
 * Returns whether or not the current table header is the currenly active sorting
 * @param sortingOptions
 * @param selectedSortingValue
 * @returns {boolean}
 */
export function isActiveSort(sortingOptions?: ITableMapSortingOptions, selectedSortingValue?: ITableSortingValue) {
  if (!selectedSortingValue?.sortDirection) {
    return false;
  }

  if (!sortingOptions) {
    return false;
  }

  if (selectedSortingValue.id === sortingOptions.id) {
    return true;
  }
}

/**
 * Returns classes based on the sortingOptions and selectedSortingValue
 * @param sortingOptions
 * @param selectedSortingValue
 * @returns
 */
export function getClasses(sortingOptions?: ITableMapSortingOptions, selectedSortingValue?: ITableSortingValue) {
  return {
    sortable: sortingOptions,
    "sortable-active": isActiveSort(sortingOptions, selectedSortingValue),
  };
}
