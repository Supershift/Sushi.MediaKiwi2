import type { App, Component } from 'vue';
import * as components from "@/components";
import { createPinia } from "pinia";
import type { Pinia } from "pinia";
// import mediakiwAxiosInstance from "./services/main";
import type {AxiosInstance} from "axios"

export interface IMediakiwiVueOptions {
  pinia?: Pinia,
}

export function createPiniaInstance(instance?: Pinia) : Pinia {
  return createPinia();
}

// function setAxiosDefaults(instance: AxiosInstance) {
//   if (instance) {
//     mediakiwAxiosInstance.defaults.baseURL = instance.defaults.baseURL;
//     mediakiwAxiosInstance.defaults.cancelToken = instance.defaults.cancelToken;
//     mediakiwAxiosInstance.defaults.headers = instance.defaults.headers;
//   }
// }

export function createMediakiwiVue(options: IMediakiwiVueOptions) {
    const install = (app: App) => {
      // Auto import all components
      for (const componentKey in components) {
          const name = (components as any)[componentKey];
          const comp = (components as any)[componentKey] as Component
          app.component(name, comp);     
      }
  
      // Create an instance of Pinia
      const pinia = createPiniaInstance(options?.pinia);      
      // setAxiosDefaults(options?.axiosInstance);
      
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