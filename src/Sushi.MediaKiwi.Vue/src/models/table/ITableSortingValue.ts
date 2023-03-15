import { TableSortingDirection } from "./TableSortingDirection";

/** Represents a selected sorting value */
export interface ITableSortingValue {
  /** Unique id that represents the column, matches the values set in the id of the ITableMapSortingOptions */
  id: string;
  /** Sorting direction for the column */
  sortDirection: TableSortingDirection;
}
