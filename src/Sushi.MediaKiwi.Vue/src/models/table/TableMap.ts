import type { TableMapItem } from "./TableMapItem";

/** Represents the mapping between an instance of Type and a table. */
export interface TableMap<T> {
  /** The mapping items which will be used to render the table. */
  items: TableMapItem<T>[];
  /** This function will be called for a bound entity to get its unique id */
  itemId?: (entity: T) => string | number;
}
