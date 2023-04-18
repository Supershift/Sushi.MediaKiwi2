import { TableSortingDirection } from "@/models";
import type { TableSortingValue, TableMapSortingOptions, TableMapItem } from "@/models";

/**
 * Helper class to help determine new sorting order,
 * sorting classes and
 *
 * @export
 * @class TableSortingHelper
 */
export default class TableSortingHelper {
  /**
   * Determine the new sort order direction based on the current direction
   * @param {TableMapItem<unknown>} tableMapItem
   * @param {TableSortingValue} selectedSortingValue
   * @return {TableSortingDirection}
   */
  getSortingDirection(tableMapItem?: TableMapItem<unknown>, selectedSortingValue?: TableSortingValue): TableSortingDirection {
    // Return a default sort option when current sort order is present
    if (!selectedSortingValue) {
      return TableSortingDirection.Desc;
    }

    // Keep the same sorting direction when changing the column
    if (tableMapItem?.id !== selectedSortingValue?.tableMapItemId) {
      return selectedSortingValue?.sortDirection;
    }

    // Toggle the sort
    return selectedSortingValue?.sortDirection === TableSortingDirection.Desc ? TableSortingDirection.Asc : TableSortingDirection.Desc;
  }

  /**
   * Creates an ITableSortingValue result with a direction for the new tableMapItem
   * @param {TableMapItem<unknown>} tableMapItem
   * @param {TableSortingValue} selectedSortingValue
   * @return {TableSortingValue}
   */
  parseTableSortingValue(tableMapItem?: TableMapItem<unknown>, selectedSortingValue?: TableSortingValue): TableSortingValue | undefined {
    if (tableMapItem?.sortingOptions && tableMapItem?.id) {
      const sortDirection = this.getSortingDirection(tableMapItem, selectedSortingValue);
      const dataItem: TableSortingValue = { tableMapItemId: tableMapItem?.id, sortDirection };
      return dataItem;
    }
  }

  /**
   * Returns whether or not the provided tableMapItem is the same as the selectedSortingValue
   * @param {TableMapItem<unknown>} tableMapItem
   * @param {TableSortingValue} selectedSortingValue
   * @return {boolean}
   */
  isActiveSort(tableMapItem?: TableMapItem<unknown>, selectedSortingValue?: TableSortingValue): boolean | undefined {
    return selectedSortingValue?.tableMapItemId === tableMapItem?.id;
  }

  /**
   * Returns classes based on the sortingOptions and selectedSortingValue
   * @param {TableMapItem<unknown>} [tableMapItem]
   * @param {TableSortingValue} [selectedSortingValue]
   * @return {Object}
   */
  getSortingClasses(tableMapItem?: TableMapItem<unknown>, selectedSortingValue?: TableSortingValue): { sortable: TableMapSortingOptions | undefined; "sortable-active": boolean | undefined } {
    return {
      sortable: tableMapItem?.sortingOptions,
      "sortable-active": this.isActiveSort(tableMapItem, selectedSortingValue),
    };
  }
}
