import type { ITableFilterItem } from "./ITableFilterItem";

/** Represents a collection of filters for table data  */
export interface ITableFilter{
    /** Collection of filter items */
    items: ITableFilterItem[]
}