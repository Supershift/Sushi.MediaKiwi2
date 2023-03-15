import { ITableMapSortingOptions, TableSortingDirection } from "@/models";
import type { ITableSortingValue } from "@/models";

export type SortingContext = {
  getSortingDirection: () => TableSortingDirection;
  getTableSortingValue: () => ITableSortingValue;
  isActiveSort: () => boolean;
  getClasses: () => {};
};

export function useSorting() {
  const getSortingDirection = (sortingOptions?: ITableMapSortingOptions, currentSort?: ITableSortingValue) => {
    // Return the default sort option when changing column
    if (!currentSort || sortingOptions?.id !== currentSort?.id) {
      return TableSortingDirection.Desc;
    }

    return currentSort?.sortOption === TableSortingDirection.Desc ? TableSortingDirection.Asc : TableSortingDirection.Desc;
  };

  const getTableSortingValue = (sortingOptions?: ITableMapSortingOptions, selectedSortingValue?: ITableSortingValue) => {
    if (sortingOptions) {
      const sortOption = getSortingDirection(sortingOptions, selectedSortingValue);
      const dataItem: ITableSortingValue = { id: sortingOptions?.id, sortOption };
      return dataItem;
    }
  };

  const isActiveSort = (sortingOptions?: ITableMapSortingOptions, selectedSortingValue?: ITableSortingValue) => {
    if (!selectedSortingValue?.sortOption) {
      return false;
    }

    if (!sortingOptions) {
      return false;
    }

    if (selectedSortingValue.id === sortingOptions.id) {
      return true;
    }
  };

  const getClasses = (sortingOptions?: ITableMapSortingOptions) => {
    return {
      sortable: sortingOptions, // can sort
      "sortable-active": isActiveSort(sortingOptions),
    };
  };

  return {
    getSortingDirection,
    getTableSortingValue,
    isActiveSort,
    getClasses,
  };
}
