import { type RouteLocationNormalized, type Router } from "vue-router";
import { InteractionType } from "@azure/msal-browser";
import { identity } from "@/identity";
import { isAuthenticated } from "../identity/isAuthenticated";

/** Adds a guard before each route transition to check if the user is authenticated. */
export function addCheckIsAuthenticated(router: Router): void {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.meta.requiresAuth || !to.matched.length) {
      const request = {
        scopes: identity.scopes,
        redirectStartPage: to.fullPath,
      };
      const shouldProceed = await isAuthenticated(identity.msalInstance, InteractionType.Redirect, request);
      return shouldProceed || "/signIn";
    }

    return true;
  });
}
