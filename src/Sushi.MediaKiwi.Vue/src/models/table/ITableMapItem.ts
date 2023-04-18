import type { Component, DefineComponent } from "vue";
import type { ITableMapItemIconOptions } from "./ITableMapItemIconOptions";
import type { ITableMapSortingOptions } from "./ITableMapSortingOptions";

/** Represents a column in a table, mapping bound entities to table cells.  */
export interface ITableMapItem<Type> {
  /** Unique id of this column */
  id?: string;
  /** The value to display in the table header for this column. */
  headerTitle: string;
  /** This function will be called for each bound entity and the return value will be displayed. */
  value: ((entity: Type) => string | number | boolean | object | undefined) | undefined;
  /** Reference a component which will be dynamically mounted for each bound entity.
   * Use the property 'data' to pass the entity to the component. */
  component?: Component | DefineComponent;
  /** Mark the column sortable */
  sortingOptions?: ITableMapSortingOptions;
  /** Icon settings */
  icon?: ((entity: Type) => ITableMapItemIconOptions) | undefined;
}
