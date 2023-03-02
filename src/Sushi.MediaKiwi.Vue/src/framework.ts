import type { App, Component } from 'vue';
import { createPinia } from "pinia";
import useMkRouter from '@/router';

export interface IMediakiwiVueOptions {
  modules: Record<string, () => Promise<unknown>>,
}

export default {
    install(app: App, options: IMediakiwiVueOptions) {  
      // Create an instance of Pinia
      const pinia = createPinia();      
      app.use(pinia);
  
      // hook up router with the modules
      const { router, createMediakiwiRouter } = useMkRouter();   
      createMediakiwiRouter(options?.modules);

      // Use the newly created router with the modules
      if(router.value) {
        app.use(router.value);
      }      
    }
}

export * from "@/components";

export { default as useMkRouter } from "@/router";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";