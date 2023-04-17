import type { ITableMapItem } from "./ITableMapItem";

/** Represents the mapping between an instance of Type and a table. */
export interface ITableMap<Type> {
  /** The mapping items which will be used to render the table. */
  items: ITableMapItem<Type>[];
  /** This function will be called for a bound entity to get its unique id */
  itemId?: (entity: Type) => string | number;
}
