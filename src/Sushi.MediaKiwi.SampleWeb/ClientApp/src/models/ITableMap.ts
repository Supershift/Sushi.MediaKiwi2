import { ITableMapItem } from "./ITableMapItem";

/** Represents the mapping between an instance of Type and a table. */
export interface ITableMap<Type> {
    (arg: Type): Type;
    /** The mapping items which will be used to render the table. */
    items: ITableMapItem<Type>[]
}