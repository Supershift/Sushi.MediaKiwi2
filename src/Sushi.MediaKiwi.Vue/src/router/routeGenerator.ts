import { injectable } from "tsyringe";
import { RouteComponent, RouteRecordRaw } from "vue-router";
import { NavigationItem, View } from "@/models";

@injectable()
export class RouteGenerator {
  constructor() {}

  /** Generates routes based on navigation items and modules */
  public generateRoutes(modules: Record<string, RouteComponent>, navigationItems: NavigationItem[], views: View[]): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = [];

    // add new routes for navigation items
    navigationItems.forEach((navigationItem: NavigationItem) => {
      // if the navigation item points to a view, get the view
      if (navigationItem.viewId != null && navigationItem.viewId !== undefined) {
        const view = views.find((x: View) => x.id == navigationItem.viewId);

        if (view?.componentKey && modules) {
          // find the module referenced by the view
          const module = modules[view.componentKey];
          if (module !== undefined) {
            // add a route to the module
            const route = <RouteRecordRaw>{
              path: navigationItem.path,
              name: navigationItem.id.toString(),
              component: module,
              meta: {
                isFromServer: true,
                requiresAuth: true,
                requiresRole: view.roles,
              },
            };

            result.push(route);
          } else {
            // no module found, give a warning
            console.warn(`No module found for viewID: ${view.id}, component key: ${view.componentKey}`);
          }
        }
      }
    });

    return result;
  }
}
