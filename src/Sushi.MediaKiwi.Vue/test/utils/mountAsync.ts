import "reflect-metadata";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import type { MountingOptions } from "@vue/test-utils";
import { Suspense, defineComponent, h } from "vue";
import type { Component, VNodeProps } from "vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { identity } from "./../../src/identity";
import { createMountOptions } from "./mount";
/**
 * Mounts a provided inside a Suspense component, making use of the {@link mount} fn from vue/test-utils
 * @param {Component} component Vue Component to mount
 * @returns {VueWrapper} VueWrapper of the mounted component
 */
async function mountAsync(component: Component, props?: any, options?: MountingOptions<unknown, unknown>): Promise<VueWrapper> {
  const suspenseWrapper = defineComponent({
    render() {
      return h(Suspense, null, {
        default: h(component, props as VNodeProps, "<div id='test'>test</div>"),
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
