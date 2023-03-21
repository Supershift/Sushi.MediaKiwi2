import type { App, Component } from "vue";
import pinia from "./plugins/pinia";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createRouter } from "vue-router";
import { PublicClientApplication } from "@azure/msal-browser";
import { type IMediakiwiVueOptions } from "./models/options";
import { createVuetify, type VuetifyOptions } from "vuetify";
import { msalPlugin } from "./plugins/msalPlugin";
import { CustomNavigationClient } from "./router/navigationClient";
import registerBreadcrumbs from "./router/breadcrumbs";
import { addCheckIsAuthenticated } from "./router/checkIsAuthenticated";
import defaultVuetifyOptions from "./plugins/vuetify";
import { identity } from "./identity";
import { container } from "tsyringe";
import { registerServices } from "./helpers/registerServices";
import { registerOptions } from "./helpers/registerOptions";
import { registerRouter } from "./helpers/registerRouter";
import { addWaitOnRouterManager } from "./router/waitOnRouterManager";

export default {
  install(app: App, options: IMediakiwiVueOptions): void {
    // register options
    registerOptions(container, options);

    // register dependencies
    registerServices(container, options.serviceRegistrations);

    // create vuetify
    let vuetifyOptions: VuetifyOptions;
    if (options.vuetifyOptions !== undefined) {
      // merge default options with custom options, if custom options is provided
      vuetifyOptions = { ...defaultVuetifyOptions, ...options.vuetifyOptions };
    } else {
      vuetifyOptions = defaultVuetifyOptions;
    }
    const vuetify = createVuetify(vuetifyOptions);
    app.use(vuetify);

    // Create an instance of Pinia
    app.use(pinia);

    // get default router options
    const routerOptions = getDefaultRouterOptions(options?.customRoutes);

    // create the router
    const router = createRouter(routerOptions);

    // register the router as dependency
    registerRouter(container, router);

    // use the router instance
    app.use(router);

    // create msal instance and install plugin
    identity.msalInstance = new PublicClientApplication(options.msalConfig);
    app.use(msalPlugin, identity.msalInstance);

    // create navigation client for msal
    const navigationClient = new CustomNavigationClient(router);
    identity.msalInstance.setNavigationClient(navigationClient);

    // adds a guard to all routes to initalize routes from API before completing routing
    addWaitOnRouterManager(router);

    // adds a guard to all routes with the meta property 'requireAuth' set to true
    addCheckIsAuthenticated(router);

    // registers breadcrumbs before we navigate, this calls the navigation store(register as late as possible)
    registerBreadcrumbs(router);
  },
};

export * from "@/components";

export * from "@/helpers";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

export { store as MkMockStore } from "@/stores/mediakiwi/mock";

import "@/assets/main.css";
