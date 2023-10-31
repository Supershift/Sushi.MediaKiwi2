import { type App } from "vue";
import pinia from "./plugins/pinia";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createRouter } from "vue-router";
import { PublicClientApplication } from "@azure/msal-browser";
import { type MediakiwiVueOptions } from "./models/options";
import { createVuetify, type VuetifyOptions } from "vuetify";
import { msalPlugin } from "./plugins/msalPlugin";
import { CustomNavigationClient } from "./router/navigationClient";
import { addCheckIsAuthenticated } from "./router/checkIsAuthenticated";
import defaultVuetifyOptions from "./plugins/vuetify";
import { identity } from "./identity";
import { container } from "tsyringe";
import { registerServices } from "./helpers/registerServices";
import { registerOptions } from "./helpers/registerOptions";
import { registerRouter } from "./helpers/registerRouter";
import { addWaitOnRouterManager } from "./router/waitOnRouterManager";
import { addCheckIsInRole } from "./router/checkIsInRole";
import { registerAxios } from "./helpers/registerAxios";
import i18next, { tokenStore } from "./plugins/i18next";
import { registerIcons } from "./helpers/registerIcons";
import { registerDirectives } from "./helpers/registerDirectives";

export default {
  install(app: App, options: MediakiwiVueOptions): void {
    // register options
    registerOptions(container, options);

    // register dependencies
    registerServices(container, options.serviceRegistrations);

    // register axios
    registerAxios(container, options);

    // add i18n
    app.use(
      i18next,
      options,
      {
        fallbackLng: "en",
        ns: ["common"],
        defaultNS: "common",
        saveMissing: true,
        partialBundledLanguages: true,
        ...options.i18nextOptions,
      },
      options.i18nextCallback
    );

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
    console.log("pinia created");

    // register icons after pinia and vuetify are created
    registerIcons(options);

    // create msal instance and install plugin
    identity.msalInstance = new PublicClientApplication(options.msalConfig);
    // add api scope to msal instance
    identity.scopes = [`api://${options.msalConfig.auth.clientId}/access_via_approle_assignments`];
    // install msal plugin
    app.use(msalPlugin, identity.msalInstance);

    // get default router options
    const routerOptions = getDefaultRouterOptions(options?.customRoutes);

    // create the router
    const router = createRouter(routerOptions);

    // register the router as dependency
    registerRouter(container, router);

    // create navigation client for msal
    const navigationClient = new CustomNavigationClient(router);
    identity.msalInstance.setNavigationClient(navigationClient);

    // adds a guard to all routes with the meta property 'requireAuth' set to true
    addCheckIsAuthenticated(router);

    // adds a guard to all routes to initalize routes from API before completing routing
    addWaitOnRouterManager(router);

    // adds a guard to all routes with the meta property 'isInRole' to check role
    addCheckIsInRole(router);

    // use the router instance
    app.use(router);

    // used for registering directives
    registerDirectives(app);

    // provide the application with the mediakiwi configuration
    app.provide("mediakiwi", { ...options });
  },
};

export * from "@/components";

export * from "@/composables";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

export * from "@/plugins/icons/icons";
