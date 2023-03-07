import type { App, Component } from "vue";
import pinia  from "./plugins/pinia";
import { createMediakiwiRouterOptions } from "@/router";
import { createRouter, RouteComponent } from "vue-router";

export interface IMediakiwiVueOptions {
  modules: Record<string, RouteComponent>;
}

export default {
  install(app: App, options: IMediakiwiVueOptions) {
    // Create an instance of Pinia
    app.use(pinia);

    // create router options, which contains paths based on the modules
    const routerOptions = createMediakiwiRouterOptions(options?.modules);

    // create the router
    const router = createRouter(routerOptions);

    // use the router instance
    app.use(router);
    
    pinia.use(({ store }) => {
      store.hello = "Welcome to Mediakiwi 2.0";
      // store.router = router;
    });

    app.provide("my key", "test");
  },
};

export * from "@/components";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";
