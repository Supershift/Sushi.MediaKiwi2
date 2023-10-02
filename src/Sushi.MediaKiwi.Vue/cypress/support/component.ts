import "reflect-metadata";
import { Suspense, computed, defineComponent, h, ref } from "vue";
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
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", (component, ...args: any) => {
  // Create the router options
  const routerOptions = getDefaultRouterOptions();

  // Create the vuetify instance
  const vuetify = createVuetify(defaultVuetifyOptions);

  // Create the global options
  args.global = args.global || {};
  args.global.plugins = args.global.plugins || [];
  args.global.provide = args.global.provide || [];

  // Add the plugins
  args.global.plugins.push(createPinia());
  args.global.plugins.push(createRouter(routerOptions));
  args.global.plugins.push(vuetify);

  args.global.provide.i18next = ref(i18next);
  args.global.provide.defaultT = (key: string) => computed(() => key);
  args.global.provide.t = (key: string) => computed(() => key);
  args.global.provide.i18initPromise = Promise.resolve();
  args.global.provide.vuetify = vuetify;

  // Return the mount with the new arguments wrapped in a VApp
  const suspenseWrapper = defineComponent({
    render() {
      return h(Suspense, null, {
        default: () => {
          return h(VLayout, null, {
            default: () => {
              return h(component, args.props);
            },
          });
        },
      });
    },
  });

  // Set msalInstance to a dummy value
  identity.msalInstance = new PublicClientApplication({ auth: { clientId: "test" } });

  mount(suspenseWrapper, args);
  // });
});

// Example use:
// cy.mount(MyComponent)
