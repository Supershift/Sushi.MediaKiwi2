import "reflect-metadata";
import { Suspense, computed, h, ref } from "vue";
import { createPinia } from "pinia";
import i18next from "i18next";
import { createRouter } from "vue-router";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createVuetify } from "vuetify";
import defaultVuetifyOptions from "@/plugins/vuetify/index";
import { mount } from "cypress/vue";
import { VLayout } from "vuetify/components";
import { identity } from "@/identity";
// Import commands.js using ES2015 syntax:
import "./commands";
import { PublicClientApplication } from "@azure/msal-browser";

import { container } from "tsyringe";
import { registerRouter } from "@/helpers/registerRouter";

/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      mount(component: any, options?: any): Chainable<any>;
    }
  }
}

Cypress.Commands.add("mount", (component, options = {}) => {
  // Create the global options
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];
  options.global.provide = options.global.provide || [];

  // Add pinia
  const pinia = createPinia();
  options.global.plugins.push(pinia);

  // Create the router options
  if (!options.router) {
    const routerOptions = getDefaultRouterOptions();
    options.router = createRouter(routerOptions);
  }

  // Add router plugin
  options.global.plugins.push({
    install(app: any) {
      app.use(options.router);
    },
  });

  registerRouter(container, options.router);

  // Create the vuetify instance
  const vuetify = createVuetify(defaultVuetifyOptions);
  options.global.plugins.push(vuetify);

  options.global.provide.i18next = ref(i18next);
  options.global.provide.defaultT = (key: string) => computed(() => key);
  options.global.provide.t = (key: string) => computed(() => key);
  options.global.provide.i18initPromise = Promise.resolve();
  options.global.provide.vuetify = vuetify;

  // Use store passed in from options, or initialize a new one
  const { ...mountOptions } = options;

  // Set msalInstance to a dummy value
  identity.msalInstance = new PublicClientApplication({ auth: { clientId: "test" } });

  return mount(() => {
    return h(Suspense, null, {
      default: () => {
        return h(VLayout, null, {
          default: () => {
            return h(component, mountOptions.props);
          },
        });
      },
    });
  }, options);
});

// Example use:
// cy.mount(MyComponent)
