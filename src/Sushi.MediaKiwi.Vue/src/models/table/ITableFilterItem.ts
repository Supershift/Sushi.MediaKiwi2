import type { Component, DefineComponent } from "vue"

/** Represents a single filter for table data  */
export interface ITableFilterItem {
    /** Unique id for the filter, will be used as key in the result TableFilterValueCollection. */ 
    id: string,
    /** Title for the filter to be displayed to the user */
    title: string,    
    /** Options to display in the filter, e.g. in a select */
    options: any[] | undefined,
    /** Reference a component which will be dynamically mounted when this filter is opened.
     * When using your own custom component:
     * - this ITableFilterItem will be passed as 'table-filter-item' to the component.
     * - implement v-model and bind it to an object of type ITableFilterValue.
     */
     component: Component | DefineComponent
}