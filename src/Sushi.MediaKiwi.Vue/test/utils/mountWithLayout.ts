/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import type { MountingOptions } from "@vue/test-utils";
import { Suspense, defineComponent, h } from "vue";
import type { Component, VNodeProps } from "vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { identity } from "./../../src/identity";
import * as components from "vuetify/components";
import { createMountOptions } from "./mount";

/**
 * Mounts a provided inside a Suspense component, making use of the {@link mount} fn from vue/test-utils
 * @param {Component} component Vue Component to mount
 * @returns {VueWrapper} VueWrapper of the mounted component
 */
async function mountWithLayoutAsync(component: Component, props?: any, options?: MountingOptions<unknown, unknown>): Promise<VueWrapper> {
  const suspenseWrapper = defineComponent({
    render() {
      return h(Suspense, null, {
        default: () => {
          return h(components.VLayout, null, {
            default: () => {
              return h(component, props as VNodeProps);
            },
          });
        },
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

export { mountWithLayoutAsync };
