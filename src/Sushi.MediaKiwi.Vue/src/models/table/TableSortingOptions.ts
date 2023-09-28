import { SortDirection } from "../enum/SortDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface TableSortingOptions<Type> {
  /** Identifier */
  id: (entity: Type) => any | keyof Type;
  /** Default (or first) direction in which to sort */
  sortDirection?: SortDirection;
}
