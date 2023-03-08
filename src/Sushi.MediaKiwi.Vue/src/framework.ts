import type { App, Component } from "vue";
import pinia from "./plugins/pinia";
import { createMediakiwiRouterOptions } from "@/router";
import { createRouter, RouteComponent, RouteRecordRaw, Router } from "vue-router";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// add authentiation
import { msalPlugin } from "./plugins/msalPlugin";
import { CustomNavigationClient } from "./router/navigationClient";
import { registerGuard } from "./router/guard";

import { identity } from "./identity";

export interface IMediakiwiVueOptions {
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
}

export default {
  install(app: App, options: IMediakiwiVueOptions) {
    // Create an instance of Pinia
    app.use(pinia);

    // create router options, which contains paths based on the modules
    const routerOptions = createMediakiwiRouterOptions(options?.modules, options?.customRoutes);

    // create the router
    const router = createRouter(routerOptions);

    // use the router instance
    app.use(router);

    pinia.use(({ store }) => {
      store.hello = "Welcome to Mediakiwi 2.0";
      // store.router = router;
    });

    // create msal instance and install plugin
    identity.msalInstance = new PublicClientApplication(options.msalConfig);
    app.use(msalPlugin, identity.msalInstance);

    // create navigation client for msal
    const navigationClient = new CustomNavigationClient(router);
    identity.msalInstance.setNavigationClient(navigationClient);

    // adds a guard to all routes with the meta property 'requireAuth' set to true
    registerGuard(router);
  },
};

export * from "@/components";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";
