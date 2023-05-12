import { SortDirection } from "../enum/SortDirection";

/** Represents a table map sorting option, making the table header sortable  */
export interface TableMapSortingOptions<Type> {
  /** Identifier */
  id: (entity: Type) => string | number | boolean | object | undefined;
  /** Default (or first) direction in which to sort */
  sortDirection?: SortDirection;
}
