import type { TableFilterValue } from "./ITableFilterValue";

/** Represents a collection of ITableFilterValue instances, each with a unique key */
export type TableFilterValueCollection = Record<string, TableFilterValue | undefined>;
