import { TableSortingType } from "./TableSortingType";

export interface ITableSortingValue {
  /** Unique id that represents the column, matches the values set in the id of the {@link ITableMapItem} */
  id: string;
  /** Sorting option for the column */
  sortOption: TableSortingType;
}
