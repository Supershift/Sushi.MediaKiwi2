import type { App, Component } from 'vue';
import * as components from "@/components";
import { createPinia } from "pinia";
import type { Pinia } from "pinia";
// import mediakiwAxiosInstance from "./services/main";
import type {AxiosInstance} from "axios"
import { useMediakiwiStore } from '@/stores/index';
import useRouter from '@/router';

export interface IMediakiwiVueOptions {
  modules: Record<string, () => Promise<unknown>>,
}

// function setAxiosDefaults(instance: AxiosInstance) {
//   if (instance) {
//     mediakiwAxiosInstance.defaults.baseURL = instance.defaults.baseURL;
//     mediakiwAxiosInstance.defaults.cancelToken = instance.defaults.cancelToken;
//     mediakiwAxiosInstance.defaults.headers = instance.defaults.headers;
//   }
// }

export default {
    install(app: App, options: IMediakiwiVueOptions) {
      // Auto import all components
      for (const componentKey in components) {
          const name = (components as any)[componentKey];
          const comp = (components as any)[componentKey] as Component
          app.component(name, comp);     
      }
  
      // Create an instance of Pinia
      const pinia = createPinia();      
      // setAxiosDefaults(options?.axiosInstance);
      app.use(pinia);
  
      // Update or replace store ?
      const s = useMediakiwiStore();
      console.log("received modules", options?.modules);
      s.SET_MODULES(options?.modules);

      console.log("createMediakiwiRouter");
      // // hook up router
      const { router, createMediakiwiRouter } = useRouter();      
      createMediakiwiRouter();

      if(router.value) {
        console.log("bind the router");
        app.use(router.value);
      }      
    }
}

export * from "@/components";

export { default as useRouter } from "@/router";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";