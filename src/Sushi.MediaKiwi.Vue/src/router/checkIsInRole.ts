import { RouteLocationNormalized, Router } from "vue-router";
import { identity } from "@/identity";

/** Checks if the user is in a role required by the target route. */
export function checkIsInRole(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  const requiresRole: string[] = to.meta.requiresRole as string[];
  if (requiresRole?.length) {
    const activeAccount = identity.msalInstance.getActiveAccount();
    const hasRequiredRole = requiresRole.some((role: string) => activeAccount?.idTokenClaims?.roles?.includes(role));

    if (!hasRequiredRole) {
      window.alert("You do not have access as the expected role is not found. Please ensure that your account is assigned to an app role and then sign-out and sign-in again.");
      return false;
    }
  }

  return true;
}

/** Adds a guard before each route transition to check if the user is in a role required by the target route. */
export function addCheckIsInRole(router: Router) {
  router.beforeEach(checkIsInRole);
}
