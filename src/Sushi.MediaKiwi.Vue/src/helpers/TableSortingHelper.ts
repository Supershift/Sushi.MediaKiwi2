import { SortDirection } from "@/models";
import type { Sorting, TableMapSortingOptions } from "@/models";
import { nameof } from "./UtilsHelper";

/**
 * Helper class to help determine sorting
 * @class TableSortingHelper
 */
export default class TableSortingHelper {
  /**
   * Creates an ISorting result with a direction for the new tableMapItem
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @param {Sorting} selectedSortingValue
   * @return {Sorting}
   */
  parseSorting(sortingOptions: TableMapSortingOptions<unknown>, selectedSortingValue?: Sorting): Sorting | undefined {
    const sortingId = this.invokeId(sortingOptions);
    const sortDirection = this.getSortingDirection(sortingId, selectedSortingValue);
    const dataItem: Sorting = { sortBy: sortingId, sortDirection };
    return dataItem;
  }

  /**
   * Returns classes based on the sortingOptions and selectedSortingValue
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @param {Sorting} selectedSortingValue
   * @return {Object}
   */
  getSortingClasses(sortingOptions: TableMapSortingOptions<unknown>, selectedSortingValue?: Sorting) {
    return {
      sortable: true,
      "sortable-active": this.isActiveSort(sortingOptions, selectedSortingValue),
    };
  }

  /**
   * Get the Id set in the sortingOptions
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @return {string}
   */
  private invokeId(sortingOptions: TableMapSortingOptions<unknown>): string {
    const id = nameof(sortingOptions.id);
    return id;
  }

  /**
   * Determine the new sort order direction based on the current direction
   * @param {string} sortingId
   * @param {Sorting} selectedSortingValue
   * @return {SortDirection}
   */
  private getSortingDirection(sortingId: string, selectedSortingValue?: Sorting): SortDirection {
    // Return a default sort option when current sort order is present
    if (!selectedSortingValue) {
      return SortDirection.Desc;
    }

    // Keep the same sorting direction when changing the column
    if (sortingId !== selectedSortingValue?.sortBy) {
      return selectedSortingValue?.sortDirection;
    }

    // Toggle the sort
    return selectedSortingValue?.sortDirection === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc;
  }
  isActiveSort(sortingOptions: TableMapSortingOptions<unknown>, selectedSortingValue?: Sorting): boolean {
    return selectedSortingValue?.sortBy === this.invokeId(sortingOptions);
  }
}
