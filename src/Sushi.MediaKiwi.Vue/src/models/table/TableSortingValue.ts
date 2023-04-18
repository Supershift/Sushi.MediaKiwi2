import type { TableSortingDirection } from "./TableSortingDirection";

/** Represents a selected sorting value */
export interface TableSortingValue {
  /** Unique id that represents the column, matches the values set in the id of the ITableMapSortingOptions */
  tableMapItemId: string;
  /** Sorting direction for the column */
  sortDirection: TableSortingDirection;
}
