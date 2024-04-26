import { SortDirection } from "@/models";
import { Sorting, TableSortingOptions, IconsLibrary } from "@/models";
import { nameof } from "@/helpers/UtilsHelper";
import { computed, ref } from "vue";

/** Tablemap options for the composable to use */
interface useTableSortingOptions {
  selectedSortOption?: Sorting;
}

const currentSort = ref<Sorting>();

/**
 * Helper class to help determine sorting
 * @class TableSortingHelper
 */
export function useTableSorting(options: useTableSortingOptions) {
  /** Private collection of the returned itemId() value */
  const { selectedSortOption } = options;

  if (selectedSortOption) {
    currentSort.value = selectedSortOption;
  }

  /**
   * Creates an ISorting result with a direction for the new tableMapItem
   * @param {TableSortingOptions<T>} sortingOptions
   * @param {Sorting}
   * @return {Sorting}
   */
  function setSorting<T>(sortingOptions: TableSortingOptions<T>) {
    const sortingId = invokeId(sortingOptions);
    const sortDirection = getSortingDirection(sortingId);
    currentSort.value = { sortBy: sortingId, sortDirection };
  }

  /**
   * Returns classes based on the sortingOptions
   * @param {TableSortingOptions<T>} sortingOptions
   * @return {Object}
   */
  function getSortingClasses<T>(sortingOptions: TableSortingOptions<T>): Record<string, boolean> {
    return {
      sortable: true,
      "sortable-active": isActiveSort(sortingOptions),
    };
  }

  /**
   * Get the Id set in the sortingOptions
   * @param {TableSortingOptions<T>} sortingOptions
   * @return {string}
   */
  function invokeId<T>(sortingOptions: TableSortingOptions<T>): string {
    if (typeof sortingOptions.id === "function") {
      return nameof(sortingOptions.id);
    } else {
      return sortingOptions.id?.toString() ?? "";
    }
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
  function isActiveSort<T>(sortingOptions: TableSortingOptions<T>): boolean {
    return currentSort.value?.sortBy === invokeId(sortingOptions);
  }

  const selectedSorting = computed(() => currentSort.value);

  const sortIcon = computed(() => {
    if (currentSort.value?.sortDirection === SortDirection.Asc) {
      return IconsLibrary.arrowUp;
    } else {
      return IconsLibrary.arrowDown;
    }
  });

  return {
    setSorting,
    getSortingClasses,
    selectedSorting,
    sortIcon,
  };
}
