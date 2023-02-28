import type { ITableFilterValue } from "./ITableFilterValue";

/** Represents a collection of ITableFilterValue instances, each with a unique key */
export class TableFilterValueCollection extends Map<string, ITableFilterValue> { }