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
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

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
      {
        fallbackLng: "en",
        ns: ["common"],
        defaultNS: "common",
        saveMissing: true,
        partialBundledLanguages: true,
        ...options.i18nextOptions,
      },
      (i18n) => {
        // add language detector
        i18n.use(LanguageDetector);

        // add http backend
        const httpApi = new HttpApi();
        httpApi.init(null, {
          crossDomain: true,
          loadPath: `${options.apiBaseUrl}/translations/{{lng}}/{{ns}}`,
          addPath: `${options.apiBaseUrl}/translations/{{lng}}/{{ns}}`,
          customHeaders: () => {
            let result = {};
            // custom headers does not support promises
            // the below is a temp fix, we will need an http backend which does support promises or ideally axios
            const accessToken = tokenStore.token;

            if (accessToken) {
              result = { Authorization: `Bearer ${accessToken}` };
            }
            return result;
          },
        });
        i18n.use(httpApi);

        // call client's callback if provided
        if (options.i18nextCallback) {
          options.i18nextCallback(i18n);
        }
      }
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

    // create msal instance and install plugin
    identity.msalInstance = new PublicClientApplication(options.msalConfig);
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
  },
};

export * from "@/components";

export * from "@/composables";

export * from "@/models";

export * from "@/services";

export * from "@/stores";

export * from "@/router";

import "@/assets/main.css";
