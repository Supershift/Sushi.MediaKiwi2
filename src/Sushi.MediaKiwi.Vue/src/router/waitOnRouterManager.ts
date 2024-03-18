import { RouteLocationNormalized, Router } from "vue-router";
import { container } from "tsyringe";
import { RouterManager, RouterManagerState } from "./routerManager";

/** If navigation fails and the router manager is not yet initialized routing is retried after waiting for initialization. */
export async function waitOnRouterManager(to: RouteLocationNormalized, _from: RouteLocationNormalized): Promise<string | boolean> {
  if (to.matched.length == 0) {
    // no route matched
    // check if we finished loading routes
    const routerManager = container.resolve<RouterManager>("RouterManager");
    if (routerManager.IsInitialized == RouterManagerState.Empty) {
      await routerManager.Initialize();
      // retry routing
      return to.fullPath;
    }
  }
  return true;
}

/** Adds a guard before each route transition to check if the router manager is initialized. */
export function addWaitOnRouterManager(router: Router) {
  router.beforeEach(waitOnRouterManager);
}
