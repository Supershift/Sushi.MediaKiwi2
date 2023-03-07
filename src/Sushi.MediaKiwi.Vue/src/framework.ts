import type { App, Component } from "vue";
import { createPinia } from "pinia";
import { createMediakiwiRouterOptions } from "@/router";
import { createRouter, RouteComponent, RouteRecordRaw, Router } from "vue-router";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// add authentiation
import { msalPlugin } from "./plugins/msalPlugin";
import { CustomNavigationClient } from "./router/navigationClient";
import { registerGuard } from "./router/guard";

export interface IMediakiwiVueOptions {
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
}

let msalInstance: PublicClientApplication;

export default {
  install(app: App, options: IMediakiwiVueOptions) {
    // Create an instance of Pinia
    const pinia = createPinia();
    app.use(pinia);

    // create router options, which contains paths based on the modules
    const routerOptions = createMediakiwiRouterOptions(options?.modules, options?.customRoutes);

    // create the router
    const router = createRouter(routerOptions);

    // use the router instance
    app.use(router);

    // create msal instance and install plugin
    msalInstance = new PublicClientApplication(options.msalConfig);
    app.use(msalPlugin, msalInstance);

    // create navigation client for msal
    const navigationClient = new CustomNavigationClient(router);
    msalInstance.setNavigationClient(navigationClient);

    // register the msal guard on the router
    registerGuard(router);
  },
};

export { msalInstance as msalInstance };

export * from "@/components";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";
