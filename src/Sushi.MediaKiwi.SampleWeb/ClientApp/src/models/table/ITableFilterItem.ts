import type { Component, DefineComponent } from "vue"

export interface ITableFilterItem {
    id: string,
    title: string,    
    options: any[] | undefined,
    /** Reference a component which will be dynamically mounted when this filter is opened.
     * The TableFilterItem will be passed as 'table-filter-item' to the component.
     * Implement the v-model pattern on an object of type ITableFilterValue.
     */
     component: Component | DefineComponent
}