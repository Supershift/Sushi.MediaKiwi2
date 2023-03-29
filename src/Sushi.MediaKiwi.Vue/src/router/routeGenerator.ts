import { injectable } from "tsyringe";
import { RouteComponent, RouteRecordRaw } from "vue-router";
import { NavigationItem, View } from "@/models";

@injectable()
export class RouteGenerator {
  constructor() {}

  /** Generates routes based on navigation items and modules */
  public generateRoutes(modules: Record<string, RouteComponent>, navigationItems: NavigationItem[], screens: View[]): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = [];

    // add new routes for navigation items
    navigationItems.forEach((navigationItem: NavigationItem) => {
      // if the navigation item points to a screen, get the screen
      if (navigationItem.viewId != null && navigationItem.viewId !== undefined) {
        const screen = screens.find((x: View) => x.id == navigationItem.viewId);

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
                requiresRole: screen.roles,
              },
            };

            result.push(route);
          } else {
            // no module found, give a warning
            console.warn(`No module found for screenID: ${screen.id}, component key: ${screen.componentKey}`);
          }
        }
      }
    });

    return result;
  }
}
