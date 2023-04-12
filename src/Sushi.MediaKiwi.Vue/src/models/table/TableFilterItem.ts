import { DefineComponent } from "vue";
import { TableFilterValue } from "./TableFilterValue";
import { TableFilterType } from "@/components/MkTableFilter/TableFilterType";
export type TableFilterItem = {
  /** Title for the filter to be displayed to the user */
  title: string;
  /** Options to display in the filter, e.g. in a select */
  options: any[] | undefined;
  /** Gets or sets the selected value for this filter. */
  selectedValue?: TableFilterValue;
  
  /** Gets or sets what type of component will render for the filter. If set to custom, you also need to set 'component'  */
  type?: TableFilterType;
  /** Reference a component which will be dynamically mounted when this filter is opened.   
   * - this TableFilterItem will be passed as 'table-filter-item' to the component.
   * - implement v-model and bind it to an object of type TableFilterValue.
   */
  component?: DefineComponent;
};
