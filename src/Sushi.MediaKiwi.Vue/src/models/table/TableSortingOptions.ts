import { SortDirection } from "../enum/SortDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface TableSortingOptions<T> {
  /** Identifier */
  id: string | ((entity: T) => any) | keyof T;
  /** Default (or first) direction in which to sort */
  sortDirection?: SortDirection;
}
