import { SortDirection } from "@/models";
import type { Sorting, TableMapSortingOptions } from "@/models";
import { nameof } from "@/helpers/UtilsHelper";
import { computed, ref } from "vue";
import type { ComputedRef } from "vue";

/** Return type of the composable */
interface useTableMapItemSorting {
  setSorting: (sortingOptions: TableMapSortingOptions<unknown>) => void;
  getSortingClasses: (sortingOptions: TableMapSortingOptions<unknown>) => unknown;
  sortIcon: ComputedRef<string>;
  selectedSorting: ComputedRef<Sorting | undefined>;
}

/** Tablemap options for the composable to use */
interface tableMapItemSortingOptions {
  selectedSortOption?: Sorting;
}

/**
 * Helper class to help determine sorting
 * @class TableSortingHelper
 */
export function useTableMapItemSorting(options: tableMapItemSortingOptions): useTableMapItemSorting {
  /** Private collection of the returned itemId() value */
  const { selectedSortOption } = options;
  const currentSort = ref<Sorting>();

  if (selectedSortOption) {
    currentSort.value = selectedSortOption;
  }
  /**
   * Creates an ISorting result with a direction for the new tableMapItem
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @param {Sorting}
   * @return {Sorting}
   */
  function setSorting(sortingOptions: TableMapSortingOptions<unknown>) {
    const sortingId = invokeId(sortingOptions);
    const sortDirection = getSortingDirection(sortingId);
    currentSort.value = { sortBy: sortingId, sortDirection };
  }

  /**
   * Returns classes based on the sortingOptions
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @return {Object}
   */
  function getSortingClasses(sortingOptions: TableMapSortingOptions<unknown>) {
    return {
      sortable: true,
      "sortable-active": isActiveSort(sortingOptions),
    };
  }

  /**
   * Get the Id set in the sortingOptions
   * @param {TableMapSortingOptions<unknown>} sortingOptions
   * @return {string}
   */
  function invokeId(sortingOptions: TableMapSortingOptions<unknown>): string {
    const id = nameof(sortingOptions.id);
    return id;
  }

  /**
   * Determine the new sort order direction based on the current direction
   * @param {string} sortingId
   * @return {SortDirection}
   */
  function getSortingDirection(sortingId: string): SortDirection {
    // Return a default sort option when current sort order is present
    if (!currentSort.value) {
      return SortDirection.Desc;
    }

    // Keep the same sorting direction when changing the column
    if (sortingId !== currentSort.value?.sortBy) {
      return currentSort.value.sortDirection;
    }

    // Toggle the sort
    return currentSort.value?.sortDirection === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc;
  }
  function isActiveSort(sortingOptions: TableMapSortingOptions<unknown>): boolean {
    return currentSort.value?.sortBy === invokeId(sortingOptions);
  }

  const selectedSorting = computed(() => currentSort.value);

  const sortIcon = computed(() => {
    if (currentSort.value?.sortDirection === SortDirection.Asc) {
      return "mdi-arrow-up";
    } else {
      return "mdi-arrow-down";
    }
  });

  return {
    setSorting,
    getSortingClasses,
    selectedSorting,
    sortIcon,
  };
}
