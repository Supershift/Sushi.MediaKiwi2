import type { TableMapItem } from "./TableMapItem";

/** Represents the mapping between an instance of Type and a table. */
export interface TableMap<Type> {
  /** The mapping items which will be used to render the table. */
  items: TableMapItem<Type>[];
  /** This function will be called for a bound entity to get its unique id */
  itemId?: (entity: Type) => string | number;
}
