import "reflect-metadata";
import { computed, ref } from "vue";
import { createTestingPinia } from "@pinia/testing";
import i18next from "i18next";
import { createRouter } from "vue-router";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createVuetify } from "vuetify";
import { defaultVuetifyOptions } from "@/plugins/vuetify/index";

/**
 * Create the default mounting options
 * @param options
 * @returns
 */
async function createMountOptions(options?: any) {
  // Create the router options
  const routerOptions = getDefaultRouterOptions();

  // Create the vuetify instance
  const vuetify = createVuetify(defaultVuetifyOptions);

  // Create the global options
  const global = {
    plugins: [createTestingPinia(), createRouter(routerOptions), vuetify],
    provide: {
      i18next: ref(i18next),
      defaultT: (key: string) => computed(() => key),
      t: (key: string) => computed(() => key),
      i18initPromise: Promise.resolve(),
      vuetify,
    },
    mocks: {
      t: (key: string) => computed(() => key),
      defaultT: (key: string) => computed(() => key),
    },
  };

  // Create the mount options
  options = options || {};

  // Add the global options
  options.global = { ...global, ...options.global };

  // Return the options
  return options;
}

function createMockResolveValue(data: unknown) {
  return {
    resolve: () => new Promise((resolve) => resolve(data)),
  };
}

export { createMountOptions, createMockResolveValue };
