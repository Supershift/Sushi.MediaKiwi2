import { TableSortingDirection } from "./TableSortingDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface ITableMapSortingOptions {
  /** Id of the column to sort */
  id: string;
  /** Default (or first) direction in which to sort */
  defaultSortDirection?: TableSortingDirection;
}
