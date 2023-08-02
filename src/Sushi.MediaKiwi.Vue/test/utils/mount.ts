/* eslint-disable no-unused-labels */
import "reflect-metadata";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import type { MountingOptions } from "@vue/test-utils";
import { Suspense, defineComponent, h, ref } from "vue";
import type { Component, VNodeProps } from "vue";
import { createTestingPinia } from "@pinia/testing";
import i18next from "i18next";
import { PublicClientApplication } from "@azure/msal-browser";
import { identity } from "@/identity";
import { createRouter } from "vue-router";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

/**
 * Create the default mounting options
 * @param options
 * @returns
 */
async function createMountOptions(options?: any) {
  // Create the router options
  const routerOptions = getDefaultRouterOptions();

  // Create the vuetify instance
  const vuetify = createVuetify({ components, directives });

  // Create the global options
  const global = {
    plugins: [createTestingPinia(), createRouter(routerOptions), vuetify],
    provide: {
      i18next: ref(i18next),
      i18initPromise: Promise.resolve(),
      vuetify,
    },
  };

  // Create the mount options
  options = options || {};

  // Add the global options
  options.global = { ...global, ...options.global };

  // Return the options
  return options;
}

/**
 * Mounts a provided inside a Suspense component, making use of the {@link mount} fn from vue/test-utils
 * @param {Component} component Vue Component to mount
 * @returns {VueWrapper} VueWrapper of the mounted component
 */
async function mountAsync(component: Component, props?: any, options?: MountingOptions<unknown, unknown>): Promise<VueWrapper> {
  const suspenseWrapper = defineComponent({
    render() {
      return h(Suspense, null, {
        default: h(component, props as VNodeProps),
      });
    },
  });

  // Set msalInstance to a dummy value
  identity.msalInstance = new PublicClientApplication({ auth: { clientId: "test" } });

  // Create the mount options
  const mountOptions = await createMountOptions(options);

  // Mount the component
  const wrapper = mount(suspenseWrapper, mountOptions);

  // Wait for the component to be mounted
  await flushPromises();

  // Return the wrapper
  return wrapper;
}

export { mountAsync };
