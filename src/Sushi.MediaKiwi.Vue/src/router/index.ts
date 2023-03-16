import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { useRouter as useVueRouter, useRoute as useVueRoute } from "vue-router";

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
