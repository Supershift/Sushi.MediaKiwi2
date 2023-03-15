import { injectable } from "tsyringe";
import { Router, RouteComponent, RouteRecordRaw } from "vue-router";
import { INavigationItem, IScreen } from "@/models";

@injectable()
export class RouterHelper {
  constructor() {}

  /** Updates the dynamic routes based on navigation items and modules */
  updateRoutes(router: Router, modules: Record<string, RouteComponent>, navigationItems: INavigationItem[], screens: IScreen[]) {
    // remove existing dynamic routes
    const existingRoutes = router.getRoutes();
    existingRoutes.forEach((route) => {
      if (route.name && route.meta?.isFromServer) {
        router.removeRoute(route.name);
      }
    });

    // add new routes for navigation items
    navigationItems.forEach((navigationItem: INavigationItem) => {
      // if the navigation item points to a screen, get the screen
      if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
        const screen = screens.find((x: IScreen) => x.id == navigationItem.screenId);

        if (screen != null && screen !== undefined && modules) {
          // find the module referenced by the screen
          const module = modules[screen.componentKey];
          if (module !== undefined) {
            // add a route to the module
            const route = <RouteRecordRaw>{
              path: navigationItem.path,
              name: navigationItem.id.toString(),
              component: module,
              meta: {
                isFromServer: true,
                requiresAuth: true,
              },
            };
            router.addRoute(route);
          } else {
            // no module found, give a warning
            console.warn(`No module found for screenID: ${screen.id}, component key: ${screen.componentKey}`);
          }
        }
      }
    });
  }
}
