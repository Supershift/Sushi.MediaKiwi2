import type { App, Component } from 'vue';
import * as components from "@/components";
import { createPinia } from "pinia";
import type { Pinia } from "pinia";

export interface IMediakiwiVueOptions {
  piniaInstance?: Pinia
}

export function createPiniaInstance(instance?: Pinia) : Pinia {
  return createPinia();
}


export function createMediakiwiVue(options: IMediakiwiVueOptions) {
    const install = (app: App) => {
      // Auto import all components
      for (const componentKey in components) {
          const name = (components as any)[componentKey];
          const comp = (components as any)[componentKey] as Component
          app.component(name, comp);     
      }
  
      // Create an instance of Pinia
      const pinia = createPiniaInstance(options?.piniaInstance);      
      
      app.use(pinia);      
    }

    return {
      install
    }    
}

export * from "@/components";

export { default as router } from "@/router";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";