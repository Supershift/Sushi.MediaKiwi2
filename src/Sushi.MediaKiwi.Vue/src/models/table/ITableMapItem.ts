import type { Component, DefineComponent } from "vue";

/** Represents a column in a table, mapping bound entities to table cells.  */
export interface ITableMapItem<Type> {
  (arg: Type): Type;
  /** Unique id for the header, will be used as id in the result TableMapSortingOption. */
  id: string;
  /** The value to display in the table header for this column. */
  headerTitle: string;
  /** This function will be called for each bound entity and the return value will be displayed. */
  value: ((entity: Type) => string | number | boolean | object) | undefined;
  /** Reference a component which will be dynamically mounted for each bound entity.
   * Use the property 'data' to pass the entity to the component. */
  component: Component | DefineComponent | undefined;
  /** Mark the column sortable */
  isSortable?: boolean;
}
