import type { Component, DefineComponent } from "vue";
import type { TableMapSortingOptions } from "./TableMapSortingOptions";
import { MoneyValue } from "../api";
import { TableCellIcon } from "./TableCellIcon";

/** Represents a column in a table, mapping bound entities to table cells.  */
export interface TableMapItem<Type> {
  /** The value to display in the table header for this column. */
  headerTitle: string;
  /** This function will be called for each bound entity and the return value will be displayed. */
  value?: (entity: Type) => string | number | boolean | MoneyValue | TableCellIcon | undefined | null;
  /** Reference a component which will be dynamically mounted for each bound entity.
   * Use the property 'data' to pass the entity to the component. */
  component?: Component | DefineComponent;
  /** Mark the column sortable */
  sortingOptions?: TableMapSortingOptions<Type>;
}
