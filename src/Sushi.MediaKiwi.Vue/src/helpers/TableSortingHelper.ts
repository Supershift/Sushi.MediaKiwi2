import { TableSortingDirection } from "@/models";
import type { ITableSortingValue, ITableMapSortingOptions, ITableMapItem } from "@/models";

/**
 * Helper class to help determine new sorting order,
 * sorting classes and
 *
 * @export
 * @class SortingHelper
 */
export default class SortingHelper {
  /**
   * Determine the new sort order direction based on the current direction
   * @param {ITableMapItem<unknown>} tableMapItem
   * @param {ITableSortingValue} selectedSortingValue
   * @return {TableSortingDirection}
   */
  getSortingDirection(tableMapItem?: ITableMapItem<unknown>, selectedSortingValue?: ITableSortingValue): TableSortingDirection {
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
   * @param {ITableMapItem<unknown>} tableMapItem
   * @param {ITableSortingValue} selectedSortingValue
   * @return {ITableSortingValue}
   */
  parseTableSortingValue(tableMapItem?: ITableMapItem<unknown>, selectedSortingValue?: ITableSortingValue): ITableSortingValue | undefined {
    if (tableMapItem?.sortingOptions) {
      const sortDirection = this.getSortingDirection(tableMapItem, selectedSortingValue);
      const dataItem: ITableSortingValue = { tableMapItemId: tableMapItem?.id, sortDirection };
      return dataItem;
    }
  }

  /**
   * Returns whether or not the provided tableMapItem is the same as the selectedSortingValue
   * @param {ITableMapItem<unknown>} tableMapItem
   * @param {ITableSortingValue} selectedSortingValue
   * @return {boolean}
   */
  isActiveSort(tableMapItem?: ITableMapItem<unknown>, selectedSortingValue?: ITableSortingValue): boolean | undefined {
    return selectedSortingValue?.tableMapItemId === tableMapItem?.id;
  }

  /**
   * Returns classes based on the sortingOptions and selectedSortingValue
   * @param {ITableMapItem<unknown>} [tableMapItem]
   * @param {ITableSortingValue} [selectedSortingValue]
   * @return {Object}
   */
  getSortingClasses(tableMapItem?: ITableMapItem<unknown>, selectedSortingValue?: ITableSortingValue): { sortable: ITableMapSortingOptions | undefined; "sortable-active": boolean | undefined } {
    return {
      sortable: tableMapItem?.sortingOptions,
      "sortable-active": this.isActiveSort(tableMapItem, selectedSortingValue),
    };
  }
}
