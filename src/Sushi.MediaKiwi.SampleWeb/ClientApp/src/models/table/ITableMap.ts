import type { ITableMapItem } from "../table/ITableMapItem";

/** Represents the mapping between an instance of Type and a table. */
export interface ITableMap<Type> {
    (arg: Type): Type;
    /** The mapping items which will be used to render the table. */
    items: ITableMapItem<Type>[],
    /** This function will be called for a bound entity to get its unique id */
    itemId?: ((entity: Type) => string | number),
}