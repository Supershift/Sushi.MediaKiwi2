import { Component, ComponentPropsOptions, DefineComponent } from "vue";

export type TableMapItemEditOptions<Type> = {
  /** The property of the bound entity to edit. */
  property: keyof Type;
  /** Props to be passed down to the component */
  componentProps?: ComponentPropsOptions;
  /** Reference a component which will be dynamically mounted for each bound entity.
   * Use the property 'data' to pass the entity to the component. */
  component?: Component | DefineComponent;
};
