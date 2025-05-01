import { AsyncComponentLoader } from "vue";
import { TableFilterValue } from "./TableFilterValue";
import { TableFilterType } from "@/models/enum/TableFilterType";

export type TableFilterItem = {
  /** Title for the filter to be displayed to the user */
  title: string;
  /** Description to be displayed to the user */
  intro?: string;
  /** Label shown in the input */
  inputLabel?: string;
  /** Options to display in the filter, e.g. in a select */
  options?: TableFilterValue[];
  /** Gets or sets the selected value for this filter. */
  selectedValue?: TableFilterValue;
  /** Gets or sets what type of component will render for the filter. If set to custom, you also need to set 'component'  */
  type?: TableFilterType;
  /** Reference a component which will be dynamically mounted when this filter is opened.
   * - this TableFilterItem will be passed as 'table-filter-item' to the component.
   * - implement v-model and bind it to an object of type TableFilterValue.
   */
  component?: AsyncComponentLoader;
  /**
   * Sets the TableFilterItem as searchable, meaning the input field in the filterbar will populate this filter item
   * Use only once in a collections of filters, otherwise the search will be applied to the occurance of a searchable filter item.
   */
  searchable?: boolean;
  /* Place a divider after this filter item and the next */
  divider?: boolean;
  /** Custom form rules the input should match */
  rules?: any[];
  /** Indicates if the user can close the filter. When not set, the user can close the filter */
  closable?: boolean;
  /** Disable the filter in the menu */
  disabled?: boolean | ((item: TableFilterItem) => boolean);
};
