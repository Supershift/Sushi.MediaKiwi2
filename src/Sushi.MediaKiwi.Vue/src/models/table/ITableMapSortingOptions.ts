import type { TableSortingDirection } from "./TableSortingDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface ITableMapSortingOptions {
  /** Default (or first) direction in which to sort */
  defaultSortDirection?: TableSortingDirection;
}
