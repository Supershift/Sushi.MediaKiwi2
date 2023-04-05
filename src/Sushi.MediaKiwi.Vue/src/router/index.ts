// TODO: Remove these comments when its been collabed with the team and only use all the index.ts files for references(import/export) to other files
import { type RouteLocationNormalizedLoaded, type Router } from "vue-router";
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
