import type { TableSortingDirection } from "./TableSortingDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface TableMapSortingOptions {
  /** Default (or first) direction in which to sort */
  defaultSortDirection?: TableSortingDirection;
}
