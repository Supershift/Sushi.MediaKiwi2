import type { App, Component } from "vue";
import pinia from "./plugins/pinia";
import { createMediakiwiRouterOptions } from "@/router";
import { createRouter } from "vue-router";
import { PublicClientApplication } from "@azure/msal-browser";
import { IMediakiwiVueOptions, currentOptions } from "./models/options";
import { createVuetify, VuetifyOptions } from "vuetify";
import { msalPlugin } from "./plugins/msalPlugin";
import { CustomNavigationClient } from "./router/navigationClient";
import { registerGuard } from "./router/guard";
import defaultVuetifyOptions from "./plugins/vuetify";
import { identity } from "./identity";
import { container } from "tsyringe";
import { registerServices } from "./helpers/registerServices";

export default {
  install(app: App, options: IMediakiwiVueOptions) {
    // set options
    currentOptions.mediakiwiVueOptions = options;

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

    pinia.use(({ store }) => {});

    // create router options, which contains paths based on the modules
    const routerOptions = createMediakiwiRouterOptions(options?.modules, options?.customRoutes);

    // create the router
    const router = createRouter(routerOptions);

    // use the router instance
    app.use(router);

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

import "@/assets/main.css";
