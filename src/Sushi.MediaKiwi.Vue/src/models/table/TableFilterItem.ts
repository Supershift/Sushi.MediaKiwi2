import type { Component, DefineComponent } from "vue";
import { TableFilterValue } from "./TableFilterValue";

export type TableFilterItem = {
  /** Title for the filter to be displayed to the user */
  title: string;
  /** Options to display in the filter, e.g. in a select */
  options: any[] | undefined;
  /** Gets or sets the selected value for this filter. */
  selectedValue?: TableFilterValue;
  /** Reference a component which will be dynamically mounted when this filter is opened.
   * When using your own custom component:
   * - this TableFilterItem will be passed as 'table-filter-item' to the component.
   * - implement v-model and bind it to an object of type TableFilterValue.
   */
  component: Component | DefineComponent;
};
