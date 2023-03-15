import { createWebHistory, RouteLocationNormalizedLoaded, Router, type RouteRecordRaw, type RouterOptions } from "vue-router";
import { useRouter as useVueRouter, useRoute as useVueRoute } from "vue-router";
import SignIn from "@/views/SignIn.vue";

/** Creates default router options based on provided modules. */
export function createMediakiwiRouterOptions(customRoutes?: RouteRecordRaw[]): RouterOptions {
  // create routes
  const routes = <RouteRecordRaw[]>[];

  // add custom routes
  if (customRoutes !== undefined) {
    customRoutes.forEach((customRoute) => routes.push(customRoute));
  }

  // add sign in screen
  routes.push({ path: "/signIn", component: SignIn });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHistory(),
  };

  return routerOptions;
}

/**
 * Returns the router instance.
 */
export function useRouter(): Router {
  return useVueRouter();
}

/**
 * Returns the current route location.
 */
export function useRoute(): RouteLocationNormalizedLoaded {
  return useVueRoute();
}
